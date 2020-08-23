Anfragen für Dashboard:

TO DO 1
alle laufenden Challenges für den Nutzer mit ID XY mit den Informationen: ID, Name, Gruppe, Start und Ende (Das kann dann in einer Art Tabelle oder Liste dem Nutzer angezeigt werden, die ID wird benötigt, damit die Informationen für eine Challenge View entsprechend angefragt werden können)

TO DO 2
alle vergangenen Challenges für den Nutzer mit ID XY mit den selben Infos wie oben - quasi gleiche Abfrage wie oben.

TO DO 3
Anfragen für Challenge-View (Ansicht einzelner Challenge):
Alle Einträge zur entsprechenden Challenge ID laden:
- Challenge Beschreibung,
- Gruppenname,
- evtl. teilnehmende User,
- Fortschrittseinträge, für Diagramme (uar_ID)

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