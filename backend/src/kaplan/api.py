"""API definition for the kaplan endpoint."""

from flask.typing import ResponseReturnValue
from flask_restful import Resource


class KaPlanApi(Resource):
    """Restful API for the KaPlan interface."""

    def get(self, key: str) -> ResponseReturnValue:
        """Handle GET requests."""
        return key
