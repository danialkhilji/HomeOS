# HomeOS Development Roadmap

## Overview

This roadmap defines the implementation plan for building the first version of HomeOS.

The goal is to build a reliable household dashboard that runs on a Linux Mini PC connected to a touchscreen display.

The first version focuses only on the core problems:

- Managing household tasks.
- Sharing grocery lists.
- Sharing family notes.
- Providing a central dashboard.

The system should be built with a clean and modular architecture so that new features can be added later without major changes.

---

# Development Principles

HomeOS should be developed with the following principles:

## Build Small, Build Well

Focus on completing a working feature before moving to the next one.

## Modular Design

Each feature should be independent and easy to extend.

## Production Quality

Code should be:

- Clean.
- Maintainable.
- Tested.
- Documented.

## Touchscreen First

The primary interface is a wall-mounted touchscreen.

All UI decisions should consider:

- Large buttons.
- Clear information.
- Simple interactions.
- Good readability.

---

# Phase 1 — Project Foundation (COMPLETED)

## Goal

Create the technical foundation for HomeOS.

## Completed Tasks

### Task 1 — Repository Structure & Configuration

- Created monorepo folder structure (backend/, frontend/, docs/).
- Created backend pyproject.toml with all Python dependencies.
- Created frontend package.json with all JS dependencies.
- Created Pydantic Settings config class (core/config.py).
- Created .env.example, .gitignore, docker-compose.yml skeleton.
- Created __init__.py files for all Python packages.

### Task 2 — Backend Foundation

- Created FastAPI application with lifespan events (main.py).
- Created async SQLAlchemy database engine and session factory (core/database.py).
- Created centralised exception handling (core/exceptions.py).
- Created structured logging (core/logging.py).
- Created versioned API router (api/v1/router.py).
- Created health check endpoint (GET /api/v1/health).
- Configured Alembic for database migrations.
- Created health endpoint tests.

### Task 3 — Frontend Foundation

- Created Vite + React + TypeScript application.
- Configured Tailwind CSS with HomeOS colour theme.
- Created React Router with routes for all sections.
- Created Axios API client pointing at the backend.
- Created TanStack Query provider.
- Created Zustand theme store.
- Created AppLayout with bottom navigation.
- Created placeholder pages for Dashboard, Tasks, Shopping, Notes, Settings.

### Docker Setup

- Docker Compose skeleton created (Dockerfiles to be added in Phase 8).

## Deliverable

A running HomeOS application with:

- Frontend working.
- Backend working.
- Database connected.
- Docker environment ready.

---

# Phase 2 — HomeOS Interface (COMPLETED)

## Goal

Create the main touchscreen experience.

## Completed Tasks

### Task 1 — Touch-Friendly Component Library

- Created Button component (primary/secondary/danger variants, min 48px, press feedback).
- Created Card component (themed container with optional title and tap handler).
- Created PageHeader component (title with optional action button).
- Created EmptyState component (centered message with optional action).
- Created IconButton component (48px circular tap target).
- Created Modal component (bottom sheet with slide-up animation and backdrop).
- Created barrel export (components/index.ts).

### Task 2 — Dark/Light Theme System

- Added Tailwind v4 @custom-variant for dark mode.
- Updated theme store to sync dark class on document root.
- Refactored all components and layout to use dark: classes instead of manual isDark checks.

### Task 3 — Navigation & Layout Polish

- Created SVG icon components replacing emojis (Home, CheckCircle, ShoppingCart, Notepad, Settings).
- Added top status bar with HomeOS branding, live date and time.
- Added Framer Motion page transitions on route change.
- Updated bottom navigation with SVG icons.

### Task 4 — Dashboard Page

- Created WeatherCard (placeholder with static temperature).
- Created TasksCard (empty state for today's tasks).
- Created ShoppingCard (empty state for shopping list).
- Created NotesCard (empty state for family notes).
- Rewrote DashboardPage to stack all four widget cards.

### Task 5 — Section Page Shells

- Rewrote TasksPage with PageHeader, Add Task button, and EmptyState.
- Rewrote ShoppingPage with PageHeader, Add Item button, and EmptyState.
- Rewrote NotesPage with PageHeader, Add Note button, and EmptyState.
- Rewrote SettingsPage with dark mode toggle card and Household Members card.

## Deliverable

A beautiful touchscreen interface ready for real functionality.

---

# Phase 3 — Household Members (COMPLETED)

## Goal

Create a lightweight household members list for assigning tasks and notes.

No user accounts, no login, no authentication. Members are simply names used as labels throughout the app.

## Completed Tasks

### Task 1 — Backend: Member Model & Migration

- Created Member SQLAlchemy model (id, name, colour, created_at).
- Updated migrations/env.py to import models for Alembic discovery.
- Generated and applied Alembic migration to create the members table.

### Task 2 — Backend: Member API

- Created Pydantic schemas for request/response validation (MemberCreate, MemberResponse).
- Created service layer with business logic (get_all_members, create_member, delete_member).
- Created REST endpoints (GET, POST, DELETE under /api/v1/members).
- Added 6 API tests (list, create, duplicate rejection, delete, not-found).

### Task 3 — Frontend: Member API Client & State

- Created axios API functions for members (fetchMembers, createMember, deleteMember).
- Created TanStack Query hooks (useMembers, useCreateMember, useDeleteMember).

### Task 4 — Frontend: Settings Page UI

- Created AddMemberModal with name input and 8 preset colour swatches.
- Created MemberList displaying colour dot, name, and delete button per member.
- Rewrote SettingsPage to wire hooks, modal state, and member list together.

## Deliverable

Household member names can be managed in Settings and used for task assignment and notes.

---

# Phase 4 — Task Management System (COMPLETED)

## Goal

Build the core household responsibility system.

## Completed Tasks

### Task 1 — Backend: Task Model & Migration

- Created Task SQLAlchemy model (id, title, assigned_to, is_completed, completed_at, created_at).
- Added foreign key relationship to Member with joined loading.
- Generated and applied Alembic migration.

### Task 2 — Backend: Task API

- Created Pydantic schemas (TaskCreate, TaskUpdate, TaskResponse with MemberSummary).
- Created service layer (get_all_tasks with member filter, create_task, update_task, toggle_task, delete_task).
- Created REST endpoints (GET, POST, PUT, DELETE, PATCH /toggle under /api/v1/tasks).
- Added 12 API tests covering all endpoints and edge cases.

### Task 3 — Frontend: Task API Client & State

- Added Task and MemberSummary TypeScript interfaces.
- Created axios API functions (fetchTasks, createTask, updateTask, toggleTask, deleteTask).
- Created TanStack Query hooks (useTasks, useCreateTask, useUpdateTask, useToggleTask, useDeleteTask).

### Task 4 — Frontend: Tasks Page UI

- Created AddTaskModal with title input and member picker (tappable buttons with colour dots).
- Created TaskList with completion toggle (circle/checkmark), member info, and delete button.
- Rewrote TasksPage to wire hooks, modal state, and task list.

### Task 5 — Frontend: Dashboard Tasks Card

- Rewrote TasksCard to display real tasks with member names, colour dots, and completion indicators.

### Task 6 — Backend: Task Rotation System

- Created rotation service that shifts task assignments to the next member and resets completion.
- Configured APScheduler to run rotation every Monday at midnight.
- Added manual POST /api/v1/tasks/rotate endpoint.
- Added 7 rotation tests covering all scenarios.

## Deliverable

A complete household task management system.

The family no longer needs to manually assign tasks.

---

# Phase 5 — Shared Shopping List (COMPLETED)

## Goal

Create a shared grocery management system.

## Completed Tasks

### Task 1 — Backend: ShoppingItem Model & Migration

- Created ShoppingItem SQLAlchemy model (id, name, is_purchased, created_at).
- Generated and applied Alembic migration.

### Task 2 — Backend: Shopping API

- Created Pydantic schemas (ShoppingItemCreate, ShoppingItemUpdate, ShoppingItemResponse).
- Created service layer (get_all_items with unpurchased-first sort, create_item, update_item, toggle_item, delete_item).
- Created REST endpoints (GET, POST, PUT, PATCH /toggle, DELETE under /api/v1/shopping).
- Added 10 API tests covering all endpoints and sort ordering.

### Task 3 — Frontend: Shopping API Client & State

- Added ShoppingItem TypeScript interface.
- Created axios API functions (fetchShoppingItems, createShoppingItem, updateShoppingItem, toggleShoppingItem, deleteShoppingItem).
- Created TanStack Query hooks (useShoppingItems, useCreateShoppingItem, useUpdateShoppingItem, useToggleShoppingItem, useDeleteShoppingItem).

### Task 4 — Frontend: Shopping Page UI

- Created AddItemModal with name input.
- Created EditItemModal with pre-filled name for fixing typos.
- Created ShoppingList with checkbox toggle, edit button, and delete button.
- Rewrote ShoppingPage to wire all hooks and both modals.

### Task 5 — Frontend: Dashboard Shopping Card

- Rewrote ShoppingCard to display unpurchased items with count in the title.

## Deliverable

Everyone in the house can maintain a single shared shopping list.

---

# Phase 6 — Family Notes (COMPLETED)

## Goal

Create a simple household communication board.

## Completed Tasks

### Task 1 — Backend: Note Model & Migration

- Created Note SQLAlchemy model (id, content, author_id as foreign key to members, created_at).
- Added author relationship with joined loading.
- Generated and applied Alembic migration.

### Task 2 — Backend: Notes API

- Created Pydantic schemas (NoteCreate, NoteUpdate, NoteResponse with MemberSummary).
- Created service layer (get_all_notes newest first, create_note with author validation, update_note, delete_note).
- Created REST endpoints (GET, POST, PUT, DELETE under /api/v1/notes).
- Added 9 API tests covering all endpoints and edge cases.

### Task 3 — Frontend: Notes API Client & State

- Added Note TypeScript interface.
- Created axios API functions (fetchNotes, createNote, updateNote, deleteNote).
- Created TanStack Query hooks (useNotes, useCreateNote, useUpdateNote, useDeleteNote).

### Task 4 — Frontend: Notes Page UI

- Created AddNoteModal with member picker for author and multi-line text area.
- Created NoteList displaying notes as cards with author colour dot, name, content, and delete button.
- Rewrote NotesPage to wire hooks, modal, and note list.

### Task 5 — Frontend: Dashboard Notes Card

- Rewrote NotesCard to display 3 most recent notes with author info and content preview.

## Deliverable

A shared digital notice board.

---

# Phase 7 — Main Dashboard Integration (COMPLETED)

## Goal

Combine all features into the main HomeOS experience. The dashboard already shows live data from tasks, shopping, and notes. This phase polishes the remaining pieces: real weather data and overall UI refinements.

## Completed Tasks

### Task 1 — Backend: Weather API Integration

- Created weather module with Open-Meteo integration (free, no API key).
- Created GET /api/v1/weather endpoint returning temperature, condition, and icon code.
- Added 30-minute in-memory cache with stale-data fallback on API failure.
- Added configurable latitude/longitude/cache duration in Settings.
- Mapped all Open-Meteo weather codes to human-readable conditions and icon identifiers.

### Task 2 — Frontend: Live Weather Card

- Added Weather TypeScript interface, axios function, and TanStack Query hook with 30-minute stale time.
- Rewrote WeatherCard to display real temperature and condition with weather emoji icons.
- Added loading and error states.

### Task 3 — Dashboard Polish & Refinements

- Created LoadingSpinner component.
- Added loading states to TasksCard, ShoppingCard, and NotesCard.
- Added 5-minute auto-refresh for all dashboard data.

## Deliverable

A complete HomeOS dashboard with live weather and polished UI.

---

# Phase 8 — Deployment (COMPLETED)

## Goal

Deploy HomeOS as a real kitchen appliance.

## Completed Tasks

### Task 1 — Dockerfiles

- Created backend Dockerfile (Python 3.12, install deps, run Alembic migrations, start uvicorn).
- Created frontend Dockerfile (multi-stage: Node build + nginx serve).
- Created nginx.conf for static file serving and API proxying.
- Updated docker-compose.yml with networking, volumes, and environment config.

### Task 2 — Production Configuration

- Added health checks for both containers (auto-restart on failure).
- Added gzip compression and static asset caching in nginx.
- Added memory limits (512MB backend, 128MB frontend).
- Set up SQLite database volume for data persistence.

### Task 3 — Mini PC Setup & Kiosk Mode (SKIPPED)

- Not needed — using iPad as display via Safari "Add to Home Screen" instead of a connected monitor with kiosk browser.

### Task 4 — Database Backups

- Created backup script (scripts/backup.sh) that copies SQLite database to ~/homeos-backups/ with timestamps.
- Keeps last 7 days of backups, deletes older ones automatically.
- Documented cron setup for daily scheduled backups.

## Deliverable

A fully working kitchen touchscreen system used by the family.

---

# Post-Launch Features

Features added after the initial v1 release.

## Prayer Times (COMPLETED)

### Task 1 — Backend: Prayer Times API

- Integrated Aladhan API with Method 15 (Moonsighting Committee) and Hanafi school for closest UK mosque times.
- Created backend prayer service with GET /api/v1/prayer-times endpoint.
- Added in-memory cache with daily refresh at 1am via APScheduler.
- Current prayer highlight recalculated on each request.

### Pull-to-Refresh

- Added pull-to-refresh component on dashboard to manually update weather, prayer times, and all cards.

### Task 2 — Frontend: Prayer Times Hook

- Added PrayerTime and PrayerTimes TypeScript interfaces.
- Created axios function (fetchPrayerTimes).
- Created TanStack Query hook (usePrayerTimes) with 1-hour stale time.

### Task 3 — Frontend: Prayer Times Bar

- Created PrayerTimesBar displaying all 5 prayers in a horizontal row on the dashboard.
- Current prayer highlighted in blue with tinted background.

### Task 4 — Islamic Calendar Date

- Added Hijri date to the prayer times API response from Aladhan.
- Displayed Islamic date in the app header alongside the Gregorian date.
- Tuned prayer time settings (Method 15, Hanafi, tune 0,0,0,5,0,5,0,9,0) to closely match Masjid-e-Salaam Preston timetable.

---

## Long-Press Edit & UI Polish (COMPLETED)

### Task 1 — Long-Press Hook

- Created reusable useLongPress hook that detects 500ms finger hold.

### Task 2 — Edit Tasks

- Created EditTaskModal with pre-filled title and member assignment.
- Wired long-press on TaskList rows to open edit modal.

### Task 3 — Edit Shopping Items

- Added long-press on ShoppingList rows to open existing EditItemModal.
- Removed pencil edit icon (replaced by long-press).

### Task 4 — Edit Notes

- Created EditNoteModal with pre-filled content.
- Added long-press on NoteList cards to open edit modal.

### Task 5 — Edit Members

- Created EditMemberModal with pre-filled name and colour picker.
- Added backend PUT /api/v1/members/{id} endpoint with duplicate name check.
- Added updateMember API function and useUpdateMember hook.
- Wired long-press on MemberList rows to open edit modal.

### Task 6 — Press Animations

- Added consistent press-down animation (scale 0.98) to notes and member list rows.
- Increased button press animation to scale 0.8 for more noticeable feedback.

### Task 7 — Dashboard Toggle

- Enabled task completion toggle directly from the dashboard TasksCard.
- Enabled shopping item purchased toggle directly from the dashboard ShoppingCard.

---

## Test Suite & CI/CD (COMPLETED)

### Task 1 — Backend: Fill Test Gaps

- Added 15 new tests bringing total from 49 to 64.
- Added member update tests (name, colour, duplicate rejection, not-found).
- Added weather and prayer times endpoint response shape tests.
- Added validation tests (empty title, empty name, empty content, invalid colour).
- Added rotation tests (after member deletion, complete then rotate resets).
- Added cross-module flow tests (update member reflects in tasks/notes, full create-assign-rotate flow).

### Task 2 — GitHub Actions CI Pipeline

- Created .github/workflows/ci.yml running on push to main/develop and PRs to main.
- Backend job: Python 3.12 setup, install deps, run pytest.
- Frontend job: Node 22 setup, install deps, tsc type check, npm build.

### Task 3 — Frontend Type Check & Build in Pre-Push Hook

- Updated pre-push hook to run three checks: pytest, tsc, and npm run build.
- All three must pass before push is allowed.

---

# Future Expansion

New modules and features to be added.

## AI Assistant

- Voice commands.
- Ask questions.
- Add shopping items using speech.
- Query household information.

Example:

"Who is washing dishes today?"

---

## Family Management

- Calendar.
- Birthdays.
- Reminders.
- Meal planner.
- Household expenses.

---

## Smart Home

- Lights.
- Thermostat.
- Cameras.
- Sensors.

---

## Rotation Duty Tracker

- Check dad's rotation duty schedule from an external source.
- Display upcoming duties for the next 7 days on the dashboard.
- Highlight today's duty if one is scheduled.

---

## CCTV Live Feed

- Display live CCTV camera feeds on the dashboard.
- Switch between multiple camera views.
- Fullscreen mode for individual cameras.

---

## Mobile Application

- View tasks remotely.
- Manage shopping list.
- Receive notifications.

---

## Auto-Update Deployment

- Create a script that checks GitHub for new changes on main branch.
- Auto-pull and rebuild Docker containers when updates are detected.
- Schedule with cron to check every few minutes.
- No manual SSH or pull needed — just merge to main and the Linux laptop updates itself.

---

## Integration & End-to-End Tests

- Add cross-module integration tests (e.g. full user flows across tasks, shopping, notes).
- Add frontend component tests for critical UI interactions.
- Add CI/CD pipeline to run tests on push.

---

## Proper Versioning (COMPLETED)

Using two-number format (v1.0, v1.1, v1.2).

### Task 1 — Tag Existing Releases

- Tagged v1.0 on the initial release commit (Phase 1-8 complete).
- Tagged v1.1 on current main (prayer times, long-press edit, CI/CD, test suite).
- Pushed tags to GitHub.

### Task 2 — Display Version in Settings Page

- Updated backend config VERSION to "1.1" and frontend package.json to "1.1.0".
- Added "HomeOS v1.1" text at the bottom of the Settings page.

### Task 3 — Create CHANGELOG

- Created CHANGELOG.md with full release history for v1.0 and v1.1.
- Added versioning instructions to README.

---

## Dashboard Calendar

- Add a calendar widget on the right side of the weather card.
- Show current month with today highlighted.
- Optionally display events or duties on specific dates.

---

## Quick-Add Shopping Items

- Add a row of common grocery items with emojis at the top of the Shopping page (e.g. 🥛 Milk, 🥚 Eggs, 🍞 Bread, 🍗 Chicken).
- Tap an emoji to instantly add that item to the shopping list.
- Faster than opening the Add Item modal for everyday items.

---

# Completion Criteria

The first version of HomeOS is complete when:

- The touchscreen dashboard runs reliably.
- Family members can view their daily tasks.
- Tasks rotate automatically.
- Shopping list is shared.
- Notes can be posted.
- The system runs automatically on the kitchen Mini PC.
- The family can use it without technical knowledge.

At this point, HomeOS becomes a foundation that can continuously evolve with new modules and capabilities.