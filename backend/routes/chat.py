import uuid
from datetime import datetime, timezone

from flask import Blueprint, jsonify, request

bp = Blueprint("chat", __name__)


@bp.post("/chat/")
def post_chat():
    data = request.get_json(silent=True) or {}
    prompt = (data.get("prompt") or "").strip()
    if not prompt:
        return jsonify({"error": "prompt is required"}), 400

    answer = prompt # TODO: delete this line
    # answer = chat(prompt) 

    return jsonify(
        {
            "id": str(uuid.uuid4()),
            "role": "assistant",
            "content": f"echo: {answer}", # TODO: change to answer
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    )

# 
def chat(prompt: str):
    pass