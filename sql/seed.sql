-- ============================================================
--  MiniBlog – seed data (development only)
--  Idempotent: uses INSERT … ON CONFLICT DO NOTHING
-- ============================================================

INSERT INTO users (username, email) VALUES
  ('alice',   'alice@example.com'),
  ('bob',     'bob@example.com'),
  ('charlie', 'charlie@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO posts (title, body, published, user_id) VALUES
  ('Hello World',      'My first post on MiniBlog!',          TRUE,  1),
  ('Draft post',       'This is still work in progress.',      FALSE, 1),
  ('Bob''s thoughts',  'Excited to join MiniBlog.',            TRUE,  2),
  ('Charlie here',     'Just testing the platform.',           FALSE, 3)
ON CONFLICT DO NOTHING;