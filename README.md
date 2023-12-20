# KeinPlan

## Was ist das?

> Warum Stundenzettel von Hand ausfüllen, wenn doch alle meine Dienste mit Datum
> und Uhrzeit schon offiziell in _KaPlan_ stehen? ***KeinPlan!***

Jeder, der sich diese Frage schon mal gestellt hat, ist hier goldrichtig!

Dieses Tool erzeugt ~~Datenmüll~~ Stundenlisten, die vollautomatisch mit den in
_KaPlan_ hinterlegten Diensten gefüttert werden.
Nicht mehr, aber auch nicht weniger.

Mit **nur 2 Klicks** können hier fertige Stundenlisten erstellt, ggf. als PDF
heruntergeladen und dann zwecks Prozessbefriedigung direkt ans Pfarrbüro
verschickt werden.

> Spoiler: An einer Vollautomatisierung für jeden, der es möchte, wird zurzeit
> noch gearbeitet. :)

## Template Handling

```sh
docker run --rm -v "$(pwd):/data:Z" pandoc/latex -o out.pdf templates/timesheet.jinja.md
```
