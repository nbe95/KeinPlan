# KeinPlan

**:warning: Aktuell noch in der Entwicklung! :warning:**

---

> Warum Stundenzettel von Hand ausfüllen, wenn doch alle meine Dienste mit Datum
und Uhrzeit schon offiziell in *KaPlan* stehen? \
***KeinPlan!***

Wenn du dir diese Frage auch schon mal gestellt hat, bist du hier genau richtig.

## Worum geht's?

Dieses Online-Tool erzeugt ~~Datenmüll~~ Stundenlisten, die vollautomatisch 1:1
mit den in *KaPlan* hinterlegten Diensten gefüttert werden. Nicht mehr, aber
auch nicht weniger.

Das bedeutet, hier kannst du mit nur wenigen Klicks fertige Stundenlisten
erstellen, als PDF herunterladen und direkt zwecks Prozessbefriedigung ans
Pfarrbüro versenden.

### Hilfreiche Befehle

```sh
curl -X POST -H "Content-type: application/json" --data "@payload_manual.json" http://127.0.0.1:8080/time-sheet/weekly/pdf?nofooter > out.pdf
```
