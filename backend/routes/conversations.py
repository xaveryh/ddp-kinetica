from flask import Blueprint, jsonify

bp = Blueprint("conversations", __name__)


@bp.get("/conversations/")
def list_conversations():
    return jsonify([])
