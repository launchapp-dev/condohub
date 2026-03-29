# QA Tester — Run Memory

This file tracks test results across runs to detect regressions and avoid duplicate bug reports.

## Format

Each entry: `[DATE] TEST — PASS/FAIL details`

## Last Run Summary

**Date:** 2026-03-29 (Run 3 - Playwright MCP Smoke Test)
**Result:** PASS - Smoke test only

### Passes
- **Smoke Test:** CondoHub landing page loads correctly with "CondoHub" heading and "Modern condominium management platform" subtitle
- **Navigation:** Log in and Sign up buttons visible and accessible
- **Console:** No critical errors on initial load
- **Screenshot:** qa-step1-smoke-test-2026-03-29-2.png captured successfully

### Known Bugs (unchanged)
- BUG-015: Visitors page 500 error — missing `visitors.list.title` and `visitors.list.description` i18n keys (HIGH severity)

## Known Bugs Filed
<!-- Bugs already reported as tasks — do NOT re-file. -->

| Bug ID | Severity | Description | First Seen | Status |
|--------|----------|-------------|------------|--------|
| BUG-015 | HIGH | Visitors page 500 error — missing i18n keys `visitors.list.title` and `visitors.list.description` | 2026-03-28 | OPEN |
| BUG-016 | MEDIUM | Missing i18n key `auth.common:loading` — causes client error during auth | 2026-03-29 | OPEN |
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

### 2026-03-29 (Run 3 - Playwright MCP Smoke Test)
- **Scope:** Smoke test only - verify app loads and video recording works
- **Result:** PASS - Landing page loads with CondoHub branding
- **Screenshot:** qa-step1-smoke-test-2026-03-29-2.png
- **Status:** Ready for full E2E test suite

### 2026-03-28
- Auth APIs FIXED — both signup and login now return 200 OK
- User successfully created: qa-test-2026-03-28@condohub.dev
- Onboarding wizard loads correctly
- All protected routes accessible after auth
- NEW BUG: Visitors page crashes with 500 error (missing i18n keys)

### 2026-03-29 (Run 2)
- Smoke Test: PASS - Landing page loads correctly
- Auth Flow: PASS - Login API works, user authenticated successfully
- Visitor Registration: FAIL - BUG-015 still open, visitors page 500 error
- i18n Verification: PASS - All locales (en, es, ar) working with RTL
- Navigation: PASS - All protected routes accessible
- Console Audit: PARTIAL - Missing i18n keys for auth.common:loading (new finding)
- **Result: 5/6 steps pass, 1 fail (known bug)**
