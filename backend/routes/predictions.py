from flask import Blueprint, jsonify

bp = Blueprint("predictions", __name__)


@bp.get("/predictions/")
def list_predictions():
    return jsonify([])
