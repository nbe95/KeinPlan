"""API definition for ou kaplan endpoint."""

from base64 import b64decode
from binascii import Error
from datetime import datetime
from typing import Optional

from dateutil.parser import isoparse
from flask import request
from flask.typing import ResponseReturnValue
from flask_restful import Resource
from hyperlink import URL

from .kaplan_ics import KaPlanIcs, KaPlanIcsCached, KaPlanInterfaceError


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
            normalized_url: str = URL.from_text(ics_url).normalize().to_text()
        except (Error, UnicodeDecodeError) as e:
            return {"message": f"The ICS string was not properly encoded: {e}"}

        try:
            date_from: datetime = isoparse(
                request.args.get("from", datetime.min.isoformat())
            )
            date_to: datetime = isoparse(
                request.args.get("to", datetime.max.isoformat())
            )
            return self.kaplan_interface.get_events(
                normalized_url, date_from, date_to
            )
        except KaPlanInterfaceError as e:
            return {"message": f"Could not import KaPlan data: {e}"}
