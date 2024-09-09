"""API definition for our time-sheet endpoint."""

from datetime import date, datetime, timedelta
from pathlib import Path
from tempfile import TemporaryDirectory
from typing import Any, Dict, List

from flask import request, send_file
from flask.typing import ResponseReturnValue
from flask_restful import Resource

from .time_entry import TimeEntry
from .time_sheet import TimeSheet, WeeklyTimeSheet


class TimeSheetEndpoint(Resource):
    """Restful API for generating time sheets."""

    def post(self, ts_type: str, file_format: str) -> ResponseReturnValue:
        """Handle POST requests."""
        # Generate time sheet
        data: Dict[str, Any] = request.json or {}
        sheet: TimeSheet
        file_name: str = "Arbeitszeit"

        if ts_type.lower() == "weekly":
            try:
                # Fetch general data
                start_date: date = date.fromisocalendar(
                    int(data.get("year", 0)), int(data.get("week", 0)), 1
                )
                year, week, _ = start_date.isocalendar()
                sheet = WeeklyTimeSheet(
                    data.get("employer", ""), data.get("employee", ""), year, week
                )
                file_name += f"_{sheet.year}-{sheet.week_no}"

                # Collect and sort all entries
                sheet.entries = [self._parse_date(d) for d in data.get("dates", [])]
                sheet.entries.sort(key=lambda entry: datetime.combine(entry.date, entry.start_time))

                # Check each date
                outside_range: List[TimeEntry] = [
                    entry
                    for entry in sheet.entries
                    if entry.date < start_date or entry.date - start_date >= timedelta(days=7)
                ]
                if outside_range:
                    return (
                        f"{len(outside_range)} of {len(sheet.entries)} time entries are outside "
                        f"the calendar week's range: {outside_range}",
                        400,
                    )
            except Exception as e:
                return f"Error while parsing of time sheet data: {str(e)}", 400

        else:
            return f'Invalid time sheet type "{ts_type}"', 400

        # Create and download file
        if file_format.lower() == "pdf":
            footer: bool = request.args.get("nofooter") is None
            with TemporaryDirectory() as tmp_dir:
                pdf_file = sheet.generate_pdf(Path(tmp_dir), footer)
                if not pdf_file:
                    return ("Could not generate time sheet file.", 500)

                return send_file(pdf_file, as_attachment=True, download_name=f"{file_name}.pdf")
        else:
            return f'Invalid file format "{file_format}"', 400

    def _parse_date(self, item: Dict[str, Any]) -> TimeEntry:
        try:
            start: datetime = datetime.fromisoformat(item["start_date"] or "")
            end: datetime = datetime.fromisoformat(item["end_date"] or "")
            entry: TimeEntry = TimeEntry(
                item.get("uid", ""),
                item.get("title", ""),
                item.get("role", ""),
                item.get("location", ""),
                start.date(),
                start.time(),
                end.time(),
            )
            if not entry.is_valid:
                raise ValueError(f"Invalid time entry: {entry}")
            return entry
        except (KeyError, ValueError) as e:
            raise ValueError(f"Invalid time entry: {item}") from e
