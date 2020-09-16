DROP TABLE IF EXISTS challengeInput CASCADE;
CREATE TABLE challengeInput (
	e_ID SERIAL PRIMARY KEY NOT NULL,
	ucr_ID INT,
	input FLOAT NOT NULL,
	e_date_start DATE,
	e_date_end DATE,
FOREIGN KEY (ucr_ID) REFERENCES uc_rel (ucr_ID)
);
