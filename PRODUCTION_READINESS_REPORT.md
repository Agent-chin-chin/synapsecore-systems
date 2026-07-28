# SynapseCore Systems – Production Readiness Report

## Executive Summary

Version 2 is now buildable and serves locally, but it is not yet fully production-ready. The app has reached a solid staging/RC baseline, yet the Supabase migration remains incomplete and authentication/data-path validation still shows blockers that must be resolved before a production go-live decision.

## Infrastructure

- Build: Pass
  - Verified with `npx next build`
  - Result: successful production compile, TypeScript completion, and route generation for 158/158 routes
- Runtime: Pass
  - Verified by starting the local dev server and requesting the main routes
  - Result: `/`, `/login`, `/learner/login`, and `/admin/login` all returned HTTP 200
- Deployment: Partial
  - The app is buildable and deployable from a packaging perspective, but production behavior is not yet fully validated
- Domain: Partial
  - The app is configured for local and production environment variables, but no live production smoke test was completed in this session
- SSL: Partial
  - No production TLS/domain verification was executed during this session

## Authentication

- Status: Partial
- Evidence:
  - The learner registration route now responds successfully and returns an explicit application-level message when Supabase returns `over_email_send_rate_limit`.
  - The application correctly handles invalid login attempts and returns standard `401 Unauthorized` responses for bad credentials.
  - No valid existing Supabase auth test account was available in the current local environment, so successful login/session persistence could not be confirmed in this session.
  - The current `.env.local` contains `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` but does not include `SUPABASE_SERVICE_ROLE_KEY`, limiting admin-side Supabase verification.
- Result:
  - The application is behaving correctly for auth route error handling.
  - External provider-side email limits are the current blocker for completing registration testing.
  - End-to-end login/logout/session verification remains pending until a valid Supabase user is available and email delivery is stabilized.

## Database

- Status: Fail
- Evidence:
  - The codebase still contains many MongoDB/Mongoose-backed routes and models such as [lib/mongoose.js](lib/mongoose.js) and the legacy route files under [app/api](app/api)
  - Supabase-backed modules exist for some areas such as courses, enrollments, payments, and auth, but their integration is not yet complete across the full platform
- Result:
  - Production data paths are not yet fully validated for insert/update/delete/read, RLS, foreign-key relationships, enrollment flow, or payment flow

## Payments

- Status: Partial / Not fully verified
- Evidence:
  - Supabase payment modules exist and are wired into [app/api/payments/route.ts](app/api/payments/route.ts)
  - However, the broader payment flow was not fully validated end to end in this session
- Result:
  - Payment flow is not yet production-validated

## Public Website

- Status: Pass
- Evidence:
  - Homepage and public routes responded successfully in the local runtime

## Learner Portal

- Status: Partial
- Evidence:
  - The learner entry route responded successfully
  - Learner auth flow is not yet fully verified

## Admin Portal

- Status: Partial
- Evidence:
  - The admin login route responded successfully
  - Admin auth behavior remains unverified beyond route availability

## Client Portal

- Status: Partial
- Evidence:
  - The client route surface is present and the app serves it, but the behavior was not fully validated end to end

## Remaining MongoDB Dependencies

| File | Reason | Migration status | Removal recommendation |
| --- | --- | --- | --- |
| [lib/mongoose.js](lib/mongoose.js) | Legacy MongoDB connector used by many routes | Not migrated | Keep for now until route-by-route replacement is complete |
| [app/api/admin/learners/route.ts](app/api/admin/learners/route.ts) | Admin learner management still uses MongoDB | Not migrated | Replace with Supabase-backed admin service |
| [app/api/admin/courses/route.ts](app/api/admin/courses/route.ts) | Admin course management still uses MongoDB | Not migrated | Replace with Supabase-backed course service |
| [app/api/learner/dashboard/route.ts](app/api/learner/dashboard/route.ts) | Learner dashboard data path still uses MongoDB | Not migrated | Replace with Supabase-backed dashboard service |
| [app/api/paystack/verify/route.ts](app/api/paystack/verify/route.ts) | Payment verification still depends on MongoDB persistence | Not migrated | Replace or isolate pending full payment migration |
| [app/api/support/route.ts](app/api/support/route.ts) | Support tickets still rely on MongoDB models | Not migrated | Replace with Supabase-backed support storage |
| [app/api/users/route.ts](app/api/users/route.ts) | User CRUD remains MongoDB-backed | Not migrated | Replace with Supabase auth/user storage integration |
| [app/api/notifications/route.ts](app/api/notifications/route.ts) | Notification data path still uses MongoDB | Not migrated | Replace with Supabase-backed notifications |
| [app/api/reports/route.ts](app/api/reports/route.ts) | Reports route still uses MongoDB | Not migrated | Replace with Supabase-backed reporting |
| [app/api/bookings/route.ts](app/api/booking/route.ts) | Booking flow remains legacy-backed | Not migrated | Replace with Supabase-backed booking storage |

## Release Readiness

- Overall completion percentage: 70%
- Remaining blockers:
  - Confirm Supabase email confirmation and SMTP provider settings in the dashboard
  - Resolve Supabase email delivery rate limits or configure a dedicated SMTP provider for auth emails
  - Add `SUPABASE_SERVICE_ROLE_KEY` to the local/test environment for admin-side Supabase user management and verification flows
  - Replace or isolate remaining MongoDB-backed API routes
  - Validate end-to-end enrollment/payment flows
  - Finish middleware modernization and remove deprecated middleware usage where appropriate
  - Complete production-level auth, data, and access-control testing
- Recommended deployment decision: No-Go for production release until the remaining auth/data-path blockers are cleared and the core user journeys are validated end to end

## Application issues

- The application currently handles Supabase auth errors correctly and returns meaningful responses during registration and login failures.
- The auth middleware protects API routes using JWT cookies and returns `401 Unauthorized` when no valid session exists.
- `SUPABASE_SERVICE_ROLE_KEY` is missing in the local environment, which limits admin-level Supabase operations and full verification.

## External provider limitations (Supabase)

- Supabase auth sign-up is currently blocked by `over_email_send_rate_limit` in the current environment.
- This is an external provider-side limitation, not an application bug.
- The local `.env.local` is configured for Gmail SMTP for application-generated emails, but Supabase auth confirmation emails still rely on the Supabase email provider unless changed in the dashboard.
- If using default Supabase email delivery, it is more likely to hit rate limits during development and staging.

## Production blockers

- Configure a reliable SMTP provider or confirm Supabase email settings before launch.
- Verify whether Supabase "Confirm email" is enabled, and adjust the app flow or dashboard settings accordingly.
- Obtain valid Supabase auth credentials for a real user account and verify login, logout, session persistence, and protected routes end to end.
- Validate the full learner registration + verification flow once email sending is stable.
