<?php
// Shared storage and retention rules for the HTTP API and CLI maintenance.
declare(strict_types=1);

const POLL_RETENTION_DAYS = [1, 7, 30, 90];
const POLL_DEFAULT_RETENTION_DAYS = 30;

function dataDirectory(): string {
  $configured = getenv('FOLKKIT_POLL_DATA');
  $directory = $configured !== false && $configured !== '' ? $configured : __DIR__ . '/data';
  if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) throw new RuntimeException('storage');
  $guard = $directory . '/.htaccess';
  if (!is_file($guard)) file_put_contents($guard, "Require all denied\n");
  return $directory;
}

function database(): PDO {
  $pdo = new PDO('sqlite:' . dataDirectory() . '/polls.sqlite', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
  $pdo->exec('PRAGMA foreign_keys = ON');
  $pdo->exec('PRAGMA busy_timeout = 3000');
  $pdo->exec('PRAGMA secure_delete = ON');
  $pdo->exec('CREATE TABLE IF NOT EXISTS polls (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT NOT NULL,
    options TEXT NOT NULL, password_hash TEXT, admin_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL, expires_at INTEGER
  )');
  // Serialize migration so simultaneous first requests cannot add the column twice.
  $pdo->exec('BEGIN IMMEDIATE');
  try {
    $columns = array_column($pdo->query('PRAGMA table_info(polls)')->fetchAll(), 'name');
    if (!in_array('expires_at', $columns, true)) $pdo->exec('ALTER TABLE polls ADD COLUMN expires_at INTEGER');
    $pdo->exec('CREATE INDEX IF NOT EXISTS polls_expiry ON polls(expires_at)');
    $pdo->exec('CREATE TABLE IF NOT EXISTS responses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
      name TEXT NOT NULL, address TEXT NOT NULL, answers TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )');
    $pdo->exec('CREATE INDEX IF NOT EXISTS responses_poll ON responses(poll_id)');
    $pdo->exec('COMMIT');
  } catch (Throwable $failure) {
    $pdo->exec('ROLLBACK');
    throw $failure;
  }
  return $pdo;
}

function retentionDeadline(mixed $days, int $now): int {
  if (!is_int($days) || !in_array($days, POLL_RETENTION_DAYS, true)) throw new InvalidArgumentException('retention');
  return $now + $days * 86400;
}

function pollExpired(array $poll, int $now): bool {
  return $poll['expires_at'] !== null && (int) $poll['expires_at'] <= $now;
}

function cleanupExpiredPolls(PDO $pdo, int $now): int {
  // ON DELETE CASCADE also removes every participant's address and answers.
  $statement = $pdo->prepare('DELETE FROM polls WHERE expires_at IS NOT NULL AND expires_at <= ?');
  $statement->execute([$now]);
  return $statement->rowCount();
}
