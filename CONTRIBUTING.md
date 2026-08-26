# Contributing to HomeOS

Thanks for your interest in contributing! Here's how to get started.

## Setup

Follow the [Development Guide](docs/DEVELOPMENT.md) to set up the project locally.

## Branch Workflow

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
3. **Create a branch** from `main` with a descriptive name:
   - Features: `add-meal-planner`, `add-ai-assistant`
   - Fixes: `fix-prayer-time-offset`, `fix-calendar-swipe`
   - Improvements: `improve-weather-card`, `refactor-task-modal`
4. **Work** on your branch, committing as you go
5. **Push** your branch to your fork
6. **Open a Pull Request** targeting the `develop` branch

## Code Conventions

### Backend (Python)
- Python 3.12+, FastAPI, SQLAlchemy (async), SQLite
- Use the `homeos` conda environment for all Python work
- Lint with `ruff check app/` — must pass with zero errors
- Follow the module pattern: `models.py` → `schemas.py` → `service.py` → `router.py`
- Business logic goes in the service layer, not the router

### Frontend (TypeScript/React)
- React 19, TypeScript, Vite, Tailwind CSS 4
- Use CSS theme variables (`bg-surface`, `text-text`, `text-primary`, etc.) — no hardcoded colours
- Shared components go in `src/components/`, feature-specific components in `src/features/<feature>/`
- Shared constants (`INPUT_STYLE`, `TAP_SPRING`, `PRESET_COLOURS`) go in `src/constants.ts`
- Use TanStack Query hooks for data fetching — no direct API calls in components

## Testing

- All backend tests must pass before submitting a PR: `pytest tests/ -v`
- TypeScript must compile cleanly: `npx tsc --noEmit`
- Frontend must build: `npm run build`
- The pre-push hook runs all three checks automatically
- Add tests for new backend endpoints

## Pull Request Guidelines

- Keep PRs focused — one feature or fix per PR
- Write a clear title and description explaining what changed and why
- Include test coverage for new backend functionality
- Never commit secrets, API keys, or personal data (`.env`, coordinates, family photos)
- Screenshots are helpful for UI changes

## Project Structure

See the [Development Guide](docs/DEVELOPMENT.md#project-structure) for a full overview of the codebase layout.

## Questions?

Open an issue if you're unsure about anything or want to discuss an approach before starting work.
