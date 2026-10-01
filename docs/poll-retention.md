# Shared poll retention

New polls have a mandatory lifetime of 1, 7, 30 or 90 days from creation (30 by default). The server calculates `expires_at`; a client cannot submit an arbitrary deadline. All access and voting stop at that timestamp. The public page displays the deadline in the visitor's local time and closes an already open form when it expires. Legacy polls migrate with a NULL deadline and remain unchanged.

The API requires PHP 8.1+, `pdo_sqlite`, and `mbstring`. SQLite stays a single local file; no database server or NoSQL service is needed. Both the API and maintenance commands must use the same `FOLKKIT_POLL_DATA` directory **outside the webroot**, writable by the site's PHP account. Never publish the SQLite file or expose the PHP development server externally. A static frontend upload does not install the API: deploy `server/api/poll.php` and `pollStorage.php` together as `/api/`, and keep maintenance code outside the public root.

## Plesk scheduled tasks

Configure these tasks under the hosting account that runs the site's PHP process. Replace the example paths with the real subscription paths, and use the installed PHP CLI version. The scheduler and web API must see the same storage directory, with compatible permissions and `open_basedir` settings.

Every 15 minutes (`*/15 * * * *`):

```sh
FOLKKIT_POLL_DATA=/var/www/vhosts/example.com/private/folkkit-polls /opt/plesk/php/8.4/bin/php /var/www/vhosts/example.com/private/folkkit-server/bin/cleanup-polls.php
```

Place `bin/cleanup-polls.php` and `api/pollStorage.php` under that private `folkkit-server` directory with their relative structure preserved. Keep the private storage module version synchronized with the web API version.

Weekly, for example Sunday at 03:10 (`10 3 * * 0`), run the same command with `--compact`. This also removes expired polls and runs SQLite `VACUUM` to return unused pages to the filesystem. Run compaction at a quiet time; it needs temporary disk space and can briefly block writes. Scheduled deletion removes polls plus every response, name and address through a foreign-key cascade. It does not purge separate hosting backups; configure backup retention independently.

No live scheduled task is created by this repository. Without a working task, expired polls are inaccessible but remain stored. Once the task is configured, physical deletion normally occurs within 15 minutes after the deadline; failed runs must be investigated through the hosting scheduler's notifications. The CLI refuses HTTP execution and logs only aggregate counts, never participant data.

## Verification

```sh
php -l server/api/poll.php
php server/tests/poll-retention.php
node node_modules/vitest/vitest.mjs run src/features/poll
```

The PHP test creates its own temporary database and verifies legacy migration, supported lifetimes, boundary times, cascaded response removal, repeated cleanup and compaction. Do not run manual expiry experiments against live storage.
