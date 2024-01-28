# KeinPlan

> Warum Stundenzettel von Hand ausfüllen, wenn doch alle meine Dienste mit Datum
und Uhrzeit schon offiziell in *KaPlan* stehen? \
– ***KeinPlan!***

Wenn du dir diese Frage auch schonmal gestellt hat, bist du hier genau richtig.

## Worum geht's?

Dieses Online-Tool exportiert vollautomatisch Stundenlisten aus deinen in
*KaPlan*> hinterlegten Diensten.

Mit nur ein paar Klicks erstellt es Auflistungen deiner Arbeitszeit, die als PDF
herunterladen und anschließend direkt ans Pfarrbüro versendet werden können.

## FAQ

### Ist das hier offiziell?

Nein. Dieses Tool hat nichts mit *KaPlan*, der Kirchengemeinde usw. zu tun.
Daher alles ohne Gewähr.\
**Überprüfe alles, was du ans Pfarrbüro sendest.**

### Meine Stundenliste ist fehlerhaft!?

Rechne nochmal nach. Wenn du sicher bist, eine Unstimmigkeit gefunden zu haben,
erstelle gerne [ein Ticket](https://github.com/nbe95/KeinPlan/issues) mit
genauer Beschreibung des Fehlers oder melde dich direkt beim
KeinPlan-Administrator deines Vertrauens.

### Ist das alles den Aufwand wert?

Ja. Allein aus Prinzip.

## Sonstiges

### Hilfreiche Befehle

```sh
curl -X POST -H "Content-type: application/json" --data "@payload_manual.json" http://127.0.0.1:8080/time-sheet/weekly/pdf?nofooter > out.pdf
```
