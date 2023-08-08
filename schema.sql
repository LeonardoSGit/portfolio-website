DROP TABLE IF EXISTS photos;

CREATE TABLE photos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    before_path TEXT NOT NULL,
    before_method TEXT NOT NULL,
    before_description TEXT NOT NULL,
    after_path TEXT NOT NULL,
    after_method TEXT NOT NULL,
    after_description TEXT NOT NULL
);
