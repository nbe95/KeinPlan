"""API definition for KeinPlan backend."""

from datetime import date, time
from pathlib import Path

from flask import Flask
from flask_restful import Api, Resource

from src.time_sheets import TimeEntry, TimeSheet, WeeklyTimeSheet

backend: Flask = Flask(__name__)
api: Api = Api(backend)


class TimeSheetAPI(Resource):
    """Restful API for generating time sheets."""

    def post(self, file_format: str):
        """Handle POST requests on the specified format endpoint."""
        ts: TimeSheet = WeeklyTimeSheet("Dienstgeber", "Mitarbeiter", 2023, 50)
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
        ts.generate(Path("out.pdf"))
        return f"Requested: {file_format}."


api.add_resource(TimeSheetAPI, "/time-sheet/<string:file_format>")
