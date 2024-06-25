"""API definition for KeinPlan backend."""

from flask import Blueprint
from flask_restful import Api

from src.kaplan import KaPlanEndpoint
from src.time_sheets import TimeSheetEndpoint
from src.version import VersionEndpoint

api_blueprint: Blueprint = Blueprint("api_v1", __name__, url_prefix="/api/v1")
api: Api = Api(api_blueprint)

api.add_resource(VersionEndpoint, "/version")
api.add_resource(KaPlanEndpoint, "/kaplan")
api.add_resource(TimeSheetEndpoint, "/time-sheet/<string:ts_type>/<string:file_format>")
