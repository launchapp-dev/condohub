@AGENTS.md

# CondoHub — Coding Agent Guide

## What Is This?

A SaaS condominium management platform. Communities sign up, manage visitors, handle maintenance requests, book amenities, and communicate — all in multiple languages. Built as an open-source showcase of what AO (Agent Orchestrator) can autonomously build.

## Tech Stack

- **Next.js 15** — App Router, TypeScript, `src/` directory
- **@launchapp/design-system** — shadcn registry with Radix UI primitives and `--la-*` CSS tokens
- **Tailwind CSS v4** — Styling
- **i18n**: next-intl — routing, messages, formatting, pluralization
- **Auth**: Better Auth — email/password signup/login, session management, role-based access
- **Database**: SQLite + Drizzle ORM — multi-tenant per community
- **Forms**: React Hook Form + Zod
- **Icons**: Lucide React
- **Notifications**: Sonner (toast)
- **QR codes**: qrcode — visitor pass generation
- **Date handling**: date-fns with locale support

## Design System — shadcn Registry

Components are installed from our shadcn registry into `src/components/ui/`. **Do NOT install @launchapp/design-system as an npm package.** Use the shadcn CLI:

### Install components
```bash
npx shadcn@latest add --registry https://launchapp-dev.github.io/design-system/registry.json button
npx shadcn@latest add --registry https://launchapp-dev.github.io/design-system/registry.json button input label card badge separator
```

### Import installed components
```tsx
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
```

### CSS tokens
All design tokens use the `--la-` prefix (e.g., `--la-primary`, `--la-background`). These are defined in globals.css. Available component slugs (lowercase, hyphenated): accordion, alert, alert-dialog, badge, button, card, checkbox, combobox, command, context-menu, dialog, dropdown-menu, form, hover-card, input, label, menubar, navigation-menu, popover, radio-group, scroll-area, select, separator, sheet, skeleton, slider, switch, table, tabs, textarea, toast, toggle, tooltip, and many more.

## Internationalization (i18n)

- All user-facing strings must use next-intl's `useTranslations` hook or `getTranslations` for server components
- Message files live in `src/messages/{locale}.json` (e.g., `en.json`, `es.json`, `pt.json`, `fr.json`, `ar.json`, `zh.json`, `ja.json`, `ko.json`)
- Date, time, and number formatting via `useFormatter` from next-intl
- RTL support for Arabic via `dir="rtl"` on the html element
- Never hardcode user-facing strings — always use translation keys
- Locale routing via next-intl middleware (`/en/dashboard`, `/es/dashboard`, etc.)

## Project Structure

```
src/
  app/
    [locale]/
      layout.tsx              — Locale-aware root layout
      page.tsx                — Landing page (unauthenticated)
      (auth)/
        login/page.tsx        — Login page
        signup/page.tsx       — Signup page
      dashboard/
        page.tsx              — Role-based dashboard
      visitors/
        page.tsx              — Visitor list
        register/page.tsx     — Register visitor
        [id]/page.tsx         — Visitor detail
        security/page.tsx     — Security gate view
      announcements/
        page.tsx              — Announcement feed
        new/page.tsx          — Create announcement
        [id]/page.tsx         — Announcement detail
      maintenance/
        page.tsx              — Maintenance requests
        new/page.tsx          — Submit request
        [id]/page.tsx         — Request detail
      amenities/
        page.tsx              — Amenity list + calendar
        [id]/book/page.tsx    — Book amenity
      finances/
        page.tsx              — Financial overview
      documents/
        page.tsx              — Document repository
      community/
        page.tsx              — Community info
        units/page.tsx        — Unit directory
      settings/
        page.tsx              — User settings
        community/page.tsx    — Community settings (admin)
        roles/page.tsx        — Role management (admin)
    globals.css               — Global styles + --la-* design tokens
  components/
    ui/                       — shadcn registry components (installed via CLI)
    ...                       — Feature components
  lib/
    utils.ts                  — cn() utility (installed by shadcn)
    auth.ts                   — Auth configuration
    ...
  db/
    schema.ts                 — Drizzle schema
    migrations/               — SQL migrations
  messages/
    en.json                   — English translations
    es.json                   — Spanish translations
    pt.json                   — Portuguese translations
    fr.json                   — French translations
    ar.json                   — Arabic translations
    zh.json                   — Chinese (Simplified) translations
    ja.json                   — Japanese translations
    ko.json                   — Korean translations
  types/
    ...                       — TypeScript types
```

## Build & Test

```bash
pnpm install
pnpm dev          # Development server on :3000
pnpm build        # Production build
pnpm lint         # ESLint
pnpm db:push      # Push schema to database
pnpm db:migrate   # Run migrations
```

## Working Rules

- Install UI components from the design system registry — never build custom buttons, inputs, cards, etc.
- Import UI components from `@/components/ui/<component>` (NOT from @launchapp/design-system)
- To add a new design system component, run: `npx shadcn@latest add --registry https://launchapp-dev.github.io/design-system/registry.json <component-name>`
- All user-facing strings must go through next-intl — never hardcode text
- All form state goes through React Hook Form with Zod schemas
- Date/time formatting via next-intl's `useFormatter` or date-fns with locale
- Currency formatting via Intl.NumberFormat
- Auth-protected routes use middleware or server-side session checks
- Role-based access: check user role before rendering admin/security features
- All CRUD goes through server actions or API routes backed by Drizzle
- File naming: kebab-case for files, PascalCase for components
- Imports use `@/*` alias (maps to `src/`)
- Do not add yourself as author or co-author in commits
- Do not add comments unless the logic is non-obvious
