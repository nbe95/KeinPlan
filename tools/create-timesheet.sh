#!/bin/bash

source "$(dirname "$0")/.env"

date_from=$(date -d "last-monday" +"%Y-%m-%d")
date_to=$(date -d "last-sunday" +"%Y-%m-%d")
week=$(date -d "last-monday" +"%V")
year=$(date -d "last-monday" +"%Y")

out_file="Arbeitszeit_$year-$week.pdf"

ics=$(curl -s -X GET "$KEINPLAN_URL/api/v1/kaplan?ics=$KAPLAN_ICS&from=$date_from&to=$date_to")
json="$(echo "$ics" \
	| jq --arg v "$EMPLOYER" '. + {employer: $v}' \
	| jq --arg v "$EMPLOYEE" '. + {employee: $v}' \
	| jq --arg v "$year" '. + {year: $v|tonumber}' \
	| jq --arg v "$week" '. + {week: $v|tonumber}' \
	| jq '.dates[].location |= sub("(?<addr>.*),.*"; "\(.addr)")')"	# strip second part of location after comma
echo "$json"

curl -s -X POST -H "Content-type: application/json" --data "$json" "$KEINPLAN_URL/api/v1/time-sheet/weekly/pdf?nofooter" > "$out_file"
