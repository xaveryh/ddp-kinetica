# ddp-kinetica

Chat application scaffold. Flask backend + React/TypeScript/Vite frontend.

The chat endpoint currently echoes input. The Kinetica SQL tool and LLM wiring will be added in a later pass.

## Run the backend

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
flask --app app run --debug --port 5000
```

Health check: `curl http://localhost:5000/api/health/` → `{"status":"ok"}`.

## Run the frontend

```bash
cd frontend
npm install
npm run dev
```

Open <http://localhost:5173>. The Vite dev server proxies `/api/*` to the backend on `:5000`.

## Layout

- `backend/app.py` — Flask app factory + entrypoint.
- `backend/routes/` — route blueprints (`health`, `chat`, `conversations`, `visualisations`, `predictions`).
- `frontend/src/` — React app with three routes: Chat (`/`), Visualisations (`/visualisations`), Predictions (`/predictions`).
