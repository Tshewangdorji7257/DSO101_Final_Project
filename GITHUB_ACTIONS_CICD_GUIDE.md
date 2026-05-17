# GitHub Actions CI/CD Guide

This project now has a GitHub Actions pipeline that does four things:

1. Runs backend smoke tests.
2. Builds the frontend.
3. Builds and pushes both Docker images to Docker Hub.
4. Optionally triggers separate Render deploy hooks for backend and frontend.

## What Was Added

- [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml)
- [`blog-backend/test/smoke.test.js`](blog-backend/test/smoke.test.js)
- [`docker-compose.prod.yml`](docker-compose.prod.yml)

## Required GitHub Secrets

Add these in your repository settings under Settings > Secrets and variables > Actions:

- `DOCKERHUB_USERNAME` - Your Docker Hub username.
- `DOCKERHUB_TOKEN` - Docker Hub access token or password.
- `ENABLE_DEPLOY` - Set to `true` to enable the deploy job.
- `RENDER_BACKEND_DEPLOY_HOOK_URL` - The Render deploy hook URL for the backend service.
- `RENDER_FRONTEND_DEPLOY_HOOK_URL` - The Render deploy hook URL for the frontend service.
- `JWT_SECRET` - Production JWT secret for the backend.
- `FRONTEND_URL` - Public frontend URL, for example `https://your-site.example.com`.
- `NEXT_PUBLIC_API_URL` - Public backend API URL, for example `https://api.example.com/api`.

If you only want CI and image publishing, you can leave the two Render hook secrets unset and keep `ENABLE_DEPLOY` unset or `false`.
## Exact Secret Values To Paste

Use this checklist when filling GitHub Secrets:

1. `DOCKERHUB_USERNAME`
   - Paste your Docker Hub account name.
   - Example: `johnsmith`.

2. `DOCKERHUB_TOKEN`
   - Paste a Docker Hub access token.
   - You can also use your Docker Hub password, but a token is safer.

3. `ENABLE_DEPLOY`
   - Paste `true` if you want GitHub Actions to call the Render hooks after push.
   - Leave it empty or set `false` if you only want test and build.

4. `RENDER_BACKEND_DEPLOY_HOOK_URL`
   - Paste the backend service deploy hook URL copied from Render.
   - This is the URL from the backend Render service only.

5. `RENDER_FRONTEND_DEPLOY_HOOK_URL`
   - Paste the frontend service deploy hook URL copied from Render.
   - This is the URL from the frontend Render service only.

6. `JWT_SECRET`
   - Paste a long random secret string for your backend JWT signing key.
   - Example format: `my-super-long-random-secret-string`.

7. `FRONTEND_URL`
   - Paste the public URL where your frontend is hosted on Render.
   - Example: `https://your-frontend-service.onrender.com`.

8. `NEXT_PUBLIC_API_URL`
   - Paste the public backend API URL.
   - Example: `https://your-backend-service.onrender.com/api`.
## How To Add The Render Secret In GitHub

1. Open your repository on GitHub.
2. Click **Settings**.
3. In the left sidebar, click **Secrets and variables**.
4. Click **Actions**.
5. Click **New repository secret**.
6. For the name, enter `RENDER_BACKEND_DEPLOY_HOOK_URL`.
7. For the value, paste the deploy hook URL for the backend service from Render.
8. Click **Add secret**.
9. Click **New repository secret** again.
10. For the name, enter `RENDER_FRONTEND_DEPLOY_HOOK_URL`.
11. For the value, paste the deploy hook URL for the frontend service from Render.
12. Click **Add secret**.

Those two secrets are what the workflow uses when it runs the final deploy steps.

## Local Validation

Before pushing, these are the same commands the workflow uses:

```bash
cd blog-backend
npm ci
npm test

cd ../blog-frontend
pnpm install --frozen-lockfile
pnpm build
```

## Docker Hub Setup

1. Create two Docker Hub repositories:
   - `blog-backend`
   - `blog-frontend`
2. Make them public, or keep them private and log in on the server before pulling.
3. Push to `main` after secrets are configured.

The workflow tags each image with:

- `latest`
- the commit SHA

## Server Setup For Deployment

This workflow expects two Render services, each with its own deploy hook already created.

1. In Render, open your backend web service.
2. Go to **Settings**.
3. Find **Deploy Hook** or **Deploy Hooks**.
4. Create a new hook and copy the URL.
5. Save that URL as the `RENDER_BACKEND_DEPLOY_HOOK_URL` GitHub secret.

6. Open your frontend web service.
7. Go to **Settings**.
8. Find **Deploy Hook** or **Deploy Hooks**.
9. Create a new hook and copy the URL.
10. Save that URL as the `RENDER_FRONTEND_DEPLOY_HOOK_URL` GitHub secret.

If your Render services are connected to Docker Hub images, make sure each one is already configured to use the image tags you push, usually `latest` or the commit SHA.

When GitHub Actions runs the deploy job, it will:

1. Finish the tests and image build.
2. POST to the backend Render hook.
3. POST to the frontend Render hook.
4. Render will start new deploys for both services.

## How The Workflow Runs

- Pull request to `main`:
  - backend smoke tests
  - frontend build
- Push to `main`:
  - backend smoke tests
  - frontend build
  - Docker image build and push
  - backend and frontend Render deploy hooks if `ENABLE_DEPLOY=true`

## Deploy File Layout

The production compose file uses image references instead of local builds:

- backend image: `${DOCKERHUB_USERNAME}/blog-backend`
- frontend image: `${DOCKERHUB_USERNAME}/blog-frontend`

It also keeps the SQLite database in a named Docker volume so it survives restarts, if you use the compose file locally.

For Render, the hook is the deployment trigger and you usually do not run the compose file directly in production.

## Recommended First Push

1. Add the secrets.
2. Push a small change to `main`.
3. Check Actions for the backend test and frontend build.
4. Confirm Docker Hub received both images.
5. Turn on `ENABLE_DEPLOY` only after the server is ready.

## Troubleshooting

- If the backend test fails, inspect `blog-backend/test/smoke.test.js` first.
- If the frontend build fails, run `pnpm build` locally in `blog-frontend`.
- If Docker push fails, confirm `DOCKERHUB_USERNAME` and `DOCKERHUB_TOKEN`.
- If deploy fails, verify both Render hook URLs and confirm both services exist in the Render dashboard.