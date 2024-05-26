"""API definition for our basic information endpoint."""

from flask.typing import ResponseReturnValue
from flask_restful import Resource

from ..constants import ADMIN_MAIL, GITHUB_LINK, KAPLAN_LINK, VERSION_BACKEND


class InfoApi(Resource):
    """Restful API for the info interface."""

    def get(self) -> ResponseReturnValue:
        """Handle GET requests."""
        return {
            "version": {
                "KeinPlanBackend": VERSION_BACKEND,
            },
            "env": {
                "GithubLink": GITHUB_LINK,
                "KaPlanLink": KAPLAN_LINK,
                "AdminMail": ADMIN_MAIL,
            },
        }
