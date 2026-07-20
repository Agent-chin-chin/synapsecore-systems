# Production Deployment Guide — SynapseCore Academy

Target domain: **https://synapsecoresystems.com**

## 1. Platform & DNS

Recommended: deploy on **Vercel** (zero-config Next.js).

1. Push the repo to GitHub and import it into Vercel.
2. In your DNS provider for `synapsecoresystems.com`, add:
   - `CNAME` `synapsecoresystems.com` → `cname.vercel-dns.com` (or use Vercel's A record `76.76.21.21`)
   - `CNAME` `www.synapsecoresystems.com` → `cname.vercel-dns.com`
3. In Vercel → Project → Domains, add `synapsecoresystems.com` and `www.synapsecoresystems.com`. Vercel provisions **automatic HTTPS** (Let's Encrypt, auto-renew). Redirect `www` → apex.

> Alternative: any host that runs Node 18+ (Railway, Render, a VPS with Nginx + Certbot). Ensure HTTPS is terminated and HTTP redirects to HTTPS.

## 2. Environment Variables (Production)

Set these in Vercel → Project → Settings → Environment Variables (Production):

| Key | Value | Notes |
|-----|-------|-------|
| `NODE_ENV` | `production` | |
| `MONGODB_URI` | `mongodb+srv://...` | Use a **production** Atlas cluster, not localhost |
| `JWT_SECRET` | random 64-char hex | Generate: `openssl rand -hex 32` |
| `NEXTAUTH_URL` | `https://synapsecoresystems.com` | Used as Paystack callback base URL |
| `NEXTAUTH_SECRET` | random 64-char hex | |
| `SMTP_HOST` | e.g. `smtp.gmail.com` | Required in production per `lib/config.js` |
| `SMTP_PORT` | `587` | |
| `SMTP_USER` | `synapsecoresystems@gmail.com` | |
| `SMTP_PASSWORD` | app password | |
| `EMAIL_FROM` | `"SynapseCore Systems" <synapsecoresystems@gmail.com>` | |
| `PAYSTACK_SECRET_KEY` | `sk_live_...` | Required server-side for Paystack initialization and webhook verification |
| `PAYSTACK_PUBLIC_KEY` | leave empty | Not used by the current implementation because checkout is initialized from server API routes |
| `PAYSTACK_WEBHOOK_SECRET` | webhook secret | Required if your Paystack dashboard uses a separate webhook secret |
| `AWS_S3_BUCKET` + `AWS_S3_REGION` | (if using S3 uploads) | Required by `lib/config.js` in production |

> The app reads `.env` (not `.env.local`) in production — Vercel injects these directly, so no file needed.

## 3. Pre-launch checklist

- [ ] Production MongoDB cluster reachable from the deployment
- [ ] `npm run build` passes with no errors
- [ ] All env vars set and secrets rotated
- [ ] Domain + HTTPS active, redirect `www` → apex
- [ ] Paystack Live keys set; webhook URL registered (see `docs/paystack-setup.md`)
- [ ] Compliance pages linked in footer (Privacy, Terms, Refund, Contact, About)
- [ ] Admin account created and verified (role `admin`)

## 4. Health check

After deploy, verify:
- `https://synapsecoresystems.com/learner/courses` loads (public catalog)
- `https://synapsecoresystems.com/admin` redirects to login when unauthenticated
- `https://synapsecoresystems.com/api/paystack/webhook` returns `401` without a signature (proves guard works)
