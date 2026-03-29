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

## 2026-03-28

### Decisions

- **Created TASK-046** (high, ready, enqueued to triage): Build admin settings pages: community config, visitor policy, and role management. Reason: /settings, /settings/community, /settings/roles, /community, /community/units are all empty stubs. VISION specifies full settings for community profile, visitor policy, role management, unit directory, and board roster. High-impact admin feature gap. NOTE: TASK-029 (user settings) is marked done but /settings/page.tsx is an empty stub — this is covered by TASK-046.
- **Created TASK-047** (high, ready, enqueued to triage): Build amenities booking system with calendar, conflict detection, and waitlist. Reason: /amenities and /amenities/[id]/book are empty stubs. src/components/amenities/ does not exist. TASK-044 (amenities booking, done) has no corresponding component files — the work was not actually done. This is a core resident feature with high impact per VISION.
- **Deferred**: Maintenance pages (list, new, detail) — all are empty stubs despite TASK-042 marked done; lower priority than settings and amenities.
- **Deferred**: Document repository — has component files (document-upload-form.tsx, documents-page-client.tsx) but limited features; waiting for upload/storage infrastructure.
- **Deferred**: OAuth (Google/GitHub) — auth infrastructure exists but OAuth not wired up; non-critical for demo.
- **Deferred**: Community rules version history, full-text search, CSV/PDF export, recurring maintenance scheduling — too complex or low-impact for single tasks.
- **Not creating duplicate**: TASK-044 (amenities) and TASK-045 (community page) were already created in 2026-03-29 run. I verified existing tasks before creating new ones.
- **Verified well-implemented**: finances (full component + server actions), visitor management (pre-registration, QR, blacklist), announcements (form with rich text), onboarding wizard — all are real implementations, not stubs.

## 2026-03-29

### Decisions

- **Created TASK-044** (high, ready, enqueued to triage): Build amenities booking system with calendar, time slots, and conflict detection. Reason: /amenities page is a placeholder; VISION specifies full amenity booking with calendar view, time slots, conflict detection, waitlist, and deposit tracking. This is a core resident feature with high impact.
- **Created TASK-045** (medium, ready): Build community page with profile, rules editor, and board roster. Reason: /community page is a placeholder; VISION specifies it should show community info, rules document (rich text, versioned), and board member roster. Named VISION page that exists but has no implementation.
- **Deferred**: Unit directory CRUD (/community/units) — placeholder but lower priority than amenities and community page.
- **Deferred**: OAuth (Google/GitHub) login — auth infrastructure exists but OAuth not wired up; non-critical for demo.
- **Deferred**: Community rules version history — would need a versions table; too complex for single task.
- **Deferred**: Amenity waitlist — part of the larger amenities booking task; not splitting further.
- **Not creating**: Document repository, finances, announcements, maintenance, visitor management — all verified as well-implemented in codebase.

## 2026-03-29 (evening review)

### Decisions

- **Health check**: PASS — pnpm install ok, pnpm build succeeds (TypeScript clean, no errors)
- **Build warnings only**: Better Auth secret entropy warnings, OAuth providers missing clientId/clientSecret (expected in dev)
- **Pipeline**: 43 done, 2 cancelled, 2 ready (TASK-045 community page, TASK-046 admin settings) — HEALTHY, not saturated
- **Ready queue**: TASK-046 (admin settings, high) and TASK-045 (community page, medium) are both waiting to be picked up
- **No new tasks created**: Phase directive is read-only product review; no file edits or task creation this run
- **Confirmed still placeholder (not yet built)**:
  - /amenities page (TASK-044 was created for this but component files not yet present in src/components/amenities/)
  - /community page (TASK-045 ready)
  - /settings/community page (TASK-046 ready)
  - /settings/roles page (TASK-046 ready)
  - /settings/page.tsx (user settings — stub)
- **Confirmed well-implemented**: dashboard (role-based, full server actions), finances (full component + server actions), documents (full component + server actions), visitor management (full pre-registration, QR, blacklist), announcements (rich text), onboarding wizard, db schema (comprehensive)
- **Deferred**: None new this run — all gaps already covered by existing ready tasks or deferred from prior runs
