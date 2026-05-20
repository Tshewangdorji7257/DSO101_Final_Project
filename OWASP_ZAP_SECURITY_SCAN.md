# OWASP ZAP Security Scanning Implementation

## Overview

OWASP ZAP (Zed Attack Proxy) is integrated into your CI/CD pipeline to perform **dynamic security testing** on both your backend API and frontend application after they are deployed.

## What is OWASP ZAP?

OWASP ZAP is an open-source security testing tool that automatically finds security vulnerabilities in web applications by:

- Scanning for common web vulnerabilities (XSS, SQL Injection, etc.)
- Testing API endpoints for security issues
- Checking HTTP headers and security configurations
- Detecting information disclosure risks
- Reporting security issues with severity levels

## Pipeline Integration

### When ZAP Scan Runs

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
│  SonarQube Analysis         │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│  Docker Build & Push        │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│ OWASP ZAP Security Scan     │ ← NEW STEP
│ • Backend API scan          │
│ • Frontend scan             │
│ • Vulnerability reports     │
└─────────────────────────────┘
            ↓
┌─────────────────────────────┐
│  Deploy to Production       │
└─────────────────────────────┘
```

### What ZAP Scans

**Backend API (Port 5000)**
- REST endpoint security
- SQL injection vulnerabilities
- Authentication/Authorization issues
- Information disclosure
- Header security configuration

**Frontend Application (Port 3000)**
- Cross-Site Scripting (XSS)
- DOM-based vulnerabilities
- Session security
- Cookie security
- CORS policy validation
- Content Security Policy issues

## Vulnerability Categories

### ERROR Level (Critical - Blocks Deployment)
```
- SQL Injection (CWE-89)
- Cross-Site Scripting/XSS (CWE-79)
- Remote Code Execution (CWE-94)
- File Upload Vulnerabilities (CWE-434)
- Path Traversal (CWE-434)
- Remote File Inclusion (CWE-434)
- LDAP Injection (CWE-434)
- OS Command Injection (CWE-434)
- Session Fixation (CWE-384)
```

### WARN Level (Medium - Reported, Doesn't Block)
```
- Missing Security Headers (X-Frame-Options, CSP, etc.)
- Missing HttpOnly Flag on Cookies
- Weak Cache Control
- Information Disclosure
- Insecure HTTP Methods
- Directory Browsing
- CORS Policy Missing
```

## Configuration Files

### `.zap/api-rules.tsv`
- Defines rules for **backend API scanning**
- Format: `[RuleID] [Category] [CWE] [Description] [Severity]`
- Severity: ERROR (critical), WARN (warning)

### `.zap/web-rules.tsv`
- Defines rules for **frontend web scanning**
- Same format as API rules
- Includes web-specific checks (XSS, CSRF, etc.)

## How the Scan Works

### 1. Docker Services Start
```bash
Backend runs on: http://localhost:5000
Frontend runs on: http://localhost:3000
```

### 2. Health Checks
Wait for both services to be ready (up to 30 seconds)

### 3. API Scan (Backend)
```bash
ZAP scans: http://localhost:5000
Method: Passive + Active scanning
Output: Vulnerability report
```

### 4. Full Scan (Frontend)
```bash
ZAP scans: http://localhost:3000
Method: Spider + Active scanning
Output: Vulnerability report
```

### 5. Report Generation
- Markdown report: `report_md.md`
- HTML report: `report_html.html`

### 6. Report Upload
- Artifacts saved for 30 days
- Available in GitHub Actions workflow artifacts
- PR comment added with summary (if PR)

## Viewing Results

### In GitHub Actions
1. Go to your repository
2. Click **Actions**
3. Find the workflow run
4. Scroll to **OWASP ZAP Security Scan** step
5. View logs or download artifacts

### Artifact Downloads
```
GitHub Actions → Workflow run → Artifacts
├── zap-scan-reports/
│   ├── report_md.md
│   └── report_html.html
```

### HTML Report Details
- Visual representation of vulnerabilities
- Risk level indicators
- Detailed descriptions
- Attack vectors
- Recommendations

## Understanding Vulnerability Report

### Severity Levels

| Level | Action | Impact |
|-------|--------|--------|
| 🔴 ERROR | Fix before deploy | Blocks pull request merge |
| 🟡 WARN | Review & fix | Informational, doesn't block |
| 🟢 INFO | Monitor | Low priority |

### Example Report Entry

```
[ERROR] SQL Injection Risk Detected
Location: /api/users (POST)
CWE: CWE-89
Description: Application appears to allow SQL Injection
Risk: High
Recommendation: Use parameterized queries
```

## Common Vulnerabilities Fixed

### 1. Missing Security Headers
```javascript
// Add to backend middleware
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});
```

### 2. Cookie Security
```javascript
// Set secure flags on cookies
res.cookie('sessionId', token, {
  secure: true,      // HTTPS only
  httpOnly: true,    // JS can't access
  sameSite: 'Strict' // CSRF protection
});
```

### 3. CORS Configuration
```javascript
// Restrict CORS properly
const corsOptions = {
  origin: 'https://yourdomain.com',
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

### 4. Input Validation
```javascript
// Validate and sanitize inputs
const { body, validationResult } = require('express-validator');

app.post('/api/users', [
  body('email').isEmail(),
  body('username').trim().escape()
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors });
  }
  // Process validated data
});
```

## Handling Scan Issues

### Slow Scans
ZAP scans can take 5-10 minutes. This is normal for comprehensive security testing.

### False Positives
Some findings may not apply to your specific application:
1. Review the vulnerability
2. Determine if it's a false positive
3. Update rules in `.zap/*.tsv` if needed
4. Create issue to track and fix

### Network Timeouts
If services timeout:
1. Check Docker service health
2. Increase wait time in workflow
3. Verify port availability

## Security Best Practices

### Before Deploying
✅ Fix all ERROR level vulnerabilities
✅ Review and address WARN level issues
✅ Keep dependencies updated
✅ Run security scan on every commit

### Regular Maintenance
✅ Review ZAP reports weekly
✅ Update vulnerability rules
✅ Monitor OWASP Top 10 changes
✅ Conduct quarterly security audits

## Integration with GitHub

### Pull Request Comments
When a PR is scanned, results are automatically posted:
```
## 🔒 OWASP ZAP Security Scan Results

### Summary
- Total Issues: 5
- Critical: 0
- High: 1
- Medium: 3
- Low: 1

### Details
[Detailed findings...]
```

### Deployment Blocking
- ERROR level vulnerabilities block deployment
- WARN level findings are informational
- Deploy step waits for scan to complete

## Troubleshooting

### "Services not ready"
```bash
# Check service logs
docker logs backend
docker logs frontend

# Verify ports are open
curl http://localhost:5000
curl http://localhost:3000
```

### "Report not generated"
- Check ZAP job logs in GitHub Actions
- Verify services are running
- Check for timeouts

### "False positive findings"
1. Document the finding
2. Test manually to confirm
3. Update scan rules if needed
4. Create GitHub issue for tracking

## References

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP ZAP Documentation](https://www.zaproxy.org/docs/)
- [CWE/SANS Top 25](https://cwe.mitre.org/top25/)
- [Security Headers Best Practices](https://securityheaders.com/)

## Monitoring & Alerts

### GitHub Actions Notifications
- Failed scans send notifications
- Check email for scan failures
- Review logs immediately

### Continuous Improvement
- Track vulnerability trends
- Monitor remediation time
- Update policies based on findings

## Example Scan Output

```
Starting ZAP API Scan...
Target: http://localhost:5000
Scanning endpoints...

[ALERT] Missing Security Headers (WARN)
  Location: GET /api/posts
  Fix: Add X-Frame-Options header

[ALERT] Cookie Missing HttpOnly Flag (WARN)
  Location: POST /api/auth/login
  Fix: Set httpOnly flag on session cookie

[ALERT] Weak Password Policy (INFO)
  Location: POST /api/auth/register
  Fix: Enforce strong password requirements

Scan Complete!
Results saved to report_html.html
```

## Next Steps

1. **Commit files**
   ```bash
   git add .zap/ .github/workflows/ci-cd.yml
   git commit -m "feat: Add OWASP ZAP security scanning"
   git push
   ```

2. **Monitor first scan**
   - Go to GitHub Actions
   - Wait for workflow to complete
   - Review ZAP scan results

3. **Fix any findings**
   - Review vulnerability reports
   - Update application code
   - Re-run tests locally

4. **Iterate**
   - Each commit triggers new scan
   - Track improvements over time
   - Build security into development process
