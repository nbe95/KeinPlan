"""API definition for our basic information endpoint."""

from flask.typing import ResponseReturnValue
from flask_restful import Resource

from ..constants import ADMIN_MAIL, GITHUB_LINK, KAPLAN_LINK, VERSION


class InfoApi(Resource):
    """Restful API for the info interface."""

    def get(self) -> ResponseReturnValue:
        """Handle GET requests."""
        return {
            "version": {
                "KeinPlanBackend": VERSION,
            },
            "env": {
                "GithubLink": GITHUB_LINK,
                "KaPlanLink": KAPLAN_LINK,
                "AdminMail": ADMIN_MAIL,
            },
        }
