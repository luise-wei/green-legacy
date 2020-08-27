Anfragen für Dashboard (Anmerkung Luise aus Slack vom 20.8.)

ChallengeOverview

--> Gib für den Nutzer mit der ID x, maximal 6 Challenges zurück, an denen er aktuell nicht teilnimmt.

SELECT activity.aname, activity.goal, activity.unit
FROM activity, ua_rel
WHERE activity.aID != ua_rel.aID
AND ua_rel.ID = *ID eingeloggter Nutzer*
ORDER BY RAND()
FETCH FIRST 6 ROWS ONLY


ChallengeView

--> Anfragen für Challenge-View (Ansicht einzelner Challenge):
--> Alle Einträge zur entsprechenden Challenge ID laden:
- Challenge Beschreibung,
- Gruppenname,
- evtl. teilnehmende User,
- Fortschrittseinträge, für Diagramme (uar_ID)

SELECT gruppe.gname, activity.aname, activity.goal, activity.unit, users.name, ua_rel.uar_ID, SUM(eingabe.eingabe) GROUP BY users.name
FROM gruppe, activity, users, eingabe, ua_rel
WHERE ua_rel.ID = users.ID
AND ua_rel.aID = activity.aID
AND ua_rel.uar_ID = eingabe.uar_ID
AND ua_rel.aID = *entsprechende Challenge bzw. aID*
AND ua_rel.date_end >= GETDATE()
GROUP BY DATEPART(week,eingabe.e_datum)
ORDER BY DATEPART(week,eingabe.e_datum)


Gruppenansicht

--> Gruppenname,
--> zugehörige User,
--> laufende und vergangene Challenges 

SELECT gruppe.gname, membership.ID, ua_rel.aID, users.name, activity.aname, ua_rel.date_start, ua_rel.date_end
FROM gruppe, membership, ua_rel, users, activity
WHERE ua_rel.ID = users.ID
AND users.ID = membership.ID
AND gruppe.gID = membership.gID
AND ua_rel.aID = activity.aID
AND gruppe.gID = *entsprechende Gruppe*
GROUP BY activity.aname [oder uar_ID, um die Challenges eindeutig zu identifizieren, z.B. wurde Challenge "50km Fahrrad fahren" 2x absolviert]
_______________________________________________________________________________________________________________
Abfragen der Screenshots aus Slack vom 23.8.

CheckRegistrationisTrue

--> Screenshot Nr. 2
--> Es muss bei der Anmeldung abgefragt werden, ob ein Nutzer bereits existiert. Dies kann über den Nutzernamen oder die E-Mail Adresse überprüft werden 
--> Falls ja: Gib Fehlermeldung "Dieser Nutzer existiert bereits"

IF NOT EXISTS ( SELECT 1 FROM users WHERE email = *eingegebene E-Mail*)
BEGIN
    INSERT INTO users (name,email,password) VALUES (*eingegebener Name*,*eingegebene E-Mail*,*eingegebenes passwort*)
END

TO DO
DetailsteckbriefChallenge (Braucht man das an dieser Stelle? Ist ja eig. ne standardisierte Übersicht)

--> Screenhsot Nr. 3
--> beinhaltet: Kurzbeschreibung Challenge, Name Challenge, Laufzeit (Start & End date), Rythmus

RankingproChallenge

--> Screenshot 4
--> Ranking je nach Challenge für eine Gruppe

SELECT ua_rel.aID, sum(eingabe.eingabe), users.name, membership.gID, activity.unit
FROM ua_rel, eingabe, users
WHERE ua_rel.uar_ID = eingabe.uar_ID 
AND uar_rel.ID = users.ID
AND membership.ID = users.ID
AND activity.aID = ua_rel.aID
AND uar_rel.aID = *entsprechende Aktivität*
AND membership.gID = *entsprechende Gruppe*
AND eingabe.e_datum>=GETDATE()
ORDER BY SUM(eingabe.eingabe) DESC
GROUP BY users.name
FETCH FIRST 3 ROWS ONLY

Ich bin mir hier nicht sicher.. pls help


ÜbersichtAktuelleChallenges

--> Screenshot 5

SELECT activity.name, users.name, ua_rel.date_start, ua_rel.date_end
FROM ua_rel, activity, users
WHERE ua_rel.ID = users.ID
AND ua_rel.aID = activity.aID
AND users.ID = *ID eingeloggter Nutzer*
AND ua_rel.date_end >= GETDATE()


ÜbersichtVergangeneChallenges

--> Screenshot 6

SELECT activity.name, users.name, ua_rel.date_start, ua_rel.date_end
FROM ua_rel, activity, users
WHERE ua_rel.ID = users.ID
AND ua_rel.aID = activity.aID
AND users.ID = *ID eingeloggter Nutzer*
AND ua_rel.date_end < GETDATE()

[hier fehlt noch der Ranking-Platz. Wird dieser irgendwie zwischen gespeichert?]
_______________________________________________________________________________________________________________
Abfragen zu Screenshots aus Notion

