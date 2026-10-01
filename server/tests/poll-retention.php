<?php
declare(strict_types=1);

// Run against an isolated temporary database, never production storage.
$directory = sys_get_temp_dir() . '/folkkit-retention-' . bin2hex(random_bytes(8));
mkdir($directory, 0700);
putenv('FOLKKIT_POLL_DATA=' . $directory);
function check(bool $condition, string $message): void {
  if (!$condition) throw new RuntimeException($message);
}
try {
  // Preserve the old schema and an existing poll during migration.
  $legacy = new PDO('sqlite:' . $directory . '/polls.sqlite');
  $legacy->exec('CREATE TABLE polls (id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL, options TEXT NOT NULL, password_hash TEXT, admin_hash TEXT NOT NULL, created_at INTEGER NOT NULL)');
  $legacy->exec("INSERT INTO polls VALUES ('legacy123', 'Legacy', '', '[]', NULL, 'hash', 1)");
  $legacy = null;
  require __DIR__ . '/../api/pollStorage.php';
  $pdo = database();
  check($pdo->query("SELECT expires_at FROM polls WHERE id = 'legacy123'")->fetchColumn() === null, 'legacy polls must remain unchanged');
  check(retentionDeadline(7, 100) === 604900, 'seven-day deadline');
  check(retentionDeadline(30, 100) === 2592100, 'default deadline');
  foreach ([0, 365, '7', null, true] as $invalid) {
    try { retentionDeadline($invalid, 100); throw new RuntimeException('accepted invalid retention'); }
    catch (InvalidArgumentException) { /* expected */ }
  }
  $insert = $pdo->prepare("INSERT INTO polls (id,title,description,options,admin_hash,created_at,expires_at) VALUES (?, 'Test', '', '[]', 'hash', 1, ?)");
  $insert->execute(['expired123', 100]);
  $insert->execute(['future123', 101]);
  $pdo->exec("INSERT INTO responses (poll_id,name,address,answers,created_at) VALUES ('expired123','Test','Test','[]',1)");
  check(pollExpired(['expires_at' => 100], 100), 'expiry boundary inclusive');
  check(!pollExpired(['expires_at' => 101], 100), 'future poll stays active');
  check(!pollExpired(['expires_at' => null], 100), 'legacy poll stays active');
  check(cleanupExpiredPolls($pdo, 100) === 1, 'one expired poll deleted');
  check((int) $pdo->query('SELECT COUNT(*) FROM responses')->fetchColumn() === 0, 'answers deleted by cascade');
  check((int) $pdo->query('SELECT COUNT(*) FROM polls')->fetchColumn() === 2, 'future and legacy retained');
  check(cleanupExpiredPolls($pdo, 100) === 0, 'cleanup idempotent');
  check(cleanupExpiredPolls($pdo, 101) === 1, 'next deadline deleted');
  $pdo->exec('VACUUM');
  check((int) $pdo->query('PRAGMA freelist_count')->fetchColumn() === 0, 'compaction reclaims free pages');
  echo "Poll retention: migration, validation, boundaries, cascading deletion and compaction passed.\n";
} finally {
  $insert = null;
  $pdo = null;
  $legacy = null;
  foreach (glob($directory . '/*') ?: [] as $file) unlink($file);
  if (is_file($directory . '/.htaccess')) unlink($directory . '/.htaccess');
  rmdir($directory);
}
