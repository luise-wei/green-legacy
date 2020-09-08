CREATE TABLE ua_rel (
    uar_ID SERIAL PRIMARY KEY NOT NULL,
    ID INT,
    aID INT,
    goal NUMERIC,
    date_start DATE NOT NULL,
    date_end DATE NOT NULL,
    FOREIGN KEY (aID) REFERENCES activity (aID),
    FOREIGN KEY (id) REFERENCES users (id)
);
