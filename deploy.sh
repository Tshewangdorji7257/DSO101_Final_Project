#!/bin/bash

# Deployment script for pushing Docker images to Docker Hub and Render
# Usage: ./deploy.sh yourusername v1.0

USERNAME=${1:-yourusername}
VERSION=${2:-latest}
REGISTRY=${3:-docker.io}

echo "================================"
echo "Docker Image Deployment Script"
echo "================================"
echo "Username: $USERNAME"
echo "Version: $VERSION"
echo "Registry: $REGISTRY"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker."
    exit 1
fi

# Login to Docker
echo "🔐 Logging in to Docker Hub..."
docker login

if [ $? -ne 0 ]; then
    echo "❌ Docker login failed"
    exit 1
fi

# Build backend
echo ""
echo "🏗️  Building backend image..."
docker build -t $USERNAME/blog-backend:$VERSION ./blog-backend

if [ $? -ne 0 ]; then
    echo "❌ Backend build failed"
    exit 1
fi

# Build frontend
echo ""
echo "🏗️  Building frontend image..."
docker build -t $USERNAME/blog-frontend:$VERSION ./blog-frontend

if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

# Push backend
echo ""
echo "📤 Pushing backend image..."
docker push $USERNAME/blog-backend:$VERSION

if [ $? -ne 0 ]; then
    echo "❌ Backend push failed"
    exit 1
fi

# Push frontend
echo ""
echo "📤 Pushing frontend image..."
docker push $USERNAME/blog-frontend:$VERSION

if [ $? -ne 0 ]; then
    echo "❌ Frontend push failed"
    exit 1
fi

echo ""
echo "✅ Deployment successful!"
echo ""
echo "Images published:"
echo "  Backend:  $USERNAME/blog-backend:$VERSION"
echo "  Frontend: $USERNAME/blog-frontend:$VERSION"
echo ""
echo "Next steps:"
echo "1. Go to https://dashboard.render.com"
echo "2. Update service image URLs in Render dashboard"
echo "3. Trigger manual deploy or wait for auto-deploy"
echo ""
echo "To set as latest:"
echo "  docker tag $USERNAME/blog-backend:$VERSION $USERNAME/blog-backend:latest"
echo "  docker push $USERNAME/blog-backend:latest"
echo "  docker tag $USERNAME/blog-frontend:$VERSION $USERNAME/blog-frontend:latest"
echo "  docker push $USERNAME/blog-frontend:latest"
