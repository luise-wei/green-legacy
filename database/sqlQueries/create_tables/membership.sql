CREATE TABLE membership (
    gID INT,
    id INT,
    PRIMARY KEY (gID,id),
    FOREIGN KEY (gID) REFERENCES gruppe (gID),
    FOREIGN KEY (id) REFERENCES users (id)
);
