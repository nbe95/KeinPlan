"""API definition for KeinPlan backend."""

from datetime import date, time
from pathlib import Path
from tempfile import NamedTemporaryFile

from flask import Flask, send_file
from flask_restful import Api, Resource

from src.time_sheets import TimeEntry, TimeSheet, WeeklyTimeSheet

backend: Flask = Flask(__name__)
api: Api = Api(backend)


class TimeSheetAPI(Resource):
    """Restful API for generating time sheets."""

    def post(self, file_format: str):
        """Handle POST requests on the specified format endpoint."""
        if file_format.lower() == "pdf":
            ts: TimeSheet = WeeklyTimeSheet(
                "Dienstgeber", "Mitarbeiter", 2023, 50
            )
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
            with NamedTemporaryFile() as fh:
                ts.generate(Path(fh.name))
                return send_file(
                    fh.name,
                    as_attachment=True,
                    download_name="time-sheet.pdf",
                )
        else:
            return ("Invalid file format", 400)


api.add_resource(TimeSheetAPI, "/time-sheet/<string:file_format>")
