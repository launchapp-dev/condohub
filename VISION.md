# CondoHub — Product Vision

The condominium management platform residents and admins actually want. Modern, multilingual, built for how people live in 2026 — not 1995.

## The Problem

Condo management today is a mess. Legacy property management software (Buildium, AppFolio, Yardi) is bloated, expensive, and designed for large property management companies — not individual condo associations. On the other end, WhatsApp groups and spreadsheets can't handle visitor logs, maintenance requests, or financial transparency. Residents are left in the dark, board members drown in admin, and security guards use paper logbooks.

## What CondoHub Is

A modern SaaS platform purpose-built for condominium communities. It connects residents, board members, property managers, and security staff in a single system. Multilingual from day one — because condos are diverse. Start free for small buildings, scale to paid plans for large complexes.

## Target Users

1. **Residents** — View announcements, register visitors, submit maintenance requests, check financials, book amenities
2. **Board Members / Admins** — Manage the building, approve requests, publish announcements, oversee finances
3. **Property Managers** — Professional managers handling multiple buildings
4. **Security / Front Desk** — Verify visitors, manage access logs, handle deliveries
5. **Maintenance Staff** — Receive and update work orders

## Core Features

### 1. Authentication & Multi-Tenancy
- Sign up / login with email + password via Better Auth
- OAuth: Google, GitHub
- Multi-tenant architecture: each condo building is a "community"
- Role-based access: resident, board_member, admin, security, maintenance
- Invite system: admins invite residents via email link
- Protected routes — unauthenticated users see the marketing landing page
- User profile with unit number, contact info, emergency contacts

### 2. Community Setup & Management
- Create a new community: name, address, total units, amenities list
- Upload community logo and cover photo
- Define building structure: towers/blocks, floors, unit numbers
- Unit directory: which units are occupied, owner vs tenant
- Community rules document (rich text, versioned)
- Board member roster with roles (president, treasurer, secretary)

### 3. Visitor Management System
- **Pre-registration**: Residents register expected visitors with name, ID type, vehicle plate, expected arrival time, purpose of visit
- **Walk-in registration**: Security registers unexpected visitors at the gate
- **QR code pass**: Generate a unique QR code for pre-registered visitors that security can scan
- **Visitor log**: Searchable history of all visitor entries and exits
- **Check-in / Check-out**: Security marks arrival and departure times
- **Recurring visitors**: Mark frequent visitors (family, caretakers, tutors) as "approved regulars"
- **Delivery tracking**: Log deliveries (courier name, package description, recipient unit)
- **Visitor types**: Guest, Delivery, Contractor, Service Provider, Real Estate Agent
- **Blacklist**: Flag individuals who are denied entry, with reason
- **Notifications**: Resident gets notified when their visitor arrives
- **Visitor dashboard**: Security sees today's expected visitors, checked-in visitors, and recent activity
- **Vehicle management**: Log visitor vehicles, parking spot assignment
- **Photo capture**: Optional photo of visitor at check-in (via webcam/phone camera)
- **Visitor history per unit**: Residents see their own visitor history
- **Bulk visitor registration**: For events/parties, register multiple visitors at once
- **Time-limited access**: Visitor passes expire after a set duration
- **Contractor work permits**: Multi-day passes for renovation contractors with approved work hours

### 4. Internationalization (i18n)
- **Full app localization**: Every string, label, error message, email, and notification is translatable
- **Supported languages (v1)**: English, Spanish, Portuguese, French, Arabic, Chinese (Simplified), Japanese, Korean
- **RTL support**: Full right-to-left layout for Arabic
- **Language detection**: Auto-detect from browser locale, allow manual override
- **Per-user language preference**: Saved in user settings, persisted across sessions
- **Community default language**: Admin sets the default language for the community
- **Date/time localization**: Format dates, times, and numbers per locale (Intl APIs)
- **Currency localization**: Display fees and financial data in local currency format
- **Pluralization rules**: Proper plural forms per language (not just "1 item" vs "N items")
- **Translation management**: Use next-intl with JSON message files per locale
- **Dynamic content**: User-generated content (announcements, rules) stored in original language — translation is a future AI feature
- **Locale-aware search**: Search works correctly with accented characters and different scripts
- **Fallback chain**: Missing translation → community default → English

### 5. Announcements & Communication
- Board members publish announcements visible to all residents
- Announcement categories: General, Maintenance, Emergency, Event, Financial, Rules
- Pin important announcements to the top
- Announcement scheduling: draft now, publish later
- Rich text editor for announcements (bold, links, images)
- Read receipts: track which residents have seen each announcement
- Comments on announcements (optional, admin-controlled)
- Push notification support (future: email digest)

### 6. Maintenance Requests
- Residents submit requests: title, description, category, photos, urgency level
- Categories: Plumbing, Electrical, HVAC, Elevator, Common Area, Parking, Security, Other
- Urgency levels: Low, Medium, High, Emergency
- Request lifecycle: Submitted → Acknowledged → In Progress → Completed → Closed
- Admin assigns requests to maintenance staff or external vendors
- Status updates with comments and photos
- Resident satisfaction rating after completion
- Recurring maintenance scheduling (elevator inspection, pool cleaning, etc.)
- Maintenance history per unit and per common area

### 7. Financial Transparency
- Monthly fee tracking: which units have paid, which are overdue
- Fee breakdown: administration, maintenance fund, reserve fund, special assessments
- Payment history per unit
- Budget overview: planned vs actual spending
- Expense categories: Utilities, Staff, Maintenance, Insurance, Legal, Capital Improvements
- Financial reports: monthly summary, annual report
- Export to CSV/PDF for board meetings
- Late payment notifications (manual trigger, not automated billing)
- Special assessments: one-time charges with explanation and due date
- Transparent spending: residents can see where money goes (aggregated, not detailed vendor contracts)

### 8. Amenity Booking
- Define amenities: party room, gym, pool, BBQ area, guest parking, co-working space
- Booking calendar: visual weekly/monthly view
- Time slot configuration per amenity (min/max duration, operating hours)
- Booking rules: max bookings per unit per month, advance booking limit, cancellation policy
- Deposit requirements for certain amenities (party room)
- Booking approval workflow: instant for some amenities, admin-approval for others
- Conflict detection: prevent double-booking
- Booking history and upcoming bookings per resident
- Waitlist for popular time slots

### 9. Document Repository
- Upload and organize community documents
- Categories: Rules & Regulations, Meeting Minutes, Financial Reports, Insurance, Legal, Forms
- Version history for updated documents
- Access control: some documents visible to all residents, some board-only
- Full-text search across documents (future enhancement)
- Download as PDF

### 10. Dashboard
- **Resident dashboard**: My unit, my visitors (today/upcoming), my maintenance requests, announcements, upcoming bookings, outstanding fees
- **Admin dashboard**: Community stats, pending approvals, overdue maintenance, financial summary, recent activity feed
- **Security dashboard**: Today's expected visitors, checked-in visitors, recent entries, delivery log, blacklist alerts
- Quick actions: register visitor, submit request, book amenity, publish announcement

### 11. Settings & Customization
- Community profile: name, address, logo, timezone, default language, currency
- Notification preferences per user: in-app, email (future), push (future)
- Theme: light/dark mode via design system's --la-* tokens
- Role management: assign/revoke roles
- Unit management: add/remove units, assign residents
- Amenity configuration
- Visitor policy settings: require ID, allow walk-ins, visitor hours

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: @launchapp/design-system shadcn registry — install components via `npx shadcn@latest add --registry https://launchapp-dev.github.io/design-system/registry.json <component>`
- **Styling**: Tailwind CSS v4
- **i18n**: next-intl for routing, messages, and formatting
- **Auth**: Better Auth
- **Database**: SQLite via Drizzle ORM (dev), Postgres for production
- **Forms**: React Hook Form + Zod
- **File Storage**: Local filesystem (dev), S3-compatible for production
- **Icons**: Lucide React
- **Notifications**: Sonner (toast)
- **Date handling**: date-fns with locale support
- **QR codes**: qrcode library for visitor pass generation

## Design Principles

- **Multilingual-first** — i18n is not bolted on, it's the foundation. Every feature considers localization from the start.
- **Mobile-first responsive** — Security guards use phones/tablets at the gate. Residents check visitors on their phones.
- **Role-aware UX** — Each role sees exactly what they need. No feature overload.
- **Dark mode** — via design system's --la-* tokens
- **Accessible** — keyboard nav, screen readers, WCAG 2.1 AA
- **Fast** — optimistic UI, minimal loading states, instant visitor check-in
- **Simple to start** — a new community should be set up in under 10 minutes
- **Grows with you** — free tier handles basics, paid tier unlocks amenity booking, financial reports, multi-building
- **Offline-resilient** — visitor check-in works without network, syncs when online

## Pages

1. **/** — Marketing landing page (unauthenticated)
2. **/login** — Login
3. **/signup** — Sign up
4. **/onboarding** — Community setup wizard (first-time admin)
5. **/dashboard** — Role-appropriate dashboard (resident / admin / security)
6. **/visitors** — Visitor management (list, register, check-in/out)
7. **/visitors/register** — Register a new visitor
8. **/visitors/[id]** — Visitor detail (check-in, check-out, history)
9. **/visitors/security** — Security gate view (today's visitors, walk-in registration)
10. **/announcements** — Announcement feed
11. **/announcements/new** — Create announcement (admin/board)
12. **/announcements/[id]** — Announcement detail with comments
13. **/maintenance** — Maintenance request list
14. **/maintenance/new** — Submit maintenance request
15. **/maintenance/[id]** — Request detail with status timeline
16. **/amenities** — Amenity list and booking calendar
17. **/amenities/[id]/book** — Book an amenity
18. **/finances** — Financial overview (fees, payments, budget)
19. **/documents** — Document repository
20. **/community** — Community info, directory, rules
21. **/community/units** — Unit directory
22. **/settings** — User settings (profile, language, notifications)
23. **/settings/community** — Community settings (admin only)
24. **/settings/roles** — Role management (admin only)

## Non-Goals (v1)

- No payment processing (Stripe, etc.) — fees are tracked, not collected
- No automated email sending — in-app notifications only
- No multi-building management (single community per instance)
- No smart home integration (door locks, cameras)
- No accounting features (journal entries, balance sheets)
- No chat/messaging between residents
- No mobile native app (responsive web only)
- No AI features in v1 (smart categorization, translation, etc.)
