# CondoHub QA Test Plan

**Version:** 1.2
**Last Updated:** 2026-03-28
**Test Environment:** http://localhost:3000

---

## Last Run

| Date | Run By | Result | Notes |
|------|--------|--------|-------|
| 2026-03-29 | QA Agent | PARTIAL PASS | Both auth APIs (signup & login) return 500. i18n keys still missing. Features blocked by auth.

---

## Test Results History

| Date | Total Tests | Passed | Failed | Blocked | Notes |
|------|-------------|--------|--------|---------|-------|
| 2026-03-28 | 6 | 2 | 4 | 0 | Initial test run - app is "Invoicer" not "CondoHub" |
| 2026-03-28 | 6 | 4 | 2 | 0 | After clearing cache - CondoHub loads, auth forms incomplete |
| 2026-03-28 | 6 | 4 | 2 | 0 | E2E run - auth forms still incomplete, visitor forms implemented |
| 2026-03-28 | 6 | 4 | 2 | 1 | Signup form complete but 500 error on API, login form still incomplete |
| 2026-03-28 | 6 | 5 | 1 | 0 | Login form FIXED, Signup API still 500, i18n auth keys missing |
| 2026-03-29 | 6 | 4 | 2 | 0 | Signup API 500 persists, i18n missing keys, auth blocked |

---

## Test Coverage

### Smoke Test
- [x] Page loads without errors
- [x] No console errors on initial load
- [x] App shows "CondoHub" branding (not "Invoicer")
- [ ] Responsive layout works

### Authentication Flow
- [x] Signup page accessible
- [x] Signup form has all input fields (FIXED: full form now present)
- [x] Login page accessible
- [x] Login form has all input fields (FIXED: full form now present - email, password, submit, social auth)
- [ ] Can register new user with email/password (FAIL: 500 error on API - BUG-012)
- [ ] Can login with valid credentials (blocked by signup failure - no user exists)
- [x] Protected routes redirect to login
- [ ] Logout clears session and redirects (not tested - blocked)

### Visitor Management
- [x] Visitor page route exists (redirects to login when unauthenticated)
- [ ] Visitor list displays (blocked by auth)
- [ ] Can register a new visitor (blocked by auth, but form implemented)
- [ ] QR code generated for visitor pass (not tested)
- [ ] Security dashboard accessible (blocked by auth)

### i18n (Internationalization)
- [x] i18n routing works (/en, /es, /ar)
- [x] English locale loads correctly
- [x] Spanish locale loads with translations
- [x] Arabic locale loads with RTL support
- [ ] Language switcher UI accessible (not found)
- [ ] All supported languages render correctly

### Navigation
- [x] Landing page loads
- [x] Login link works
- [x] Signup link works
- [ ] Dashboard accessible (requires auth)
- [ ] Visitors link works (requires auth)
- [ ] Other protected routes (requires auth)
- [x] No 404 errors on expected routes

### Dashboard
- [ ] Dashboard loads for authenticated user (blocked by auth)
- [ ] Role-appropriate content displayed (not tested)

### Documents
- [ ] Documents page accessible (requires auth)
- [ ] Can upload documents with category
- [ ] Document list displays correctly
- [ ] Document categories work (Rules, Minutes, Financial, etc.)
- [ ] Access control for board-only documents

### Visitor Blacklist
- [ ] Blacklist system prevents denied entries
- [ ] Security can check visitors against blacklist
- [ ] Blacklist alerts display properly

### Community Onboarding
- [ ] Onboarding wizard accessible at /onboarding
- [ ] Can create new community with name, address, units
- [ ] Can configure amenities during setup
- [ ] Wizard completes and redirects to dashboard

---

## Known Issues

| ID | Severity | Description | First Seen | Status |
|----|----------|-------------|------------|--------|
| BUG-012 | HIGH | Signup API returns 500 error - `/api/auth/sign-up/email` fails | 2026-03-28 | **OPEN** - Task TASK-024 marked done but issue persists |
| BUG-014 | HIGH | **Login API also returns 500** - `/api/auth/sign-in/email` fails | 2026-03-29 | **NEW** |
| BUG-011 | MEDIUM | Missing i18n translation key `auth.common:loading` causing console errors | 2026-03-28 | **OPEN** - Task TASK-025 marked done but issue persists |
| BUG-013 | MEDIUM | Missing i18n translation key `auth.common.or` causing console errors | 2026-03-28 | **NEW** |
| BUG-010 | MEDIUM | No language switcher UI component | 2026-03-28 | Open |

### Fixed Issues

| ID | Severity | Description | First Seen | Fixed Date |
|----|----------|-------------|------------|------------|
| BUG-009 | HIGH | Login form incomplete - missing email, password inputs and submit button | 2026-03-28 | 2026-03-28 (TASK-019 FIXED - form now complete) |
| BUG-008 | HIGH | Signup form incomplete - missing name, email, password inputs and submit button | 2026-03-28 | 2026-03-28 (FORM FIXED - but API has new issue BUG-012) |
| BUG-001 | CRITICAL | Wrong app running: "Invoicer" instead of "CondoHub" | 2026-03-28 | 2026-03-28 (cleared Next.js cache) |
| BUG-002 | CRITICAL | Missing dependencies: @radix-ui/react-popover | 2026-03-28 | 2026-03-28 |
| BUG-003 | CRITICAL | Missing dependencies: cmdk | 2026-03-28 | 2026-03-28 |
| BUG-004 | HIGH | 500 Internal Server Error on /login page | 2026-03-28 | 2026-03-28 |
| BUG-005 | HIGH | /visitors route returns 404 | 2026-03-28 | 2026-03-28 |
| BUG-006 | HIGH | i18n locale routes return 404 | 2026-03-28 | 2026-03-28 |
| BUG-007 | MEDIUM | 28 console errors during test session | 2026-03-28 | 2026-03-28 |

---

## Regression Tracker

| Test Case | Last Passed | First Failed | Notes |
|-----------|-------------|--------------|-------|
| N/A | N/A | N/A | First test run |

---

## Detailed Test Results

### Step 1 - Smoke Test: PASS
- **Status:** CondoHub loads correctly with proper branding
- **URL:** http://localhost:3000 → redirects to /en
- **Console Errors:** 0
- **Screenshot:** qa-step1-smoke-test.png

### Step 2 - Auth Flow: PARTIAL (SIGNUP API FAILS, LOGIN FIXED)
- **Status:** Both Signup and Login forms COMPLETE, but Signup API returns 500 error
- **Signup Page:**
  - ✅ All form fields present: Full name, Email, Password, Confirm password
  - ✅ Submit button present
  - ❌ Submit fails with 500 error on `/api/auth/sign-up/email` (BUG-012)
- **Login Page:**
  - ✅ FIXED: All form fields present: Email, Password
  - ✅ FIXED: Submit button present
  - ✅ FIXED: Social auth buttons present (Google, GitHub)
  - ❌ Missing i18n key `auth.common.or` causes console errors (BUG-013)
- **Login Test:**
  - Attempted login with qa-test@condohub.dev → "Invalid email or password" (expected, user doesn't exist)
- **Related Tasks:** TASK-018 and TASK-019 both COMPLETE - forms are working
- **Open Bugs:** BUG-011 (auth.common:loading), BUG-012 (API 500), BUG-013 (auth.common:or)

### Step 3 - Visitor Registration: BLOCKED
- **Status:** Cannot test - requires authentication
- **Route:** /en/visitors correctly redirects to /en/login when unauthenticated
- **Code Status:** RegisterVisitorForm fully implemented with React Hook Form + Zod validation
- **Expected:** After auth works, should show visitor list with registration button

### Step 4 - i18n Verification: PASS
- **Status:** All tested locales working correctly
- **English (/en):** "CondoHub - Modern condominium management platform" ✓
- **Spanish (/es):** "CondoHub - Plataforma moderna de gestión de condominios" ✓
- **Arabic (/ar):** "CondoHub - منصة حديثة لإدارة المجمعات السكنية" with RTL layout ✓
- **Console Errors:** 0 (but errors appear during auth flow due to missing `auth.common:loading` key)

### Step 5 - Navigation: PASS
- **Status:** All public routes working, protected routes correctly require auth
- **Working Routes:** /, /en, /es, /ar, /en/login, /en/signup
- **Protected Routes:** /en/dashboard, /en/visitors, /en/announcements, /en/maintenance, /en/amenities, /en/finances all correctly redirect to login
- **Console Errors:** 0

### Step 6 - Console & Network Audit: FAIL (KNOWN ISSUES)
- **Console Errors:** Multiple missing i18n keys in auth namespace:
  - `IntlError: MISSING_MESSAGE: Could not resolve 'auth.common:loading'` (BUG-011)
  - `IntlError: MISSING_MESSAGE: Could not resolve 'auth.common:or'` (BUG-013)
- **Network Failures:** POST `/api/auth/sign-up/email` returns 500 Internal Server Error (BUG-012)
- **Root Cause:**
  1. Auth forms using i18n keys that don't exist in message files
  2. Better Auth API endpoint failing on signup (possible DB issue or config error)

---

## Detailed Test Results - 2026-03-29

### Step 1 - Smoke Test: PASS
- **Status:** CondoHub loads correctly with proper branding
- **URL:** http://localhost:3000 → redirects to /en
- **Console Errors:** 0
- **Screenshot:** qa-step1-smoke-test.png

### Step 2 - Auth Flow: PARTIAL FAIL
- **Status:** Signup API 500 error persists (BUG-012), Login form complete and functional
- **Signup Page:**
  - ✅ All form fields present: Full name, Email, Password, Confirm password
  - ✅ Submit button present
  - ❌ 500 error on `/api/auth/sign-up/email` endpoint (BUG-012 - STILL OPEN)
  - ❌ Missing i18n key `auth.common:loading` (BUG-011 - STILL OPEN)
- **Login Page:**
  - ✅ All form fields present: Email, Password, Submit
  - ✅ Social auth buttons present (Google, GitHub)
  - ❌ Missing i18n key `auth.common:or` (BUG-013 - STILL OPEN)
- **Login Test:** Attempted login with qa-test@condohub.dev → "Invalid email or password" (expected)

### Step 3 - Visitor Registration: BLOCKED
- **Status:** Cannot test - requires authentication
- **Route:** /en/visitors correctly redirects to /en/login when unauthenticated
- **Note:** Same as previous run - blocked by auth issues

### Step 4 - i18n Verification: PASS
- **Status:** All tested locales working correctly
- **English (/en):** "CondoHub - Modern condominium management platform" ✓
- **Spanish (/es):** "CondoHub - Plataforma moderna de gestión de condominios" ✓
- **Arabic (/ar):** "CondoHub - منصة حديثة لإدارة المجمعات السكنية" with RTL layout ✓
- **Console Errors:** 0 on i18n pages (errors only appear on auth pages)

### Step 5 - Navigation: PASS
- **Status:** All public routes working, protected routes correctly redirect to login
- **Working Routes:** /, /en, /es, /ar, /en/login, /en/signup
- **Protected Routes:** /en/dashboard, /en/visitors correctly redirect to login

### Step 6 - Console & Network Audit: FAIL (KNOWN ISSUES - NO NEW BUGS)
- **Console Errors:** Same as previous run:
  - `IntlError: MISSING_MESSAGE: Could not resolve 'auth.common:loading'` (BUG-011)
  - `IntlError: MISSING_MESSAGE: Could not resolve 'auth.common:or'` (BUG-013)
- **Network Failures:** POST `/api/auth/sign-up/email` returns 500 (BUG-012)
- **Conclusion:** No new bugs found - all errors are documented known issues

---

## Detailed Test Results - 2026-03-29 (Current Run)

### Step 1 - Smoke Test: PASS
- **Status:** CondoHub loads correctly with proper branding
- **URL:** http://localhost:3000 → redirects to /en
- **Console Errors:** 0
- **Screenshot:** qa-step1-smoke-test-2026-03-29.png

### Step 2 - Auth Flow: FAIL (CRITICAL - BOTH APIs BROKEN)
- **Status:** Forms complete but BOTH auth APIs return 500
- **Signup Page:**
  - ✅ All form fields present: Full name, Email, Password, Confirm password
  - ✅ Submit button present
  - ❌ POST `/api/auth/sign-up/email` returns 500 (BUG-012 - STILL OPEN)
  - ❌ Missing i18n key `auth.common:loading` causes console errors (BUG-011)
- **Login Page:**
  - ✅ All form fields present: Email, Password, Submit
  - ✅ Social auth buttons present (Google, GitHub)
  - ❌ POST `/api/auth/sign-in/email` returns 500 (NEW - Login API also broken)
  - ❌ Missing i18n key `auth.common:or` causes console errors (BUG-013)
- **Test Credentials:** qa-test-2026-03-29@condohub.dev / TestPass123!
- **Screenshot:** qa-errors-signup-2026-03-29.png

### Step 3 - Visitor Registration: BLOCKED
- **Status:** Cannot test - requires authentication
- **Route:** /en/visitors correctly redirects to /en/login when unauthenticated
- **Onboarding:** /en/onboarding returns 307 (redirect, may require auth)

### Step 4 - i18n Verification: PASS
- **Status:** All tested locales working correctly
- **English (/en):** "CondoHub - Modern condominium management platform" ✓
- **Spanish (/es):** "CondoHub - Plataforma moderna de gestión de condominios" ✓
- **Arabic (/ar):** "CondoHub - منصة حديثة لإدارة المجمعات السكنية" with RTL layout ✓
- **Console Errors:** 0 on i18n pages (errors only appear on auth pages)

### Step 5 - Navigation: PASS
- **Status:** All public routes working, protected routes correctly redirect to login
- **Public Routes:** /, /en, /es, /ar, /en/login, /en/signup all return 200
- **Protected Routes:** All redirect to /en/login with 307:
  - /en/dashboard, /en/visitors, /en/announcements, /en/maintenance
  - /en/amenities, /en/finances, /en/documents, /en/community, /en/settings
- **No 404 errors** on expected routes

### Step 6 - Console & Network Audit: FAIL
- **Console Errors during auth flow:**
  - `IntlError: MISSING_MESSAGE: Could not resolve 'auth.common:loading'` (BUG-011)
  - `IntlError: MISSING_MESSAGE: Could not resolve 'auth.common:or'` (BUG-013)
- **Network Failures:**
  - POST `/api/auth/sign-up/email` returns 500 (BUG-012)
  - POST `/api/auth/sign-in/email` returns 500 (Login API also broken)
- **Note:** Tasks TASK-024, TASK-025 marked as "done" but issues persist

---

## Critical Findings

1. **Login Form FIXED (TASK-019 Complete):**
   - Login page now has complete form with email, password, submit button, and social auth
   - BUG-009 is RESOLVED

2. **Signup Form Complete but API BROKEN:**
   - TASK-018 is complete - signup form has all required fields
   - BUT the signup API returns 500 error, preventing user registration (BUG-012)

3. **i18n Auth Namespace Missing Keys:**
   - Auth forms reference keys `auth.common:loading` and `auth.common.or` that don't exist
   - Need to add these keys to en.json and other locale files (BUG-011, BUG-013)

4. **Authentication is the Main Blocker:**
   - BOTH Signup AND Login APIs return 500 errors
   - Cannot test protected features (visitor management, dashboard, etc.) until auth APIs are fixed
   - Tasks TASK-024 (signup fix) and TASK-025 (i18n fix) marked as "done" but issues persist

---

## Recommendations

1. **Priority 1:** Fix signup API 500 error (BUG-012) - check Better Auth config, database schema, and environment variables
2. **Priority 2:** Add missing i18n keys `auth.common:loading` and `auth.common.or` to en.json and other locales (BUG-011, BUG-013)
3. **Priority 3:** Once auth works, verify protected features (visitor management, dashboard, etc.)
4. **Priority 4:** Add language switcher UI component (BUG-010)

---

## Test Environment Setup

```bash
# Start the development server
pnpm dev

# Verify server is running
curl http://localhost:3000

# Clear cache if wrong app shows
rm -rf .next && pnpm dev
```

## Test User Credentials

- **Email:** qa-test@condohub.dev
- **Password:** TestPass123!

---

## How to Run Tests

1. Ensure the app is running: `pnpm dev`
2. Navigate to http://localhost:3000
3. Execute each test case in the Test Coverage section
4. Mark results in the "Last Run" and "Test Results History" tables
5. Document any failures in "Known Issues"
6. Commit changes to QA.md
