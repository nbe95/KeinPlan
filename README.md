# KeinPlan

**:warning: Aktuell noch in der Entwicklung! :warning:**

---

> Warum Stundenzettel von Hand ausfüllen, wenn doch alle meine Dienste mit Datum
und Uhrzeit schon offiziell in _KaPlan_ stehen? \
***KeinPlan!***

Wenn du dir diese Frage auch schon mal gestellt hat, bist du hier genau richtig!

## Worum geht's?

Dieses Tool erzeugt ~~Datenmüll~~ Stundenlisten, die vollautomatisch mit den in
_KaPlan_ hinterlegten Diensten gefüttert werden.
Nicht mehr, aber auch nicht weniger.

Das bedeutet, mit **nur 2 Klicks** können fertige Stundenlisten erstellt, ggf.
als PDF heruntergeladen und zwecks Prozessbefriedigung direkt ans Pfarrbüro
verschickt werden.

> Spoiler: An einer Vollautomatisierung wird zurzeit noch gearbeitet. :smiley:

### Template Handling

```sh
docker run --rm -v "$(pwd):/data:Z" pandoc/latex -o out.pdf templates/timesheet.jinja.md
```
