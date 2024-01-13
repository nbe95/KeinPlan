"""API definition for the kaplan endpoint."""

from flask.typing import ResponseReturnValue
from flask_restful import Resource

from flask import request

from base64 import b64decode

from binascii import Error


from .kaplan_ics import KaPlanIcsCached

class KaPlanApi(Resource):
    """Restful API for the KaPlan interface."""

    def get(self) -> ResponseReturnValue:
        """Handle GET requests."""
        try:
            ics_url_b64: str = request.args.get("ics")
            if not ics_url_b64:
                raise Error("Got an empty string.")
            ics_url: str = b64decode(ics_url_b64).decode("ascii")
        except (Error, UnicodeDecodeError) as e:
            raise ValueError("The ICS string was not properly base64 encoded.") from e

        k = KaPlanIcsCached(ics_url)
        return k.get_events()
