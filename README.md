# KeinPlan

Ein inoffizielles Tool zur einfachen Erstellung von Stundenlisten anhand Daten
eines offiziellen *KaPlan* Servers.

Alle Komponenten sind als Docker-Images verfügbar für ein einfaches und
effizientes Deployment. Nach jedem Pull Request in `main` werden sie via CI
automatisch gebaut und veröffentlicht.

## Frontend

Zur einfachen Bedienung im Browser gibt es ein interaktives Web-Frontend
basierend auf *next.js*, welches (intern) auf Port 3000 lauscht.

Lokale Entwicklung mittels `npm run dev` etc.

## Backend

Die eigentlichen Kernfunktionalitäten finden sich im Backend, welches folgende
Endpunkte bereitstellt:

|Endpunkt-URL|Methode(n)|Beschreibung|
|:---|:-:|:--|
|`/info`|GET|Stellt generelle Informationen zur Laufzeit für das Frontend bereit, die u. a. in optimierten/kompilierten *next.js*-Docker Containern nicht mehr (ohne krasse Hacks) ausgelesen und ins Frontend eingebunden werden können.|
|`/kaplan`|POST|Schnittstelle zum *KaPlan* Server, die Anfragen entgegennimmt und mit den Ergebnissen möglichst geschickt umgeht (Caching usw.).|
|`/time-sheet`|GET|Endpunkt für die Generierung verschiedener Stundenlisten.|

> Hinweis: Alle Endpunkte erhalten das URL-Präfix `/api/v1`.

Auf einem produktiven Server, der als reverse Proxy fungieren sollte, müssen
Anfragen an den `/api`-Pfad ans Backend geleitet werden (ohne die URL dabei zu
ändern); alle anderen Anfragen sind fürs Frontend bestimmt.

Für ein möglichst simples und sicheres Setup sollte ein Netzwerk erstellt werden
mit dem Reverse Proxy und allen Containern, die darin erreichbar sein sollen.
Diese können dann auch untereinander kommunizieren und es müssen keine Ports
extra nach außen geöffnet werden (außer 80/443). Für Details bzw. ein Beispiel
siehe `docker-compose.yaml`.

Beispielkonfiguration mittels Caddy, hier mit den Docker-Namen als Ziel:

```Caddyfile
keinplan.domain.tld {
        handle /api/* {
                reverse_proxy keinplan-backend:8080
        }
        handle {
                reverse_proxy keinplan-frontend:3000
        }
}
```

Lokale Entwicklung in einer `venv` mittels `waitress-serve --port 8080
src.main:backend`. Eine tox-Umgebung steht für Linting und Formatting bereit.

## Sonstiges

### Funktionsweise

Die Generierung der Stundenlisten geschieht intern via Jinja Templates.
Resultierende Markdown-Dateien werden mittels `pandoc` in PDFs umgewandelt.

### Hilfreiche Befehle

```sh
curl -X POST -H "Content-type: application/json" --data "@payload_manual.json" http://127.0.0.1:8080/time-sheet/weekly/pdf?nofooter > out.pdf
```
