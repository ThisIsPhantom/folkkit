<?php
// Run every 15 minutes as a Plesk scheduled task. No public cleanup endpoint.
declare(strict_types=1);
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
if (array_diff(array_slice($argv, 1), ['--compact'])) {
  fwrite(STDERR, "Usage: php cleanup-polls.php [--compact]\n");
  exit(2);
}
require __DIR__ . '/../api/pollStorage.php';
try {
  $pdo = database();
  $count = cleanupExpiredPolls($pdo, time());
  if (in_array('--compact', $argv, true)) $pdo->exec('VACUUM');
  echo "Expired polls removed: $count\n";
} catch (Throwable) {
  fwrite(STDERR, "Poll maintenance failed. Check storage permissions and PHP extensions.\n");
  exit(1);
}
