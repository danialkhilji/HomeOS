# Changelog

## v1.3

### New Features
- Dashboard calendar with expandable modal, month/year dropdowns, swipe navigation, and date selection
- Task reminders with date/time picker and overdue highlighting on dashboard
- Recurring tasks (daily/weekly/monthly) with automatic reset via APScheduler
- Calendar-task integration — select any date to see its tasks
- Birthday tracking via calendar — add birthdays for anyone, yearly repeat, upcoming birthdays card on dashboard
- Calendar as core system — unified /api/v1/calendar/by-date endpoint returning tasks and birthdays
- Animated weather card backgrounds (sunny, cloudy, rainy, snowy, stormy, windy) with CSS keyframes
- Enhanced weather data — feels like, rain chance, daily high/low from Open-Meteo
- Mobile app via PWA + Tailscale — responsive UI, installable on phone, remote access
- Custom app icon (Figma-designed HomeOS icon)
- Quick-add shopping items with emoji buttons and custom items in Settings

### Improvements
- Removed dark mode (unused by family)
- Auto-scroll focused input into view when keyboard opens in modals
- Weather card vertically and horizontally centred
- Responsive font sizes (14px phone, 18px tablet)
- Calendar grid stays fixed while tasks/birthdays scroll independently
- Add Birthday and Today buttons always visible at bottom of calendar

### Infrastructure
- Moved birthdays module into calendar module
- Moved calendar components to features/calendar/ folder
- Moved project docs to private KnowledgeBase repo
- 119 backend tests total

---

## v1.2

### New Features
- Store-based shopping lists — create stores (Aldi, Tesco, etc.) in Settings and assign shopping items to specific stores
- Shopping page groups items by store with section headers and colour dots
- Dashboard shopping card shows per-store unpurchased counts when stores exist
- Drag-and-drop reorder for tasks and shopping items using grip handle
- MIT license added

### Improvements
- Purchased items now visible on dashboard shopping card with checkmark and strikethrough
- Fixed Islamic calendar date disappearing on page refresh
- Fixed bottom navigation icon spacing
- Store colour dot and name shown on shopping item rows

### Tests
- 82 backend tests (up from 64)
- Added 14 store tests (CRUD, shopping-store integration, cascade, toggle keeps store)
- Added 4 reorder tests (tasks, shopping, invalid IDs, empty list)

---

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