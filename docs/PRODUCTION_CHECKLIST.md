# SynapseCore Production Readiness Checklist

## Environment & Configuration
- [ ] Validate required environment variables at startup
- [ ] Use central config module in `lib/config.js`
- [ ] Store only non-sensitive defaults in `.env.example`

## Logging & Monitoring
- [ ] Use Winston with separate `error`, `warn`, and `combined` logs
- [ ] Add request logging helper for API routes
- [ ] Keep audit logs for incident lifecycle actions

## Security Hardening
- [ ] Enforce secure request headers via Next.js `headers()` configuration
- [ ] Use httpOnly, secure, sameSite cookies for auth
- [ ] Apply CSRF token generation helpers for future form/API protections
- [ ] Add rate limiting for sensitive login and upload endpoints

## File Upload Production Upgrade
- [ ] Replace mock upload route with AWS S3 backend support
- [ ] Validate upload MIME types and maximum file size
- [ ] Return upload metadata together with file URL

## Email Infrastructure
- [ ] Switch from Ethereal demo SMTP to environment-driven SMTP transport
- [ ] Provide reusable production-ready email templates
- [ ] Add queue placeholder infrastructure for future notification delivery

## Background Jobs Foundation
- [ ] Establish a queue API shape for future background processing
- [ ] Keep job structure separate from request handlers

## Deployment Preparation
- [ ] Optimize `next.config.js` security and remote image sources
- [ ] Keep production logs out of `.gitignore` and ensure log folder exists
- [ ] Add deployment checklist documentation

## Error Recovery
- [ ] Ensure API failures return sanitized error responses
- [ ] Preserve `reactStrictMode` for frontend validation
- [ ] Use retry-safe upload and submit flows where possible
