-- ============================================================
--  MiniBlog – seed data (development only)
--  Idempotent: uses INSERT … ON CONFLICT DO NOTHING
-- ============================================================

INSERT INTO users (username, email) VALUES
  ('Dario Burbano',   'dario@example.com'),
  ('Christian Gomez',     'Christian@example.com'),
  ('Daniel Hernandez', 'daniel@example.com')
ON CONFLICT DO NOTHING;

INSERT INTO posts (title, body, published, user_id) VALUES
  ('Hola mundo',      'Mi primera publicación en MiniBlog!', TRUE,  1),
  ('Mundo Sofia',       'Pelicula favorita', FALSE, 1),
  ('Casa de papel',  'Serie de Netflix.', TRUE,  2),
  ('Fabrica de chocolate', 'Serie favorita.', FALSE, 3)
ON CONFLICT DO NOTHING;