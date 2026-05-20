# SonarQube Setup - DSO FINAL Project (Single Project)

## Quick Start

Your repository now uses **ONE SonarQube project** that analyzes both backend and frontend code together.

## Step 1: Create SonarQube Project

1. Go to https://sonarcloud.io
2. Sign in with GitHub
3. Click **"Create project"**
4. Select your GitHub organization
5. Search for and select `DSO FINAL` repository
6. Click **"Create project"**
7. Choose **"Set up project for FREE"**
8. Keep the default settings (or customize the project name)
9. Click **"Create project"**

**Note the Project Key** (usually auto-generated as something like `your-org_DSO-FINAL`). You'll need this for GitHub secrets.

## Step 2: Generate SonarQube Token

1. Go to https://sonarcloud.io → **My Account** → **Security**
2. Click **"Generate tokens"**
3. Name it: `GitHub Actions DSO FINAL`
4. Click **"Generate"**
5. **Copy the token** (you won't see it again)

## Step 3: Add GitHub Secrets

Go to your GitHub repository:
**Settings → Secrets and variables → Actions**

Add these 2 secrets:

| Secret Name | Value |
|-----------|-------|
| `SONAR_TOKEN` | Your token from Step 2 |
| `SONAR_ORGANIZATION` | Your SonarQube organization key |

That's it! You only need 2 secrets now.

## How It Works

### Root Configuration File
- Location: `sonar-project.properties` (at repository root)
- Analyzes both:
  - **Backend**: `blog-backend/src` files and `blog-backend/test` tests
  - **Frontend**: `blog-frontend/app`, `blog-frontend/components`, `blog-frontend/lib`, etc.

### CI/CD Pipeline
- Generates coverage for both backend and frontend during tests
- Runs single SonarQube scan after tests pass
- Reports all metrics to one project dashboard

### Coverage Reports
```
blog-backend/coverage/lcov.info     ← Backend coverage
blog-frontend/coverage/lcov.info    ← Frontend coverage
```

## What Gets Analyzed

✅ **Backend Source Code** (`blog-backend/src/`)
- All JavaScript files
- Code quality metrics
- Test coverage

✅ **Frontend Source Code** (`blog-frontend/app/`, `blog-frontend/components/`, etc.)
- All TypeScript/JSX files  
- Code quality metrics
- Test coverage

❌ **Excluded from Analysis**
- node_modules/
- .next/
- dist/, build/
- Test files
- Coverage files

## Pipeline Flow

```
┌─────────────────────────────────┐
│  Backend Tests + Coverage       │
└─────────────────────────────────┘
            ↓
┌─────────────────────────────────┐
│  Frontend Tests + Coverage      │
└─────────────────────────────────┘
            ↓
┌─────────────────────────────────┐
│  SonarQube Analysis             │ ← ONE project for entire repo
│  • Backend metrics              │
│  • Frontend metrics             │
│  • Combined quality report      │
└─────────────────────────────────┘
            ↓
┌─────────────────────────────────┐
│  Docker Build & Push            │
└─────────────────────────────────┘
            ↓
┌─────────────────────────────────┐
│  Deploy to Production           │
└─────────────────────────────────┘
```

## Project Structure

```
DSO FINAL/
├── sonar-project.properties          ← ROOT configuration (one project)
├── .github/
│   └── workflows/
│       └── ci-cd.yml                 ← Single SonarQube scan
├── blog-backend/
│   ├── package.json                  ← npm run test:coverage
│   ├── coverage/
│   │   └── lcov.info                 ← Analyzed by SonarQube
│   └── src/
├── blog-frontend/
│   ├── package.json                  ← pnpm test (with coverage)
│   ├── coverage/
│   │   └── lcov.info                 ← Analyzed by SonarQube
│   └── app/
```

## Viewing Results

1. After push/PR, wait for CI/CD to complete (usually ~5-10 minutes)
2. Go to SonarQube Cloud dashboard
3. Select your project → View:
   - **Code Quality**: Overall grade (A-E)
   - **Coverage**: Backend + Frontend combined coverage %
   - **Issues**: Bugs, vulnerabilities, code smells
   - **Metrics**: Lines of code, duplications, etc.

## Local Testing

### Test Backend with Coverage
```bash
cd blog-backend
npm run test:coverage
```

### Test Frontend with Coverage
```bash
cd blog-frontend
pnpm test
```

## Troubleshooting

### "Project not found"
- Double-check project key matches SonarQube exactly
- Verify SONAR_TOKEN and SONAR_ORGANIZATION secrets are set

### No coverage reported
- Ensure `npm run test:coverage` runs in CI
- Check `pnpm test` generates coverage in frontend
- Verify file paths in `sonar-project.properties`

### "Only one SonarQube project per token"
- This is expected - one project analyzes the whole repo
- One token is shared across the entire analysis

## Advantages of One Project

✅ Single dashboard for entire application
✅ Unified quality metrics
✅ Simpler secret management (only 2 secrets needed)
✅ Combined code quality trends
✅ Easier to track overall project health
