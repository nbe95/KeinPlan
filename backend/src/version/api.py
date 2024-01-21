"""API definition for our version endpoint."""

from flask.typing import ResponseReturnValue
from flask_restful import Resource

from ..constants import VERSION


class VersionApi(Resource):
    """Restful API for the version interface."""

    def get(self) -> ResponseReturnValue:
        """Handle GET requests."""
        return {"version": {"keinplan": VERSION}}
