# CondoHub QA Test Plan

**Version:** 1.2
**Last Updated:** 2026-03-28
**Test Environment:** http://localhost:3000

---

## Last Run

| Date | Run By | Result | Notes |
|------|--------|--------|-------|
| 2026-03-28 | QA Agent | PARTIAL PASS | Signup form FIXED but API 500 error, Login form still broken, New i18n bug found |

---

## Test Results History

| Date | Total Tests | Passed | Failed | Blocked | Notes |
|------|-------------|--------|--------|---------|-------|
| 2026-03-28 | 6 | 2 | 4 | 0 | Initial test run - app is "Invoicer" not "CondoHub" |
| 2026-03-28 | 6 | 4 | 2 | 0 | After clearing cache - CondoHub loads, auth forms incomplete |
| 2026-03-28 | 6 | 4 | 2 | 0 | E2E run - auth forms still incomplete, visitor forms implemented |
| 2026-03-28 | 6 | 4 | 2 | 1 | Signup form complete but 500 error on API, login form still incomplete |

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
- [ ] Login form has all input fields (FAIL: still missing - BUG-009)
- [ ] Can register new user with email/password (FAIL: 500 error on API - BUG-012)
- [ ] Can login with valid credentials (blocked by incomplete form)
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

### Community Management
- [ ] Community settings accessible (requires auth)
- [ ] Unit directory accessible (requires auth)
- [ ] Role management accessible (requires auth)

---

## Known Issues

| ID | Severity | Description | First Seen | Status |
|----|----------|-------------|------------|--------|
| BUG-012 | HIGH | Signup API returns 500 error - `/api/auth/sign-up/email` fails | 2026-03-28 | **NEW** |
| BUG-011 | MEDIUM | Missing i18n translation key `auth.common:loading` causing console errors | 2026-03-28 | **NEW** |
| BUG-009 | HIGH | Login form incomplete - missing email, password inputs and submit button | 2026-03-28 | **STILL OPEN** (TASK-019 marked done but not working) |
| BUG-010 | MEDIUM | No language switcher UI component | 2026-03-28 | Open |

### Fixed Issues

| ID | Severity | Description | First Seen | Fixed Date |
|----|----------|-------------|------------|------------|
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

### Step 2 - Auth Flow: PARTIAL (MIXED RESULTS)
- **Status:** Signup form FIXED, Login form STILL BROKEN, Signup API FAILS
- **Signup Page:**
  - ✅ All form fields present: Full name, Email, Password, Confirm password
  - ✅ Submit button present
  - ❌ Submit fails with 500 error on `/api/auth/sign-up/email`
  - ❌ Missing i18n key `auth.common:loading` causes console errors
- **Login Page:**
  - ❌ Still incomplete - only shows title "Welcome back" and subtitle
  - ❌ No email/password fields, no submit button (BUG-009 persists)
- **Related Tasks:** TASK-018 marked done and form IS fixed, TASK-019 marked done but login NOT working
- **New Bugs:** BUG-011 (i18n), BUG-012 (API 500)

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

### Step 6 - Console & Network Audit: FAIL
- **Console Errors:** Multiple `IntlError: MISSING_MESSAGE: Could not resolve 'auth.common:loading'` errors
- **Network Failures:** POST `/api/auth/sign-up/email` returns 500 Internal Server Error
- **Root Cause:**
  1. i18n messages missing `auth.common:loading` key in auth namespace
  2. Better Auth API endpoint failing on signup (possible DB issue or config error)

---

## Critical Findings

1. **Signup Form FIXED but API BROKEN:**
   - TASK-018 is actually complete - the signup form now has all fields
   - BUT the signup API returns 500 error, preventing user registration
   - Missing i18n key `auth.common:loading` causes console spam during submission

2. **Login Form STILL BROKEN:**
   - TASK-019 marked as "done" but login page still only shows title/subtitle
   - No input fields or submit button present
   - This blocks all authenticated testing

3. **Better Auth Integration Issues:**
   - Signup API endpoint `/api/auth/sign-up/email` returns 500
   - May be database schema issue, auth config error, or missing env vars

4. **i18n Namespace Gap:**
   - Auth forms using `auth.common:loading` key that doesn't exist
   - Need to add auth namespace to i18n messages or update form code

---

## Recommendations

1. **Priority 1:** Fix signup API 500 error (BUG-012) - check Better Auth config and database
2. **Priority 2:** Fix login form - TASK-019 shows done but code is not working
3. **Priority 3:** Add missing i18n key `auth.common:loading` to en.json and other locales
4. **Priority 4:** Once auth works, verify protected features (visitor management, dashboard, etc.)

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
