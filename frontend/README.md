# Mini Lead CRM — Frontend

## Tech stack

| Tool | Why |
|------|-----|
| **React + Vite + TypeScript** | Fast local dev, types for the lead model |
| **Tailwind CSS v4** | Utility styling aligned with the design reference |
| **React Router** | Deep-linkable routes (`/leads/:id/edit` works on refresh) |
| **Context API** | One `LeadsProvider` for list data, filters, and mutations — avoids prop drilling |
| **lucide-react** | Small icon set for sidebar and actions |
| **fetch** | Direct calls to the mock server — no extra data library for Level 1 |

## Setup

```bash
npm install
npm run dev
```

Optional: set `VITE_API_URL` in `.env` if the API is not on `http://localhost:4000`.

## Project structure

```
src/
  api/leads.ts          # HTTP helpers + error parsing
  context/LeadsContext.tsx
  hooks/useLead.ts      # Single lead for detail/edit (refresh-safe)
  utils/status.ts       # Allowed transitions (matches server)
  utils/validation.ts
  components/layout/    # Sidebar, header, filter bar (design shell)
  components/leads/     # Table, form, status menu, delete
  pages/                # List, detail, create, edit
```

## Design decisions

### State organization

- **Server state** lives in `LeadsContext`: the leads array, loading/error from `GET /leads`, and mutations (create, update, delete, patch status).
- **UI state** in the same context: `searchQuery` and `statusFilter` (multi-select). `filteredLeads` is derived with `useMemo`.
- **Form state** stays local inside `LeadForm` (field values, touched, submit loading). On success, context is updated via the mutation callbacks.

### Status rules in the UI

`utils/status.ts` mirrors the mock server state machine. `StatusMenu` only renders transitions from `getNextStatuses(lead.status)`. Terminal leads (`CONVERTED`, `LOST`) show “Final status” instead of a menu — invalid moves are never offered.

### Delete behavior

Wait-for-server: the confirm dialog shows “Deleting…” while `DELETE` runs. The row is removed from context only after a successful response. On failure, the lead stays in the list and `actionError` is shown.

### Async handling

List fetch, form submit, status change, and delete each have explicit loading or disabled UI. API errors return a string from `{ error: "..." }`, not raw JSON.

### Offline / concurrent edits (what I’d do next)

- **Offline:** cache leads in `indexedDB`, queue mutations, replay when online; show a “pending sync” indicator.
- **Concurrent edits:** `ETag` or `updated_at` on `PUT` — server returns `409` if stale; UI offers refresh or merge.

### Level 2 — Kanban (`/board`)

- Five columns; CONVERTED and LOST are locked (cards not draggable).
- **@dnd-kit/core** for drag-and-drop.
- Invalid drops: card snaps back, amber banner, no API call.
- Valid drops: optimistic move, revert on API failure.
- Search, status, source, and sort persist in the URL when switching List ↔ Board.

### Another week

- Level 3 bulk actions and virtualization
- Toast component instead of inline banners

## AI usage note

_(Fill this in before submission — example below.)_

I used AI to scaffold the Vite + folder layout and to double-check the status transition table against the spec. I wrote the Context mutations, `StatusMenu`, and validation logic myself and simplified AI suggestions where they added extra abstractions. I rejected auto-generated shadcn-style component trees in favor of plain Tailwind classes so the code stays easy to walk through in an interview.

## Screen recording

Add your Loom (or similar) link here before submitting.
