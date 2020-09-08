DROP TABLE IF EXISTS membership CASCADE;
CREATE TABLE membership (
    gID INT,
    ID INT,
    PRIMARY KEY (gID,id),
    FOREIGN KEY (gID) REFERENCES gruppe (gID),
    FOREIGN KEY (id) REFERENCES users (id)
);
