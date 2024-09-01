"""API definition for our basic information endpoint."""

from flask.typing import ResponseReturnValue
from flask_restful import Resource

from ..constants import VERSION_BACKEND, VERSION_SHA_BACKEND


class VersionEndpoint(Resource):
    """Restful API for the version interface."""

    def get(self) -> ResponseReturnValue:
        """Handle GET requests."""
        return {
            "KeinPlan": {
                "backend": {
                    "version": VERSION_BACKEND,
                    "sha": VERSION_SHA_BACKEND,
                }
            }
        }
