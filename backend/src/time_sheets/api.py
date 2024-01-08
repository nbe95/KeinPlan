"""API definition for the time-sheet endpoint."""

from datetime import date, time
from tempfile import NamedTemporaryFile

from flask import request, send_file
from flask.typing import ResponseReturnValue
from flask_restful import Resource

from .entry import TimeEntry
from .sheet import TimeSheet, WeeklyTimeSheet


class TimeSheetApi(Resource):
    """Restful API for generating time sheets."""

    def post(self, ts_type: str, file_format: str) -> ResponseReturnValue:
        """Handle POST requests."""
        # Generate time sheet
        ts: TimeSheet
        if ts_type.lower() == "weekly":
            ts = WeeklyTimeSheet("Dienstgeber", "Mitarbeiter", 2023, 50)
            ts.entries = [
                TimeEntry(
                    date(2023, 12, 11),
                    "Hl. Messe",
                    (time(11, 0), time(12, 0)),
                    None,
                ),
                TimeEntry(
                    date(2023, 12, 12),
                    "Hl. Messe",
                    (time(11, 0), time(12, 0)),
                    None,
                ),
                TimeEntry(
                    date(2023, 12, 13),
                    "Hl. Messe",
                    (time(11, 0), time(12, 0)),
                    None,
                ),
                TimeEntry(
                    date(2023, 12, 14),
                    "Hl. Messe",
                    (time(11, 0), time(12, 0)),
                    None,
                ),
                TimeEntry(
                    date(2023, 12, 15),
                    "Bußandacht",
                    (time(11, 0), time(12, 0)),
                    None,
                ),
            ]
        else:
            return (f'Invalid time sheet type "{ts_type}"', 400)

        # Create and download file
        if file_format.lower() == "pdf":
            with NamedTemporaryFile() as fh:
                ts.generate(fh.name, request.args.get("nofooter") is None)
                return send_file(
                    fh.name,
                    as_attachment=True,
                    download_name="time-sheet.pdf",
                )
        else:
            return (f'Invalid file format "{file_format}"', 400)
