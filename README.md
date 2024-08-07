# KeinPlan

Ein inoffizielles Tool zur einfachen Erstellung von Stundenlisten mittels Daten eines öffentlich
erreichbaren *KaPlan* Servers.

Alle Komponenten sind als Docker-Images verfügbar und können so auf beliebigen Systemen ausgeführt
werden. Nach jedem Pull Request in `main` werden jene via CI automatisch gebaut, veröffentlicht und
auch deployt.

## Frontend

Zur einfachen Bedienung des Tools im Browser gibt es ein interaktives *next.js* Web-Frontend,
welches (intern) auf Port 3000 lauscht.

Lokale Entwicklung mittels `npm run dev` etc.

## Backend

Die eigentlichen Kernfunktionalitäten von KeinPLan finden sich im Backend, welches u. a. die
folgenden Endpunkte bereitstellt:

- GET auf `/kaplan`: Schnittstelle zum *KaPlan* Server, die Anfragen entgegennimmt und mit den
  Ergebnissen möglichst geschickt umgeht (Caching usw.).
- POST auf `/time-sheet`: Endpunkt für die Generierung diverser Stundenlistentypen.

> Hinweis: Alle Endpunkte erhalten das URL-Präfix `/api/v1`.

Die eigentliche Generierung der Stundenlisten geschieht intern via Jinja2-Templates. Resultierende
Markdown-Dateien werden mittels `pandoc` in PDFs umgewandelt.

Auf einem Produktivserver, der zwecks SSL/TLS als reverse Proxy konfiguriert sein sollte, müssen
Anfragen an den `/api`-Pfad ans Backend geleitet werden (ohne die URL dabei zu ändern!), alle
anderen Anfragen sind fürs Frontend bestimmt.

Für ein möglichst simples und sicheres Setup sollte ein Netzwerk erstellt werden, das den Reverse
Proxy samt aller Container umfasst, welche darüber erreichbar sein sollen. Diese können dann auch
anhand ihrer Namen untereinander kommunizieren. Es müssen dann keine Ports (außer natürlich 80/443)
extra nach außen geöffnet werden. Details bzw. ein aussagekräftiges Beispiel findet sich in
`docker-compose.yaml`.

Lokale Entwicklung in einer `venv` mittels `waitress-serve --port 8080 src.main:backend` oder
(für Frontend-Tests) im Docker-Container. Eine tox-Umgebung steht für Linting und Formatting bereit.
