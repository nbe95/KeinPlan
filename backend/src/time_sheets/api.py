"""API definition for the time-sheet endpoint."""

from datetime import date, timedelta
from tempfile import NamedTemporaryFile
from typing import Any, Dict, List

from dateutil.parser import isoparse
from flask import request, send_file
from flask.typing import ResponseReturnValue
from flask_restful import Resource

from .entry import TimeEntry
from .sheet import TimeSheet, WeeklyTimeSheet
from .span import TimeSpan


class TimeSheetApi(Resource):
    """Restful API for generating time sheets."""

    def post(self, ts_type: str, file_format: str) -> ResponseReturnValue:
        """Handle POST requests."""
        # Generate time sheet
        data: Dict[str, Any] = request.json or {}
        ts: TimeSheet
        if ts_type.lower() == "weekly":
            # Fetch general data
            start_date: date = date.fromisocalendar(
                int(data.get("year", 0)),
                int(data.get("week", 0)),
                1,
            )
            year, week, _ = start_date.isocalendar()
            ts = WeeklyTimeSheet(
                data.get("employer", ""),
                data.get("employee", ""),
                year,
                week,
            )

            # Collect and sort all entries
            for datum in data.get("dates", ()):
                entry: TimeEntry = TimeEntry(
                    datum.get("title", ""),
                    datum.get("role", ""),
                    TimeSpan(
                        isoparse(datum.get("begin", "")),
                        isoparse(datum.get("end", "")),
                    ),
                    TimeSpan(
                        isoparse(datum.get("break_begin", "")),
                        isoparse(datum.get("break_end", "")),
                    )
                    if all(
                        key in datum for key in ("break_begin", "break_end")
                    )
                    else None,
                )
                if not entry.is_valid():
                    return (f"Time entry is invalid: {entry}", 400)
                ts.entries.append(entry)
            ts.entries.sort(key=lambda x: x.time_span.begin)

            # Check each date
            outside_range: List[TimeEntry] = [
                e
                for e in ts.entries
                if e.time_span.begin.date() < start_date
                or e.time_span.begin.date() - start_date >= timedelta(days=7)
            ]
            if outside_range:
                return (
                    f"{len(outside_range)} of {len(ts.entries)} time entries "
                    f"are outside the calendar week's range: {outside_range}",
                    400,
                )

        else:
            return (f'Invalid time sheet type "{ts_type}"', 400)

        # Create and download file
        if file_format.lower() == "pdf":
            with NamedTemporaryFile() as fh:
                footer: bool = request.args.get("nofooter") is None
                if not ts.generate(fh.name, footer):
                    return ("Could not generate time sheet file.", 500)

                return send_file(
                    fh.name,
                    as_attachment=True,
                    download_name="time-sheet.pdf",
                )
        else:
            return (f'Invalid file format "{file_format}"', 400)
