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

### Docker (recommended)

Run the entire app with a single command:

```bash
docker compose up --build
```

App runs at `http://localhost`. Backend on port 8000, frontend on port 80 via nginx.

To stop: `docker compose down`

#### Docker without admin access (macOS)

If you don't have admin access to install Docker Desktop, use Colima:

```bash
brew install docker colima docker-compose
mkdir -p ~/.docker/cli-plugins
ln -sf $(brew --prefix)/bin/docker-compose ~/.docker/cli-plugins/docker-compose
colima start
```

Then `docker compose up --build` works as normal. To stop Colima when done: `colima stop`.

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
