CREATE TABLE eingabe (
	e_ID SERIAL PRIMARY KEY NOT NULL,
	uar_ID INT,
	eingabe FLOAT NOT NULL,
	e_datum DATE,
FOREIGN KEY (uar_ID) REFERENCES ua_rel (uar_ID)
);
