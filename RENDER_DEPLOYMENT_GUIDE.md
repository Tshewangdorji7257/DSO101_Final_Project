# Deploying to Render with Docker

This guide walks you through deploying your blog application (backend and frontend) to Render using Docker images.

## Prerequisites

- Render account (https://render.com)
- Docker installed locally
- Docker Hub account (https://hub.docker.com) or similar container registry
- Git repository with your code

## Step 1: Prepare Docker Images and Push to Docker Hub

### 1.1 Create Docker Hub Account
- Go to https://hub.docker.com
- Sign up or log in
- Verify your email

### 1.2 Build Images Locally

```bash
# Build backend image
docker build -t yourusername/blog-backend:latest ./blog-backend

# Build frontend image
docker build -t yourusername/blog-frontend:latest ./blog-frontend

# Replace 'yourusername' with your Docker Hub username
```

### 1.3 Push Images to Docker Hub

```bash
# Login to Docker Hub
docker login

# Push backend image
docker push yourusername/blog-backend:latest

# Push frontend image
docker push yourusername/blog-frontend:latest
```

## Step 2: Deploy Backend Service on Render

### 2.1 Create New Web Service
1. Go to https://dashboard.render.com
2. Click **New +** → **Web Service**
3. Click **Deploy an existing image from a registry**

### 2.2 Configure Backend Service

**Step 1: Image Settings**
- **Image URL**: `yourusername/blog-backend:latest`
- **Registry**: Docker Hub (or your registry)

**Step 2: Service Settings**
- **Name**: `blog-backend`
- **Region**: Choose closest to your users
- **Plan**: Start with Free tier or Starter

**Step 3: Environment Variables**
Add the following environment variables:
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.onrender.com
DATABASE_URL=/app/data/blog.db
```

**Step 4: Networking**
- Leave **Public URL** enabled
- Note the backend URL: `https://blog-backend.onrender.com`

### 2.3 Deploy
- Click **Deploy Web Service**
- Wait for deployment to complete (5-10 minutes)

## Step 3: Deploy Frontend Service on Render

### 3.1 Create New Web Service
1. Click **New +** → **Web Service**
2. Click **Deploy an existing image from a registry**

### 3.2 Configure Frontend Service

**Step 1: Image Settings**
- **Image URL**: `yourusername/blog-frontend:latest`
- **Registry**: Docker Hub

**Step 2: Service Settings**
- **Name**: `blog-frontend`
- **Region**: Same as backend
- **Plan**: Same as backend

**Step 3: Environment Variables**
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://blog-backend.onrender.com/api
```

**Step 4: Deploy Settings**
- **Build Command**: (Leave empty - already built)
- **Start Command**: `pnpm start`

### 3.3 Deploy
- Click **Deploy Web Service**
- Wait for deployment

## Step 4: Update Frontend Configuration

After frontend is deployed, update its environment variable:
- In Render dashboard, go to frontend service
- Click **Environment**
- Update `NEXT_PUBLIC_API_URL` to point to your backend
- Trigger a redeploy

## Step 5: Connect Backend Database

### Option A: Persistent Disk for SQLite (Recommended for Small Apps)

1. In backend service settings, scroll to **Disks**
2. Click **Add Disk**
3. **Name**: `data`
4. **Mount Path**: `/app/data`
5. **Size**: 1 GB
6. Save and redeploy

### Option B: Use PostgreSQL (Recommended for Production)

1. Create PostgreSQL database on Render
2. Update backend code to use PostgreSQL instead of SQLite
3. Add connection string to environment variables

## Step 6: Verify Deployment

### Check Backend
```bash
# Test health check
curl https://blog-backend.onrender.com/api/health
```

### Check Frontend
- Open https://blog-frontend.onrender.com in browser
- Should load without errors

### Check Connectivity
1. Open frontend in browser
2. Open DevTools (F12)
3. Check Network tab for API calls
4. Should see successful requests to backend

## Step 7: Set Up CI/CD (Optional but Recommended)

### Automatic Deployment on Git Push

1. Connect your Git repository:
   - Go to service settings
   - Click **Environment** → **Git Repository**
   - Connect your GitHub/GitLab account
   - Select repository and branch

2. Enable auto-deploy:
   - Check **Auto-deploy** on push
   - Now pushing to main branch triggers automatic deployment

## Important Configuration

### CORS Settings

Update backend's CORS configuration to allow your Render frontend:

In `blog-backend/src/server.js`:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
```

Make sure `FRONTEND_URL` environment variable is set correctly in Render.

### Persistent Data

For SQLite database persistence:
- Use Render's Disk feature (see Step 5, Option A)
- Disk persists between deployments and restarts
- Backup regularly

## Environment Variables Reference

### Backend Variables
```
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://your-frontend-domain.onrender.com
DATABASE_URL=/app/data/blog.db
```

### Frontend Variables
```
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://your-backend-domain.onrender.com/api
```

## Monitoring & Logging

### View Logs
1. Go to service in Render dashboard
2. Click **Logs** tab
3. Real-time logs appear here

### View Metrics
1. Click **Metrics** tab
2. Monitor CPU, memory, and network usage

## Troubleshooting

### Service Won't Start
- Check logs for error messages
- Verify environment variables are set correctly
- Ensure image is publicly available on Docker Hub

### Frontend Can't Connect to Backend
- Check `NEXT_PUBLIC_API_URL` is correct
- Verify backend service is running (check its logs)
- Check CORS settings in backend
- Try accessing backend URL directly in browser

### Database Not Persisting
- Ensure persistent disk is mounted at `/app/data`
- Check disk has sufficient space
- Verify database file location in backend code

### Image Pull Errors
- Verify image exists on Docker Hub
- Check image name is correct (yourusername/blog-backend:latest)
- Ensure Docker Hub image is public (or configure auth)

### High Memory Usage
- Optimize dependencies (remove unused packages)
- Consider upgrading plan
- Check for memory leaks in application

## Cost Optimization

- **Free Tier**: Services spin down after 15 minutes of inactivity
- **Paid Tiers**: $7-12/month per service
- **Disk Storage**: Additional cost per GB/month
- **Database**: Separate pricing for PostgreSQL

## Production Checklist

- [ ] Both services deployed and running
- [ ] Frontend connects to backend successfully
- [ ] Database persists (test by restarting service)
- [ ] Environment variables configured
- [ ] CORS settings correct
- [ ] Logs monitored for errors
- [ ] Automatic deploys enabled (if using Git)
- [ ] Backup strategy in place
- [ ] Custom domain configured (if needed)
- [ ] SSL/HTTPS enabled (automatic on Render)

## Updating Deployments

### Method 1: Manual Push to Docker Hub + Redeploy
```bash
# Build with new version tag
docker build -t yourusername/blog-backend:v1.0 ./blog-backend

# Push
docker push yourusername/blog-backend:v1.0

# Update service URL in Render dashboard
# Trigger redeploy
```

### Method 2: Git Auto-Deploy (Recommended)
```bash
# Push code changes to Git
git add .
git commit -m "Update features"
git push origin main

# Render automatically rebuilds and deploys
```

## Additional Resources

- Render Documentation: https://render.com/docs
- Docker Hub: https://hub.docker.com
- Next.js Deployment: https://nextjs.org/docs/deployment
- Express.js Production: https://expressjs.com/en/advanced/best-practice-performance.html

## Support

If you encounter issues:
1. Check service logs in Render dashboard
2. Review this guide's troubleshooting section
3. Visit Render support: https://render.com/support
4. Check application logs in your terminal: `docker logs <container-id>`
