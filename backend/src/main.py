"""Main KeinPlan backend module."""

import logging

from flask import Flask
from flask_cors import CORS

from src.kaplan.constants import KAPLAN_ALLOWED_SERVERS, KAPLAN_ALLOWED_WORKGROUPS

from .api import api_blueprint
from .constants import LOG_LEVEL, VERSION_BACKEND

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)
logger.setLevel(LOG_LEVEL)

logger.info(
    "Setting up KeinPlan backend %s.",
    f"v{VERSION_BACKEND}" if VERSION_BACKEND else "<unknown version>",
)
logger.info(
    "Allowed KaPlan servers: %s",
    ", ".join(KAPLAN_ALLOWED_SERVERS) if KAPLAN_ALLOWED_SERVERS else "<any>",
)
logger.info(
    "Allowed KaPlan workgroups: %s",
    ", ".join(KAPLAN_ALLOWED_WORKGROUPS) if KAPLAN_ALLOWED_WORKGROUPS else "<any>",
)


backend: Flask = Flask(__name__)
CORS(backend)
backend.register_blueprint(api_blueprint)
