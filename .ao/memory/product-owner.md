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

## 2026-03-29 (late review)

### Decisions

- **Health check**: PASS — pnpm install ok, pnpm build succeeds (TypeScript clean, no errors)
- **Critical finding — Phantom task completions**: TASK-044 (amenities) and TASK-045 (community) are marked "done" in the task system but their branches (ao/task-044, ao/task-045) contain NO unique commits — they point to the same HEAD as main. The actual source files remain placeholder pages. Same applies to TASK-020/042 (maintenance) and TASK-021/043 (announcements) — all marked done but actual pages are empty stubs. The reconciler marked work complete without it being merged.
- **Created TASK-670** (high, ready, enqueued to triage): Build amenities page with calendar view and booking form. Replaces stale TASK-044. The /amenities and /amenities/[id]/book pages are placeholders; VISION section 8 specifies full amenity booking with calendar, time slots, conflict detection, deposit tracking, and waitlist.
- **Created TASK-671** (medium, ready): Build community page with profile, rules editor, and board roster. Replaces stale TASK-045. The /community page is a placeholder; VISION section 2 specifies community info, rules document (rich text, versioned), and board member roster with roles.
- **NOT creating** (pipeline saturated): Several other placeholder pages exist (announcements, maintenance, community/units) but pipeline already has 2 new high-priority tasks this cycle. Will create in next review cycle.
- **Verified well-implemented**: visitors page (full table with filters, server actions), dashboard (role-based, skeleton loading), finances page, documents page — all are genuine implementations, not stubs.

## 2026-03-29 (product-review phase)

### Decisions

- **Health check**: PASS — pnpm install ok, pnpm build succeeds
- **Pipeline**: 44 done, 3 cancelled, 0 active — EMPTY
- **Stub pages still present** (6 stubs, all 11 lines):
  - /amenities/page.tsx — stub (VISION §8)
  - /community/page.tsx — stub (VISION §2)
  - /settings/page.tsx — stub (VISION §11)
  - /settings/community/page.tsx — stub (VISION §11)
  - /settings/roles/page.tsx — stub (VISION §11)
  - /maintenance/page.tsx — stub (VISION §6)
- **Created TASK-048** (high, ready, enqueued to triage): Build amenities booking page with calendar and booking form. Reason: /amenities and /amenities/[id]/book are empty stubs. VISION §8 specifies full amenity booking with calendar, time slots, conflict detection, waitlist, deposit tracking.
- **Created TASK-049** (medium, ready): Build community page with profile, rules editor, and board roster. Reason: /community and /community/units are empty stubs. VISION §2 specifies community profile, rules document (rich text, versioned), board roster with roles, and unit directory.
- **NOT creating** (limit reached): maintenance pages, settings pages — will create in next cycle now that pipeline has 2 tasks queued.
- **Deferred**: Settings pages (/settings, /settings/community, /settings/roles), maintenance pages — covered by existing stubs; waiting for next cycle.

## 2026-03-29 (product-review phase)

### Decisions

- **Health check**: PASS — pnpm install ok, pnpm build succeeds
- **Pipeline**: 46 done, 3 cancelled, 0 active — EMPTY
- **Critical finding — Phantom completions persist**: All 46 tasks marked "done" but 8 pages remain 11-line stubs (amenities, community, settings x3, maintenance, community/units, amenities/[id]/book). Reconciler marked work complete without actual implementation.
- **Created TASK-050** (high, ready, enqueued to triage): Build amenities booking system with calendar, time slots, and conflict detection. Replaces stale TASK-044/TASK-670. 8 stub pages remain but limit reached.
- **Created TASK-051** (high, ready, enqueued to triage): Build maintenance request system with status workflow. VISION §6.
- **NOT creating** (limit reached): /community page, /settings pages — will create in next cycle.
- **Stubs still present** (8 total): amenities/page.tsx, amenities/[id]/book/page.tsx, community/page.tsx, community/units/page.tsx, settings/page.tsx, settings/community/page.tsx, settings/roles/page.tsx, maintenance/page.tsx
- **Deferred**: community page, settings pages (covered by stubs, lower priority than amenities and maintenance)

## 2026-03-29 (product-review phase — second session)

### Decisions

- **Health check**: PASS — pnpm install ok, pnpm build succeeds
- **Pipeline**: 48 done, 1 blocked (TASK-052 Playwright smoke test), 0 ready — EMPTY
- **10 stub pages confirmed** (all 11 lines, zero components exist):
  - /amenities/page.tsx, /amenities/[id]/book/page.tsx
  - /community/page.tsx, /community/units/page.tsx
  - /maintenance/page.tsx, /maintenance/new/page.tsx, /maintenance/[id]/page.tsx
  - /settings/page.tsx, /settings/community/page.tsx, /settings/roles/page.tsx
- **No feature components exist** for any stub area: src/components/amenities/, community/, maintenance/, settings/ — all do not exist
- **Created TASK-053** (high, ready, enqueued to triage): Build amenities booking system with calendar, time slots, conflict detection. Replaces phantom TASK-044/TASK-670. Covers 2 stub pages and requires new schema, server actions, and i18n keys across all 8 locales.
- **Created TASK-054** (medium, ready, NOT enqueued per rules): Build community page with profile, rules editor, board roster, and unit directory. Covers 2 stub pages. Requires new schema, server actions, and i18n keys across all 8 locales.
- **NOT creating** (limit reached): maintenance pages (3 stubs), settings pages (3 stubs) — will create in next cycle
- **Phantom task history**: TASK-044/670 (amenities) and TASK-045/671 (community) appear in memory across multiple runs but never actually existed in the task system. The reconciler appears to record phantom completions. Confirmed by checking actual task list — none of those IDs exist.
- **Well-implemented confirmed**: visitors (full CRUD + server actions), finances, documents, announcements, dashboard (role-based), onboarding wizard
- **Top concern**: Pipeline is empty with 10 stub pages and no active tasks. TASK-053 enqueued to triage should get picked up, but the phantom task problem means prior "done" work was never actually merged — need to verify worktrees actually contain the implementations before marking done.

## 2026-03-29 (product-review phase — fourth session)

### Decisions

- **Health check**: PASS — pnpm install ok, pnpm build succeeds (TypeScript clean, warnings only: Better Auth secret entropy, OAuth missing clientId/clientSecret)
- **Pipeline**: 52 done, 5 cancelled, 0 active — EMPTY
- **Worktree analysis reveals phantom completions**: Tasks 044–062 all share identical non-functional commits (memory updates, reviewer fixes). Only TASK-063 has a real `feat(community): add unit-directory` commit. All prior "amenities" and "community" task IDs never produced any feature code — the reconciler marked them done without merged PRs.
- **10 stub pages confirmed still 11-line stubs**: amenities (2), community (2), maintenance (3), settings (3)
- **Requirements list**: Empty
- **Created TASK-064** (high, ready, enqueued to triage): Build amenities booking system with calendar and time slots. Replaces phantom TASK-044/050/053/055. /amenities and /amenities/[id]/book are stubs; no src/components/amenities/ exists; no schema or server actions. VISION §8.
- **Created TASK-065** (medium, ready): Build admin settings pages with community config and role management. Replaces phantom TASK-046/056. /settings, /settings/community, /settings/roles are stubs; no src/components/settings/ exists. VISION §11.
- **NOT creating** (limit reached): maintenance pages (3 stubs) — will create next cycle.
- **Well-implemented confirmed**: visitors, finances, documents, announcements, dashboard, onboarding, db schema — all have real worktree commits with actual component code.
- **Top concern**: Phantom task completions keep recurring (7+ cycles). TASK-064 and TASK-065 are new IDs but describe the same gaps. Need the reconciler to stop marking work done without merged PRs — or these stub pages will remain unimplemented indefinitely.

## 2026-03-29 (product-review phase — third session)

### Decisions

- **Health check**: PASS — pnpm install ok, pnpm build succeeds (TypeScript clean, warnings only: Better Auth secret entropy, OAuth missing clientId/clientSecret)
- **Pipeline**: 50 done, 4 cancelled, 0 active — EMPTY
- **Stub pages confirmed still present**: /amenities (2 pages), /community (2 pages), /maintenance (3 pages), /settings (3 pages) — all 11-line stubs with zero components
- **Requirements list**: Empty — no requirements in system at all
- **Created TASK-055** (high, ready, enqueued to triage): Build amenities booking system with calendar and booking form. Reason: /amenities and /amenities/[id]/book are 11-line stubs; no src/components/amenities/ exists; no amenities schema; no booking server actions. VISION §8 core resident feature.
- **Created TASK-056** (medium, ready): Build community page with profile, rules editor, board roster, and unit directory. Reason: /community and /community/units are 11-line stubs; no src/components/community/ exists; some schema exists but no components or server actions. VISION §2.
- **NOT creating** (limit reached): maintenance pages (3 stubs), settings pages (3 stubs)
- **Phantom task pattern confirmed persistent**: TASK-050/053/055 (amenities) and TASK-051/054/056 (community) are separate task IDs across runs — each cycle creates a new ID because prior IDs remain phantom-done. The actual work never gets merged.
- **Well-implemented confirmed**: visitors (full CRUD + server actions), finances, documents, announcements, dashboard, onboarding wizard, db schema (comprehensive)
- **Top concern**: 10 stub pages remain unimplemented across 3+ review cycles. Phantom task completions are a systematic reconciler issue, not a code problem. The implementation never actually happens because worktrees get created but never merged.

## 2026-03-29 (product-review phase — fifth session)

### Decisions

- **Health check**: FAIL — pnpm install ok, but pnpm build FAILS
- **Build failure**: better-sqlite3@12.8.0 compiled for NODE_MODULE_VERSION 127 (Node ~22) but running Node v25.2.1 requires NODE_MODULE_VERSION 141. Build fails at page data collection for /[locale]/onboarding with ERR_DLOPEN_FAILED.
- **Pipeline**: 60 done, 5 cancelled, 1 ready (TASK-066), 1 newly created — pipeline not saturated but build is broken
- **Created TASK-068** (critical, ready, enqueued to triage): Fix build failure — rebuild better-sqlite3 for Node v25. Fix: pnpm rebuild better-sqlite3 or reinstall the package.
- **NOT proceeding to stub page review**: Build must pass first. TASK-068 is blocking.
- **Well-implemented confirmed** (prior runs): visitors, finances, documents, announcements, dashboard, onboarding, db schema — all have real worktree commits with actual component code.
- **Top concern**: Critical build failure — no deployments possible. TASK-068 is enqueued to triage.

## 2026-03-29 (product-review phase — sixth session)

### Decisions

- **Health check**: PASS — pnpm install ok, pnpm build succeeds (TypeScript clean, warnings only: Better Auth secret entropy, OAuth missing clientId/clientSecret)
- **Pipeline**: 66 done, 5 cancelled, 2 ready (TASK-071, TASK-072 — maintenance pages), 0 active — HEALTHY, not saturated but at 2-task creation limit
- **7 stub pages confirmed still 11-line stubs**: amenities (2), community (2), settings (3) — zero components exist in src/components/
- **3 maintenance stubs still 11-line stubs**: maintenance/page.tsx, maintenance/new/page.tsx, maintenance/[id]/page.tsx — but TASK-071/TASK-072 cover these
- **Worktree analysis confirms phantom pattern**: TASK-069 through TASK-073 all share commit 54e1970 ("fix reviewer: handle missing/empty PRs") — no feature code. Only task-task-063 has a real feature commit (unit-directory). Prior amenities/community/settings/ maintenance tasks were never merged.
- **No new tasks created** (at 2-task limit, and pipeline already has 2 critical tasks queued)
- **Well-implemented confirmed**: visitors, finances, documents, announcements, dashboard, onboarding, db schema — all have real worktree commits with actual component code
- **Top concern**: Phantom task completions persist — tasks marked done but work never merged. 10 stub pages remain across 6+ review cycles. TASK-071 and TASK-072 are queued for maintenance implementation.

## 2026-03-29 (product-review phase — seventh session)

### Decisions

- **Health check**: PASS — pnpm install ok, pnpm build succeeds (TypeScript clean, warnings only: Better Auth secret entropy, OAuth missing clientId/clientSecret)
- **Node version note**: Default node v16.19.0 is too old for pnpm; used nvm to switch to Node 22.22.2 for health check
- **Pipeline**: 65 done, 6 cancelled, 4 ready (TASK-071, TASK-072 maintenance; TASK-074 amenities; TASK-075 settings), 0 active — HEALTHY, not saturated
- **10 stub pages still 11-line stubs**: amenities/page.tsx, amenities/[id]/book/page.tsx, community/page.tsx, community/units/page.tsx, maintenance/page.tsx, maintenance/new/page.tsx, maintenance/[id]/page.tsx, settings/page.tsx, settings/community/page.tsx, settings/roles/page.tsx
- **No components exist** for: amenities, community, maintenance, settings (only dashboard, documents, finances, ui in src/components/)
- **Phantom task pattern confirmed**: Tasks 044–073 are all marked done but none produced feature code in the main branch. Stub pages have never been replaced.
- **Created TASK-074** (high, ready, enqueued to triage): Build amenities booking system with calendar and time slots. Reason: /amenities and /amenities/[id]/book are 11-line stubs; no src/components/amenities/ exists; no schema, server actions, or i18n keys for amenities. VISION §8 core resident feature.
- **Created TASK-075** (medium, ready, NOT enqueued per rules): Build user and admin settings pages with community config and role management. Reason: /settings, /settings/community, /settings/roles are 11-line stubs; no src/components/settings/ exists. VISION §11.
- **NOT creating** (limit reached): community pages (2 stubs) — covered by community stubs, lower priority than amenities and settings
- **Well-implemented confirmed**: visitors (full CRUD + server actions), finances, documents, announcements, dashboard, onboarding, db schema — all have real worktree commits with actual component code
- **Top concern**: 10 stub pages remain unimplemented. TASK-071/072 (maintenance, critical), TASK-074 (amenities, high) are enqueued/ready. Phantom completions mean prior "done" tasks never produced code.

## 2026-03-29 (product-review phase — eighth session)

### Decisions

- **Health check**: PASS — pnpm install ok, pnpm build succeeds (TypeScript clean, no errors; warnings: Better Auth secret entropy, OAuth missing clientId/clientSecret)
- **Node version**: Default pnpm uses Node 16.19.0 which is too old; must use `export PATH="$HOME/.nvm/versions/node/v22.22.2/bin:$PATH"` before pnpm commands
- **Pipeline**: 65 done, 7 cancelled, 2 blocked, 5 ready, 0 active — HEALTHY, not saturated (5 ready tasks exist but I haven't created any yet this run)
- **Queue**: 6 entries (TASK-079 assigned/i18n, TASK-074/TASK-075 assigned/triage, TASK-051/TASK-018/TASK-014 pending/pr-reviewer)
- **10 stub pages still confirmed 11-line stubs**: amenities (2), community (2), maintenance (3), settings (3) — zero feature components exist in src/components/ for any of these areas
- **Phantom task pattern confirmed**: Tasks 044–075 show "done" but /community/page.tsx and /community/units/page.tsx are still 11-line stubs. TASK-060/058/059 (all marked done) claimed to implement community pages but produced no code.
- **Existing ready tasks cover**: maintenance (TASK-071/072, critical), amenities (TASK-074, high), settings (TASK-075, medium), i18n (TASK-079, critical)
- **Community pages gap identified**: No task covers /community/page.tsx and /community/units/page.tsx — all prior community tasks are phantom-done
- **Created TASK-080** (medium, ready, NOT enqueued per rules): Build community pages with profile, rules, board roster, and unit directory. Reason: /community/page.tsx and /community/units/page.tsx are 11-line stubs with no coverage. All prior community task IDs (TASK-045/049/054/056/059/060/061/062) are phantom-done. Depends on TASK-079 (i18n keys).
- **NOT creating second task** (limit reached for this run)
- **Well-implemented confirmed** (verified fresh this run): dashboard components (admin/resident/security), finances.tsx, documents components, visitors (full CRUD), announcements, onboarding wizard, db schema (comprehensive)
- **Top concern**: 10 stub pages remain. Pipeline has 5 ready tasks but phantom completions mean actual code delivery is uncertain. Community pages (TASK-080) now queued as the only remaining uncovered gap.
