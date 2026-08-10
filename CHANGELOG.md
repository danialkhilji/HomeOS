# Changelog

## v1.1

### New Features
- Prayer times from Aladhan API tuned to match Masjid-e-Salaam Preston timetable
- Islamic (Hijri) calendar date displayed in the header
- Long-press edit for tasks, shopping items, notes, and members
- Task and shopping item toggle directly from dashboard cards
- Pull-to-refresh on dashboard for weather, prayer times, and all cards
- Database backup script with 7-day retention

### Improvements
- Press animations on all interactive elements (buttons, list rows, navigation icons)
- GitHub Actions CI pipeline running backend tests and frontend build on every push
- Pre-push git hook running pytest, tsc, and build before allowing push
- Version number displayed in Settings page
- Auto-start after reboot instructions for production deployment
- Docker timezone set to Europe/London for correct prayer time highlighting

### Tests
- 64 backend tests (up from 49)
- Added tests for member update, weather, prayer times, validation, and cross-module flows

---

## v1.0

### Features
- Household members management (add, delete) with colour coding
- Task management with member assignment and completion toggle
- Weekly task rotation via APScheduler (every Monday at midnight)
- Shared shopping list with purchased toggle and sort ordering
- Family notes with member authorship
- Live weather from Open-Meteo API with 30-minute cache
- Dashboard with weather, tasks, shopping, and notes cards
- 5-minute auto-refresh on dashboard
- Dark/light theme with toggle in Settings
- Touch-friendly UI with 48px tap targets and bottom navigation
- SVG navigation icons with page transitions

### Infrastructure
- FastAPI backend with SQLAlchemy and SQLite
- React frontend with TypeScript, Tailwind CSS, and TanStack Query
- Docker deployment with nginx proxy, health checks, gzip compression, and memory limits
- Alembic database migrations
- Production-ready docker-compose with data persistence