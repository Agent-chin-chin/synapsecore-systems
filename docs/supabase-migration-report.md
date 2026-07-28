# Supabase Migration Dependency Report

## Phase 1 scope: authentication and user identity

### MongoDB/Mongoose dependencies identified before migration
- Application auth entry points:
  - app/api/auth/register/route.ts
  - app/api/auth/login/route.ts
  - app/api/learner/register/route.ts
  - app/api/learner/login/route.ts
  - app/api/learner/forgot-password/route.ts
  - app/api/learner/reset-password/route.ts
  - app/api/learner/verify-email/route.ts
- Authentication services:
  - services/authService.js
  - lib/auth.js
- Database connection layer:
  - lib/mongoose.js
  - lib/config.js
- User model layer:
  - lib/models/User.js
  - lib/models/User.ts
- Supporting scripts:
  - scripts/register-admin.js
  - scripts/seed-admin.js
  - scripts/seed-admin.ts
  - scripts/seed-courses.js
  - scripts/seed-learner-courses.js

### Verification evidence
- Supabase client initialization is now implemented in lib/supabase.js and wired into services/authService.js.
- Auth regression tests passed locally with: `node --test test/authService.test.js` → 4 tests passed, 0 failed.
- Production build passed locally with: `npm run build` → Next.js production build completed successfully.
- The current workspace does not yet contain real Supabase environment variables, so live end-to-end calls against a remote project require setting:
  - SUPABASE_URL
  - SUPABASE_ANON_KEY
  - SUPABASE_SERVICE_ROLE_KEY

### Authentication architecture
```text
Next.js route handlers
  -> services/authService.js
  -> Supabase Auth (register/login/verify/reset)
  -> JWT issued by the app for session handling
  -> browser cookie/session storage
```

### Current status
- Authentication is now implemented through Supabase Auth rather than MongoDB/Mongoose.
- The remaining work is to connect the app to a real Supabase project with environment variables and to continue migrating the business data layer.

## Phase 2 scope: business data layer

### Module 1: Courses
- Migrated route handler: app/api/courses/route.ts
- Added Supabase-backed helper: lib/supabase/modules/courses.js
- Verification: `npm run build` passed after the migration.

### Module 2: Learner course listing
- Migrated route handler: app/api/learner/courses/route.ts
- Added Supabase-backed helper: lib/supabase/modules/learner-courses.js
- Verification: `npm run build` passed after the migration.

### Module 3: Enrollment
- Migrated route handler: app/api/learner/enroll/route.ts
- Added Supabase-backed helper: lib/supabase/modules/enrollments.js
- Verification: `npm run build` passed after the migration.

### Remaining MongoDB dependencies
- The app still contains many Mongoose-based routes and models for payments, bookings, notifications, admin data, and learner profile operations.
- The next phase will tackle those modules one at a time with the same verification pattern.
