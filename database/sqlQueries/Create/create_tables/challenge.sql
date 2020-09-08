DROP TABLE IF EXISTS challenge CASCADE;
CREATE TABLE challenge (
    cID SERIAL PRIMARY KEY NOT NULL,
    aID INT,
    date_start DATE NOT NULL,
    date_end DATE NOT NULL,
    FOREIGN KEY (aID) REFERENCES activity (aID)
);
