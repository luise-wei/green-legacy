Anfragen für Dashboard (Anmerkung Luise aus Slack vom 20.8.)

ChallengeOverview

--> Gib für den Nutzer mit der ID x, maximal 6 Challenges zurück, an denen er aktuell nicht teilnimmt.
TO DO 1
alle laufenden Challenges für den Nutzer mit ID XY mit den Informationen: ID, Name, Gruppe, Start und Ende (Das kann dann in einer Art Tabelle oder Liste dem Nutzer angezeigt werden, die ID wird benötigt, damit die Informationen für eine Challenge View entsprechend angefragt werden können)

TO DO 2
alle vergangenen Challenges für den Nutzer mit ID XY mit den selben Infos wie oben - quasi gleiche Abfrage wie oben.

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

TO DO 4
Eingaben, um eine neue Challenge anzulegen:
Name
Zeitraum
Gruppe(?)

TO DO 5
Neue Seite: Gruppenansicht:
Gruppenname,
zugehörige User,
laufende und vergangene Challenges (sind die Challenges mit GruppenID verknüpft? Nur dann ist es sinnvoll, sich diese Seite überhaupt anzeigen la



# -------------------------------- Abfragen strukturiert nach Screenshots (Lucca) --------------------------------------------- (Feedback bitte als solches Kennzeichnen) ---

# 1
keine

# 2 -> Hier darf nur nach Mail nicht nach Username gefragt werden bei der Anmeldung, da Username nicht unique sein wird
- Forgot Password?: UserID identifizieren und zugehörige Mail finden -> Passwort Reset Mail an Adresse schicken
- Anmeldung: UserID/Mail und zugehöriges Passwort stimmen überein? -> Anmeldung erfolgreiche
             UserID/Mail und zugehöriges Passwort stimmen nicht überein? -> Anmeldung fehlgeschlagen

# 3
- "Fahrrad Challenge von 'blank' " -> 'blank' soll hier ersetzt werden von dem zugehörigen Gruppennamen der GroupID, welche die Challenge aktuell durchführt
- Challengebeschreibung (vorgeschrieben für die jeweilige ChallengeID in der Datenbank)
- Datum // Laufzeit (wird erst auf Datum festgelegt, nach Start der Challenge)
- Laufzeit (e.g. 3 Monate) ist in Verbindung mit der ChallengeID bereits in der Datenbank hinterlegt

# 4 -> Was ist hier aus der grafischen Ansicht geworden? Sobald die steht ändert sich hier nochmal viel
- Anzahl der Teilnehmer (Gruppe entnehmen)
- namen ins Scoreboard projezieren (sortiert nach Scores)
- kumuliere aktuelle Scores zu den entsprechenden Namen zuordnen
- Einheit (hier km) aus der Datenbank entnehmen (bei ChallengeID hinterlegt)
- Daten eintragen (siehe uar_table)

# 5
- oben: den, der UserID entsprechenden, namen in den Satz einbauen
- aktuelle Challenges anzeigen lassen: In welchen Gruppen befindet sich der User mit der UserID XY aktuell? -> Diese dann hier aufführen in eigenen Kästen
    - siehe hierfür TO DO 1 oben (von Luise)
- sonst weiß ich nicht wie diese Seite einzuordnen ist, die Abfrage verläuft so wie unter #4 beschrieben

# 6
- Vergangene Challenges: siehe #6 und TO DO 2 oben (von Luise)

# 7 -> bei den vergangenen Challenges reicht es mMn, wenn die Platzierung und der Score zu der Challenge gesichert werden und nicht alle Daten und Eintragungen, dadurch spart man sich viel Zeit und einiges an Datenschutz-Bumms
- Zusätzliche Abfrage bei den Vergangen Challenges bei disem Slider: Name der Challenege (ID, name) sowie Score und Platzierung/Rang

# 8
- Klick auf das Fragezeichen -> Weiterleitung Übersicht Challeneges
- Did you know facts durchnummerieren und hier in den Slider einbauen, zu jeder Nummer gibt es ein Bild, einen Satz und ggf eine kurze Beschreibung in der Datenbank, die hier abgerufen wird

# 9
keine

# 10
keine
