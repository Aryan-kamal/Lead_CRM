# Mini Lead CRM — Superleap Assessment

Level 1 implementation: lead list, CRUD, status transitions, mock API.

## Quick start

**Terminal 1 — mock API**

```bash
cd mock-server
npm install
npm start
```

Runs at `http://localhost:4000`.

**Terminal 2 — frontend**

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Repo layout

- `mock-server/` — Express mock API + seed data
- `frontend/` — React app (see `frontend/README.md` for details)

## Level 1 routes

| Route | Purpose |
|-------|---------|
| `/leads` | List, search, status filter |
| `/leads/new` | Create lead |
| `/leads/:id` | View lead + status actions |
| `/leads/:id/edit` | Edit lead (refresh-safe) |
