# KeinPlan

Ein inoffizielles Tool zur einfachen Erstellung von Stundenlisten anhand Daten
eines offiziellen *KaPlan* Servers.

Alle Komponenten sind als Docker-Container verfügbar und werden bei
Funktionserweiterungen/Updates via CI automatisch veröffentlicht.

## Frontend

Zur einfachen Bedienung im Browser gibt es ein interaktives Web-Frontend
basierend auf *next.js*, welches (intern) auf Port 3000 lauscht.

Lokale Entwicklung mittels `npm run dev` etc.

## Backend

Die eigentliche Funktionalität, Datem vom *KaPlan* Server abzufragen und daraus
Stundenlisten zu erstellen, findet sich im Backend mit den folgenden Endpunkten.

- `/info`: Stellt generelle Informationen zur Laufzeit für das Frontend bereit,
  die u. a. in optimierten/kompilierten next.js-Docker Containern nicht mehr
  (ohne krasse Hacks) ausgelesen und ins Frontend eingebunden werden können.
- `/kaplan`: Schnittstelle zum *KaPlan* Server, die Anfragen entgegennimmt und
  mit den Ergebnissen möglichst geschickt umgeht (Caching usw.).
- `/time-sheet`: Endpunkt für die Generierung verschiedener Stundenlisten.

> Hinweis: Alle Endpunkte erhalten das URL-Präfix `/api/v1`.

Auf einem produktiven Server, der als reverse Proxy fungieren sollte, müssen
Anfragen an den `/api`-Pfad ans Backend geleitet werden (ohne die URL dabei zu
ändern!), alle anderen Anfragen sind fürs Frontend bestimmt.

Beispielkonfiguration mittels Caddy, hier mit dem Docker-Host als Ziel:

```Caddyfile
keinplan.domain.tld {
        handle /api/* {
                reverse_proxy 172.17.0.1:8080
        }
        handle {
                reverse_proxy 172.17.0.1:3000
        }
}
```

Lokale Entwicklung in einer venv mittels `waitress-server --port 8080
src.main:backend`. Eine tox-Umgebung steht für Linting und Formatting bereit.

## Sonstiges

### Funktionsweise

Die Generierung der Stundenlisten geschieht intern via Jinja Templates.
Resultierende Markdown-Dateien werden mittels `pandoc` in PDFs umgewandelt.

### Hilfreiche Befehle

```sh
curl -X POST -H "Content-type: application/json" --data "@payload_manual.json" http://127.0.0.1:8080/time-sheet/weekly/pdf?nofooter > out.pdf
```
