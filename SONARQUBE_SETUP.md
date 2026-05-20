# SonarQube Integration Setup Guide

This guide explains how to set up SonarQube Cloud for code quality analysis in your CI/CD pipeline.

## Overview

The CI/CD pipeline now includes **SonarQube Code Quality Analysis** for both backend and frontend applications. This step analyzes your code for:

- Code smells
- Bugs and vulnerabilities
- Code coverage metrics
- Technical debt

## Prerequisites

1. **GitHub Repository**: Already set up
2. **SonarQube Cloud Account**: [Create one at sonarsource.com](https://sonarcloud.io)

## Step-by-Step Setup

### 1. Create SonarQube Cloud Account

1. Go to https://sonarcloud.io
2. Sign up with your GitHub account
3. Authorize SonarQube Cloud to access your GitHub repositories

### 2. Create Projects in SonarQube

#### Backend Project
1. In SonarQube Cloud, click **"Create project"**
2. Select your GitHub organization
3. Search for and select your repository
4. Name it: **blog-backend**
5. Note the **Project Key** (e.g., `your-org_blog-backend`)

#### Frontend Project
1. Repeat the process for **blog-frontend**
2. Note the **Project Key** (e.g., `your-org_blog-frontend`)

### 3. Generate SonarQube Token

1. Go to **My Account → Security → Generate tokens**
2. Create a token named "GitHub Actions"
3. Copy the token value

### 4. Add GitHub Secrets

Go to your GitHub repository settings: **Settings → Secrets and variables → Actions**

Add these secrets:

| Secret Name | Value |
|-----------|-------|
| `SONAR_TOKEN` | Your SonarQube token from Step 3 |
| `SONAR_ORGANIZATION` | Your SonarQube organization key |
| `SONAR_PROJECT_KEY_BACKEND` | Backend project key from Step 2 |
| `SONAR_PROJECT_KEY_FRONTEND` | Frontend project key from Step 2 |

### 5. Verify Setup

The SonarQube analysis will automatically run on:
- **Push to main branch** (after tests pass)
- **Pull requests** (for code review)

## Pipeline Flow

```
┌─────────────────────────────┐
│  Backend Test & Build       │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│  Frontend Test & Build      │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│ SonarQube Analysis          │ ← NEW STEP
│  • Backend coverage         │
│  • Frontend coverage        │
│  • Quality metrics          │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│  Docker Build & Push        │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│  Deploy to Production       │
└─────────────────────────────┘
```

## Coverage Reports

### Backend

The backend now generates coverage reports using Node.js built-in coverage:

```bash
npm run test:coverage
```

Coverage is output to `blog-backend/coverage/lcov.info`

### Frontend

The frontend uses Jest to generate coverage reports:

```bash
pnpm test
```

Coverage is output to `blog-frontend/coverage/lcov.info`

## Local Testing

### Test Backend Coverage Locally

```bash
cd blog-backend
npm run test:coverage
```

### Test Frontend Coverage Locally

```bash
cd blog-frontend
pnpm test
```

## Viewing Results

1. Go to your SonarQube Cloud dashboard
2. Select your organization and project
3. View quality metrics, coverage, and code issues

## CI/CD Configuration Files Updated

- **`.github/workflows/ci-cd.yml`** - Added SonarQube analysis job
- **`blog-backend/package.json`** - Added `test:coverage` script
- **`blog-backend/sonar-project.properties`** - Added coverage path
- **`blog-frontend/jest.config.js`** - Added coverage reporters
- **`blog-frontend/package.json`** - Updated test script for coverage
- **`blog-frontend/sonar-project.properties`** - Added coverage path

## Troubleshooting

### "SONAR_TOKEN not found"
- Verify the secret is added to GitHub repository settings
- Check the secret name matches exactly: `SONAR_TOKEN`

### "Project not found"
- Verify project keys match exactly what's in SonarQube Cloud
- Ensure `sonar-project.properties` files have matching `sonar.projectKey`

### Coverage reports not detected
- Run tests locally to verify coverage files are generated
- Check file paths in `sonar-project.properties` match actual output locations

## Next Steps

1. Complete the GitHub secrets setup
2. Push a commit to main branch to trigger the pipeline
3. Check SonarQube Cloud dashboard for analysis results
4. Review code quality metrics and address any critical issues
