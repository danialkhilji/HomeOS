# HomeOS

A self-hosted family operating system for a kitchen touchscreen. Manages household tasks, shopping lists, and family notes from a single shared display.

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Python 3.12, FastAPI, SQLAlchemy, SQLite
- **Infrastructure:** Docker, Docker Compose
- **Target Device:** Linux Mini PC + touchscreen display

## Setup

### Backend

```bash
conda activate homeos
cd backend
pip install -e ".[dev]"
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

### Run Tests

```bash
conda activate homeos
cd backend
pytest tests/ -v              # run all tests
pytest tests/test_health.py   # run a specific test file
pytest tests/ -v --cov=app    # run with coverage report
```

Tests use an in-memory SQLite database — each test gets a fresh database so tests don't interfere with each other.

## Project Structure

```
HomeOS/
├── backend/          # FastAPI application
│   ├── app/
│   │   ├── api/v1/   # Versioned API routes
│   │   ├── core/     # Config, database, logging, exceptions
│   │   └── modules/  # Feature modules (members, tasks, shopping, notes)
│   ├── migrations/   # Alembic database migrations
│   └── tests/
├── frontend/         # React application
│   └── src/
│       ├── api/       # Axios client
│       ├── components/# Shared UI components
│       ├── features/  # Feature pages (dashboard, tasks, shopping, notes, settings)
│       ├── layouts/   # App shell and navigation
│       ├── stores/    # Zustand state management
│       └── types/     # Shared TypeScript types
└── docs/             # Vision, roadmap, engineering guidelines
```
