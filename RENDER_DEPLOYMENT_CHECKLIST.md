# Render Deployment Checklist

## Pre-Deployment

- [ ] Docker images built successfully locally
- [ ] Docker Hub account created
- [ ] Docker images tested locally with `docker-compose up`
- [ ] Git repository initialized (if using auto-deploy)
- [ ] All environment variables documented

## Step 1: Push Imag



es to Docker Hub

- [ ] Run `docker login`
- [ ] Build backend: `docker build -t yourusername/blog-backend:latest ./blog-backend`
- [ ] Build frontend: `docker build -t yourusername/blog-frontend:latest ./blog-frontend`
- [ ] Push backend: `docker push yourusername/blog-backend:latest`
- [ ] Push frontend: `docker push yourusername/blog-frontend:latest`
- [ ] Verify images are public on Docker Hub

## Step 2: Create Backend Service on Render

- [ ] Go to https://dashboard.render.com
- [ ] Click "New +" → "Web Service"
- [ ] Select "Deploy an existing image from a registry"
- [ ] Enter image URL: `yourusername/blog-backend:latest`
- [ ] Set service name: `blog-backend`
- [ ] Choose region
- [ ] Add environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `PORT=5000`
  - [ ] `FRONTEND_URL=https://blog-frontend.onrender.com` (update with actual domain)
  - [ ] `DATABASE_URL=/app/data/blog.db`
- [ ] Add persistent disk at `/app/data` (1 GB minimum)
- [ ] Deploy service
- [ ] Wait for "Live" status (5-10 minutes)
- [ ] Note the service URL (e.g., `https://blog-backend.onrender.com`)

## Step 3: Create Frontend Service on Render

- [ ] Click "New +" → "Web Service"
- [ ] Select "Deploy an existing image from a registry"
- [ ] Enter image URL: `yourusername/blog-frontend:latest`
- [ ] Set service name: `blog-frontend`
- [ ] Same region as backend
- [ ] Add environment variables:
  - [ ] `NODE_ENV=production`
  - [ ] `NEXT_PUBLIC_API_URL=https://blog-backend.onrender.com/api` (use actual backend domain)
- [ ] Deploy service
- [ ] Wait for "Live" status
- [ ] Note the service URL (e.g., `https://blog-frontend.onrender.com`)

## Step 4: Verify Deployment

### Backend Tests
- [ ] Visit `https://blog-backend.onrender.com/api/health` in browser
- [ ] Check logs in Render dashboard for errors
- [ ] No 502 Bad Gateway errors

### Frontend Tests
- [ ] Visit `https://blog-frontend.onrender.com` in browser
- [ ] Page loads without errors
- [ ] UI displays correctly
- [ ] Open DevTools → Console, check for errors

### Integration Tests
- [ ] Try to log in (if login available)
- [ ] Try to create a post
- [ ] Check DevTools Network tab for API calls
- [ ] API calls go to correct backend URL
- [ ] No CORS errors in console

## Step 5: Production Setup

- [ ] Set auto-deploy from Git (if repository connected):
  - [ ] Go to service settings
  - [ ] Connect Git repository
  - [ ] Enable auto-deploy on push
  
- [ ] Configure custom domain (if needed):
  - [ ] In service settings, go to "Custom Domain"
  - [ ] Add your domain (e.g., myblog.com)
  - [ ] Configure DNS records as shown
  - [ ] SSL automatically provisioned

- [ ] Set up notifications (optional):
  - [ ] Enable deployment notifications
  - [ ] Set up error alerts

## Monitoring

- [ ] Check service metrics regularly
- [ ] Monitor CPU and memory usage
- [ ] Review logs for errors or warnings
- [ ] Set up uptime monitoring

## Backup & Recovery

- [ ] Database is persisted on disk
- [ ] Test recovery process (optional)
- [ ] Document backup strategy

## Troubleshooting

If services don't start:
- [ ] Check service logs for error messages
- [ ] Verify environment variables are correct
- [ ] Ensure image exists and is public on Docker Hub
- [ ] Check port is correctly exposed

If frontend can't connect to backend:
- [ ] Verify `NEXT_PUBLIC_API_URL` is correct
- [ ] Check CORS settings in backend
- [ ] Test backend URL directly in browser
- [ ] Check backend logs for errors

If database doesn't persist:
- [ ] Verify persistent disk is mounted at `/app/data`
- [ ] Check disk has sufficient space
- [ ] Review backend logs

## Additional Resources

- Render Dashboard: https://dashboard.render.com
- Docker Hub: https://hub.docker.com
- Render Docs: https://render.com/docs
- Support: https://render.com/support

---

**Deployment Date:** _______________  
**Backend URL:** _______________  
**Frontend URL:** _______________  
**Notes:** _______________
