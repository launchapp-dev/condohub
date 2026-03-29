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

## 2026-03-29

### Decisions

- **Created TASK-044** (high, ready, enqueued to triage): Build amenities booking system with calendar, time slots, and conflict detection. Reason: /amenities page is a placeholder; VISION specifies full amenity booking with calendar view, time slots, conflict detection, waitlist, and deposit tracking. This is a core resident feature with high impact.
- **Created TASK-045** (medium, ready): Build community page with profile, rules editor, and board roster. Reason: /community page is a placeholder; VISION specifies it should show community info, rules document (rich text, versioned), and board member roster. Named VISION page that exists but has no implementation.
- **Deferred**: Unit directory CRUD (/community/units) — placeholder but lower priority than amenities and community page.
- **Deferred**: OAuth (Google/GitHub) login — auth infrastructure exists but OAuth not wired up; non-critical for demo.
- **Deferred**: Community rules version history — would need a versions table; too complex for single task.
- **Deferred**: Amenity waitlist — part of the larger amenities booking task; not splitting further.
- **Not creating**: Document repository, finances, announcements, maintenance, visitor management — all verified as well-implemented in codebase.
