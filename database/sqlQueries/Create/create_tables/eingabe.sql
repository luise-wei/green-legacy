DROP TABLE IF EXISTS eingabe CASCADE;
CREATE TABLE eingabe (
	e_ID SERIAL PRIMARY KEY NOT NULL,
	ucr_ID INT,
	eingabe FLOAT NOT NULL,
	e_date_start DATE,
	e_date_end DATE,
FOREIGN KEY (ucr_ID) REFERENCES uc_rel (ucr_ID)
);
