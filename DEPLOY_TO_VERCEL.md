# Deploy Pre-Launch to Vercel (main)

This document explains how to deploy the current project to Vercel's `main` (production) environment with the Pre-Launch mode enabled.

Prerequisites:
- You have a Vercel account and the project is connected to this repository, or you can use the Vercel CLI.
- Optionally: a Vercel Personal Access Token if you want to run non-interactive CLI deploys.

Recommended approach (CI / Git integration):
1. In the Vercel dashboard, go to your project > Settings > Environment Variables.
2. Add `PRE_LAUNCH_MODE` with value `true` for the `Production` environment (or set via `vercel env add`).
3. Push changes to the `main` branch (or create a PR and merge). Vercel will automatically build and deploy.

Manual CLI deploy (interactive):

```bash
# install Vercel CLI if needed
npm i -g vercel
# login (interactive)
vercel login
# link the project (interactive) - run once
vercel link
# deploy to production
vercel --prod
```

Non-interactive CLI deploy (CI):

```bash
# set VEREL_TOKEN in CI
npx vercel --prod --token $VERCEL_TOKEN --confirm
```

Notes:
- `vercel.json` in the repo already sets `PRE_LAUNCH_MODE=true` for builds, but it's recommended to set environment variables in the Vercel dashboard for security and control.
- To disable the pre-launch page after launch, set `PRE_LAUNCH_MODE=false` in the Vercel dashboard (Production) and redeploy.

Validation checklist after deploy:
- Public pages should show the pre-launch countdown.
- `/admin/*`, `/client/*`, `/learner/*`, `/api/*`, `/dashboard/*` remain fully functional.
- If you need me to run the CLI deploy from this environment, provide a Vercel token or confirm you want an interactive login from the terminal and I'll run `vercel --prod` for you.
