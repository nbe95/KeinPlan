#!/bin/bash

source "$(dirname "$0")/.env"

function week2date {
  local year=$1
  local week=$2
  local dayofweek=$3
  date -d "$year-01-01 +$(( week * 7 + 1 - $(date -d "$year-01-04" +%u ) - 3 )) days -2 days + $dayofweek days" +"%Y-%m-%d"
}

week=${1:-$(date -d "last-monday-5 days" +"%V")}
year=${2:-$(date -d "last-monday-5 days" +"%Y")}
date_from=$(week2date "$year" "$week" 1)
date_to=$(week2date "$year" "$week" 7)

out_file="Arbeitszeit_$year-$week.pdf"

kaplan_dates=$(curl -s -X GET -H "X-KaPlan-ICS: $KAPLAN_ICS" "$KEINPLAN_URL/api/v1/kaplan?from=$date_from&to=$date_to")
ts_json="$(jq \
    --arg employer "$EMPLOYER" \
    --arg employee "$EMPLOYEE" \
    --arg year "$year" \
    --arg week "$week" \
    "{
        employer: \$employer,
        employee: \$employee,
	year: \$year|tonumber,
	week: \$week|tonumber,
        dates: [.dates[] | {
            title: .title,
       	    role: .role,
            location: .location_short,
            time: {
                begin: .begin,
                end: .end
            }
        }]
    }" <<< "$kaplan_dates")"

echo "$ts_json"
curl -s -X POST -H "Content-type: application/json" --data "$ts_json" "$KEINPLAN_URL/api/v1/time-sheet/weekly/pdf?nofooter" > "$out_file"
