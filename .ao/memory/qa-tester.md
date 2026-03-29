# QA Tester — Run Memory

This file tracks test results across runs to detect regressions and avoid duplicate bug reports.

## Format

Each entry: `[DATE] TEST — PASS/FAIL details`

## Last Run Summary

**Date:** 2026-03-28
**Result:** PARTIAL PASS (5/6 steps pass)

### Passes
- Smoke Test: CondoHub loads correctly
- Auth Flow: BOTH signup and login APIs now work (major fix!)
- i18n Verification: All locales work correctly
- Navigation: All routes working
- Protected Routes: All accessible after authentication

### Failures
- Visitor Management: 500 error due to missing i18n keys (BUG-015)

### Known Bugs Filed
- BUG-015: Visitors page 500 error — missing `visitors.list.title` and `visitors.list.description` i18n keys (HIGH severity)

## Known Bugs Filed
<!-- Bugs already reported as tasks — do NOT re-file. -->

| Bug ID | Severity | Description | First Seen | Status |
|--------|----------|-------------|------------|--------|
| BUG-015 | HIGH | Visitors page 500 error — missing i18n keys `visitors.list.title` and `visitors.list.description` | 2026-03-28 | OPEN |
| BUG-011 | MEDIUM | Missing i18n key `auth.common:loading` | 2026-03-28 | OPEN |
| BUG-013 | MEDIUM | Missing i18n key `auth.common:or` | 2026-03-28 | OPEN |
| BUG-010 | MEDIUM | No language switcher UI component | 2026-03-28 | OPEN |

## Regressions Detected
<!-- Tests that previously passed but now fail. -->

None — auth APIs that were failing in all previous runs are now working.

## Fixed Since Last Run
<!-- Bugs from previous runs that are now passing. -->

| Bug ID | Description | Fixed Date |
|--------|-------------|------------|
| BUG-012 | Signup API 500 error | 2026-03-28 |
| BUG-014 | Login API 500 error | 2026-03-28 |

## Run History

### 2026-03-28
- Auth APIs FIXED — both signup and login now return 200 OK
- User successfully created: qa-test-2026-03-28@condohub.dev
- Onboarding wizard loads correctly
- All protected routes accessible after auth
- NEW BUG: Visitors page crashes with 500 error (missing i18n keys)

### 2026-03-29
- Login API WORKS — POST `/api/auth/sign-in/email` returns 200 OK
- Successfully logged in as qa-test-2026-03-28@condohub.dev
- Onboarding wizard accessible and functional
- All protected routes accessible after auth (dashboard, announcements, maintenance, amenities, finances, documents, settings)
- BUG-015 STILL OPEN: Visitors page 500 error — missing `visitors.list.title` and `visitors.list.description` i18n keys
- i18n locales all working (en, es, ar)
- 5/6 test steps pass
