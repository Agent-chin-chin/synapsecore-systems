This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Email verification (Gmail / real SMTP)

This project uses `nodemailer` via `lib/email.js`. By default in development the code will attempt to use Ethereal (a test SMTP service) if `SMTP_*` env vars are not configured. To send real verification emails using Gmail:

1. Enable 2-Step Verification for the Gmail account you want to send from.
2. Create an App Password (Mail) and copy the generated password.
3. Create a `.env.local` from `.env.local.example` and set the following values:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=youremail@gmail.com
SMTP_PASSWORD=your_app_password_here
EMAIL_FROM="Your App" <noreply@yourdomain.com>
```

4. Restart the dev server (`npm run dev`). Verification emails (registration and resend) will now be sent through Gmail.

Security note: Use app passwords or a secure SMTP provider in production; never commit real credentials to source control.

## SMS and Seed Setup

This project supports optional SMS delivery via Twilio for learner verification and password reset reminders. Add the following values to your `.env.local` after copying from `.env.local.example`:

```bash
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_FROM_NUMBER=+1234567890
```

To seed the learner course catalog, run:

```bash
npm run seed:courses
```

The seed script requires a valid `MONGODB_URI` setting in `.env.local` before it can connect to the database.
