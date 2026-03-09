# Windows Setup Guide for RUTick

This guide covers everything you need to set up RUTick on Windows 10/11.

## Prerequisites

### 1. Install Node.js & npm

1. Visit https://nodejs.org/
2. Download **LTS version** (not the Current version)
3. Run the installer and follow the defaults
4. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

### 2. Install Git

1. Visit https://git-scm.com/download/win
2. Download and install with default options
3. Verify installation:
   ```cmd
   git --version
   ```

### 3. Install MongoDB (One of the following)

#### Option A: Docker Desktop (Recommended)

1. Download Docker Desktop: https://www.docker.com/products/docker-desktop
2. Install and restart your computer
3. Verify:
   ```cmd
   docker --version
   ```

#### Option B: Local MongoDB Installation

1. Download from: https://www.mongodb.com/try/download/community
2. Select Windows MSI Installer
3. Installation defaults work fine
4. Verify:
   ```cmd
   mongod --version
   ```

#### Option C: MongoDB Atlas (Cloud)

1. Create free account: https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Get connection string (for .env file)

## Quick Start (5 Minutes)

### Step 1: Clone or Download Project

```cmd
cd D:\projects
git clone <repository-url> rutick
cd rutick
```

### Step 2: Generate JWT Secrets

```cmd
node setup-env-generator.js
```

This creates `backend\.env` with secure random secrets.

### Step 3: Run Setup Script

```cmd
setup.bat
```

This installs all backend dependencies and verifies Node.js/npm.

### Step 4: Configure Environment Variables

Edit `backend\.env`:

```
# Most important settings to change:
MONGODB_URI=mongodb://localhost:27017/rutick
JWT_SECRET=<run setup-env-generator.js to get this>
REFRESH_TOKEN_SECRET=<run setup-env-generator.js to get this>
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password-from-google
FRONTEND_URL=http://localhost:3000
```

### Step 5: Start MongoDB

#### If using Docker:

```cmd
docker run -d -p 27017:27017 --name rutick-mongo mongo:7.0
```

#### If using local installation:

```cmd
"C:\Program Files\MongoDB\Server\<VERSION>\bin\mongod.exe"
```

Keep this terminal open in the background.

### Step 6: Start Backend Server

```cmd
cd backend
npm run dev
```

You should see:

```
✓ MongoDB connected
✓ Server running on http://localhost:5000
```

### Step 7: Start Frontend

Open `index.html` in your browser:

- Double-click `index.html` in Explorer, OR
- Right-click → Open with → Browser

Or use Python's built-in server:

```cmd
cd d:\path\to\rutick
python -m http.server 3000
```

Then open: `http://localhost:3000`

### Step 8: Seed Database (Optional)

In a new terminal:

```cmd
cd backend
npm run seed
```

Test credentials:

- **Student**: rutick_student1 / password
- **Admin**: rutick_admin / password
- **Staff**: rutick_staff / password

## Using Docker Desktop (All-in-One)

If Docker Desktop is installed, run everything with one command:

```cmd
docker-compose up -d
```

Then:

- **Backend**: http://localhost:5000
- **Frontend**: http://localhost:80
- **MongoDB**: localhost:27017

View logs:

```cmd
docker logs rutick-backend
docker logs rutick-mongo
```

Stop everything:

```cmd
docker-compose down
```

## Troubleshooting

### "Node.js is not recognized"

- **Cause**: Node.js not installed or terminal not restarted
- **Fix**: Restart Command Prompt after installing Node.js

### "Cannot find MongoDB connection"

- **Cause**: MongoDB not running
- **Fix**: Start MongoDB (Docker or local installation)
- **Check**: In a new terminal, run `mongo` or `mongosh`

### "Port 5000 already in use"

- **Cause**: Another application using this port
- **Fix**: Change `PORT` in backend/.env to 5001
- **Or**: Kill the process: `netstat -ano | findstr :5000` then `taskkill /PID <PID> /F`

### "CORS origin not allowed"

- **Cause**: Frontend and backend URLs don't match
- **Fix**: Update `CORS_ORIGIN` in backend/.env to match your frontend URL
- **Default**: `http://localhost:3000`

### "Email not sending"

- **Cause**: SMTP credentials wrong or 2FA enabled without app password
- **Fix**: For Gmail:
  1. Enable 2-Step Verification: https://myaccount.google.com/security
  2. Generate App Password: https://myaccount.google.com/apppasswords
  3. Use the 16-character password in SMTP_PASSWORD

### "Cannot connect to MongoDB Atlas"

- **Cause**: Connection string incorrect or IP not whitelisted
- **Fix**: In MongoDB Atlas:
  1. Go to Network Access → Add Current IP
  2. Or add 0.0.0.0/0 for development (NOT for production)
  3. Copy connection string and update MONGODB_URI

### Port 3000 already in use

- **Fix**: Use different port: `python -m http.server 3001`

## Development Workflow

### Terminal Setup

Open 4 terminals (or terminal tabs):

**Terminal 1 - MongoDB:**

```cmd
docker run -p 27017:27017 --name rutick-mongo mongo:7.0
```

**Terminal 2 - Backend:**

```cmd
cd backend
npm run dev
```

**Terminal 3 - Frontend Server:**

```cmd
python -m http.server 3000
```

**Terminal 4 - Additional commands:**

```cmd
# Run tests
cd backend && npm test

# Seed database
cd backend && npm run seed

# Format code
cd backend && npm run format
```

### Environment Configuration

Key environment variables in `backend\.env`:

| Variable     | Purpose                      | Example                          |
| ------------ | ---------------------------- | -------------------------------- |
| MONGODB_URI  | Database connection          | mongodb://localhost:27017/rutick |
| JWT_SECRET   | Token signing (CHANGE THIS!) | 64-char hex string               |
| SMTP_USER    | Email sender account         | your-email@gmail.com             |
| FRONTEND_URL | Frontend location            | http://localhost:3000            |
| PORT         | API server port              | 5000                             |
| NODE_ENV     | Environment mode             | development                      |

## Production Deployment

### On Windows Server

1. Install Node.js LTS
2. Use PM2 to keep backend running:

   ```cmd
   npm install -g pm2
   pm2 start "npm run start" --name "rutick-api"
   pm2 startup
   ```

3. Use IIS or Nginx as reverse proxy
4. Use MongoDB Atlas (cloud) instead of local MongoDB

### To Docker + Cloud

1. Build: `docker-compose build`
2. Push to Docker Hub/Azure Container Registry
3. Deploy to: Azure, AWS, DigitalOcean, Heroku
4. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed steps

## Testing the API

Use Postman or VS Code REST Client:

**Register new user:**

```http
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@riarauniversity.ac.ke",
  "studentId": "RU2024999",
  "password": "SecurePass123"
}
```

**Login:**

```http
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@riarauniversity.ac.ke",
  "password": "SecurePass123"
}
```

**Get all events:**

```http
GET http://localhost:5000/api/events
```

## Getting Help

- 📖 **QUICKSTART.md** - 5-minute overview
- 📚 **README.md** - Full project documentation
- 🚀 **DEPLOYMENT.md** - Production setup
- 📋 **backend/README.md** - API endpoints reference
- 🐛 **Issues**: Check GitHub Issues or raise a new one

## Quick Commands Reference

```cmd
# Generate secrets
node setup-env-generator.js

# Setup backend
setup.bat

# Install dependencies
cd backend && npm install

# Start development server
cd backend && npm run dev

# Seed test data
cd backend && npm run seed

# Run tests
cd backend && npm test

# Format code
cd backend && npm run format

# Start with Docker
docker-compose up -d

# View Docker logs
docker logs rutick-backend

# Stop Docker
docker-compose down
```

## Next Steps

1. ✅ Complete environment setup (you are here)
2. Create your first event
3. Register for an event
4. Generate a certificate
5. Review an event
6. Deploy to production

Happy coding! 🚀
