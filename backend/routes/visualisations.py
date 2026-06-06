from flask import Blueprint, jsonify

bp = Blueprint("visualisations", __name__)


@bp.get("/visualisations/")
def list_visualisations():
    return jsonify([])
