# MongoDB Dependency Inventory

Generated: 2026-07-25

This document inventories every file that still references MongoDB / Mongoose and groups them by module. It identifies imports, models referenced, migration status, and a suggested migration priority. Do NOT delete files yet; this is a planning artifact.

Summary
- Total files scanned for Mongo/Mongoose references: 122 (matches from repo scan)
- Files fully migrated to Supabase: 10
- Files partially migrated: 4
- Files still using MongoDB: 108
- Estimated migration completion: ~35% (based on completed feature surface, not raw file count)

Legend
- ✅ Migrated to Supabase
- 🟡 Partially Migrated
- 🔴 Still Uses MongoDB

---

## Authentication

Files:
- lib/models/User.js — Purpose: User model schema. Imports: `mongoose`. Models used: `User`. Status: 🔴 Still Uses MongoDB. Migration priority: High
- lib/models/User.ts — Purpose: TS variant of user model. Imports: `mongoose`. Status: 🔴. Priority: High
- services/authMiddleware.js — Purpose: Protect routes using User model. Imports: `../lib/models/User`, `connectDB`. Status: 🔴. Priority: High
- app/api/learner/register/route.ts — Purpose: registration route (references Course, Payment in some flows). Imports: `Payment`, `Course`, `connectDB` per scan. Status: 🔴 (partial flows may be migrated). Priority: High
- app/api/auth/* (auth routes) — Note: core auth flows have been migrated to Supabase in `services/authService.js`, but many routes may still import `lib/models/User` — verify each route individually. Status: 🟡 Partially Migrated

## Learners

Files:
- app/api/learner/profile/route.ts — Purpose: learner profile route. Imports: `User` model and `connectDB`. Status: 🔴. Priority: High
- app/api/learner/courses/[id]/route.ts — Purpose: learner course details. Imports: `Course`, `mongoose` in some variants. Status: 🔴. Priority: High
- app/api/learner/dashboard/route.ts — Purpose: dashboard data aggregation (uses enrollments). Imports: `connectDB`. Status: 🔴. Priority: High
- app/api/learner/enrollments/route.ts — Purpose: list enrollments. Imports: `mongoose` and `Enrollment` model. Status: 🔴. Priority: High
- app/api/learner/assessments/route.ts — Purpose: learner assessments. Imports: `connectDB`. Status: 🔴. Priority: Medium
- lib/enrollment.ts — Purpose: enrollment helper that imports `connectDB`. Status: 🔴. Priority: High
- scripts/seed-learner-courses.js — Purpose: seeding learner courses. Imports: `mongoose`. Status: 🔴. Priority: Low

## Clients

Files:
- app/api/client/bookings/route.ts — Purpose: client bookings endpoint. Imports: `connectDB`, `Booking` model. Status: 🔴. Priority: Medium

## Admin

Files:
- app/api/admin/learners/* (approve/reject/suspend/unsuspend/delete-all) — Purpose: admin learner actions. Imports: `connectDB`, `User` model. Status: 🔴. Priority: High
- app/api/admin/courses/route.ts and app/api/admin/courses/[id]/route.ts — Purpose: admin course CRUD. Imports: `mongoose`, `Course`. Status: 🔴. Priority: High
- app/api/api-keys/* — Purpose: manage API keys (`ApiKey` model). Imports: `connectDB`, `ApiKey`. Status: 🔴. Priority: Medium

## Courses

Files:
- lib/models/Course.ts — Purpose: Course model. Imports: `mongoose`. Status: 🔴. Priority: High
- app/api/instructor/courses/* — Purpose: instructor course CRUD, modules, lessons. Multiple files import `mongoose` and `connectDB`. Status: 🔴. Priority: High
- app/api/courses — Note: public listing and some learner endpoints have been migrated to Supabase (`app/api/courses` and `app/api/learner/courses` marked migrated). Verify duplicates and admin/instructor variants. Status: ✅ (public listings) / 🔴 (admin/instructor)

## Modules

Files:
- app/api/instructor/courses/[id]/modules/route.ts — Purpose: module listing/management. Imports: `mongoose`, `connectDB`. Status: 🔴. Priority: High
- app/api/instructor/courses/[id]/modules/[moduleId]/lessons/route.ts — Purpose: lesson management. Imports: `mongoose`. Status: 🔴. Priority: High

## Lessons

Files:
- instructor lesson routes as above. Status: 🔴. Priority: High

## Enrollments

Files:
- lib/models/Enrollment.ts — Purpose: enrollment model schema. Imports: `mongoose`. Status: 🔴. Priority: High
- app/api/learner/enroll/route.ts — Purpose: enrollment flow — this route has been migrated to Supabase (`app/api/learner/enroll` uses `lib/supabase/modules/enrollments`). Status: ✅ (route migrated)
- app/api/learner/enrollments/route.ts — Purpose: list enrollments (uses mongoose). Status: 🔴. Priority: High

## Payments

Files:
- lib/models/Payment.js — Purpose: payment model. Imports: `mongoose`. Status: 🔴. Priority: High
- app/api/payments/route.ts — Purpose: payments API — migrated to Supabase modules and TS nullability fix applied. Status: ✅
- app/api/paystack/* (initialize, verify, webhook) — Purpose: Paystack integration. Many of these still call `connectDB` and update MongoDB payment/enrollment state. Status: 🔴. Priority: High

## Bookings

Files:
- lib/models/Booking.js — Purpose: booking model. Imports: `mongoose`. Status: 🔴. Priority: Medium
- app/api/booking/route.ts — Purpose: booking endpoint. Imports: `connectDB`, `Booking`. Status: 🔴. Priority: Medium

## Notifications

Files:
- lib/models/Notification.ts — Purpose: notification model. Imports: `mongoose`. Status: 🔴. Priority: Medium
- app/api/notifications/route.ts — Purpose: notifications endpoint. Imports: `connectDB`. Status: 🔴. Priority: Medium

## CMS

Files:
- lib/models/BlogPost.js — Purpose: CMS blog posts. Imports: `mongoose`. Status: 🔴. Priority: Low-Medium
- app/api/blog/* — check routes for `dbConnect` usage. Status: 🔴. Priority: Low-Medium

## Reports

Files:
- lib/models/CustomReport.js — Purpose: custom reports. Status: 🔴. Priority: Low
- app/api/custom-reports/route.ts — Purpose: custom reports route, imports `dbConnect`. Status: 🔴. Priority: Low

## Utilities

Files:
- lib/mongoose.js — Purpose: MongoDB connection wrapper used across many routes. Imports: `mongoose`, reads `MONGODB_URI` from env. Status: 🔴. Migration priority: Must remain until all DB-using modules removed.
- lib/enrollment.ts — Purpose: enrollment helper referencing `connectDB`. Status: 🔴. Priority: High
- lib/auth.js — Purpose: legacy auth glue that calls `connectDB`. Status: 🔴. Priority: High
- services/* (many services import models): `userService.js`, `bookingService.js`, `auditLogService.js`, `incidentService.js`, `blogService.js`, etc. Status: 🔴. Priority: varies by feature usage

## Scripts

Files:
- scripts/seed-admin.js, scripts/seed-admin.ts, scripts/seed-courses.js, scripts/seed-learner-courses.js, scripts/register-admin.js, scripts/seed-learner-courses.js, scripts/fix-user-statuses.js, scripts/query-published-courses.js — Purpose: seeds, maintenance scripts. Imports: `mongoose`. Status: 🔴 (these need migration or replacement with Supabase migration scripts). Priority: Low (operate offline)

---

## Dependency Graph (high-level)

Payments
  ↓
Enrollments
  ↓
Courses
  ↓
Lessons / Modules
  ↓
Learners

Other dependencies:
- Bookings → Learners
- Notifications → Learners
- Admin → Users, Courses, Reports
- CMS (Blog) → Admin

This indicates payments/enrollments/courses/learners form the critical spine — migrate and verify these first.

---

## Removal Plan (what can be removed and what must stay)

- Files that can be deleted only after full migration and data migration:
  - `lib/models/*` (all model files) — must remain until all services/routes that reference them are migrated and data copied to Postgres.
  - `lib/mongoose.js` — keep until all DB usage is migrated.
  - scripts/* that seed Mongo — keep until replacement migration scripts are in place.

- Files that are safe to remove after replacement is confirmed (but DO NOT remove now):
  - Route files that were fully replaced by Supabase-backed routes (e.g., where you intentionally added new `app/api/*` routes that use `lib/supabase/modules/*`) — remove originals only after verifying traffic and tests. Currently only a few public listing routes were replaced; keep old admin/instructor routes until migrated.

- Immediate removals: None. Do not delete any files at this stage.

---

## Environment Audit

MongoDB-specific env variables found in `lib/config.js` and docs:
- MONGODB_URI (production required currently)
- (JWT_SECRET remains required; may remain after migration depending on auth setup)

Supabase-specific env variables required by new code:
- SUPABASE_URL
- SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

Client-side variables (recommended if client uses Supabase directly):
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY

Which envs are no longer needed after full migration (estimates):
- MONGODB_URI — can be removed once all Mongo dependencies removed and data migrated.
- Any MongoDB-specific connection strings used in scripts (e.g., local seed scripts) — remove when those scripts are replaced.

Note: `lib/config.js` currently still enforces `MONGODB_URI` in production — update this guard after migrating or change requirement to optional until final removal.

---

## Final Summary / Counts
- Total files scanned: 122
- Files fully migrated (examples):
  - `services/authService.js` ✅
  - `lib/supabase.js` ✅
  - `lib/supabase/modules/courses.js` ✅
  - `lib/supabase/modules/learner-courses.js` ✅
  - `lib/supabase/modules/enrollments.js` ✅
  - `lib/supabase/modules/payments.js` ✅
  - `app/api/courses/route.ts` ✅
  - `app/api/learner/courses/route.ts` ✅
  - `app/api/learner/enroll/route.ts` ✅
  - `app/api/payments/route.ts` ✅
- Files partially migrated (examples): 4 (some auth routes, public vs admin variants) 🟡
- Files still using MongoDB: 108 🔴

Estimated migration percentage: ~35% (functional features migrated vs remaining scope)

Recommended migration order for remaining modules:
1. Enrollments & Payments verification (complete Phase 1.5)
2. Learners (profiles, dashboards)
3. Courses (admin + instructor flows)
4. Modules & Lessons
5. Bookings
6. Notifications
7. CMS
8. Reports & Admin utilities
9. Remove `lib/mongoose.js` and `lib/models/*`
10. Remove `mongoose` from `package.json` and cleanup scripts

---

## Next steps I can take (pick one)
- (A) Produce a fully exhaustive CSV of the 122 files with per-file extracted import lines and the first 10 lines of file (for quicker triage).
- (B) Start preparing Supabase migration scripts for `Enrollment`, `Payment`, `User`, and `Course` schemas (requires schema mapping).

---

(Inventory generated by automated repo scan; if you'd like the CSV export of every file with exact import lines, tell me and I'll write it as `MONGODB_DEPENDENCY_LIST.csv`.)
