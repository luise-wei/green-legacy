CREATE TABLE ua_rel (
    uar_ID SERIAL PRIMARY KEY NOT NULL,
    id INT,
    aID INT,
    date_start DATE NOT NULL,
    date_end DATE NOT NULL,
    FOREIGN KEY (aID) REFERENCES activity (aID),
    FOREIGN KEY (id) REFERENCES users (id)
);
