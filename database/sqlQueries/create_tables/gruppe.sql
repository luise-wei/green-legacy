CREATE TABLE gruppe (
    gID BIGSERIAL PRIMARY KEY, 
    gname VARCHAR (200) NOT NULL, 
    UNIQUE (gname)
);
