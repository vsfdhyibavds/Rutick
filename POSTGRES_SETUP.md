# PostgreSQL Setup Guide for RUTick

**NOTE:** This project uses **PostgreSQL with Sequelize ORM**, not MongoDB.

## 🚀 Quick Start (4 Steps)

### Step 1: Setup Backend

```bash
cd /home/eugene/Rutick/Rutick/backend
npm install
cp .env.example .env
```

### Step 2: Configure PostgreSQL Connection

Edit `backend/.env`:

```env
# Database Configuration (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rutick
DB_USER=postgres
DB_PASSWORD=postgres  # Change this!

# JWT Secrets (run: node setup-env-generator.js in root)
JWT_SECRET=your_long_random_key_here
REFRESH_TOKEN_SECRET=another_long_random_key_here

# Other required settings
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:8000
CORS_ORIGIN=http://localhost:8000
```

### Step 3: Start PostgreSQL (Choose One)

**Option A: Using Docker (Easiest)**

```bash
docker run -d -p 5432:5432 --name rutick-postgres \
  -e POSTGRES_PASSWORD=postgres \
  postgres:16-alpine
```

**Option B: Local PostgreSQL Installation**

```bash
# PostgreSQL usually starts automatically
# Verify:
psql --version
```

**Option C: Cloud PostgreSQL (AWS RDS, Heroku, DigitalOcean)**

1. Create database instance
2. Get connection credentials
3. Update `.env` with:
   ```env
   DB_HOST=your-host.example.com
   DB_USER=your_username
   DB_PASSWORD=your_password
   DB_NAME=rutick
   DB_PORT=5432
   ```

### Step 4: Start Backend & Frontend

**Terminal 1: Backend**

```bash
cd /home/eugene/Rutick/Rutick/backend
npm run dev
```

Expected output:

```
✓ PostgreSQL Connected: localhost:5432
✓ Database models synchronized
✓ Server running on http://0.0.0.0:5000
```

**Terminal 2: Frontend**

```bash
cd /home/eugene/Rutick/Rutick
python -m http.server 8000
```

**Terminal 3: Seed Database (Optional)**

```bash
cd /home/eugene/Rutick/Rutick/backend
npm run seed
```

Then open browser: **http://localhost:8000**

---

## 📋 PostgreSQL vs MongoDB Differences

| Aspect              | MongoDB       | PostgreSQL                                                |
| ------------------- | ------------- | --------------------------------------------------------- |
| **Config Variable** | `MONGODB_URI` | `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` |
| **ORM**             | Mongoose      | Sequelize                                                 |
| **Connection Test** | `mongosh`     | `psql`                                                    |
| **Port**            | 27017         | 5432                                                      |
| **ID Format**       | ObjectId      | UUID (auto-generated)                                     |

---

## 🔧 Terminal Commands

### PostgreSQL Connection

```bash
# Connect to database
psql -U postgres -h localhost -p 5432 -d rutick

# Inside psql prompt:
\dt              # List tables
\d "users"       # Show users table structure
SELECT COUNT(*) FROM "users";  # Count rows
SELECT * FROM "users" LIMIT 5; # View data
\q               # Quit
```

### Docker Commands

```bash
# Start PostgreSQL container
docker run -d -p 5432:5432 --name rutick-postgres \
  -e POSTGRES_PASSWORD=postgres postgres:16-alpine

# View logs
docker logs rutick-postgres

# Stop container
docker stop rutick-postgres

# Remove container
docker rm rutick-postgres

# Check if running
docker ps | grep postgres
```

### Backend Commands

```bash
# Install dependencies
cd backend && npm install

# Start development server
npm run dev

# Run tests
npm test

# Seed database
npm run seed

# Check database connection
npm run test:db  # If available, or check logs
```

---

## ✅ Verification Checklist

After setup, verify everything works:

```bash
# 1. PostgreSQL is running
psql -U postgres -h localhost -p 5432 -c "SELECT 1"

# 2. Backend is running
curl http://localhost:5000/api/health

# 3. Frontend loads
curl http://localhost:8000 | head -20

# 4. Database has tables
psql -U postgres -h localhost -p 5432 -d rutick -c "\dt"

# 5. Seed data exists
curl http://localhost:5000/api/events
```

---

## 🆘 Troubleshooting

### "ECONNREFUSED 127.0.0.1:5432"

**Problem:** Backend cannot connect to PostgreSQL

**Solutions:**

```bash
# Check PostgreSQL is running
docker ps | grep postgres
# OR
psql --version

# Test connection directly
psql -U postgres -h localhost -p 5432

# If connection fails, start PostgreSQL:
docker run -d -p 5432:5432 --name rutick-postgres \
  -e POSTGRES_PASSWORD=postgres postgres:16-alpine
```

### "relation \"users\" does not exist"

**Problem:** Database tables not created

**Solutions:**

```bash
# Backend should auto-create tables on first run
# If not, check backend logs for errors

# Or manually sync:
cd backend
npm run dev
# Wait for: "Database models synchronized"
```

### "password authentication failed"

**Problem:** Database credentials incorrect

**Solutions:**

1. Check `backend/.env` for correct:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`

2. Test connection manually:

   ```bash
   psql -U postgres -h localhost -p 5432 -d postgres
   ```

3. If using cloud database (AWS RDS, etc.):
   - Verify security group allows port 5432
   - Verify IP whitelist includes your machine

### "Port 5432 already in use"

**Problem:** Another PostgreSQL instance or Docker container using port

**Solutions:**

```bash
# Find what's using port 5432
lsof -i :5432  # Mac/Linux
netstat -ano | findstr :5432  # Windows

# Kill the process
kill -9 <PID>  # Mac/Linux
taskkill /PID <PID> /F  # Windows

# Or use different port in Docker:
docker run -d -p 5433:5432 --name rutick-postgres \
  -e POSTGRES_PASSWORD=postgres postgres:16-alpine

# Then update .env:
DB_PORT=5433
```

---

## 🗄️ Database Structure

Sequelize automatically creates these tables:

- `users` - User accounts and authentication
- `events` - Event information
- `registrations` - Event registrations/tickets
- `reviews` - Event reviews and ratings
- `certificates` - Attendance certificates
- `reminders` - Scheduled email reminders

All tables use UUID primary keys and include `createdAt`, `updatedAt` timestamps.

---

## 📚 Additional Resources

- **Sequelize Docs**: https://sequelize.org/docs/v6/
- **PostgreSQL Docs**: https://www.postgresql.org/docs/
- **Docker PostgreSQL**: https://hub.docker.com/_/postgres
- **psql Commands**: https://www.postgresql.org/docs/current/app-psql.html

---

**Last Updated:** March 14, 2026
