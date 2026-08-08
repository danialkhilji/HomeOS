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

# Phase 5 — Shared Shopping List

## Goal

Create a shared grocery management system.

## Tasks

### Task 1 — Backend: ShoppingItem Model & Migration

- Create ShoppingItem SQLAlchemy model (id, name, is_purchased, created_at).
- Generate and apply Alembic migration.

### Task 2 — Backend: Shopping API

- Create Pydantic schemas for request/response validation.
- Create service layer (create, list, delete, toggle purchased).
- Create REST endpoints (GET, POST, DELETE, PATCH under /api/v1/shopping).
- Add API tests.

### Task 3 — Frontend: Shopping API Client & State

- Create axios API functions for shopping items.
- Create TanStack Query hooks (useShoppingItems, useCreateShoppingItem, useDeleteShoppingItem, useToggleShoppingItem).

### Task 4 — Frontend: Shopping Page UI

- Create AddItemModal with name input.
- Create ShoppingList displaying items with purchased toggle and delete button.
- Rewrite ShoppingPage to wire hooks, modal, and item list together.

### Task 5 — Frontend: Dashboard Shopping Card

- Update ShoppingCard on the dashboard to show real shopping list items with purchased status.

## Deliverable

Everyone in the house can maintain a single shared shopping list.

---

# Phase 6 — Family Notes

## Goal

Create a simple household communication board.

## Tasks

Implement:

- Create notes.
- Edit notes.
- Delete notes.
- Display recent notes.

Example:


Family Notes

Danial:
Please buy vegetables tomorrow.

Ali:
Coming home late today.


## Deliverable

A shared digital notice board.

---

# Phase 7 — Main Dashboard Integration

## Goal

Combine all features into the main HomeOS experience.

The dashboard should display:


HomeOS

Thursday 6 August

Weather
21°C Sunny

Today's Tasks

Danial
Wash dishes

Ali
Vacuum

Shopping List

Milk
Eggs

Family Notes

Dentist appointment tomorrow


## Add:

- Current date.
- Current time.
- Weather API.
- Real-time updates.

## Deliverable

A complete HomeOS dashboard.

---

# Phase 8 — Deployment

## Goal

Deploy HomeOS as a real kitchen appliance.

## Tasks

Setup Mini PC:

- Install Ubuntu.
- Install Docker.
- Deploy application.

Configure:

- Automatic startup.
- Browser kiosk mode.
- Fullscreen dashboard.
- Automatic recovery after restart.
- Database backups.

### Final architecture:


Touchscreen Display

   |

Mini PC

  |

Ubuntu Linux

   |

Docker

   |

HomeOS


## Deliverable

A fully working kitchen touchscreen system used by the family.

---

# Future Expansion

After the first version is stable, new modules can be added.

Possible future features:

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

## Prayer Times

- Scrape prayer times from local mosque website.
- Display daily prayer schedule on the dashboard.
- Highlight the next upcoming prayer.

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