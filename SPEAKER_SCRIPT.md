# DSO Final Project - Complete Speaker Script
**Duration:** 10-15 minutes  
**Last Updated:** May 20, 2026  
**Status:** Ready for Presentation

---

## OPENING & INTRODUCTION (1 minute)

### [SLIDE 1: Title Slide]

**[Stand confidently, make eye contact with audience]**

"Good morning/afternoon everyone. I'm [Your Name], and today I'm presenting the DevOps infrastructure I've built for the DSO Final Project—a full-stack blog application.

**[Pause 2 seconds]**

Over the past few weeks, I implemented an automated CI/CD pipeline that takes code from the developer's computer, runs it through automated tests, analyzes its quality and security, builds Docker containers, and deploys it to production—all without any manual intervention.

**[Pause 1 second]**

What used to take hours of manual work with multiple points of failure now takes about 5 minutes automatically. And that's what I want to show you today."

**[Pause 2 seconds]**

**Timing: 1:00**

---

## THE PROBLEM (1 minute)

### [SLIDE 2: The Traditional Deployment Challenge]

**[Point to the slide with left hand, move to center stage]**

"Let's start with the problem we're solving. In a traditional environment without DevOps, here's what happens:

**[Read the 'Manual Process' column]**

A developer writes code, sends it to a team, someone manually sets up a server—and this is where things go wrong. You have human error, inconsistent environments, and the process takes hours or even days.

**[Pause 1 second]**

**[Point to 'Issues' column]**

The testing is manual—so sometimes it gets skipped. The deployment is manual—so there's a huge risk of downtime. And if something goes wrong in production, there's manual investigation and fixing.

**[Pause 1 second]**

This is the exact problem DevOps solves. Instead of this slow, error-prone manual process, we automate everything."

**[Pause 1 second]**

**Timing: 0:55-1:05**

---

## THE SOLUTION (1 minute)

### [SLIDE 3: Our Solution - DevOps Pipeline]

**[Walk to the slide, point at the flow]**

"Here's our solution. When I push code to GitHub, the pipeline runs automatically:

**[Point at each stage as you read]**

First, it checks out the code. Then it runs automated tests on both the backend and frontend. If tests pass, it analyzes code quality. If that passes, it builds Docker containers. Then it deploys to production.

**[Pause 1 second]**

If ANY step fails, the entire pipeline stops. We don't deploy broken code to production.

**[Pause 1 second]**

The entire process—from code commit to live production—takes about 5 minutes. No manual intervention required."

**[Move back to center]**

**Timing: 0:50-1:00**

---

## ARCHITECTURE OVERVIEW (2 minutes)

### [SLIDE 4: Complete Architecture]

**[Stand to the left of the diagram]**

"Let me walk you through the architecture. 

**[Point to the top]**

Everything starts in our GitHub repository. We have two main parts—the backend built with Node.js and Express, and the frontend built with Next.js.

**[Move finger down to the middle section]**

When code is pushed, GitHub Actions takes over. This is where our CI/CD pipeline lives. It's 6 different jobs that run in sequence:

**[Pause for emphasis]**

The first two jobs run in parallel—one tests and builds the backend, the other tests and builds the frontend. This is important for speed—they don't wait for each other.

**[Pause 1 second]**

Once both are done, job three kicks in—SonarQube analysis. This analyzes BOTH the backend and frontend code as a single project—that's called a monorepo. It checks for code duplication, security issues, and overall quality.

**[Move hand down]**

If quality gates pass, job four builds the Docker containers. These are packaged versions of our application that can run anywhere.

**[Point to next section]**

Job five deploys these containers to production on Render.com. And then job six—OWASP ZAP—scans the live production website for security vulnerabilities.

**[Point to bottom]**

Finally, real users can access the live application.

**[Pause 1 second]**

This entire flow happens automatically. The only time a human touches it is when they push code or review pull requests."

**Timing: 1:50-2:10**

---

## GITHUB ACTIONS DEEP DIVE (3 minutes)

### [SLIDE 5: GitHub Actions Pipeline - 6 Jobs]

**[Stand center, reference the slide]**

"Let me break down what each job actually does, because this is the heart of the entire system.

**[Point to Job 1]**

**Job 1: Backend Test & Build**
When this job runs, it does three things:
- First, `npm ci` which is a clean install of all dependencies
- Then `npm run lint` which checks the code for style issues—things like unused variables, missing semicolons
- Finally, `npm run test:coverage` which runs all the backend tests

**[Pause 1 second]**

The output of this is a coverage report that tells us exactly what percentage of the code is tested.

**[Point to Job 2]**

**Job 2: Frontend Test & Build**
The frontend is a bit more complex:
- We use `pnpm` instead of npm for speed
- `pnpm install` installs dependencies
- `pnpm lint` checks TypeScript types and code quality
- `pnpm test` runs all component and integration tests
- `pnpm build` creates an optimized production build

**[Pause 1 second]**

**[Point to Job 3]**

**Job 3: SonarQube Analysis**
This is where code quality gets serious:
- It merges the coverage reports from both backend and frontend
- Runs SonarQube analysis on the entire codebase
- Checks against quality gates—if duplication is too high, if coverage is too low, if there are security hotspots

**[Pause 1 second]**

This is actually checking a MONOREPO—meaning it's treating the backend and frontend as ONE project. This is important because it can detect duplication across the entire application, not just within one service.

**[Point to Job 4]**

**Job 4: Docker Build**
At this point, we know:
- Code is tested ✓
- Code is linted ✓
- Code quality is good ✓

Now we package it:
- Build backend Docker image
- Build frontend Docker image
- Push both to Docker Hub with versioning
- Tag them with: `latest` and the git commit SHA

**[Pause 1 second]**

Why the git commit SHA? So we can always go back to ANY version ever deployed.

**[Point to Job 5]**

**Job 5: Deploy to Production**
This depends on Job 4 succeeding:
- Trigger webhook to deploy backend to Render.com
- Trigger webhook to deploy frontend to Render.com
- Wait and monitor the deployment
- Health checks validate that everything is running

**[Pause 1 second]**

**[Point to Job 6]**

**Job 6: OWASP ZAP Security Scanning**
This is the final gatekeeper:
- We run an API security scan on the backend
- We run a full website scan on the frontend
- It checks for 100+ common security vulnerabilities
- If critical issues are found, it alerts us immediately

**[Pause 1 second]**

And here's the key point: **All of this happens automatically.** I don't manually kick off each job. I don't manually run tests. I don't manually deploy. I just push code to GitHub, and this entire orchestration runs."

**Timing: 2:50-3:15**

---

## CODE QUALITY METRICS (1 minute)

### [SLIDE 6: SonarQube Cloud Analysis]

**[Stand to the left of the slide]**

"One of the key things we measure is code quality, and SonarQube gives us this dashboard.

**[Point at overall rating]**

We have an overall rating of **A**, which is the highest rating. This means our code is maintainable and doesn't have critical issues.

**[Point to duplication metric]**

But the one I'm most proud of is this: **Code Duplication: 2.8%**

**[Pause for emphasis]**

When we started implementing DevOps and refactoring the code, this number was **14%**. That means 14% of the code was copy-pasted or duplicated. That's a huge problem because when you find a bug in that duplicated code, you have to fix it in 10 different places.

We fixed this by creating a centralized styles utility—a single file where all the common styling is defined. Now, all components use the same styles from one place. We reduced duplication by 80%.

**[Point to coverage]**

We also maintain 65% code coverage. That means 65% of the code is tested by automated tests.

**[Point to security hotspots]**

We've reviewed all 5 security hotspots and deemed them acceptable.

**[Point to bugs and vulnerabilities]**

Zero bugs, zero vulnerabilities. That's the goal."

**Timing: 0:55-1:10**

---

## SECURITY IMPLEMENTATION (1.5 minutes)

### [SLIDE 7: Security Implementation]

**[Walk to the slide, point at first section]**

"Security is not an afterthought in this project. We have multiple layers.

**[Point to HTTP Security Headers]**

First, HTTP Security Headers. There are 9 of them:

**[Read through each with brief explanations]**

- **X-Content-Type-Options: nosniff** — This prevents the browser from trying to guess what type of file something is. If it's supposed to be JavaScript, it will always be treated as JavaScript, not HTML.

- **X-Frame-Options: DENY** — This prevents our website from being embedded in another website's iframe. This stops clickjacking attacks.

- **X-XSS-Protection** — Enables the browser's built-in XSS protection.

- **Strict-Transport-Security** — Forces the browser to always use HTTPS. Never allows HTTP.

- **Content-Security-Policy** — This is big. It controls exactly where scripts can come from, where stylesheets can come from, where images can come from. Only 'self' and trusted domains.

**[Pause 1 second]**

**[Point to Authentication section]**

We also use JWT tokens for authentication. When you log in, you get a token. That token is signed with a secret key, so it can't be forged. And passwords are hashed with bcryptjs—not stored in plain text.

**[Point to Dynamic Security Scanning]**

Then we have OWASP ZAP—this is a security tool that actually scans the live website like a hacker would. It tries common attacks and reports if they work.

**[Pause 1 second]**

And after all that? **121 security checks passed.** Zero vulnerabilities found.

**[Step back]**

This is enterprise-level security applied to a university project."

**Timing: 1:40-1:55**

---

## DOCKER CONTAINERIZATION (1.5 minutes)

### [SLIDE 8: Docker Multi-Stage Build]

**[Point to the slide]**

"Now let me talk about Docker. Docker is a containerization technology. Think of it as packaging your entire application—code, dependencies, configuration—into a box that can run anywhere.

**[Point to Stage 1: Build]**

We use a multi-stage build, which is a performance optimization. In Stage 1, we start with Node.js Alpine—that's a tiny Linux distribution.

We copy the package files, run `npm ci` to install everything, and build the application. This stage is BIG because it has all the development tools.

**[Point to Stage 2: Runtime]**

In Stage 2, we start fresh with another Alpine image. But this time, we ONLY copy the built application. We don't copy the development dependencies.

**[Pause 1 second]**

This means the final Docker image is much smaller. Instead of 500MB, we get 240MB for the backend and 180MB for the frontend. Smaller images mean:
- Faster downloads
- Faster startup time
- Lower bandwidth costs

**[Point to features]**

We also include health checks. Every 30 seconds, Docker pings the `/health` endpoint. If the application stops responding, Docker automatically restarts the container. This is automatic recovery—we don't need a human to notice the problem and restart it."

**Timing: 1:40-1:55**

---

## DEPLOYMENT FLOW (1.5 minutes)

### [SLIDE 9: Deployment Pipeline - GitHub to Users]

**[Walk through the flow step by step]**

"Let me walk you through what happens from code commit to users accessing the live website.

**[Point to Step 1]**

**Step 1: Code Commit**
A developer writes code and commits to GitHub. That's the only manual step.

**[Point to Step 2]**

**Step 2: Automated Testing**
All tests run automatically. If tests fail, the pipeline stops here and notifies the developer. Bad code never gets deployed.

**[Point to Step 3]**

**Step 3: Docker Build**
Images are built and pushed to Docker Hub with tags like `latest` and the git commit SHA.

**[Point to Step 4]**

**Step 4: Render Deployment**
Webhooks trigger deployment. The backend goes to `dso-blog-backend.onrender.com` and the frontend to `dso-blog-frontend.onrender.com`.

**[Point to Step 5]**

**Step 5: Health Checks**
We verify the backend responds to `/health` and the frontend responds to the root URL with a 200 OK status.

**[Point to Step 6]**

**Step 6: Security Scanning**
OWASP ZAP scans the live production URLs for vulnerabilities.

**[Point to result]**

**Total Time: 5 minutes. Manual Work: Zero steps.**

**[Pause 1 second]**

The entire journey from code commit to production takes 5 minutes. And during those 5 minutes, we've:
- Run automated tests
- Analyzed code quality
- Checked for security issues
- Built Docker containers
- Deployed to production
- Verified the deployment is healthy
- Scanned for vulnerabilities

All automatic. All auditable. All with zero manual errors because humans weren't involved in the process."

**Timing: 1:35-1:50**

---

## LIVE DEMO GUIDE (3-4 minutes)

### [SWITCH TO SCREEN SHARE]

**[Speak calmly and clearly]**

"Now I want to show you this in action. Let me switch to my screen.

**[Show GitHub Actions tab]**

Here's the GitHub repository. If I click on the Actions tab... you can see our recent workflow runs.

**[Point to recent run]**

This is our latest pipeline run. You can see all 6 jobs:
1. backend-test-build ✓
2. frontend-test-build ✓
3. sonarqube-analysis ✓
4. docker-build ✓
5. deploy ✓
6. owasp-zap-scan ✓

All of them passed. If I click on one of them... let me click on the backend-test-build job...

**[Wait for page to load]**

Here you can see the actual output. It ran `npm ci`, then `npm run lint`, then `npm run test:coverage`. And it generated a coverage report showing that 65% of the backend code is tested.

**[Close this, navigate to SonarQube]**

Now let me show you SonarQube Cloud. This is where code quality is analyzed.

**[Point to metrics]**

DSO_FINAL_Project. Overall rating: A. Code duplication: 2.8%. Coverage: 65%. Security hotspots: 5 reviewed. Zero bugs, zero vulnerabilities.

**[Point to history graph]**

And here you can see the trend over time. When we started, duplication was at 14%. We've been reducing it with each commit. Now it's at 2.8%.

**[Navigate to production URL]**

Finally, let me show you the actual live application.

**[Show blog homepage]**

This is the live blog application, running in production, deployed through our CI/CD pipeline. You can see the blog posts with images loaded from Unsplash. All of this infrastructure—the testing, the quality gates, the security scanning, the deployment—is orchestrated by the pipeline we built.

**[Point to security headers]**

If I open Developer Tools... and look at the Response Headers... you can see all 9 security headers we implemented.

**[Show a few headers]**

X-Content-Type-Options: nosniff. X-Frame-Options: DENY. X-XSS-Protection enabled. And the Content-Security-Policy with all the restrictions.

**[Close dev tools]**

This is the result of the DevOps infrastructure."

**Timing: 3:00-4:00**

---

## RESULTS & IMPACT (1 minute)

### [SLIDE 12: Results & Impact - SWITCH BACK FROM DEMO]

**[Return to slide presentation view]**

"Let me show you the before and after.

**[Point to BEFORE column]**

**Before DevOps:**
- Deployment was manual, taking hours
- Testing was manual, sometimes skipped
- Quality was unpredictable
- Security checks were manual
- Rollback was time-consuming
- There was low visibility into what's running
- Time to market was days or weeks

**[Point to AFTER column]**

**After DevOps:**
- Deployment is automated, 5 minutes
- Testing is automated on every commit
- Quality is consistent and measured
- Security is automatically scanned
- Rollback is easy, just use a previous version
- Full visibility through GitHub Actions logs
- Time to market is minutes

**[Point to impact]**

Business impact:
- 95% reduction in deployment time
- 100% code review automation
- Zero manual deployment errors
- 24/7 health monitoring
- Faster feature releases
- Higher user satisfaction

**[Pause 1 second]**

This is the power of DevOps. It's not just faster. It's more reliable. It's more secure. It's better for the entire team and the users."

**Timing: 0:55-1:05**

---

## RUBRIC MAPPING (45 seconds)

### [SLIDE - Rubric Scoring]

**[Reference the scoring table]**

"Let me quickly map this project to the assignment rubric.

**[Point to each criterion as you read]**

We have 6 scoring criteria, 5 points each, for 35 points total.

**[Read each with brief explanation]**

1. **Docker Configuration & Optimization** (5/5) - Multi-stage builds, health checks, docker-compose files
2. **CI/CD Pipeline Design** (5/5) - 6 jobs, proper dependencies, error handling
3. **Pipeline Implementation** (10/10) - Complete automation from tests to deployment
4. **Integration with External Services** (5/5) - SonarQube, OWASP ZAP, Render, Docker Hub
5. **Security Considerations** (5/5) - 9 headers, CSP, ZAP scanning, authentication
6. **Documentation & Presentation** (5/5) - This guide, architecture documents, demos

**[Pause 1 second]**

We've addressed all 6 criteria completely."

**Timing: 0:40-0:50**

---

## TECHNICAL DEEP DIVE - OPTIONAL (For Q&A)

**If asked about specific technical challenges:**

### On SonarQube Monorepo:

"The challenge was that we needed to analyze both backend (Node.js) and frontend (React) code as a single project. Most people would create two separate SonarQube projects. But we created one 'monorepo' project that analyzes:
- Backend source: `blog-backend/src`
- Frontend source: `blog-frontend/app`, `blog-frontend/components`
- Backend tests: `blog-backend/test`
- Frontend tests: `blog-frontend/__tests__`
- Coverage reports from both

This allows us to detect duplication across the entire application, not just within one part."

### On Code Duplication Reduction:

"We found that styling code was being duplicated in multiple components. So we created a centralized utility file `blog-styles.ts` that defines all common Tailwind CSS classes. Now instead of each component defining its own styles, they all import from this utility. When we need to update a style, we update it in one place."

### On OWASP ZAP Integration:

"OWASP ZAP is a security testing tool. What makes our integration special is that it runs POST-deployment. We could run it in the pipeline, but that would just test the code. By running it after deployment on the live URLs, we're testing the actual live application—the way a hacker would attack it."

---

## CLOSING REMARKS (1 minute)

### [FINAL SLIDE or BLANK SCREEN]

**[Stand center, confident posture]**

"In summary, I've built a DevOps infrastructure that:

**[Count on fingers]**

1. **Automates testing** - Every commit is tested
2. **Enforces quality** - Code quality gates prevent bad code
3. **Secures the application** - Multiple layers of security
4. **Containerizes deployment** - Docker ensures consistency
5. **Enables fast deployments** - 5 minutes from code to production
6. **Provides visibility** - Full audit trail in GitHub Actions

**[Pause 1 second]**

This is what modern software development looks like. It's not just about building features. It's about building infrastructure that lets you build features safely, quickly, and reliably.

**[Pause 2 seconds]**

Thank you. I'm happy to answer any questions."

**Timing: 1:00**

---

## Q&A TALKING POINTS

### If asked "Why SonarQube?"

"SonarQube gives us continuous insight into code quality. Without it, we'd only find quality issues during code review. With it, they're automatically detected and measured. We can see trends over time—are we getting better or worse? We can set quality gates—if duplication goes above 3%, the build fails."

### If asked "What happens if a test fails?"

"The pipeline stops immediately. The code is never deployed. The developer gets notified through GitHub. They have to fix the test, push again, and the pipeline runs again. This ensures only tested code reaches production."

### If asked "How is this different from manual deployment?"

"Manual deployment is like driving a car through a fog at night. You're making decisions based on incomplete information, hoping you don't crash. DevOps is like driving on a highway with clear markings, guardrails, and automatic safety systems. Every step is verified, every decision is automated."

### If asked "What if production has a bug?"

"We can rollback instantly. Every Docker image is tagged with the git commit SHA. If production has an issue, we just deploy the previous version. This takes seconds, not hours."

### If asked "How do you handle database migrations?"

"For this project, we use SQLite, so database changes are automated. For larger systems, database migrations would be part of the deployment pipeline—they'd run automatically as part of the deployment script."

### If asked "Is this overkill for a university project?"

"Actually, no. This is a good learning experience. In the real world, companies this size definitely have CI/CD pipelines. For this project size, it's demonstrating best practices. Plus, everything we built here is industry-standard—SonarQube, GitHub Actions, Docker, OWASP ZAP—these are tools used at massive companies."

---

## DELIVERY TIPS

### Pacing:
- Speak at a conversational pace (not too fast)
- Pause after key points (1-2 seconds)
- Use silence for emphasis, not filler words like "um" or "uh"

### Eye Contact:
- Look at different people in the audience
- Don't read directly from slides
- Glance at slides for reference

### Hand Gestures:
- Point at diagrams when describing them
- Use natural hand movements
- Avoid crossing arms (defensive posture)

### Energy:
- Stand up straight
- Move around occasionally (not pacing constantly)
- Show enthusiasm about the project

### If you lose your place:
- Pause and take a breath
- Look at the slide
- Continue from where you paused
- The audience won't notice

### If asked a question you can't answer:
- Be honest: "That's a great question, I don't have that data right now, but I could find out"
- Write it down to follow up
- Don't make up an answer

---

## TIMING BREAKDOWN

| Section | Time | Cumulative |
|---------|------|-----------|
| Opening & Intro | 1:00 | 1:00 |
| The Problem | 1:00 | 2:00 |
| The Solution | 1:00 | 3:00 |
| Architecture | 2:00 | 5:00 |
| GitHub Actions | 3:00 | 8:00 |
| Code Quality | 1:00 | 9:00 |
| Security | 1:30 | 10:30 |
| Docker | 1:30 | 12:00 |
| Deployment | 1:30 | 13:30 |
| Demo | 3:00 | 16:30 |
| Results | 1:00 | 17:30 |
| Rubric | 0:45 | 18:15 |
| Closing | 1:00 | 19:15 |
| Q&A Buffer | 5:45 | 25:00 |

**Total: 25 minutes (10 min presentation + 15 min buffer for demo delays and Q&A)**

---

**Last Updated:** May 20, 2026  
**Status:** Ready for Delivery  
**Confidence Level:** High (all content validated and tested)
