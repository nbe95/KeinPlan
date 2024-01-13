"""API definition for ou kaplan endpoint."""

from base64 import b64decode
from binascii import Error
from typing import Optional

from flask import request
from flask.typing import ResponseReturnValue
from flask_restful import Resource

from .kaplan_ics import KaPlanIcs, KaPlanIcsCached


class KaPlanApi(Resource):
    """Restful API for the KaPlan interface."""

    kaplan_interface: KaPlanIcs = KaPlanIcsCached()

    def get(self) -> ResponseReturnValue:
        """Handle GET requests."""
        try:
            ics_url_b64: Optional[str] = request.args.get("ics")
            if not ics_url_b64:
                raise Error("Got an empty string.")
            ics_url: str = b64decode(ics_url_b64).decode("ascii")
        except (Error, UnicodeDecodeError) as e:
            raise ValueError(
                "The ICS string was not properly base64 encoded."
            ) from e

        return self.kaplan_interface.get_events(ics_url)
