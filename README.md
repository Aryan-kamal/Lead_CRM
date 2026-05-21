# Mini Lead CRM — Superleap Assessment

## Introduction

This is a small lead-management CRM built for the Superleap frontend intern assessment. You can browse leads, search and filter them, create and edit records, change status using the allowed pipeline rules, and view everything on a list or a kanban board.

**Work completed**

- **Level 1** - Full CRUD, status transitions, validation, loading/empty/error states, deep-linkable routes.
- **Level 2** - Kanban board with drag-and-drop, invalid-drop handling, optimistic status updates on the board, and filters/search kept in the URL when switching views.
- **Level 3** - Pagination, URL State; Not fully done (due to time constraint).

**Extra improvements on top of the base spec**

- Clean UI shell (sidebar, header, filter bar) inspired by the design reference.
- Refresh button to reload leads from the API.
- **Save** exports the current filtered list as a CSV file.
- Stronger filtering (status, source with “others”) and sorting by **updated**, **created**, or **name** (asc / desc via the arrow button).
- Pagination (15 leads per page) and phone on the list and board.
- URL state so search, filters, and sort persist across list ↔ board.
- Mock seed data increased to 50 leads.

---

## Tech stack (and why)

**React + Vite + TypeScript**  
I could have used Next but I went with React beacuse it works best for SPAs. Vite keeps local development fast, and TypeScript helps catch mistakes on the lead model and API responses early. Also Typescript is widely used for prod.

**State management - React Context**  
All leads, filters, sort, and API actions live in one `LeadsProvider`. Pages and components call `useLeads()` instead of passing props through many layers. Form fields stay local inside `LeadForm` because they are short-lived and only matter on create/edit screens.

**Styling - Tailwind CSS**  
Utility classes were enough to match the layout from the design without pulling in a heavy component library. That kept the bundle small and the markup easy to change.

**Mock API - Express (`mock-server/`)**  
The provided mock server runs locally on port 4000. On startup it reads `seed.json` into an **in-memory array** — all creates, edits, deletes, and status changes update that array in RAM only. Nothing is written back to disk, so **restarting the server resets data** to the seed file. That is enough for this assessment; a real app would use a database. The frontend calls the API with plain `fetch` and a thin `api/leads.ts` layer. I skipped React Query and MSW because the app is small and one context already handles server state.

**Drag-and-drop - `@dnd-kit/core`**  
Level 2 needs a kanban with drag between columns. I used **@dnd-kit** instead of older options like `react-beautiful-dnd` (unmaintained, awkward with React 18+) or `react-dnd` (more setup for a simple board). dnd-kit is actively maintained, works well with modern React, and let me do what I needed with little code: draggable cards, droppable columns, a drag overlay, and an activation distance so clicking a card link does not start a drag. Invalid drops are handled in our own logic before calling the API.

**Other libraries**  
- **React Router** — routes like `/leads/:id/edit` work on refresh.  
- **lucide-react** — icons only where needed.

---

## Setup (run locally)

**Terminal 1 - mock API**

```bash
cd mock-server && npm install && npm start
```

Runs at `http://localhost:4000`. Data is **in-memory** — restart this process to reset leads from `seed.json`.

**Terminal 2 - frontend**

```bash
cd frontend && npm install && npm run dev
```

Open **http://localhost:5173** in the browser.

Optional: if the API is not on port 4000, create `frontend/.env` with:

```
VITE_API_URL=http://localhost:4000
```

---

## Design decisions

### How components, state, and async logic are organized

- **`pages/`** - one file per route; mostly wiring and layout.
- **`components/layout/`** - sidebar, header, filter bar, list/board toggle.
- **`components/leads/`** - table, forms, status menu, delete.
- **`components/board/`** - kanban columns and cards.
- **`components/ui/`** - small reusable pieces (badge, pagination, confirm dialog).
- **`api/`** - HTTP calls and error parsing.
- **`context/LeadsContext.tsx`** - server data (leads list), shared filters, sort, and mutations (create, update, delete, status change).
- **`hooks/useLead.ts`** - loads a single lead on detail/edit so refresh on `/leads/:id/edit` still works.
- **Form state** - stays inside `LeadForm` (values, validation, submit loading).
- **Pagination page number** — local state in `LeadsTable` (resets when filters change).

Async flows show loading or disabled UI where it matters: initial list load, refresh, form submit, delete (waits for server before removing the row), and status changes. Errors are shown as readable messages, not raw JSON.

**Where data lives:** The mock server holds the source of truth in memory while it runs. The React app keeps a copy in `LeadsContext` for the UI. After a successful API call, both stay in sync. Default list order on first load is **updated_at, newest first** (client-side sort); the API returns leads in seed order before sorting.

### How status rules are enforced in the UI

The rules live in `utils/status.ts` and match the mock server:

```
NEW → CONTACTED → QUALIFIED → CONVERTED
  ↘         ↘           ↘
   LOST     LOST         LOST
```

- **List view** — `StatusMenu` only shows valid next statuses for that lead. Terminal leads (`CONVERTED`, `LOST`) show “Final status” instead of a menu.
- **Board view** — `canTransition()` checks before any API call. Invalid drops snap back with a message. Cards in terminal columns are not draggable.
- The server still validates on `PATCH /leads/:id/status`; the UI is meant to prevent bad actions first.

### Offline support and concurrent edits (what I would do differently)

**Offline:** Store leads in IndexedDB, queue create/update/delete when offline, and replay when the connection returns. Show a small “pending sync” indicator so the user knows some changes are not on the server yet.

**Concurrent edits:** Send `updated_at` (or an ETag) on `PUT`. If the server returns 409 because someone else changed the lead, show “This lead was updated elsewhere” and offer refresh or overwrite — instead of silently overwriting.

### Another week (not done - time)

- Connect a **real backend and database** instead of in-memory mock data.
- **Level 3** — bulk select, bulk delete, bulk status change with clear rules when the selection is mixed.
- **Performance** — virtualization or pagination on the server for thousands of leads; keep search/filter responsive.
- **Deploy** frontend + API with proper environment variables.
- Small UX polish — toast notifications, better keyboard focus on menus and other UI enhancements for better UX.

---

## AI usage note

I used AI (Cursor) mainly to speed up scaffolding and repetitive UI work: folder structure, Tailwind layout, and checking the status transition table against the PDF. I accepted suggestions that stayed simple - for example the initial Vite setup, some Tailwind class names, and the idea of a shared `errors.ts` for clearer API messages.
I wrote or adjusted myself: `LeadsContext` mutations, `StatusMenu` and board drag logic, form validation, pagination, CSV export, URL filter sync, and delete flow (wait for server, no optimistic delete). I rejected heavier patterns AI sometimes suggests like extra hooks for every field, shadcn-style component trees, or React Query for this size of app so the code stays easy to read and explain in an interview.

---

## Repo layout

```
Superleap Assessment/
├── mock-server/          # Express API, seed.json, generate.js
│   ├── server.js
│   └── seed.json         # 50 sample leads
├── frontend/             # React app
│   └── src/
│       ├── api/          # fetch wrappers
│       ├── context/      # LeadsProvider
│       ├── hooks/        # useLead
│       ├── pages/        # route screens
│       ├── components/   # layout, leads, board, ui
│       ├── utils/        # status, validation, csv, urlFilters, errors
│       └── constants/    # pagination, sources
└── README.md
```

---

## Routes

| Route | Purpose |
|-------|---------|
| `/` | Redirects to `/leads` |
| `/leads` | List view — search, filters, sort, pagination, CSV save |
| `/board` | Kanban board — drag cards to change status |
| `/leads/new` | Create a new lead |
| `/leads/:id` | View lead details and change status |
| `/leads/:id/edit` | Edit lead (works on page refresh) |

**URL query params** (shared between list and board):

| Param | Example | Purpose |
|-------|---------|---------|
| `q` | `?q=priya` | Search name, email, or phone |
| `status` | `?status=NEW,CONTACTED` | Filter by status |
| `source` | `?source=website,others` | Filter by source |
| `sort` | `?sort=updated_at` | Sort field: `updated_at`, `created_at`, or `name` |
| `dir` | `?dir=desc` | Sort direction (`asc` / `desc`) |

Examples:

- `/board?q=aman&status=NEW&sort=updated_at&dir=desc`
- `/leads?sort=name&dir=asc` — list sorted A–Z by name

---

## Screen recording
