# Änderungen

## 0.0.9.1
- **Korrigiert:** In 0.0.9 wurden bei der Berechnung auch die Verbraucher-Kacheln (Steckdose, Auto, …) abgezogen. Das war der Restverbrauch und nicht der Hausverbrauch. Jetzt ist der Standard der **Gesamtverbrauch** (Zufluss minus Einspeisung und Akku laden).
- Neu: Auswahl „Berechnung“ bei der Haus-Kachel (`calc: total` oder `rest`). „Restverbrauch“ liefert den bisherigen Wert aus 0.0.9.
- Neu: Im Editor der Haus-Kachel zeigt „So wird der Hausverbrauch berechnet“ alle einfließenden Kacheln mit Wert und warnt, wenn Quelle, Netz oder Akku mit Flussart „Beides“ fehlen.

## 0.0.9
- Haus-Kachel: „Unten“ zeigt jetzt den **berechneten Hausverbrauch** (Zufluss minus Abfluss aller Kacheln), solange kein eigener Sensor gewählt ist. Der Kopfbereich nutzt denselben Wert.
- Die **Beschriftung unter den Werten** lässt sich selbst festlegen (`top_label`, `bottom_label`, `left_label`, `right_label`), auch bei der Haus-Kachel. Im Editor steht unter jedem Sensor ein Feld dafür, die automatische Beschriftung erscheint als Platzhalter.
- Lange Beschriftungen links und rechts werden mit „…“ gekürzt.

## 0.0.8
- Behoben: Die Auswahlfelder für Entitäten überlappten sich bei langen Namen und IDs. Die Felder bleiben jetzt in ihrer Spalte, lange Texte werden mit „…“ gekürzt.
- Geprüft bei 1000, 600 und 390 Pixel Breite.

## 0.0.7
- **Behoben: Die Integration wurde in 0.0.5 und 0.0.6 nicht geladen.** Die Datei `const.py` war durch einen Fehler beim Paketieren leer, dadurch scheiterte der Import beim Start. Funktionsumfang ist sonst wie in 0.0.6. Bitte 0.0.5 und 0.0.6 überspringen.

## 0.0.6
- Mobil: Unter 600 Pixel Breite wechselt die Karte in ein Handy-Layout (Haus oben, Kacheln in zwei Spalten, Sammellinie) mit deutlich größeren Schriften.
- Die Karte passt sich beim Drehen oder Ändern der Fenstergröße automatisch an.
- GitHub-Name „Maddog3010“ ist jetzt in `manifest.json` (Dokumentation, Fehlermeldungen, Codeowner) und in der README eingetragen.

## 0.0.5
- Das Feld „Richtung“ ist jetzt die **Flussart**: verbraucht, liefert, beides mit einem Sensor (Vorzeichen, optional umkehrbar) oder beides mit zwei Sensoren (`power_to_node`, `power_to_house`).
- Der Editor zeigt je nach Flussart nur die passenden Sensorfelder mit Hinweis.
- Die Fluss-Animation und die Leuchtfarbe richten sich nach der tatsächlichen Richtung des Wertes.
- Behoben: Die Fluss-Punkte liefen seit 0.0.1 in die falsche Richtung.
- „Unten“ wird nur noch dann als Fluss-Sensor benutzt, wenn er eine Leistung in W oder kW liefert.
- Das alte Feld `direction` wird weiter gelesen.

## 0.0.4
- Entitäten wählst du jetzt über ein Auswahlmenü mit Suchfeld (Name und ID, mit aktuellem Wert, Tastatursteuerung).
- Bilder wählst du ebenfalls über ein Auswahlmenü mit Suchfeld: 15 mitgelieferte Illustrationen, Emojis, eigene `mdi:`-Symbole und Pfade.
- Im Kopfbereich steht rechts ein Bild (Option `hero_image`, `none` blendet es aus).
- Behoben: Verbindungslinien und Symbole kamen sich bei SVG-Bildern in die Quere.

## 0.0.2
- Die Integration legt automatisch eine Seite **Energiefluss** in der Seitenleiste an.
- Auf der Seite: Karte im Vollbild und „Anpassen“ mit dem Editor (Kacheln an/aus, Entitäten, Bilder). Gespeichert wird zentral für alle Benutzer, ändern dürfen nur Administratoren.
- Optionen der Integration: Titel, Symbol und Sichtbarkeit (nur Administratoren) des Eintrags.
- Neues Aussehen wie in der Vorschau: Kopfbereich mit „Hausverbrauch jetzt“ und Chips (Solar, Hausverbrauch heute, eigene Chips), Karte in dunklen Kacheln.
- Neue Einrichtung der Kacheln im selben Stil: Kachel-Liste mit Haken, Entitäten mit Vorschlägen, Farbauswahl und YAML-Vorschau. Kacheln lassen sich auch direkt auf der Karte antippen.
- Karte: neue Optionen `hide_header`, `show_hero` und `hub.chips`.

## 0.0.1
- Erste Version: Karte mit bis zu 9 Kacheln und je vier Entitäten, grafischer Editor, Einrichtung per Oberfläche.
