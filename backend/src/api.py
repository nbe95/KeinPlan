"""API definition for KeinPlan backend."""

import logging

from flask import Blueprint
from flask_restful import Api

from src.kaplan import KaPlanApi
from src.time_sheets import TimeSheetApi
from src.version import VersionApi

from .constants import LOG_LEVEL, VERSION

api_blueprint: Blueprint = Blueprint("api_v1", __name__, url_prefix="/api/v1")
api: Api = Api(api_blueprint)

api.add_resource(VersionApi, "/version")
api.add_resource(KaPlanApi, "/kaplan")
api.add_resource(
    TimeSheetApi,
    "/time-sheet/<string:ts_type>/<string:file_format>",
)
