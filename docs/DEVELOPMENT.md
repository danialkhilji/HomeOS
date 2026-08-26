# Development Guide

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

## Run Tests

```bash
conda activate homeos
cd backend
pytest tests/ -v              # run all tests
pytest tests/test_health.py   # run a specific test file
pytest tests/ -v --cov=app    # run with coverage report
```

Tests use an in-memory SQLite database — each test gets a fresh database so tests don't interfere with each other.

## Pre-Push Checks

Run all checks (backend tests, frontend type check, frontend build) manually before pushing:

```bash
cd HomeOS
.git/hooks/pre-push
```

These checks also run automatically on every `git push`. If any check fails, the push is blocked.

## Releasing a New Version

When you're ready to release a new version:

1. Update the version number in two files:
   - `backend/app/core/config.py` — change `VERSION`
   - `frontend/package.json` — change `version`

2. Commit, push, and merge to main

3. Tag the release on main:
```bash
git checkout main
git pull
git tag v1.2
git push origin v1.2
```

4. Update CHANGELOG.md with what changed in this version

Version format is two numbers (e.g. v1.0, v1.1, v1.2). Bump the second number for new features, use a third number for bug fixes if needed (e.g. v1.2.1).

## Project Structure

```
HomeOS/
├── backend/          # FastAPI application
│   ├── app/
│   │   ├── api/v1/   # Versioned API routes
│   │   ├── core/     # Config, database, scheduler, logging, exceptions
│   │   └── modules/  # Feature modules (members, tasks, shopping, notes, calendar, prayer, weather, cleanup)
│   ├── migrations/   # Alembic database migrations
│   └── tests/
├── frontend/         # React application
│   └── src/
│       ├── api/       # API client functions
│       ├── components/# Shared UI components (Button, Card, Modal, icons)
│       ├── features/  # Feature pages (dashboard, tasks, shopping, notes, calendar, settings)
│       ├── hooks/     # TanStack Query hooks
│       ├── layouts/   # App shell and navigation
│       └── types/     # Shared TypeScript types
├── scripts/          # Backup and utility scripts
└── CHANGELOG.md      # Release history
```
