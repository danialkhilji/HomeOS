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

## Production Deployment

Deploy HomeOS on a dedicated Linux machine (Mini PC, old laptop, etc.).

### Prerequisites

- Linux with Docker and Docker Compose installed
- Git installed

### First-time setup

```bash
git clone https://github.com/YOUR_USERNAME/HomeOS.git
cd HomeOS
cp .env.example .env
```

Edit `.env` and set your location coordinates. These are used for both weather and prayer times:

```
WEATHER_LATITUDE=your_latitude
WEATHER_LONGITUDE=your_longitude
```

To find your coordinates, search your city name on Google Maps and copy the latitude/longitude from the URL.

#### Prayer Times

Prayer times are fetched from the [Aladhan API](https://aladhan.com/prayer-times-api) using:

- **Method 15** (Moonsighting Committee Worldwide) — closest to UK mosque timetables for Fajr
- **Hanafi school** — for later Asr times matching most UK mosques

Times refresh automatically at 1am daily. The next upcoming prayer is highlighted on the dashboard. These are calculated astronomical times, so they may differ by a few minutes from your local mosque's posted times.

Start the app in the background:

```bash
docker compose up --build -d
```

Open `http://localhost` in a browser. To access from other devices on the same network, use the machine's IP address.

### Updating to latest version

```bash
cd HomeOS
git pull
docker compose down
docker compose up --build -d
```

Your data (members, tasks, shopping, notes) is stored on a Docker volume and is preserved across updates.

### Auto-start after reboot

To ensure HomeOS starts automatically when the machine restarts:

```bash
sudo systemctl enable docker
```

This makes Docker start on boot. The containers auto-start with Docker because they're configured with `restart: unless-stopped`. No need to run `docker compose up` again after a reboot.

To verify Docker is running after a restart:

```bash
sudo systemctl status docker
```

### Remote Access with Tailscale

Access HomeOS from your phone outside your home WiFi using Tailscale (free VPN).

**On the Linux laptop (HomeOS server):**

```bash
curl -fsSL https://tailscale.com/install.sh | sh
sudo tailscale up
```

Note the Tailscale IP shown (e.g. `100.x.x.x`).

**On your phone:**

1. Install Tailscale from App Store (iPhone) or Play Store (Android)
2. Sign in with the same account used on the Linux laptop
3. Open `http://100.x.x.x` in your phone browser (use the Tailscale IP from above)

Tailscale runs in the background — once set up, your phone can reach HomeOS from anywhere without opening ports or exposing your home network.

### Useful commands

```bash
docker compose up --build -d   # start in background
docker compose down             # stop
docker compose logs -f          # view live logs
docker compose ps               # check container status
```

### Database Backups

Run the backup script manually:

```bash
cd HomeOS
./scripts/backup.sh
```

Backups are saved to `~/homeos-backups/` with timestamps (e.g. `homeos-2026-08-09.db`). Backups older than 7 days are automatically deleted.

To schedule daily backups at 3am on the Linux machine:

```bash
crontab -e
# Add this line (adjust the path to your HomeOS directory):
0 3 * * * cd /path/to/HomeOS && ./scripts/backup.sh >> ~/homeos-backups/backup.log 2>&1
```

### Pre-Push Checks

Run all checks (backend tests, frontend type check, frontend build) manually before pushing:

```bash
cd HomeOS
.git/hooks/pre-push
```

These checks also run automatically on every `git push`. If any check fails, the push is blocked.

### Releasing a New Version

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
