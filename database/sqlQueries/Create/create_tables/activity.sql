DROP TABLE IF EXISTS activity CASCADE;
CREATE TABLE activity (
    aID SERIAL  PRIMARY KEY NOT NULL,
    aname VARCHAR (200) NOT NULL,
    unit VARCHAR(200) NOT NULL,
    abfrage VARCHAR (500) NOT NULL,
    icon varchar(255),
    image varchar(255),
    shortInfoText TEXT,
    infotext TEXT,
    defaultGoal NUMERIC,
    minGoal NUMERIC,
    maxGoal NUMERIC
);
