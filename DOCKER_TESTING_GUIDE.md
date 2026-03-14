# Docker & PostgreSQL Testing Guide

This guide walks you through testing the Docker setup with PostgreSQL integration.

## ✅ Pre-Testing Checklist

- [ ] Docker is installed (`docker --version`)
- [ ] Docker Compose is installed (`docker compose version` or `docker-compose --version`)
- [ ] Windows: Docker Desktop is running
- [ ] Linux: Docker daemon is running (`sudo systemctl status docker`)
- [ ] Port 5432 (PostgreSQL) is available
- [ ] Port 5000 (Backend API) is available
- [ ] Port 80 (Frontend) is available

## 🐳 Configuration Fixes Applied

### ✅ Fixed Issues

1. **depends_on**: Changed from `mongodb:` to `postgres:` (was referencing non-existent MongoDB service)
2. **Volumes**: Replaced `mongo_data:` with `postgres_data:` (PostgreSQL data persistence)
3. **Networks**: Added proper `rutick-network` bridge configuration
4. **Environment Variables**: Added missing `RATE_LIMIT_WINDOW` and `RATE_LIMIT_MAX`
5. **.env File**: Updated `DB_HOST=postgres` for Docker connectivity

---

## 🚀 Step 1: Build Docker Images

```bash
cd d:\ind3x.html\ind3x.html

# Recommended: Build with no cache for fresh images
docker compose build --no-cache
```

**Expected Output:**

```
[+] Building 85.3s (20/20) FINISHED
 => backend
 => postgres postgres:16-alpine
 => frontend nginx:1.27-alpine
```

**Troubleshooting:**

- If Node.js build fails: Check internet connection for npm packages
- If Dockerfile not found: Ensure `backend/Dockerfile` exists
- If permission denied: Run with `sudo` on Linux

---

## 🔌 Step 2: Start Services

```bash
# Start in foreground (see all logs)
docker compose up

# OR start in background
docker compose up -d
```

**Expected Sequence:**

1. PostgreSQL starts and runs migrations (10-15 seconds)
2. Backend builds on first run (30-45 seconds)
3. Backend connects to PostgreSQL ✅
4. Frontend nginx starts

**Sample Healthy Output:**

```
rutick-postgres  | database system is ready to accept connections ✓
rutick-backend   | ✅ PostgreSQL Connected: postgres:5432 ✓
rutick-backend   | ✅ Database models synchronized ✓
rutick-backend   | ✅ Server running on http://0.0.0.0:5000 ✓
rutick-frontend  | ... listening on
```

---

## 📝 Step 3: Verify Services

### Check Running Containers

```bash
docker ps
```

Should show 3 containers:

- `rutick-postgres` - PostgreSQL 16
- `rutick-backend` - Node.js Backend
- `rutick-frontend` - Nginx Frontend

### Check Container Health

```bash
docker compose ps
```

All should show `healthy` status.

---

## 🧪 Step 4: Test API Endpoints

### Test Backend Health Check

```bash
# Returns: {"status":"API is running"}
curl http://localhost:5000/api/health
```

### Test Database Connection

```bash
# Check backend logs for database connection
docker compose logs backend | grep "PostgreSQL Connected"
```

### Test API (Sample)

```bash
# Register new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "test@example.com",
    "studentId": "TEST001",
    "department": "CS",
    "password": "Password@123"
  }'
```

### Test Frontend

```bash
# Open in browser
http://localhost:80
# or
http://localhost/
```

---

## 📊 Step 5: Database Testing

### Access PostgreSQL Directly (Optional)

```bash
# Connect to PostgreSQL container
docker compose exec postgres psql -U rutick_user -d rutick
```

Inside PostgreSQL:

```sql
-- List tables
\dt

-- Check Users table
SELECT email, role FROM "users" LIMIT 5;

-- Exit
\q
```

### Verify Models Synchronized

```bash
docker compose logs backend | grep "Database models synchronized"
```

---

## 🔍 Step 6: Seed Database (Optional)

```bash
# Run seed script in backend container
docker compose exec backend npm run seed
```

**Expected Output:**

```
✅ Database synchronized
✅ Sample users created
✅ Sample events created
✅ Sample registrations created
Database seeded successfully
```

---

## 🧹 Step 7: Cleanup & Restart

### View Container Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend
docker compose logs -f postgres
```

### Restart Services

```bash
# Restart all
docker compose restart

# Restart one service
docker compose restart backend
```

### Stop Services

```bash
# Stop all (keeps data)
docker compose stop

# Stop and remove containers (keeps volumes/data)
docker compose down

# Stop, remove containers AND volumes (clean slate)
docker compose down -v
```

---

## ⚠️ Common Issues & Solutions

### Issue: "depends_on: getaddrinfo ENOTFOUND postgres"

**Cause:** Backend can't find PostgreSQL container
**Fix:**

```bash
# Verify network
docker network ls
docker compose down -v
docker compose up
```

### Issue: "psql: error: connection refused"

**Cause:** PostgreSQL not healthy yet
**Fix:**

```bash
# Wait for PostgreSQL
docker compose logs postgres | grep "ready to accept"
```

### Issue: "RATE_LIMIT_WINDOW - NaN rate limit"

**Cause:** Environment variables not set
**Status:** ✅ FIXED in docker-compose.yml

### Issue: "Port 5000 already in use"

**Fix:**

```bash
# Find and kill process
lsof -i :5000  # macOS/Linux
netstat -ano | findstr :5000  # Windows
kill -9 <PID>  # or taskkill /PID <PID> /F
```

### Issue: "PostgreSQL connection failed"

**Check:**

```bash
# Verify environment variables
docker compose config | grep -A5 "backend:"

# Check PostgreSQL logs
docker compose logs postgres
```

---

## 📋 Full Testing Report Template

Use this checklist to verify everything works:

- [ ] PostgreSQL container started and healthy
- [ ] Backend connected to PostgreSQL successfully
- [ ] Health check endpoint responds (HTTP 200)
- [ ] Can register new user (POST /api/auth/register)
- [ ] Can login user (POST /api/auth/login)
- [ ] Can fetch events (GET /api/events)
- [ ] Frontend loads without errors
- [ ] No console errors in browser DevTools
- [ ] Database tables created (check via psql)
- [ ] Rate limiting works (send 150+ requests fast)

---

## 🚀 Production Deployment Checklist

Before deploying to production:

- [ ] Review `.env` - all values updated from defaults
- [ ] JWT secrets rotated (32+ character random strings)
- [ ] SMTP credentials configured
- [ ] FRONTEND_URL updated to production domain
- [ ] CORS_ORIGIN updated to production domain
- [ ] Set `NODE_ENV=production`
- [ ] Database backups configured
- [ ] SSL/TLS certificates installed
- [ ] Rate limiting tuned for expected load
- [ ] Logs persist and are monitored

---

## 📞 Support

If issues persist:

1. Check logs: `docker compose logs backend`
2. Verify network: `docker network inspect rutick_rutick-network`
3. Test individual services: `docker compose logs postgres`
4. Clean rebuild: `docker compose down -v && docker compose build --no-cache && docker compose up`
