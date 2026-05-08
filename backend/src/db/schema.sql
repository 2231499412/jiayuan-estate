-- backend/src/db/schema.sql
CREATE TABLE IF NOT EXISTS properties (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  title      TEXT NOT NULL,
  type       TEXT NOT NULL,
  area       TEXT NOT NULL,
  address    TEXT NOT NULL,
  price      TEXT NOT NULL,
  area_sqm   TEXT,
  rooms      TEXT,
  floor      TEXT,
  image_keys TEXT,
  desc       TEXT,
  hot        INTEGER DEFAULT 0,
  status     TEXT DEFAULT '在售',
  created_at TEXT DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE IF NOT EXISTS admins (
  id       INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
);
