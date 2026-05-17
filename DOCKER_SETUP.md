# Docker Setup Guide

This guide explains how to containerize and run the blog application using Docker.

## Prerequisites

- Docker installed and running
- Docker Compose installed (usually comes with Docker Desktop)

## Project Structure

```
├── blog-backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── src/
├── blog-frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── app/
├── docker-compose.yml
└── .env.docker
```

## Quick Start

### Option 1: Using Docker Compose (Recommended)

```bash
# Build and start both services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 2: Build Images Individually

```bash
# Build backend image
docker build -t blog-backend ./blog-backend

# Build frontend image
docker build -t blog-frontend ./blog-frontend

# Run backend
docker run -d -p 5000:5000 --name blog-backend blog-backend

# Run frontend
docker run -d -p 3000:3000 --name blog-frontend blog-frontend
```

## Accessing the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## Configuration

### Backend Environment Variables

The backend uses the following environment variables (set in `docker-compose.yml`):

- `NODE_ENV`: Set to `production`
- `PORT`: Backend port (default: 5000)
- `FRONTEND_URL`: Frontend URL for CORS (default: http://localhost:3000)
- `DATABASE_URL`: SQLite database path (default: /app/data/blog.db)

### Frontend Environment Variables

- `NODE_ENV`: Set to `production`
- `NEXT_PUBLIC_API_URL`: Backend API URL (default: http://localhost:5000/api)

## Volumes

The backend service uses a volume to persist SQLite database:
- `./blog-backend/data:/app/data` - Persists database between container restarts

## Networking

Both services are connected via a custom Docker network (`blog-network`), allowing them to communicate using service names.

## Health Checks

Both containers include health checks that run every 30 seconds:
- **Backend**: Checks `/api/health` endpoint
- **Frontend**: Checks root endpoint

## Common Commands

```bash
# View service status
docker-compose ps

# View logs for specific service
docker-compose logs backend
docker-compose logs frontend

# Rebuild images
docker-compose up -d --build

# Remove all containers and volumes
docker-compose down -v

# Execute command in container
docker exec -it blog-backend npm run dev
docker exec -it blog-frontend pnpm run dev

# View resource usage
docker stats
```

## Troubleshooting

### Services not connecting
- Ensure both services are on the same network
- Check Docker daemon is running
- Verify ports aren't already in use

### Build failures
- Clear Docker cache: `docker-compose build --no-cache`
- Check Dockerfile syntax
- Verify package.json dependencies are correct

### Database not persisting
- Ensure `./blog-backend/data` directory exists
- Check volume mount permissions

### Port conflicts
- Change ports in `docker-compose.yml` if 3000 or 5000 are in use
- Example: Change `"3000:3000"` to `"3001:3000"`

## Production Considerations

For production deployments:

1. Use `.env` files for sensitive data
2. Consider using environment-specific compose files
3. Set up proper logging and monitoring
4. Use a reverse proxy (nginx) in front
5. Enable HTTPS/TLS
6. Consider using container orchestration (Kubernetes)
7. Implement proper resource limits in compose file
8. Use multi-stage builds to reduce image size

## Development Mode

To run containers in development mode with hot reload:

```bash
# Modify docker-compose.yml to use dev scripts
# Or create docker-compose.dev.yml with different commands
docker-compose -f docker-compose.dev.yml up -d
```

Create `docker-compose.dev.yml`:

```yaml
version: '3.8'

services:
  backend:
    # ... existing config ...
    command: npm run dev
    environment:
      # ... existing env ...

  frontend:
    # ... existing config ...
    command: pnpm run dev
    environment:
      # ... existing env ...
```
