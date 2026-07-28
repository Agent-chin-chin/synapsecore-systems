# Version 2 Go-Live Checklist

## 1. Authentication
- [!] Learner registration route is functional and now returns a meaningful error when Supabase email delivery is rate-limited. End-to-end registration is currently blocked by Supabase `over_email_send_rate_limit` rather than an application bug.
- [ ] Learner login route responds correctly, but no valid Supabase test account was available in the current environment for a successful login verification.
- [ ] Admin login route endpoint is available; not yet verified with a valid admin account.
- [ ] Client login route endpoint is available; not yet verified with a valid client account.
- [ ] Logout route clears the `token` cookie on request.
- [ ] Password reset route exists; full flow not yet validated end to end.
- [ ] Email verification route exists; full flow not yet validated end to end.
- [ ] Protected routes are guarded by JWT cookie auth in code; end-to-end protected-route access is pending successful login validation.

## 2. Supabase data layer
- [ ] No authentication flow depends on MongoDB
- [ ] Learner dashboard reads from Supabase
- [ ] Enrollment writes and reads through Supabase
- [ ] Payments read/write through Supabase
- [ ] RLS and access rules are validated

## 3. Payments and enrollments
- [ ] Payment initialization works
- [ ] Payment verification succeeds
- [ ] Enrollment is created after successful payment
- [ ] Duplicate payment/enrollment attempts are handled safely

## 4. Portals
- [ ] Learner portal loads and shows the correct data
- [ ] Admin portal loads and shows the correct data
- [ ] Client portal loads and shows the correct data

## 5. Production smoke tests
- [ ] Production build succeeds
- [ ] Production deployment succeeds
- [ ] Public pages render correctly
- [ ] Authenticated pages render correctly
- [ ] Critical API routes return expected responses

## 6. Release decision
- [ ] Authentication: PASS
- [ ] Supabase: PASS
- [ ] Payments: PASS
- [ ] Enrollments: PASS
- [ ] Learner Portal: PASS
- [ ] Admin Portal: PASS
- [ ] Client Portal: PASS
- [ ] Production Build: PASS
- [ ] Production Deploy: PASS

Decision: GO / NO-GO
