# Paystack Production Setup

## 1. Configuration model

This application does not initialize Paystack directly from a browser component. Instead:

- The learner clicks a button in [app/learner/courses/[id]/page.tsx](app/learner/courses/[id]/page.tsx)
- The client calls [app/api/paystack/initialize/route.ts](app/api/paystack/initialize/route.ts)
- The server route calls [lib/paystack.js](lib/paystack.js)
- The server uses `PAYSTACK_SECRET_KEY` to create the Paystack transaction and verify webhook signatures

Because the public key is not read in browser code, `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is not required for the current implementation.

## 2. Callback & Webhook URLs (already coded)

- **Callback (return) URL**: `https://synapsecoresystems.com/api/paystack/verify`
  - Built in `lib/paystack.js` from `NEXTAUTH_URL` + `/api/paystack/verify?reference=...`
- **Webhook URL**: `https://synapsecoresystems.com/api/paystack/webhook`
  - Register in Paystack Dashboard → Settings → API Keys & Webhooks → Webhook URL

## 3. Signature verification (already implemented)

`app/api/paystack/webhook/route.ts`:
- Reads raw body via `await request.text()` (required — HMAC must match Paystack's exact bytes)
- Computes `HMAC-SHA512` with `PAYSTACK_WEBHOOK_SECRET`
- Compared with `x-paystack-signature` header using `crypto.timingSafeEqual` (constant-time)
- Returns `401` on mismatch → Paystack will retry, not mark as delivered

Verified correct against Paystack's documented scheme.

## 4. Test Mode flow (do this BEFORE switching to Live)

Use **Test Mode** keys (`sk_test_...`) first.

1. In Paystack Dashboard, ensure you are in **Test Mode** (toggle top-right).
2. Set `.env.local` (or Vercel preview env) with `sk_test_...` / `pk_test_...` / test webhook secret.
3. Register the webhook URL pointing to your **preview** deployment (or `ngrok` to localhost:3000).
4. Run the end-to-end test in `PRODUCTION_READINESS.md` → "Learner Journey".
5. Use Paystack test cards:
   - Success: `5123 4567 8901 2346`, any future expiry, any CVV, OTP `123456`
   - Failed: `5123 4567 8901 0002`
6. After a successful test payment, confirm in Mongo:
   - `payments` doc `status: "completed"`
   - `enrollments` doc exists for learner+course (exactly one, even after webhook retries)
   - learner `learnerProfile.enrolledCourses` contains the course
   - `course.enrollmentCount` incremented by exactly 1

## 5. Switch to Live

1. In Paystack Dashboard, switch to **Live Mode**.
2. Replace keys with `sk_live_...` / `pk_live_...` and the live webhook secret.
3. Register the live webhook URL `https://synapsecoresystems.com/api/paystack/webhook`.
4. Re-run the test flow once with a small real charge, then refund it.

## 6. Idempotency (already guaranteed)

- `payment.transactionId` = Paystack `reference` (unique index) → no duplicate payments.
- `createEnrollmentForPayment` uses an atomic `findOneAndUpdate(upsert)` with a unique
  `{ learnerId, courseId }` index → no duplicate enrollments on webhook retry/race.
- `enrollmentCount` increments only on a genuine new enrollment (`lastErrorObject.upserted`).
