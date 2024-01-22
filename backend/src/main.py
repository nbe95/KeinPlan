"""API definition for KeinPlan backend."""

import logging

from flask import Flask
from flask_restful import Api

from src.kaplan import KaPlanApi
from src.kaplan.constants import (
    KAPLAN_ALLOWED_SERVERS,
    KAPLAN_ALLOWED_WORKGROUPS,
)
from src.time_sheets import TimeSheetApi
from src.version import VersionApi

from .constants import LOG_LEVEL, VERSION

logging.basicConfig(level=logging.WARNING)
logger = logging.getLogger(__name__)
logger.setLevel(LOG_LEVEL)

logger.info("Setting up KeinPlan backend v%s.", VERSION)
logger.info("Allowed KaPlan servers: %s", ", ".join(KAPLAN_ALLOWED_SERVERS))
logger.info(
    "Allowed KaPlan workgroups: %s", ", ".join(KAPLAN_ALLOWED_WORKGROUPS)
)


backend: Flask = Flask(__name__)
api: Api = Api(backend)

api.add_resource(VersionApi, "/version")
api.add_resource(KaPlanApi, "/kaplan")
api.add_resource(
    TimeSheetApi, "/time-sheet/<string:ts_type>/<string:file_format>"
)
