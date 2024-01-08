"""API definition for KeinPlan backend."""

from flask import Flask
from flask_restful import Api

from src.kaplan import KaPlanApi
from src.time_sheets import TimeSheetApi

backend: Flask = Flask(__name__)
api: Api = Api(backend)

api.add_resource(KaPlanApi, "/kaplan/<string:key>/")
api.add_resource(
    TimeSheetApi, "/time-sheet/<string:ts_type>/<string:file_format>"
)
