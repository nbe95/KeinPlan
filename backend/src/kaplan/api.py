"""API definition for our kaplan endpoint."""

from base64 import b64decode
from binascii import Error
from datetime import date, datetime
from typing import Optional

from flask import request
from flask.typing import ResponseReturnValue
from flask_restful import Resource
from hyperlink import URL

from .constants import KAPLAN_ICS_HEADER
from .kaplan_ics import KaPlanIcs, KaPlanIcsCached, KaPlanInterfaceError


class KaPlanEndpoint(Resource):
    """Restful API for the KaPlan interface."""

    kaplan_interface: KaPlanIcs = KaPlanIcsCached()

    def get(self) -> ResponseReturnValue:
        """Handle GET requests."""
        try:
            ics_url_b64: Optional[str] = request.headers.get(KAPLAN_ICS_HEADER)
            if not ics_url_b64:
                raise Error("Got an empty string.")
            ics_url: str = b64decode(ics_url_b64).decode("ascii")
            normalized_url: str = URL.from_text(ics_url).normalize().to_text()
        except (Error, UnicodeDecodeError) as e:
            return f"The ICS string was not properly encoded: {e}", 400

        try:
            date_from: date = datetime.strptime(
                request.args.get("from", date.min.isoformat()), "%Y-%m-%d"
            ).date()
            date_to: date = datetime.strptime(
                request.args.get("to", date.max.isoformat()), "%Y-%m-%d"
            ).date()
            return self.kaplan_interface.get_events(normalized_url, date_from, date_to)
        except KaPlanInterfaceError as e:
            return f"Could not import KaPlan data: {e}", 400
