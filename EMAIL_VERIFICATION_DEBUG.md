# Email Verification Debugging Guide

## Latest Fix Applied (July 25, 2026)

**Problem:** Learners receiving "Invalid verification code" even with correct code

**Root Cause Analysis:** Added comprehensive logging to identify exact mismatch point

### Changes Made:

1. **Removed double-normalization** in `/app/api/learner/verify-email/route.ts`
   - Route now passes raw email/code to service
   - Service handles all normalization (`trim().toLowerCase()` for email, `/\D/g` for code)

2. **Added diagnostic logging** in `services/authService.js`:
   - `registerUser()`: Logs generated code and stored code
   - `verifyUserEmail()`: Logs lookup, stored vs provided code, comparison result
   - `resendVerificationCode()`: Logs new code generation and storage

### How to Debug

**Step 1: Enable Logging**
- Logs appear in Vercel dashboard → Deployments → Function Logs
- Or in local dev: `npm run dev` and check terminal output

**Step 2: Test Flow**
```
1. POST /api/learner/register with:
   {
     "firstName": "Test",
     "lastName": "User",
     "email": "testuser@example.com",
     "phone": "+234...",
     "password": "secure123",
     "confirmPassword": "secure123",
     "learningGoal": "...",
     "country": "Nigeria",
     "termsConsent": true,
     "dataProcessingConsent": true
   }

2. Check logs for:
   [registerUser] Creating learner user: testuser@example.com, verificationCode: "XXXXXX"
   [registerUser] User saved to DB. Stored verificationCode: "XXXXXX"

3. POST /api/learner/verify-email with:
   {
     "email": "testuser@example.com",
     "code": "XXXXXX"
   }

4. Check logs for:
   [verify-email API] Raw input - email: "testuser@example.com", code: "XXXXXX"
   [verifyUserEmail] Looking up user with email: "testuser@example.com"
   [verifyUserEmail] Stored code: "XXXXXX", Provided code: "XXXXXX"
   [verifyUserEmail] After sanitization - Stored: "XXXXXX", Provided: "XXXXXX"
   [verifyUserEmail] Email verified successfully for user: ...
```

**Step 3: What to Look For**

If verification still fails, logs will show:
- `User not found` → Email case mismatch or lookup issue
- `Code mismatch` → Stored code doesn't match provided code
- `Stored code: "ABC"` vs `Provided code: "DEF"` → Character-level comparison failure

### If It Still Fails

1. **Check MongoDB:**
   ```javascript
   // In MongoDB Atlas compass or shell
   db.users.findOne({ email: "testuser@example.com" })
   // Look for: verificationCode, emailVerified fields
   ```

2. **Check Email Content:**
   - Verify the code in the email matches what was generated
   - Look for extra spaces, formatting issues in email template

3. **Check Network:**
   - Ensure the code isn't being altered in transit
   - Test with simple 6-digit code first (no special chars)

### Code References

**Normalize Function:**
```javascript
function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase();
}
```

**Sanitize Function:**
```javascript
function sanitizeVerificationCode(code) {
  return String(code || '').replace(/\D/g, '').trim();
}
```

Both are idempotent (can be called multiple times safely).

### Testing Locally

```bash
# Terminal 1: Run dev server
npm run dev

# Terminal 2: Test registration
curl -X POST http://localhost:3000/api/learner/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@local.com",
    "phone": "+1234567890",
    "password": "test123456",
    "confirmPassword": "test123456",
    "learningGoal": "Learn security",
    "country": "US",
    "termsConsent": true,
    "dataProcessingConsent": true
  }'

# Watch Terminal 1 for logs showing generated code
# e.g. [registerUser] Creating learner user: test@local.com, verificationCode: "123456"

# Terminal 2: Test verification
curl -X POST http://localhost:3000/api/learner/verify-email \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@local.com",
    "code": "123456"
  }'

# Watch Terminal 1 for verification logs
```

### Production Debugging

**Vercel Logs:**
1. Go to https://vercel.com/[project]/deployments
2. Click latest deployment
3. → Function Logs
4. Filter by endpoint: `/api/learner/verify-email` or `/api/learner/register`

**Real-time Monitoring:**
- Set up Sentry integration for error tracking
- Or use `console.log` logs piped to external logging service

---

**Build Status:** ✅ Production build in progress (TypeScript check running)  
**Expected Outcome:** Email verification should work with detailed logging to identify any remaining issues
