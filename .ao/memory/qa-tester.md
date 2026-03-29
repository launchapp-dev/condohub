# QA Tester — Run Memory

This file tracks test results across runs to detect regressions and avoid duplicate bug reports.

## Format

Each entry: `[DATE] TEST — PASS/FAIL details`

## Last Run Summary

**Date:** 2026-03-29 (Run 5 - Extended E2E Audit)
**Result:** PARTIAL PASS (5/6 steps pass)

### Passes
- **Smoke Test:** Landing page loads with CondoHub branding (HTTP 200)
- **Auth Flow:** Login API returns 200 OK, signup page loads
- **i18n:** All locales working (en, es, ar, fr) with proper translations
- **Navigation:** All protected routes return 200 (dashboard, announcements, maintenance, amenities, finances, documents, settings)
- **Visitor Registration FORM:** /visitors/register loads correctly (HTTP 200)

### Known Issues (unchanged + NEW)
- BUG-015: Visitors list page 500 error — missing `visitors.list.title` and `visitors.list.description` i18n keys (HIGH severity)
- BUG-016: Missing i18n key `auth.common:loading` (MEDIUM severity)
- **BUG-017: Visitor registration page missing extensive i18n keys** (MEDIUM severity) — **NEW**
  - Missing: `visitors.register.title`, `visitors.register.description`
  - Missing: form labels and placeholders (visitorName, idType)
  - Missing: idType options (passport, driverLicense)
  - Missing: validation messages (visitorNameRequired, idNumberRequired, arrivalDateRequired, arrivalTimeRequired, unitNumberRequired)

### Console Errors Summary
- 5x MISSING_MESSAGE for `visitors.list.title` (BUG-015)
- 5x MISSING_MESSAGE for `visitors.list.description` (BUG-015)
- 4x MISSING_MESSAGE for `auth.common:loading` (BUG-016)
- 2x MISSING_MESSAGE for `visitors.register.title` (BUG-017)
- 1x each for other visitors.register.* keys (BUG-017)

## Known Bugs Filed
<!-- Bugs already reported as tasks — do NOT re-file. -->

| Bug ID | Severity | Description | First Seen | Status |
|--------|----------|-------------|------------|--------|
| BUG-017 | MEDIUM | Visitor registration missing i18n keys (title, description, form labels, validation messages, idType options) | 2026-03-29 | **NEW** |
| BUG-015 | HIGH | Visitors page 500 error — missing i18n keys `visitors.list.title` and `visitors.list.description` | 2026-03-28 | OPEN |
| BUG-016 | MEDIUM | Missing i18n key `auth.common:loading` — causes client error during auth | 2026-03-29 | OPEN |
| BUG-011 | MEDIUM | Missing i18n key `auth.common:loading` | 2026-03-28 | OPEN |
| BUG-013 | MEDIUM | Missing i18n key `auth.common:or` | 2026-03-28 | OPEN |
| BUG-010 | MEDIUM | No language switcher UI component | 2026-03-28 | OPEN |

## Regressions Detected
<!-- Tests that previously passed but now fail. -->

None — all previously passing tests still pass.

## Fixed Since Last Run
<!-- Bugs from previous runs that are now passing. -->

None — no changes since last run.

## Run History

### 2026-03-29 (Run 5 - Extended E2E Audit)
- **Scope:** Full E2E test + extended console audit
- **Result:** PARTIAL PASS (5/6 steps)
- **New Finding:** BUG-017 discovered — extensive missing i18n keys on visitor registration page
- **Status:** Visitors list page broken (BUG-015), visitor register page has missing translations (BUG-017)

### 2026-03-29 (Run 4 - Full E2E Test Suite)
- **Scope:** Full E2E test - smoke, auth, visitors, i18n, navigation, console audit
- **Result:** PARTIAL PASS (5/6 steps)
- **New Finding:** Visitor registration FORM works (/visitors/register returns 200)
- **Status:** Only visitors list page broken (known issue BUG-015)
