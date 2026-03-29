# Product Owner — Run Memory

This file tracks decisions made across runs to prevent duplicate work and reverting previous decisions.

## Format

Each entry: `[DATE] DECISION — reason`

## Tasks Created
<!-- Append new entries here. Check this list before creating any task. -->

## Tasks Skipped
<!-- Tasks considered but deliberately NOT created, with reason. -->

## Requirements Created
<!-- Requirements created, to avoid duplicates. -->

## Gaps Identified But Deferred
<!-- Gaps spotted but deferred to future cycles, with reason. -->

## 2026-03-29 (product-review phase)

### Decisions

- **Health check**: PASS — pnpm install ok, pnpm build succeeds (TypeScript clean, warnings only: Better Auth secret entropy, OAuth missing clientId/clientSecret)
- **Node version**: Must use `export PATH="$HOME/.nvm/versions/node/v22.22.2/bin:$PATH"` before pnpm commands
- **Pipeline**: EMPTY — 0 tasks in system, 0 requirements in system. All prior "done" tasks (72+) appear to have been cleaned from the system.
- **13 stub pages confirmed** (all 11-13 lines, zero feature components):
  - Amenities (2): /amenities/page.tsx, /amenities/[id]/book/page.tsx — VISION §8
  - Announcements (3): /announcements/page.tsx, /announcements/new/page.tsx, /announcements/[id]/page.tsx — VISION §5 — NOTE: was "well-implemented" in prior runs but is now a STUB
  - Community (2): /community/page.tsx, /community/units/page.tsx — VISION §2
  - Maintenance (3): /maintenance/page.tsx, /maintenance/new/page.tsx, /maintenance/[id]/page.tsx — VISION §6
  - Settings (3): /settings/page.tsx, /settings/community/page.tsx, /settings/roles/page.tsx — VISION §11
- **No component directories exist** for: amenities, community, maintenance, settings, announcements
- **Server actions confirmed**: dashboard.ts, documents.ts, finances.ts, onboarding.ts, visitors.ts
- **Well-implemented confirmed**: visitors/page.tsx (180 lines, full CRUD table), finances.tsx, documents (2 components), dashboard (3 role-based components), onboarding server action, db/schema
- **Announcements regression**: Previously reported as well-implemented but now confirmed as 3 stub pages — the announcements implementation was either never merged or reverted.
- **No new tasks created**: Phase directive is read-only product review; no file edits or task creation this run
- **Top concern**: 13 stub pages remain, pipeline is empty, and task system was reset. No work is currently queued. The biggest gaps are amenities (high, VISION §8), announcements (medium, VISION §5), and maintenance (high, VISION §6).
