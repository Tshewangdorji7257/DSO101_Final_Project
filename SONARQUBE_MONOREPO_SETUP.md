# SonarQube Setup for DSO101_Final_Project (Monorepo)

## Overview

Your repository `DSO101_Final_Project` contains both backend and frontend code in separate folders. This guide configures **two separate SonarQube projects** for better code quality tracking.

## SonarQube Project Setup

### Step 1: In SonarQube Cloud

Visit: https://sonarcloud.io

#### Create First Project (Backend)
1. Click **"Create project"**
2. Select your GitHub organization
3. Choose your `DSO101_Final_Project` repository
4. Click **"Create project"**
5. On next screen, choose **"Set up project for FREE"**
6. At the bottom, expand **"Project settings"** and set:
   - **Project name**: `DSO101_Final_Project - Backend`
   - **Project key**: `DSO101_Final_Project_Backend` (will be auto-generated, you can edit it)
7. Click **"Create project"**

#### Create Second Project (Frontend)
1. Click **"Create project"** again
2. Select your GitHub organization
3. Choose your `DSO101_Final_Project` repository **again**
4. Click **"Create project"**
5. On next screen, choose **"Set up project for FREE"**
6. At the bottom, expand **"Project settings"** and set:
   - **Project name**: `DSO101_Final_Project - Frontend`
   - **Project key**: `DSO101_Final_Project_Frontend`
7. Click **"Create project"**

### Step 2: Generate Token

1. Go to **My Account → Security → Generate tokens**
2. Create a token named `GitHub Actions DSO101`
3. Copy the token

### Step 3: GitHub Secrets

Add these to your repository: **Settings → Secrets and variables → Actions**

| Secret Name | Value |
|-----------|-------|
| `SONAR_TOKEN` | Your token from Step 2 |
| `SONAR_ORGANIZATION` | Your SonarQube organization key |
| `SONAR_PROJECT_KEY_BACKEND` | `DSO101_Final_Project_Backend` |
| `SONAR_PROJECT_KEY_FRONTEND` | `DSO101_Final_Project_Frontend` |

## Configuration Files

Your folder structure:
```
DSO101_Final_Project/
├── backend/
│   ├── sonar-project.properties
│   ├── package.json
│   └── ...
├── frontend/
│   ├── sonar-project.properties
│   ├── package.json
│   └── ...
└── .github/workflows/ci-cd.yml
```

### Backend: `backend/sonar-project.properties`
```properties
sonar.projectKey=DSO101_Final_Project_Backend
sonar.projectName=DSO101_Final_Project - Backend
sonar.projectVersion=1.0.0
sonar.sourceEncoding=UTF-8

# Source files
sonar.sources=src
sonar.tests=test

# Exclude node_modules and other non-source files
sonar.exclusions=node_modules/**,dist/**,build/**,.git/**,test/**

# Test files
sonar.test.inclusions=test/**/*.test.js
sonar.coverage.exclusions=test/**,node_modules/**

# Coverage
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Language
sonar.language=js

# JavaScript specific settings
sonar.javascript.node.maxOldSpaceSize=4096
```

### Frontend: `frontend/sonar-project.properties`
```properties
sonar.projectKey=DSO101_Final_Project_Frontend
sonar.projectName=DSO101_Final_Project - Frontend
sonar.projectVersion=1.0.0
sonar.sourceEncoding=UTF-8

# Source files
sonar.sources=app,components,lib,hooks,styles
sonar.tests=__tests__

# Exclude node_modules and other non-source files
sonar.exclusions=node_modules/**,.next/**,dist/**,build/**,.git/**,coverage/**,__tests__/**

# Test files
sonar.test.inclusions=__tests__/**/*.{test,spec}.{js,jsx,ts,tsx}
sonar.coverage.exclusions=__tests__/**,node_modules/**,.next/**

# Coverage
sonar.javascript.lcov.reportPaths=coverage/lcov.info

# Language
sonar.language=ts

# JavaScript/TypeScript specific settings
sonar.javascript.node.maxOldSpaceSize=4096
```

## CI/CD Pipeline Configuration

In `.github/workflows/ci-cd.yml`, the SonarQube analysis step should be:

```yaml
- name: SonarQube Scan - Backend
  uses: sonarsource/sonarcloud-github-action@master
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
  with:
    args: |
      -Dsonar.projectBaseDir=backend
      -Dsonar.projectKey=${{ secrets.SONAR_PROJECT_KEY_BACKEND }}
      -Dsonar.organization=${{ secrets.SONAR_ORGANIZATION }}

- name: SonarQube Scan - Frontend
  uses: sonarsource/sonarcloud-github-action@master
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
  with:
    args: |
      -Dsonar.projectBaseDir=frontend
      -Dsonar.projectKey=${{ secrets.SONAR_PROJECT_KEY_FRONTEND }}
      -Dsonar.organization=${{ secrets.SONAR_ORGANIZATION }}
```

## Key Differences from Single-Project Setup

| Single Project | Two Projects |
|---|---|
| All code in one analysis | Backend and frontend analyzed separately |
| One project dashboard | Two dashboards for comparison |
| Combined metrics | Separate metrics per application |
| **Better for**: Large monorepos | **Better for**: Different tech stacks |

## Important Notes

- **Same repository**: Both SonarQube projects link to the same GitHub repository (`DSO101_Final_Project`)
- **Different project keys**: Each project has a unique key (`*_Backend`, `*_Frontend`)
- **Different base directories**: `-Dsonar.projectBaseDir` points to either `backend` or `frontend` folder
- **One token**: Single `SONAR_TOKEN` works for both projects

## Troubleshooting

### "Project not found"
- Verify project keys match exactly what's in SonarQube
- Check `sonar.projectKey` in properties files

### Coverage not detected
- Ensure `npm run test:coverage` runs in backend
- Ensure `pnpm test` runs in frontend
- Check coverage paths match `lcov.reportPaths`

### Multiple projects from same repo
- This is expected behavior with monorepos
- Each project analyzes only its base directory
- You can manage both dashboards independently
