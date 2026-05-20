# Mini Lead CRM — Superleap Assessment

Level 1 + Level 2: lead list, CRUD, kanban board, URL-persisted filters, mock API.

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

## Routes

| Route | Purpose |
|-------|---------|
| `/leads` | List (pagination, filters, CSV export) |
| `/board` | Kanban — drag cards to change status |
| `/leads/new` | Create lead |
| `/leads/:id` | View lead + status actions |
| `/leads/:id/edit` | Edit lead (refresh-safe) |

Filters persist in the URL, e.g. `?q=priya&status=NEW,CONTACTED&source=website&sort=updated_at&dir=desc` — shared between list and board.
