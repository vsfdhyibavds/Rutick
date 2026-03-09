# Troubleshooting Guide

This guide covers common issues and solutions for RUTick.

## Installation Issues

### ❌ "npm is not recognized"

**Symptoms**: Command not found when running `npm` or `node` in terminal

**Solutions**:

1. Check if Node.js is installed:
   ```cmd
   node --version
   ```
2. If not installed, download from https://nodejs.org (LTS version)
3. **Restart Command Prompt AFTER installing** Node.js
4. Close and reopen all terminals
5. Verify: `npm --version`

**Windows-specific**:

- Ensure Node.js installation folder is in PATH
- Search "Environment Variables" in Windows
- Edit PATH and add: `C:\Program Files\nodejs`
- Restart computer

---

## Backend Issues

### ❌ "Cannot GET /api/events" (404)

**Symptoms**: API returns 404 error

**Causes & Solutions**:

1. Backend not running
   ```cmd
   cd backend && npm run dev
   ```
2. Wrong API base URL in frontend
   - Edit `scripts/api.js`
   - Check `API_BASE_URL` matches running server
   ```js
   const API_BASE_URL = "http://localhost:5000/api";
   ```
3. API started but not ready
   - Wait 2-3 seconds, try again
   - Check terminal for errors

**Debug**: Open `http://localhost:5000` - should show welcome message

---

### ❌ "Error: connect ECONNREFUSED 127.0.0.1:27017"

**Symptoms**: MongoDB connection failed

**Causes & Solutions**:

1. **MongoDB not running**

   If using Docker:

   ```cmd
   docker ps
   ```

   If not seeing mongo container, start it:

   ```cmd
   docker run -d -p 27017:27017 --name rutick-mongo mongo:7.0
   ```

2. **MongoDB URI wrong in .env**

   Check `backend\.env`:

   ```
   MONGODB_URI=mongodb://localhost:27017/rutick
   ```

   For MongoDB Atlas:

   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/rutick
   ```

3. **MongoDB installed but not started**

   ```cmd
   "C:\Program Files\MongoDB\Server\<VERSION>\bin\mongod.exe"
   ```

4. **Port 27017 already in use**
   ```cmd
   netstat -ano | findstr :27017
   taskkill /PID <PID> /F
   ```

**Debug**: Test connection

```cmd
mongosh mongodb://localhost:27017
```

---

### ❌ "ValidationError: email is not valid"

**Symptoms**: Email registration fails

**Solutions**:

1. Use university email domain
   - Accepted: `name@riarauniversity.ac.ke`
   - Rejected: `name@gmail.com`

2. Check `backend/src/models/User.js` for allowed domains:

   ```js
   validate: {
     validator: function(v) {
       return /.*@riarauniversity\.ac\.ke$/.test(v);
     }
   }
   ```

3. To add more domains, edit User model

---

### ❌ "Error: ENOENT: no such file or directory, open '/path/to/.env'"

**Symptoms**: Backend won't start, .env file error

**Solutions**:

1. Create .env file:

   ```cmd
   cd backend
   copy .env.example .env
   ```

2. Or use setup script:

   ```cmd
   node setup-env-generator.js
   ```

3. Fill in required fields (see .env.example for defaults)

4. Restart backend:
   ```cmd
   npm run dev
   ```

---

### ❌ "Listening on port 5000" but connection refused

**Symptoms**: Server claims to be running but can't connect

**Solutions**:

1. Check if port is really open:

   ```cmd
   netstat -ano | findstr :5000
   ```

2. If port shows as LISTENING but still can't connect:
   - Windows Firewall blocking: Disable or add exception
   - Try alternate port in .env

   ```
   PORT=5001
   ```

   - Update frontend `API_BASE_URL` to match

3. Check for binding errors in logs:
   ```cmd
   # Change PORT in .env
   PORT=8000
   npm run dev
   ```

---

## Frontend Issues

### ❌ Blank page or "Cannot find api"

**Symptoms**: Frontend loads but shows errors

**Solutions**:

1. Open browser developer console (F12)
2. Look for errors with "api" or "localhost:5000"
3. Check `scripts/api.js` - API_BASE_URL correct?
   ```js
   const API_BASE_URL = "http://localhost:5000/api";
   ```
4. Is backend running?
   ```cmd
   cd backend && npm run dev
   ```
5. Check CORS in `backend\.env`:
   ```
   CORS_ORIGIN=http://localhost:3000
   ```

**Debug**:

- Use DevTools Network tab
- Watch for failed requests
- Check response status codes

---

### ❌ "CORS error" in browser console

**Symptoms**: Blocked by CORS policy error

**Solutions**:

1. Check console error message for exact origin
2. Update `backend\.env`:
   ```
   CORS_ORIGIN=http://specific-origin:port
   ```
3. If running on different port:
   ```
   CORS_ORIGIN=http://localhost:3001
   ```
4. For development only, allow all:

   ```
   CORS_ORIGIN=*
   ```

   (⚠️ NOT for production!)

5. Restart backend to apply changes

---

### ❌ "Cannot read property of undefined" in console

**Symptoms**: JavaScript errors, features don't work

**Solutions**:

1. Open DevTools (F12)
2. Check Console tab for full error
3. Common causes:
   - API not returning expected data
   - Empty response from server
   - Trying to access nested property that doesn't exist

4. Verify:
   - Backend is running
   - Database has data
   - API endpoints return proper JSON

---

## Authentication Issues

### ❌ Login fails silently

**Symptoms**: Click login, nothing happens or redirect fails

**Solutions**:

1. Check browser console for errors
2. Verify test credentials:

   ```
   Email: rutick_student1@riarauniversity.ac.ke
   Password: password
   ```

   (From `npm run seed`)

3. Verify JWT_SECRET in backend/.env is set:

   ```
   JWT_SECRET=your-long-random-string-here
   ```

4. Check token in browser Storage:
   - Open DevTools → Application → Local Storage
   - Should have `authToken` and `refreshToken`

5. Password case-sensitive? Yes, check caps lock

---

### ❌ Token expired immediately

**Symptoms**: Can't stay logged in, redirects to login

**Solutions**:

1. Check `backend\.env`:

   ```
   JWT_EXPIRE=7d
   ```

2. Browser not saving LocalStorage:
   - Check if cookies enabled
   - Check Incognito mode (doesn't save storage)
   - Clear cache: DevTools → Application → Clear Storage

3. Server time out of sync:
   - Sync Windows system clock
   - Settings → Time & Language → Date & Time
   - Set "Sync now"

---

### ❌ "Email already registered" but didn't register

**Symptoms**: Registration form rejects email as duplicate

**Solutions**:

1. Email already exists in database

   ```cmd
   # Reset database (development only!)
   cd backend
   npm run seed
   ```

2. Check database directly:

   ```cmd
   mongosh
   use rutick
   db.users.find({email: "your-email@..."})
   ```

3. If you want to use same email again:
   - Delete user from database
   - Or use different email

---

## Email Issues

### ❌ Emails not sending

**Symptoms**: Registration complete but no email received

**Solutions**:

1. **Gmail/Google Account**

   Problem: Using account password directly

   Solution: Use App Password instead
   - Enable 2-Step Verification: https://myaccount.google.com/security
   - Generate App Password: https://myaccount.google.com/apppasswords
   - Update `backend\.env`:

   ```
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=generated-16-char-password-from-google
   ```

2. **SMTP credentials wrong**

   Test in .env with known working credentials:

   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=test@gmail.com
   SMTP_PASSWORD=your-app-password
   SMTP_FROM=noreply@your-domain.com
   ```

3. **Port incorrect**

   Correct ports:
   - Gmail TLS: 587 (usually correct)
   - Gmail SSL: 465
   - Custom SMTP: varies

4. **Firewall blocking SMTP**

   Solution: Disable Windows Firewall for testing, or:
   - Use Gmail (usually works)
   - Use email provider in corporate environment
   - Contact IT for SMTP access

5. **Check logs**

   In backend terminal, watch for email errors:

   ```cmd
   # Restart with logging
   npm run dev
   # Register a user
   # Look for email sending logs
   ```

### ✅ Testing without email

To skip email setup while testing:

1. Edit `backend/src/utils/email.js`
2. Make `sendEmail()` return success without sending:
   ```js
   async function sendEmail(to, subject, html) {
     console.log(`[TEST] Email would send to: ${to}`);
     console.log(`[TEST] Subject: ${subject}`);
     return true; // Pretend it sent
   }
   ```

---

## Database Issues

### ❌ Database reset needed

**Symptoms**: Want clean slate, test data corrupted

**Solutions**:

1. **Soft delete (recommended)**

   ```cmd
   cd backend
   npm run seed
   ```

   This creates fresh test data without destroying old data.

2. **Hard reset** (deletes everything!)

   ```cmd
   mongosh
   use rutick
   db.users.deleteMany({})
   db.events.deleteMany({})
   db.registrations.deleteMany({})
   db.reviews.deleteMany({})
   db.certificates.deleteMany({})
   db.reminders.deleteMany({})
   ```

   Then: `npm run seed`

3. **MongoDB Atlas reset**
   - Go to Collections
   - Select each collection
   - Delete documents
   - Or create new cluster

---

## Docker Issues

### ❌ Docker command not found

**Symptoms**: `docker: command not found` or `is not recognized`

**Solutions**:

1. Docker Desktop not installed
   - Download: https://www.docker.com/products/docker-desktop
   - Install and restart computer
   - Verify: `docker --version`

2. Docker Desktop not running
   - Start: Search "Docker" in Windows
   - Click "Docker Desktop"
   - Wait for status icon in taskbar

3. Terminal not updated after install
   - Close ALL terminals
   - Restart computer
   - Re-open terminal

---

### ❌ "docker-compose up" fails

**Symptoms**: Error starting containers

**Solutions**:

1. **Port already in use**

   ```cmd
   docker-compose down
   docker ps -a | grep rutick
   docker rm <container_id>
   docker-compose up -d
   ```

2. **Docker Desktop not running**
   - Open Docker Desktop from Windows menu
   - Wait for engine to start (check taskbar icon)

3. **Insufficient resources**
   - Check Docker Desktop Settings
   - Increase CPU/Memory allocation
   - Requires at least 2 CPU, 2GB RAM

4. **MongoDB volume conflict**
   ```cmd
   docker volume rm rutick_mongo_data
   docker-compose up -d
   ```

---

### ❌ Cannot access service from host

**Symptoms**: Can't reach localhost:5000 even though Docker shows running

**Solutions**:

1. Check container is actually running:

   ```cmd
   docker ps
   ```

   If not listed, check logs:

   ```cmd
   docker logs rutick-backend
   ```

2. Verify port mapping:

   ```cmd
   docker port rutick-backend
   ```

   Should show: `5000/tcp -> 0.0.0.0:5000`

3. Windows Firewall blocking:
   - Add Docker exception to firewall
   - OR temporarily disable: Settings → Windows Defender Firewall

4. Try from inside container:
   ```cmd
   docker exec rutick-backend curl http://localhost:5000
   ```

---

## Performance Issues

### ❌ Slow API responses

**Symptoms**: Requests take >2 seconds, timeouts occur

**Solutions**:

1. **Database too slow**
   - Check MongoDB is running efficiently
   - Verify indexes exist: `db.events.getIndexes()`
   - MongoDB Atlas: Check connection string

2. **Too many records**
   - Check pagination works: `GET /api/events?page=1&limit=20`
   - Remove seedDatabase duplicates

3. **Network latency**
   - Test: `ping localhost`
   - Check DNS setup
   - Try different network

4. **Server overloaded**
   - Check CPU/memory usage: Resource Monitor
   - Restart backend: Stop and `npm run dev` again

---

## Common Errors - Quick Reference

| Error           | Cause                             | Fix                                      |
| --------------- | --------------------------------- | ---------------------------------------- |
| ECONNREFUSED    | MongoDB not running               | `docker run mongo`                       |
| CORS error      | Frontend-backend origin mismatch  | Update CORS_ORIGIN in .env               |
| ValidationError | Invalid email/data format         | Check .env and test data                 |
| ENOENT .env     | .env file missing                 | `copy .env.example .env`                 |
| 404 not found   | Wrong API URL or endpoint         | Check api.js URL and endpoint path       |
| Port in use     | Another app using port 5000       | Change PORT in .env or kill process      |
| Token expired   | JWT secret mismatch or time issue | Verify JWT_SECRET matches and sync clock |

---

## Getting More Help

- **Check backend logs**: Look at terminal where `npm run dev` is running
- **Check browser console**: Press F12 in browser
- **Docker logs**: `docker logs rutick-backend`
- **Database inspection**: Use mongosh or MongoDB Compass
- **VS Code**: Install REST Client extension to test API
- **Postman**: Import API and test endpoints

---

## Still Stuck?

1. Note exact error message
2. Check what you did before error occurred
3. Stop all services: `npm run dev` (Ctrl+C), `docker-compose down`
4. Start fresh: `npm run dev` in new terminal
5. Reproduce the issue step-by-step
6. Share error message and steps with team

99% of issues are:

- ✅ Port conflicts
- ✅ MongoDB not running
- ✅ .env file missing or incomplete
- ✅ CORS mismatch
- ✅ Wrong email credentials

Try these first!
