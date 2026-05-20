# OWASP ZAP Post-Deployment Security Scanning

## Setup Instructions

The OWASP ZAP security scan now runs **AFTER deployment** to scan your actual production environment.

## Required GitHub Secrets

Add these secrets to your GitHub repository: **Settings → Secrets and variables → Actions**

| Secret Name | Example Value | Description |
|-----------|-------|---|
| `PRODUCTION_BACKEND_URL` | `https://blog-backend-demo.onrender.com` | Your deployed backend URL |
| `PRODUCTION_FRONTEND_URL` | `https://blog-frontend-demo.onrender.com` | Your deployed frontend URL |

### How to Find Your Production URLs

1. Go to your Render dashboard
2. Find your deployed backend service
3. Copy the URL (e.g., `https://blog-backend-demo.onrender.com`)
4. Repeat for frontend service
5. Add both to GitHub secrets

## Pipeline Flow (Updated)

```
1. Tests
    ↓
2. SonarQube Analysis
    ↓
3. Docker Build & Push
    ↓
4. Deploy to Production  ← Services are now live
    ↓
5. OWASP ZAP Scan       ← Scans the actual production environment
```

## What Gets Scanned

### Backend API
- Endpoint: `{PRODUCTION_BACKEND_URL}/health`
- Tests: REST API security, authentication, data handling
- Rules file: `.zap/api-rules.tsv`

### Frontend Application
- Endpoint: `{PRODUCTION_FRONTEND_URL}`
- Tests: Web application security, XSS, CSRF, cookie security
- Rules file: `.zap/web-rules.tsv`

## Scan Process

1. **Deploy completes** → Backend and frontend are live on Render
2. **ZAP job starts** → Waits up to 60 seconds for services to be ready
3. **Health check** → Verifies both services are responding
4. **API Scan** → Tests backend for vulnerabilities
5. **Full Scan** → Tests frontend for vulnerabilities
6. **Reports generated** → Saved as artifacts
7. **Results reviewed** → Can be downloaded from GitHub Actions

## Accessing Results

### After Workflow Completes

1. Go to GitHub repository
2. Click **Actions**
3. Find the completed workflow run
4. Look for **OWASP ZAP Security Scan** job
5. View logs or download artifacts

### Artifact Location

```
GitHub Actions → Workflow run → Artifacts
└── zap-scan-reports/
    ├── report_md.md       ← Markdown summary
    └── report_html.html   ← Detailed HTML report
```

## Viewing the Full Report

1. Download `report_html.html` from artifacts
2. Open in web browser
3. Review findings with severity levels
4. Check recommendations for each issue

## Understanding Results

### Severity Classification

- 🔴 **HIGH** - Critical security issues that need immediate fixing
- 🟡 **MEDIUM** - Important issues that should be addressed soon
- 🟢 **LOW** - Minor issues, informational only
- ⚪ **INFO** - Observations and best practices

## Common Issues & Fixes

### "Services not ready" Error

If ZAP can't reach your production services:

1. Verify Render deployment is complete
2. Check URLs in GitHub secrets are correct
3. Ensure backend has `/health` endpoint:
   ```javascript
   app.get('/health', (req, res) => {
     res.status(200).json({ status: 'ok' });
   });
   ```
4. Check that your services are publicly accessible (not private)

### Security Headers Missing

**Issue**: X-Frame-Options, CSP, X-Content-Type-Options not set

**Fix in Backend**:
```javascript
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});
```

### Cookie Security Issues

**Issue**: SessionID cookie missing HttpOnly or Secure flags

**Fix**:
```javascript
res.cookie('sessionId', token, {
  httpOnly: true,    // Prevents JS access
  secure: true,      // HTTPS only
  sameSite: 'Strict', // CSRF protection
  maxAge: 3600000    // 1 hour
});
```

## Workflow Status

After each push to main:

| Stage | Status | What It Does |
|-------|--------|---|
| Tests | ✅ | Backend & frontend tests |
| SonarQube | ✅ | Code quality analysis |
| Docker Build | ✅ | Build and push images |
| Deploy | ✅ | Deploy to Render |
| ZAP Scan | ✅ | **Security scan of production** |

## Automation Trigger

ZAP scan automatically runs when:
- ✅ Code is pushed to `main` branch
- ✅ Deployment to production succeeds
- ✅ All services are ready

ZAP scan does **NOT** run when:
- ❌ Pull request is opened (only on main push)
- ❌ Deployment fails (security scan skipped)
- ❌ Services don't become ready within 60 seconds

## Continuous Monitoring

The ZAP scan provides ongoing security validation:

1. **Before Deployment**: SonarQube checks code quality
2. **During Deployment**: Docker images are built with latest code
3. **After Deployment**: ZAP scans the live production environment
4. **Results Review**: Team reviews findings and takes action

## Next Steps

1. **Set GitHub Secrets**:
   - `PRODUCTION_BACKEND_URL`
   - `PRODUCTION_FRONTEND_URL`

2. **Ensure Backend Health Endpoint**:
   ```javascript
   app.get('/health', (req, res) => {
     res.status(200).json({ status: 'ok' });
   });
   ```

3. **Push to main** and monitor workflow

4. **Review ZAP results** after scan completes

5. **Fix any security issues** found

## Troubleshooting

### Scan times out

**Problem**: ZAP scan job times out waiting for services

**Solution**:
- Increase wait time from 60 to 120 seconds
- Check Render service health logs
- Verify services are actually deployed

### False positives in report

**Problem**: ZAP reports issues that aren't real vulnerabilities

**Solution**:
1. Review the finding carefully
2. Test manually if possible
3. Update rules in `.zap/*.tsv` if needed
4. Create GitHub issue to track

### Scan doesn't run

**Problem**: ZAP job doesn't appear in workflow

**Solution**:
- Check that push was to `main` branch (not feature branch)
- Verify deployment job completed successfully
- Check GitHub Actions logs for errors

## Best Practices

✅ **Do**:
- Review ZAP reports regularly
- Fix HIGH severity issues immediately
- Keep security headers up to date
- Run manual scans during development

❌ **Don't**:
- Ignore security findings
- Suppress legitimate vulnerabilities
- Disable health endpoint
- Make backend/frontend private

## Reporting Issues

If you find a security vulnerability:

1. Don't disclose it publicly
2. Open a GitHub issue (private)
3. Include ZAP report details
4. Assign to security team lead
5. Create a fix PR

## Security References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [ZAP Documentation](https://www.zaproxy.org/docs/)
- [Security Headers](https://securityheaders.com/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)
