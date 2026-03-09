@echo off
REM RUTick Setup Script for Windows

setlocal enabledelayedexpansion

echo.
echo ========================================
echo   RUTick Project Setup for Windows
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Node.js is not installed.
    echo Please install Node.js 14+ from: https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js version: %NODE_VERSION%
echo.

REM Check MongoDB (optional)
where mongod >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [WARNING] MongoDB is not installed locally.
    echo Options:
    echo   - Install from: https://www.mongodb.com/try/download/community
    echo   - Use Docker: docker run -d -p 27017:27017 --name mongo mongo
    echo   - Use MongoDB Atlas: https://www.mongodb.com/cloud/atlas
    echo.
)

REM Check npm
where npm >nul 2>nul
if %ERRORLEVEL% neq 0 (
    echo [ERROR] npm is not installed.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm version: %NPM_VERSION%
echo.

echo ========================================
echo   Setting up Backend
echo ========================================
echo.

cd backend

REM Create .env file
if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env >nul
    echo.
    echo [ACTION REQUIRED] Edit backend\.env with your configuration:
    echo   - MONGODB_URI (for local: mongodb://localhost:27017/rutick)
    echo   - JWT_SECRET (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    echo   - SMTP_* settings (for email functionality)
    echo   - FRONTEND_URL
    echo.
) else (
    echo .env file already exists
)

REM Install dependencies
echo Installing npm dependencies...
call npm install

if %ERRORLEVEL% neq 0 (
    echo [ERROR] Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo [OK] Backend setup complete!
echo.

cd ..

echo ========================================
echo   Next Steps
echo ========================================
echo.
echo 1. Configure Environment:
echo    - Edit backend\.env with your settings
echo    - Use 'setup-env-generator.js' to generate JWT secrets
echo.
echo 2. Start MongoDB:
echo    - Local: mongod
echo    - Docker: docker run -d -p 27017:27017 mongo
echo.
echo 3. Start Backend:
echo    - cd backend
echo    - npm run dev
echo.
echo 4. Start Frontend:
echo    - Open index.html in a web browser
echo    - Or use: python -m http.server 3000
echo.
echo 5. Database Setup:
echo    - cd backend
echo    - npm run seed
echo.
echo ========================================
echo   Documentation
echo ========================================
echo.
echo - QUICKSTART.md    - 5-minute quick start
echo - README.md        - Full project overview
echo - DEPLOYMENT.md    - Production deployment guide
echo - backend/README.md - Backend API documentation
echo.
echo ========================================
echo   Docker Alternative
echo ========================================
echo.
echo If you prefer Docker:
echo   docker-compose up -d
echo.
echo This will start MongoDB, backend, and frontend automatically.
echo.
echo ========================================
echo.
echo Press any key to exit...
pause >nul
