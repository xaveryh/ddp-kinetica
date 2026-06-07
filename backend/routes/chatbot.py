import json
import os
import uuid
from datetime import datetime, timezone

import google.generativeai as genai
import requests
from requests.auth import HTTPBasicAuth
from flask import Blueprint, jsonify, request

bp = Blueprint("chatbot", __name__)

KINETICA_HOST = os.environ.get(
    "KINETICA_HOST",
    "https://cluster1450.saas.kinetica.com/cluster1450/gpudb-0",
)
KINETICA_USER = os.environ.get("KINETICA_USER", "chhunheangchhorn_gmail")
KINETICA_PASS = os.environ.get("KINETICA_PASS", "AdminLover67!")

SCHEMA = """
Tables in the archer Kinetica database:

Archer(archerID, avNumber, yearOfBirth, gender, classID)
Class(classID, className, gender, minAge, maxAge)
Equipment(equipmentID, equipmentName, descriptions)
Round(roundID, roundName)
ArcheryRange(rangeID, roundID, distance, faceSize, numEnds)
ArcheryRangeAttempt(rangeAttemptID, rangeID)
RoundAttempt(roundAttemptID, archerID, equipmentID, roundID, rangeAttemptID, roundDatetime)
Category(categoryID, classID, equipmentID, categoryName)
ScoreEnd(endID, rangeAttemptID, endNumber, approvalStatus, score1, score2, score3, score4, score5, score6)
Competition(compID, winnerID, categoryID, compDatetime, compVenue)
Championship(championshipID, winnerID, champName, champStartDate, champEndDate)
ArcherEquipment(archerID, equipmentID, isDefault)
CompetitionSession(compID, roundAttemptID)
ChampionshipCompetition(compID, championshipID)
RoundEligibility(categoryID, roundID)
EquivalentRound(equivalentRoundID, nominalRoundID, theEquivalentRoundID, categoryID, startDate, endDate)
"""

_SQL_SYSTEM = (
    "You are a SQL expert for a Kinetica database. "
    "Convert the user's natural language question into a valid SQL SELECT query.\n\n"
    f"Schema:\n{SCHEMA}\n\n"
    "Rules:\n"
    "- Return ONLY the SQL query, no explanation, no markdown, no code fences.\n"
    "- Use standard SQL compatible with Kinetica.\n"
    "- Do not end with a semicolon.\n"
    "- Write SELECT queries only."
)

_ANSWER_SYSTEM = (
    "You are a helpful assistant. "
    "Given a SQL query result, answer the user's question in plain, concise English."
)


def _make_gemini_model(system_instruction: str) -> genai.GenerativeModel:
    genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))
    return genai.GenerativeModel(
        model_name="gemini-2.5-flash",
        system_instruction=system_instruction,
    )


def _extract_text(response) -> str:
    for part in response.parts:
        if part.text and not getattr(part, "thought", False):
            return part.text.strip()
    return ""


def _question_to_sql(question: str) -> str:
    model = _make_gemini_model(_SQL_SYSTEM)
    response = model.generate_content(question)
    return _extract_text(response)


def _run_sql(sql: str) -> list:
    url = f"{KINETICA_HOST}/execute/sql"
    resp = requests.post(
        url,
        json={"statement": sql, "limit": 100, "offset": 0, "encoding": "json"},
        auth=HTTPBasicAuth(KINETICA_USER, KINETICA_PASS),
        timeout=30,
    )
    resp.raise_for_status()
    data = resp.json()

    if data.get("status") != "OK":
        raise RuntimeError(data.get("message", f"Unexpected response: {data}"))

    inner = json.loads(data.get("data_str", "{}"))
    encoded = json.loads(inner.get("json_encoded_response", "{}"))

    if not encoded:
        return []

    column_headers = encoded.get("column_headers", [])
    if not column_headers:
        return []

    num_rows = len(encoded.get("column_1", []))
    rows = []
    for i in range(num_rows):
        row = {}
        for j, name in enumerate(column_headers):
            col_data = encoded.get(f"column_{j + 1}", [])
            row[name] = col_data[i] if i < len(col_data) else None
        rows.append(row)
    return rows


def _results_to_answer(question: str, sql: str, rows: list) -> str:
    results_preview = json.dumps(rows[:20], indent=2)
    prompt = (
        f"Question: {question}\n\n"
        f"SQL used: {sql}\n\n"
        f"Results ({len(rows)} rows total, showing up to 20):\n{results_preview}\n\n"
        "Answer the question in plain English."
    )
    model = _make_gemini_model(_ANSWER_SYSTEM)
    response = model.generate_content(prompt)
    return _extract_text(response)


@bp.post("/chat/")
def post_chatbot():
    data = request.get_json(silent=True) or {}
    question = (data.get("prompt") or "").strip()
    if not question:
        return jsonify({"error": "prompt is required"}), 400

    try:
        sql = _question_to_sql(question)
    except Exception as exc:
        return jsonify({"error": f"SQL generation failed: {exc}"}), 500

    try:
        rows = _run_sql(sql)
    except requests.exceptions.Timeout:
        return jsonify({"error": "Database timed out. Check the Kinetica cluster is running."}), 500
    except requests.exceptions.HTTPError as exc:
        try:
            detail = exc.response.json()
        except Exception:
            detail = exc.response.text
        return jsonify({"error": f"Database HTTP error: {exc}", "sql": sql, "detail": detail}), 500
    except Exception as exc:
        return jsonify({"error": f"Database query failed: {exc}", "sql": sql}), 500

    try:
        answer = _results_to_answer(question, sql, rows)
    except Exception as exc:
        return jsonify({"error": f"Answer generation failed: {exc}"}), 500

    return jsonify(
        {
            "id": str(uuid.uuid4()),
            "role": "assistant",
            "content": answer,
            "created_at": datetime.now(timezone.utc).isoformat(),
        }
    )
