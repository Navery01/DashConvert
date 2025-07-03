@echo off
REM ====================================================================
REM DashConvert React App Service Batch File
REM This script runs the Next.js application in production mode
REM for use with NSSM (Non-Sucking Service Manager)
REM ====================================================================

REM Set the current directory to the script location
cd /d "%~dp0"

REM Set environment variables
set NODE_ENV=production
set PORT=3000

REM Log startup
echo [%date% %time%] Starting DashConvert React App Service >> service.log

REM Ensure the application is built
if not exist ".next" (
    echo [%date% %time%] Building application... >> service.log
    npm run build
    if errorlevel 1 (
        echo [%date% %time%] Build failed! >> service.log
        exit /b 1
    )
)

REM Start the Next.js application in production mode
echo [%date% %time%] Starting Next.js server on port %PORT% >> service.log
npm start

REM Log if the service stops
echo [%date% %time%] DashConvert React App Service stopped >> service.log