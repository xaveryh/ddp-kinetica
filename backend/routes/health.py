from flask import Blueprint, jsonify

bp = Blueprint("health", __name__)


@bp.get("/health/")
def get_health():
    return jsonify({"status": "ok"})
