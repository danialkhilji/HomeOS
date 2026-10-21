# HomeOS

A self-hosted family operating system for a kitchen touchscreen. Manages household tasks, shopping lists, notes, prayer times, bin collections, and birthdays from a single shared display.

## Screenshots

<p align="center">
  <img src="docs/screenshots/dashboard.jpeg" width="380" alt="Dashboard with weather, calendar, prayer times and bin collection" />
  <img src="docs/screenshots/dashboard-scrolled.jpeg" width="380" alt="Dashboard scrolled to tasks, shopping list and notes" />
</p>

<p align="center">
  <img src="docs/screenshots/calendar.jpeg" width="380" alt="Calendar" />
  <img src="docs/screenshots/tasks.jpeg" width="380" alt="Tasks" />
</p>

<p align="center">
  <img src="docs/screenshots/shopping.jpeg" width="380" alt="Shopping" />
  <img src="docs/screenshots/settings.jpeg" width="380" alt="Settings with household members and stores" />
</p>

<p align="center">
  <img src="docs/screenshots/settings-1.jpeg" width="380" alt="Bin collection settings" />
  <img src="docs/screenshots/settings-2.jpeg" width="380" alt="Quick-add items settings" />
</p>

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS
- **Backend:** Python 3.12, FastAPI, SQLAlchemy, SQLite
- **Infrastructure:** Docker, Docker Compose
- **Target Device:** Linux Mini PC + touchscreen display

## Quick Start

```bash
git clone https://github.com/danialkhilji/HomeOS.git
cd HomeOS
cp .env.example .env
docker compose up --build
```

## Documentation

- [Deployment Guide](docs/DEPLOYMENT.md)
- [Development Guide](docs/DEVELOPMENT.md)
- [Contributing](CONTRIBUTING.md)
- [Changelog](CHANGELOG.md)

## License

MIT
