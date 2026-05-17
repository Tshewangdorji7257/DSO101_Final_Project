@echo off
REM Windows deployment script for pushing Docker images to Docker Hub and Render
REM Usage: deploy.bat yourusername v1.0

setlocal enabledelayedexpansion

set USERNAME=%1
set VERSION=%2
set REGISTRY=%3

if "%USERNAME%"=="" set USERNAME=yourusername
if "%VERSION%"=="" set VERSION=latest
if "%REGISTRY%"=="" set REGISTRY=docker.io

echo ================================
echo Docker Image Deployment Script
echo ================================
echo Username: %USERNAME%
echo Version: %VERSION%
echo Registry: %REGISTRY%
echo.

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Docker is not running. Please start Docker.
    exit /b 1
)

REM Login to Docker
echo 🔐 Logging in to Docker Hub...
call docker login

if errorlevel 1 (
    echo ❌ Docker login failed
    exit /b 1
)

REM Build backend
echo.
echo 🏗️  Building backend image...
call docker build -t %USERNAME%/blog-backend:%VERSION% ./blog-backend

if errorlevel 1 (
    echo ❌ Backend build failed
    exit /b 1
)

REM Build frontend
echo.
echo 🏗️  Building frontend image...
call docker build -t %USERNAME%/blog-frontend:%VERSION% ./blog-frontend

if errorlevel 1 (
    echo ❌ Frontend build failed
    exit /b 1
)

REM Push backend
echo.
echo 📤 Pushing backend image...
call docker push %USERNAME%/blog-backend:%VERSION%

if errorlevel 1 (
    echo ❌ Backend push failed
    exit /b 1
)

REM Push frontend
echo.
echo 📤 Pushing frontend image...
call docker push %USERNAME%/blog-frontend:%VERSION%

if errorlevel 1 (
    echo ❌ Frontend push failed
    exit /b 1
)

echo.
echo ✅ Deployment successful!
echo.
echo Images published:
echo   Backend:  %USERNAME%/blog-backend:%VERSION%
echo   Frontend: %USERNAME%/blog-frontend:%VERSION%
echo.
echo Next steps:
echo 1. Go to https://dashboard.render.com
echo 2. Update service image URLs in Render dashboard
echo 3. Trigger manual deploy or wait for auto-deploy
echo.
echo To set as latest:
echo   docker tag %USERNAME%/blog-backend:%VERSION% %USERNAME%/blog-backend:latest
echo   docker push %USERNAME%/blog-backend:latest
echo   docker tag %USERNAME%/blog-frontend:%VERSION% %USERNAME%/blog-frontend:latest
echo   docker push %USERNAME%/blog-frontend:latest

endlocal
