"""API definition for KeinPlan backend."""

from flask import Blueprint
from flask_restful import Api

from src.info import InfoApi
from src.kaplan import KaPlanApi
from src.time_sheets import TimeSheetApi

api_blueprint: Blueprint = Blueprint("api_v1", __name__, url_prefix="/api/v1")
api: Api = Api(api_blueprint)

api.add_resource(InfoApi, "/info")
api.add_resource(KaPlanApi, "/kaplan")
api.add_resource(
    TimeSheetApi,
    "/time-sheet/<string:ts_type>/<string:file_format>",
)
