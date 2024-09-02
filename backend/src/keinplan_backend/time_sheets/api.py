"""API definition for our time-sheet endpoint."""

from datetime import date, datetime, timedelta
from tempfile import NamedTemporaryFile
from typing import Any, Dict, List

from flask import request, send_file
from flask.typing import ResponseReturnValue
from flask_restful import Resource

from .entry import TimeEntry
from .sheet import TimeSheet, WeeklyTimeSheet
from .span import TimeSpan


class TimeSheetEndpoint(Resource):
    """Restful API for generating time sheets."""

    def post(self, ts_type: str, file_format: str) -> ResponseReturnValue:
        """Handle POST requests."""
        # Generate time sheet
        data: Dict[str, Any] = request.json or {}
        ts: TimeSheet
        file_name: str = "Arbeitszeit"

        if ts_type.lower() == "weekly":
            try:
                # Fetch general data
                start_date: date = date.fromisocalendar(
                    int(data.get("year", 0)), int(data.get("week", 0)), 1
                )
                year, week, _ = start_date.isocalendar()
                ts = WeeklyTimeSheet(data.get("employer", ""), data.get("employee", ""), year, week)
                file_name += f"_{ts.date_start.strftime('%Y-%V')}"

                # Collect and sort all entries
                ts.entries = [self._parse_date(d) for d in data.get("dates", [])]
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
                        f"{len(outside_range)} of {len(ts.entries)} time entries are outside the "
                        f"calendar week's range: {outside_range}",
                        400,
                    )
            except Exception as e:
                return f"Error while parsing of time sheet data: {str(e)}", 400

        else:
            return f'Invalid time sheet type "{ts_type}"', 400

        # Create and download file
        if file_format.lower() == "pdf":
            with NamedTemporaryFile() as fh:
                footer: bool = request.args.get("nofooter") is None
                if not ts.generate(fh.name, footer):
                    return ("Could not generate time sheet file.", 500)

                return send_file(fh.name, as_attachment=True, download_name=f"{file_name}.pdf")
        else:
            return f'Invalid file format "{file_format}"', 400

    def _parse_date(self, item: Dict[str, Any]) -> TimeEntry:
        item_time: Dict[str, str] = item.get("time") or {}
        item_break: Dict[str, str] = item.get("break") or {}
        entry: TimeEntry = TimeEntry(
            item.get("uid", ""),
            item.get("title", ""),
            item.get("role", ""),
            item.get("location", ""),
            TimeSpan(
                datetime.fromisoformat(item_time.get("begin") or ""),
                datetime.fromisoformat(item_time.get("end") or ""),
            ),
            (
                TimeSpan(
                    datetime.fromisoformat(item_break.get("begin") or ""),
                    datetime.fromisoformat(item_break.get("end") or ""),
                )
                if all(item_break.get(key) is not None for key in ("begin", "end"))
                else None
            ),
        )
        if not entry.is_valid():
            raise ValueError(f"Got an invalid time entry: {entry}")
        return entry
