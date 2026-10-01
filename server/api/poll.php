<?php
// Folkkit shared polls: minimal JSON API backed by one SQLite file.
// Every request is a POST with a JSON body {"action": "...", ...}.
declare(strict_types=1);

const POLL_MAX_BODY = 32768;
const POLL_MAX_OPTIONS = 40;
const POLL_TITLE_MAX = 120;
const POLL_DESCRIPTION_MAX = 1000;
const POLL_OPTION_LABEL_MAX = 80;
const POLL_NAME_MAX = 80;
const POLL_ADDRESS_MAX = 200;
const POLL_PASSWORD_MAX = 200;
const POLL_MAX_RESPONSES = 500;
const POLL_ANSWERS = ['yes', 'maybe', 'no'];

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $body): never {
  http_response_code($status);
  echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

function fail(int $status, string $code): never {
  respond($status, ['error' => $code]);
}

function dataDirectory(): string {
  $configured = getenv('FOLKKIT_POLL_DATA');
  $directory = $configured !== false && $configured !== '' ? $configured : __DIR__ . '/data';
  if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) fail(500, 'storage');
  // Keep the database unreachable over HTTP when it lives below the web root.
  $guard = $directory . '/.htaccess';
  if (!is_file($guard)) @file_put_contents($guard, "Require all denied\nDeny from all\n");
  return $directory;
}

function database(): PDO {
  $pdo = new PDO('sqlite:' . dataDirectory() . '/polls.sqlite', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
  ]);
  $pdo->exec('PRAGMA foreign_keys = ON');
  $pdo->exec('PRAGMA busy_timeout = 3000');
  $pdo->exec('CREATE TABLE IF NOT EXISTS polls (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    options TEXT NOT NULL,
    password_hash TEXT,
    admin_hash TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )');
  $pdo->exec('CREATE TABLE IF NOT EXISTS responses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    answers TEXT NOT NULL,
    created_at INTEGER NOT NULL
  )');
  $pdo->exec('CREATE INDEX IF NOT EXISTS responses_poll ON responses(poll_id)');
  return $pdo;
}

function text(mixed $value, int $max, bool $required): string {
  if (!is_string($value)) $value = '';
  $value = trim(preg_replace('/[\x00-\x09\x0B-\x1F\x7F]/u', '', $value) ?? '');
  if ($required && $value === '') fail(422, 'required');
  if (mb_strlen($value) > $max) fail(422, 'tooLong');
  return $value;
}

function randomId(int $bytes): string {
  return rtrim(strtr(base64_encode(random_bytes($bytes)), '+/', '-_'), '=');
}

function loadPoll(PDO $pdo, mixed $id): array {
  if (!is_string($id) || !preg_match('/^[A-Za-z0-9_-]{8,32}$/', $id)) fail(404, 'notFound');
  $statement = $pdo->prepare('SELECT * FROM polls WHERE id = ?');
  $statement->execute([$id]);
  $poll = $statement->fetch();
  if (!$poll) fail(404, 'notFound');
  return $poll;
}

function isAdmin(array $poll, mixed $token): bool {
  return is_string($token) && $token !== '' && hash_equals($poll['admin_hash'], hash('sha256', $token));
}

function requireAccess(array $poll, array $input): void {
  if ($poll['password_hash'] === null || isAdmin($poll, $input['adminToken'] ?? null)) return;
  $password = $input['password'] ?? null;
  if (!is_string($password) || $password === '') fail(401, 'passwordRequired');
  if (!password_verify($password, $poll['password_hash'])) {
    usleep(400000); // slow down guessing
    fail(401, 'passwordWrong');
  }
}

function publicPoll(PDO $pdo, array $poll, bool $admin): array {
  $statement = $pdo->prepare('SELECT id, name, address, answers, created_at FROM responses WHERE poll_id = ? ORDER BY id');
  $statement->execute([$poll['id']]);
  $responses = array_map(static function (array $row) use ($admin) {
    $entry = ['id' => (int) $row['id'], 'name' => $row['name'], 'answers' => json_decode($row['answers'], true), 'createdAt' => (int) $row['created_at']];
    // Addresses only confirm participation; only the creator sees them.
    if ($admin) $entry['address'] = $row['address'];
    return $entry;
  }, $statement->fetchAll());
  return [
    'id' => $poll['id'],
    'title' => $poll['title'],
    'description' => $poll['description'],
    'options' => json_decode($poll['options'], true),
    'protected' => $poll['password_hash'] !== null,
    'admin' => $admin,
    'createdAt' => (int) $poll['created_at'],
    'responses' => $responses,
  ];
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') fail(405, 'method');
$raw = file_get_contents('php://input', false, null, 0, POLL_MAX_BODY + 1);
if ($raw === false || strlen($raw) > POLL_MAX_BODY) fail(413, 'tooLarge');
$input = json_decode($raw, true);
if (!is_array($input)) fail(400, 'badRequest');

try {
  $pdo = database();
  switch ($input['action'] ?? '') {
    case 'create': {
      $title = text($input['title'] ?? '', POLL_TITLE_MAX, true);
      $description = text($input['description'] ?? '', POLL_DESCRIPTION_MAX, false);
      $rawOptions = $input['options'] ?? null;
      if (!is_array($rawOptions) || count($rawOptions) < 1) fail(422, 'options');
      if (count($rawOptions) > POLL_MAX_OPTIONS) fail(422, 'tooMany');
      $options = [];
      foreach (array_values($rawOptions) as $option) {
        if (!is_array($option)) fail(422, 'options');
        $date = is_string($option['date'] ?? null) ? $option['date'] : '';
        if ($date !== '' && !preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) fail(422, 'options');
        $label = text($option['label'] ?? '', POLL_OPTION_LABEL_MAX, false);
        if ($date === '' && $label === '') fail(422, 'options');
        $options[] = ['date' => $date, 'label' => $label];
      }
      $password = $input['password'] ?? '';
      if (!is_string($password) || strlen($password) > POLL_PASSWORD_MAX) fail(422, 'tooLong');
      $id = randomId(9);
      $adminToken = randomId(24);
      $pdo->prepare('INSERT INTO polls (id, title, description, options, password_hash, admin_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)')
        ->execute([$id, $title, $description, json_encode($options, JSON_UNESCAPED_UNICODE), $password === '' ? null : password_hash($password, PASSWORD_DEFAULT), hash('sha256', $adminToken), time()]);
      respond(201, ['id' => $id, 'adminToken' => $adminToken]);
    }
    case 'get': {
      $poll = loadPoll($pdo, $input['id'] ?? null);
      requireAccess($poll, $input);
      respond(200, publicPoll($pdo, $poll, isAdmin($poll, $input['adminToken'] ?? null)));
    }
    case 'respond': {
      $poll = loadPoll($pdo, $input['id'] ?? null);
      requireAccess($poll, $input);
      $name = text($input['name'] ?? '', POLL_NAME_MAX, true);
      $address = text($input['address'] ?? '', POLL_ADDRESS_MAX, true);
      $optionCount = count(json_decode($poll['options'], true));
      $answers = $input['answers'] ?? null;
      if (!is_array($answers) || count($answers) !== $optionCount) fail(422, 'answers');
      $answers = array_values($answers);
      foreach ($answers as $answer) if (!in_array($answer, POLL_ANSWERS, true)) fail(422, 'answers');
      $count = $pdo->prepare('SELECT COUNT(*) FROM responses WHERE poll_id = ?');
      $count->execute([$poll['id']]);
      if ((int) $count->fetchColumn() >= POLL_MAX_RESPONSES) fail(409, 'full');
      $pdo->prepare('INSERT INTO responses (poll_id, name, address, answers, created_at) VALUES (?, ?, ?, ?, ?)')
        ->execute([$poll['id'], $name, $address, json_encode($answers), time()]);
      respond(201, publicPoll($pdo, $poll, isAdmin($poll, $input['adminToken'] ?? null)));
    }
    case 'deleteResponse': {
      $poll = loadPoll($pdo, $input['id'] ?? null);
      if (!isAdmin($poll, $input['adminToken'] ?? null)) fail(403, 'forbidden');
      $pdo->prepare('DELETE FROM responses WHERE poll_id = ? AND id = ?')->execute([$poll['id'], (int) ($input['responseId'] ?? 0)]);
      respond(200, publicPoll($pdo, $poll, true));
    }
    case 'deletePoll': {
      $poll = loadPoll($pdo, $input['id'] ?? null);
      if (!isAdmin($poll, $input['adminToken'] ?? null)) fail(403, 'forbidden');
      $pdo->prepare('DELETE FROM responses WHERE poll_id = ?')->execute([$poll['id']]);
      $pdo->prepare('DELETE FROM polls WHERE id = ?')->execute([$poll['id']]);
      respond(200, ['deleted' => true]);
    }
    default:
      fail(400, 'badRequest');
  }
} catch (PDOException) {
  fail(500, 'storage');
}
