"""API definition for our KaPlan endpoint."""

from base64 import b64decode
from datetime import date, datetime
from typing import Any, Optional

from flask import request
from flask.typing import ResponseReturnValue
from flask_restful import Resource
from hyperlink import URL
from requests.exceptions import ConnectionError as RequestsConnectionError
from validators import url as validate_url

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
                raise ValueError("No URL provided.")

            ics_url: str = b64decode(ics_url_b64).decode("ascii")
            normalized_url: str = URL.from_text(ics_url).normalize().to_text()
            validation: Any = validate_url(normalized_url, simple_host=True)
            if not validation:
                return (
                    f"Got an invalid URL: {validation.reason}"
                    if hasattr(validation, "reason")
                    else "Got an invalid URL."
                ), 400

        except UnicodeDecodeError as e:
            return f"The URL was malformed or not properly encoded: {e}", 400

        except ValueError:
            return "Could not process the provided URL.", 400

        try:
            date_from: date = datetime.strptime(
                request.args.get("from", date.min.isoformat()), "%Y-%m-%d"
            ).date()
            date_to: date = datetime.strptime(
                request.args.get("to", date.max.isoformat()), "%Y-%m-%d"
            ).date()
            return self.kaplan_interface.get_events(normalized_url, date_from, date_to)

        except RequestsConnectionError:
            return "Could not connect to KaPlan server.", 400

        except ValueError as e:
            return f"Got an invalid response from KaPlan server: {e}", 400

        except KaPlanInterfaceError as e:
            return f"Unknown error during date import: {e}", 400
