# Echtzeitsystem-Simulator

## Beschreibung

Dieses Projekt ist eine TypeScript-Webanwendung, die mithilfe von go.js einen Echtzeitsystem-Simulator implementiert. Der Simulator ermöglicht die Verwendung von Semaphoren und Mutexen zur Synchronisierung von Prozessen. Die Mutexe können entweder mit einer Prioritätsliste versehen oder mit Prioritätsvererbung arbeiten. Semaphoren haben einen Namen und einen Wert im Bereich von 0 bis n. 

Das System besteht aus Aktivitäten und Tasks, wobei Tasks aus mehreren Aktivitäten bestehen können. Es werden sowohl AND- als auch OR-Semaphoren unterstützt.

## Features

- Simulation von Echtzeitsystemen mit der Verwendung von Semaphoren und Mutexen
- Prioritätsliste für Mutexe oder Prioritätsvererbung
- Benutzerdefinierte Namen und Werte für Semaphoren
- Unterstützung für AND- und OR-Semaphoren
- Gute Anordnung der Nodes beim Generieren
- Verschieben von Nodes innerhalb der Anwendung
- Bearbeiten und Anzeigen von CSV-Dateien im Browser
- Hochladen von Dateien
- Erstellen, Löschen und Verwalten von Dateien direkt im Browser
- Persistenz von Dateien selbst nach Neustart der Anwendung
- Automatischer Ablauf von Tasks
- Möglichkeit, Schritte zurückzugehen
- Historie-Tab zur Anzeige vergangener Zustände
- Viewer-Tab zur detaillierten Anzeige des aktuellen Systemzustands
- Dark Mode und Light Mode mit ansprechendem Design

## Installation und Verwendung

1. Klonen Sie das Repository auf Ihren lokalen Rechner.
2. Führen Sie `npm install` aus, um die erforderlichen Abhängigkeiten zu installieren.
3. Starten Sie die Anwendung mit `npm start`.
4. Öffnen Sie Ihren Webbrowser und navigieren Sie zu `http://localhost:3000`.

## Beispiel Datei 

'# Activity, activity_task, Duration

Activity, a_1, 1
Activity, a_2, 1
Activity, a_3, 1


'# Semaphore, Wert, Endwert, Startwert +,
Semaphore, 0, a_1, a_2
Semaphore, 0, a_2, a_3, a_1
Semaphore, 0, a_3, a_1


'# Mutex, Prioritäten Aktivitäten
Mutex, a_1,a_2,a_3

## Lizenz

Dieses Projekt steht unter der [MIT-Lizenz](https://opensource.org/licenses/MIT).


- prioritätsvereerbung
- or pfeil (gojs)

- zurück und vor (nextCycle) (max 50 back)
- automatisch mit intervall (mit custom timer)
- csv, reload button (hotload?)
- abspeichern der elementkoordinaten 
- element informationen 