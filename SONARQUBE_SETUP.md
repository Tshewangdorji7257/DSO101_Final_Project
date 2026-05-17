# SonarQube Integration Guide

This guide explains how to set up SonarQube for code quality analysis in your CI/CD pipeline.

## Overview

SonarQube is integrated into your GitHub Actions pipeline to automatically analyze:
- **Backend** (`blog-backend`): Node.js/JavaScript code quality
- **Frontend** (`blog-frontend`): Next.js/TypeScript/React code quality

Analysis results are posted to SonarCloud as part of every push and pull request.

## Prerequisites

You need:
1. **SonarCloud Account** - Sign up at https://sonarcloud.io
2. **GitHub Organization** - Your SonarCloud organization key
3. **SonarToken** - A personal access token from SonarCloud

## Step 1: Create SonarCloud Account

1. Go to https://sonarcloud.io
2. Sign up with your GitHub account
3. Authorize the SonarCloud GitHub App
4. Note your **Organization Key** (usually your GitHub username or org name)

## Step 2: Generate SonarCloud Token

1. Log in to https://sonarcloud.io
2. Go to **Account Settings** (top right profile icon)
3. Click **Security** tab
4. Under **Generate Tokens**, enter a name (e.g., `blog-cicd-token`)
5. Click **Generate**
6. Copy the token immediately (you won't see it again)

## Step 3: Create Projects in SonarCloud

For each project (backend and frontend), create them in SonarCloud:

### Backend Project
1. In SonarCloud, click **+ Create project**
2. Select **Create manually**
3. Enter:
   - **Project key**: `blog-backend`
   - **Project name**: `Blog Backend`
   - **Organization**: Your org
   - **Public/Private**: Choose based on your preference
4. Click **Create**

### Frontend Project
1. Click **+ Create project** again
2. Select **Create manually**
3. Enter:
   - **Project key**: `blog-frontend`
   - **Project name**: `Blog Frontend`
   - **Organization**: Your org
   - **Public/Private**: Choose based on your preference
4. Click **Create**

## Step 4: Add GitHub Secrets

Add these secrets to your GitHub repository settings:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add:

### Required Secrets

| Secret Name | Value |
|---|---|
| `SONAR_TOKEN` | Your SonarCloud token from Step 2 |
| `SONAR_ORGANIZATION` | Your SonarCloud organization key |

### Example Values
```
SONAR_TOKEN: squ_abc1234def5678ghi9012jkl3456m
SONAR_ORGANIZATION: myorg
```

## Step 5: Verify Configuration

The configuration files are already in place:

- **Backend**: `blog-backend/sonar-project.properties`
  - Analyzes: `src/` directory
  - Tests: `test/` directory

- **Frontend**: `blog-frontend/sonar-project.properties`
  - Analyzes: `app/`, `components/`, `lib/`, `hooks/`, `styles/`
  - Tests: `__tests__/` directory

## Step 6: Trigger Analysis

The analysis runs automatically on:
- **Every push** to `main` branch
- **Every pull request** to `main` branch
- **Manual trigger** via Actions tab

### Manually Trigger
1. Go to **Actions** tab in GitHub
2. Click **Blog CI/CD Pipeline**
3. Click **Run workflow** → **Run workflow**

## Step 7: View Results

Once analysis completes:

1. Check GitHub **Checks** tab on your commit/PR for SonarCloud results
2. Visit SonarCloud dashboard:
   - Backend: `https://sonarcloud.io/project/overview?id=blog-backend`
   - Frontend: `https://sonarcloud.io/project/overview?id=blog-frontend`

## Quality Gates

Quality gates ensure code meets standards:

### Backend Rules
- Minimum 80% code coverage
- No critical issues
- No duplicated blocks >10 lines
- Maintainability rating ≥ B

### Frontend Rules
- Minimum 75% code coverage
- No critical issues
- No duplicated blocks >10 lines
- Maintainability rating ≥ B

## Local Analysis (Optional)

### Analyze Backend Locally

```bash
cd blog-backend

# Using Docker (easiest)
docker run --rm -e SONAR_HOST_URL=https://sonarcloud.io \
  -e SONAR_LOGIN=<your-token> \
  -v $(pwd):/usr/src \
  sonarsource/sonar-scanner-cli \
  -Dsonar.projectKey=blog-backend \
  -Dsonar.organization=<your-org>
```

### Analyze Frontend Locally

```bash
cd blog-frontend

# Using Docker
docker run --rm -e SONAR_HOST_URL=https://sonarcloud.io \
  -e SONAR_LOGIN=<your-token> \
  -v $(pwd):/usr/src \
  sonarsource/sonar-scanner-cli \
  -Dsonar.projectKey=blog-frontend \
  -Dsonar.organization=<your-org>
```

## Troubleshooting

### Analysis Not Running

**Problem**: SonarQube step is skipped in Actions

**Solution**:
- Verify `SONAR_TOKEN` and `SONAR_ORGANIZATION` are set
- Check that projects exist in SonarCloud with correct keys
- Verify organization key matches exactly (case-sensitive)

### "Project not found"

**Problem**: Error says project doesn't exist in SonarCloud

**Solution**:
- Verify project keys match:
  - Backend: must be exactly `blog-backend`
  - Frontend: must be exactly `blog-frontend`
- Create missing projects in SonarCloud dashboard

### Token Expired

**Problem**: "Invalid token" error after some time

**Solution**:
1. Generate a new token in SonarCloud
2. Update `SONAR_TOKEN` secret in GitHub
3. Re-run the workflow

## Configuration Reference

### Backend (sonar-project.properties)
```properties
sonar.projectKey=blog-backend
sonar.projectName=Blog Backend
sonar.sources=src
sonar.tests=test
sonar.exclusions=node_modules/**,dist/**
```

### Frontend (sonar-project.properties)
```properties
sonar.projectKey=blog-frontend
sonar.projectName=Blog Frontend
sonar.sources=app,components,lib,hooks,styles
sonar.tests=__tests__
sonar.exclusions=node_modules/**,.next/**
```

## Integrating with Pull Requests

SonarCloud automatically:
- Adds a comment on PR with analysis results
- Shows pass/fail status on quality gates
- Blocks merge if quality gate fails (if configured)

### Enable Automatic Checks

1. In SonarCloud project settings
2. Go to **General Settings** → **Pull Requests**
3. Enable **Comment on PR**
4. Enable **Decorate pull requests**

## Next Steps

- Configure **quality gates** for stricter standards
- Set up **branch protection** to require quality gate pass
- Add **code coverage** reports (currently optional)
- Configure **security hotspots** review

## Resources

- [SonarCloud Documentation](https://docs.sonarcloud.io)
- [SonarQube Rules](https://rules.sonarsource.com)
- [GitHub Actions Integration](https://docs.sonarcloud.io/integrations/github/)
- [Quality Gates](https://docs.sonarcloud.io/improving/quality-gates/)
