# RUTick Local Testing Checklist

**Objective:** Thoroughly test the application locally with Docker before production deployment
**Estimated Time:** 3-4 hours
**Environment:** Docker Compose with PostgreSQL

---

## Phase 1: Pre-Testing Setup (15 minutes)

### Prerequisites Check

- [ ] Docker installed: `docker --version` (should be 20.10+)
- [ ] Docker Compose installed: `docker compose version`
- [ ] Docker Desktop running (Windows/Mac) or daemon running (Linux)
- [ ] Ports available: 5432 (Postgres), 5000 (API), 80 (Frontend)
- [ ] At least 2GB free disk space

### Port Availability

```bash
# Check if ports are free
lsof -i :5432  # PostgreSQL
lsof -i :5000  # API
lsof -i :80    # Frontend

# Windows alternative:
netstat -ano | findstr :5432
netstat -ano | findstr :5000
netstat -ano | findstr :80
```

**Status:** [ ] All prerequisites met

---

## Phase 2: Configuration Validation (5 minutes)

### Run Configuration Validator

```bash
cd d:\ind3x.html\ind3x.html
node docker-config-validator.js
```

**Expected Output:**

```
✅ CONFIGURATION VALIDATED - Ready for Docker deployment
✅ Passed: 14
```

**Checklist:**

- [ ] Configuration validator runs without errors
- [ ] All 14 checks pass
- [ ] No critical errors reported

---

## Phase 3: Docker Build (30-45 minutes)

### Build Images

```bash
docker compose build --no-cache
```

**Expected Phases:**

1. PostgreSQL image pulled (~2 minutes)
2. Node.js backend built (~10-15 minutes) - compiles dependencies
3. Nginx frontend pulled (~1 minute)

**Troubleshooting:**

- If npm fails: Check internet connection, firewall blocking npm registry
- If out of disk space: Run `docker system prune` to clean
- If permission denied: Use `sudo` on Linux

**Checklist:**

- [ ] Build completes successfully
- [ ] All 3 images build without errors
- [ ] No warnings about deprecated packages
- [ ] Build takes < 60 minutes total

---

## Phase 4: Service Startup (2 minutes)

### Start All Services

```bash
docker compose up -d
```

### Verify Services Running

```bash
docker compose ps
```

**Expected Output:**

```
NAME              STATUS
rutick-postgres   Up (healthy)
rutick-backend    Up (healthy)
rutick-frontend   Up
```

**Checklist:**

- [ ] PostgreSQL container started and healthy
- [ ] Backend container started and healthy
- [ ] Frontend container started
- [ ] No containers in "exited" or "unhealthy" state

---

## Phase 5: Service Health Checks (10 minutes)

### Check PostgreSQL Health

```bash
docker compose logs postgres | grep "ready to accept connections"
```

**Expected Output:**

```
database system is ready to accept connections
```

**Checklist:**

- [ ] PostgreSQL logs show "ready to accept connections"
- [ ] PostgreSQL appears in `docker compose ps` as healthy

### Check Backend Health

```bash
docker compose logs backend | grep "Server running"
```

**Expected Output:**

```
✅ PostgreSQL Connected: postgres:5432
✅ Database models synchronized
✅ Server running on http://0.0.0.0:5000
```

**Checklist:**

- [ ] Backend connected to PostgreSQL successfully
- [ ] Database models synchronized
- [ ] Backend listening on port 5000

### Check Frontend Health

```bash
docker compose logs frontend | head -20
```

**Expected Output:**

```
nginx: ... listening on
```

**Checklist:**

- [ ] Frontend nginx server started
- [ ] No startup errors in frontend logs

### Test Health Endpoints

```bash
# API health check
curl -i http://localhost:5000/api/health

# Frontend health check
curl -i http://localhost/
```

**Expected Output:**

```
HTTP/1.1 200 OK
{"status":"API is running"}
```

**Checklist:**

- [ ] API responds with 200 status
- [ ] Frontend returns HTML (200 status)

---

## Phase 6: Database Testing (15 minutes)

### Connect to PostgreSQL

```bash
docker compose exec postgres psql -U rutick_user -d rutick
```

### Inside PostgreSQL (psql prompt)

#### List All Tables

```sql
\dt
```

**Expected Output:**

```
List of relations:
 Schema | Name | Type | Owner
--------+------+------+----------
 public | users | table | rutick_user
 public | events | table | rutick_user
 ... (more tables)
```

**Checklist:**

- [ ] At least 5 tables exist (users, events, registrations, etc.)
- [ ] No permission errors

#### Check Schema

```sql
\d "users"
```

**Expected Output:** Shows columns like id, firstName, lastName, email, studentId, etc.

**Checklist:**

- [ ] Users table has correct columns
- [ ] Timestamp columns present (createdAt, updatedAt)

#### Verify Data

```sql
SELECT table_name FROM information_schema.tables WHERE table_schema='public';
SELECT COUNT(*) FROM "users";
SELECT COUNT(*) FROM "events";
```

**Expected Output:**

```
count
-------
    0
```

(0 is normal before seeding)

**Checklist:**

- [ ] Database tables are empty (expected for fresh start)
- [ ] Can query without permission errors

#### Exit PostgreSQL

```sql
\q
```

**Checklist:**

- [ ] Successfully connected to PostgreSQL
- [ ] All expected tables exist
- [ ] Schema matches expected structure

---

## Phase 7: API Testing (45 minutes)

### 7.1 Authentication Endpoints

#### Test: User Registration

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "email": "testuser@example.com",
    "studentId": "TEST001",
    "department": "Computer Science",
    "password": "TestPassword@123"
  }'
```

**Expected Response:** (201 or 200 status)

```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "email": "testuser@example.com",
    "role": "student"
  },
  "token": "eyJhbGc..."
}
```

- [ ] Registration successful (HTTP 200/201)
- [ ] User object returned
- [ ] JWT token provided
- [ ] Token is valid format

#### Test: User Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "testuser@example.com",
    "password": "TestPassword@123"
  }'
```

**Expected Response:** (200 status)

```json
{
  "success": true,
  "token": "eyJhbGc...",
  "refreshToken": "...",
  "user": { ... }
}
```

- [ ] Login successful (HTTP 200)
- [ ] Both token and refreshToken provided
- [ ] User details returned

**Save the token for next tests:**

```bash
export TOKEN="<your_jwt_token_from_login>"
```

#### Test: Refresh Token

```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "<your_refresh_token>"
  }'
```

- [ ] Refresh successful (HTTP 200)
- [ ] New token provided

### 7.2 Event Endpoints

#### Test: Create Event (Admin)

```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Programming Workshop",
    "description": "Learn web development",
    "startDate": "2026-04-01T10:00:00Z",
    "endDate": "2026-04-01T12:00:00Z",
    "location": "Room 101",
    "capacity": 50,
    "category": "Workshop"
  }'
```

**Expected Response:** (201 status)

```json
{
  "success": true,
  "message": "Event created successfully",
  "event": {
    "id": "...",
    "title": "Test Programming Workshop",
    ...
  }
}
```

- [ ] Event created (HTTP 201)
- [ ] Event ID returned
- [ ] All fields present in response

**Save the event ID:**

```bash
export EVENT_ID="<event_id_from_response>"
```

#### Test: Get All Events

```bash
curl -X GET http://localhost:5000/api/events
```

**Expected Response:** (200 status)

```json
{
  "success": true,
  "events": [ { ... }, { ... } ],
  "total": 1,
  "page": 1
}
```

- [ ] Get events successful (HTTP 200)
- [ ] Event created above appears in list
- [ ] Pagination data present

#### Test: Get Single Event

```bash
curl -X GET http://localhost:5000/api/events/$EVENT_ID
```

- [ ] Event retrieved successfully (HTTP 200)
- [ ] All event details present

#### Test: Update Event

```bash
curl -X PUT http://localhost:5000/api/events/$EVENT_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Updated Programming Workshop",
    "capacity": 75
  }'
```

- [ ] Event updated (HTTP 200)
- [ ] Changes reflected in response

### 7.3 Registration Endpoints

#### Test: Register for Event

```bash
curl -X POST http://localhost:5000/api/registrations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "eventId": "'$EVENT_ID'"
  }'
```

**Expected Response:** (201 status)

```json
{
  "success": true,
  "registration": {
    "id": "...",
    "eventId": "...",
    "status": "registered",
    "qrCode": "..."
  }
}
```

- [ ] Registration successful (HTTP 201)
- [ ] Registration ID provided
- [ ] QR code data present
- [ ] Status is "registered"

**Save registration ID:**

```bash
export REG_ID="<registration_id>"
```

#### Test: Get User Registrations

```bash
curl -X GET http://localhost:5000/api/registrations \
  -H "Authorization: Bearer $TOKEN"
```

- [ ] Registrations retrieved (HTTP 200)
- [ ] Event registered above appears in list

#### Test: Check-in (Admin)

```bash
curl -X POST http://localhost:5000/api/registrations/$REG_ID/checkin \
  -H "Authorization: Bearer $TOKEN"
```

- [ ] Check-in successful (HTTP 200)
- [ ] Status changed to "checked-in"

### 7.4 User Endpoints

#### Test: Get User Profile

```bash
curl -X GET http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer $TOKEN"
```

**Expected Response:**

```json
{
  "success": true,
  "user": {
    "id": "...",
    "firstName": "Test",
    "email": "testuser@example.com",
    ...
  }
}
```

- [ ] Profile retrieved (HTTP 200)
- [ ] Correct user data returned

#### Test: Update Profile

```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "firstName": "TestUpdated"
  }'
```

- [ ] Profile updated (HTTP 200)
- [ ] Changes reflected

#### Test: Dashboard Stats

```bash
curl -X GET http://localhost:5000/api/users/dashboard/stats \
  -H "Authorization: Bearer $TOKEN"
```

- [ ] Stats retrieved (HTTP 200)
- [ ] Contains eventCount, registrationCount, etc.

### 7.5 Review Endpoints

#### Test: Create Review

```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "eventId": "'$EVENT_ID'",
    "rating": 5,
    "comment": "Great workshop!"
  }'
```

- [ ] Review created (HTTP 201)
- [ ] Review ID provided

#### Test: Get Event Reviews

```bash
curl -X GET http://localhost:5000/api/reviews/event/$EVENT_ID
```

- [ ] Reviews retrieved (HTTP 200)
- [ ] Review created above appears in list

### 7.6 Certificate Endpoints

#### Test: Generate Certificate

```bash
curl -X POST http://localhost:5000/api/certificates \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "registrationId": "'$REG_ID'"
  }'
```

- [ ] Certificate generated (HTTP 201)
- [ ] Certificate data returned

#### Test: Get User Certificates

```bash
curl -X GET http://localhost:5000/api/certificates \
  -H "Authorization: Bearer $TOKEN"
```

- [ ] Certificates retrieved (HTTP 200)
- [ ] Certificates appear in list

**Checklist Summary - API Testing:**

- [ ] All 6 endpoint categories tested
- [ ] Authentication flows work
- [ ] CRUD operations functional
- [ ] Responses have correct status codes
- [ ] Response bodies contain expected data
- [ ] Authorization working (token required where needed)

---

## Phase 8: Frontend Testing (30 minutes)

### Load Frontend

```bash
# Open in browser
http://localhost
# or
http://localhost:80
```

**Checklist:**

- [ ] Page loads without errors
- [ ] Logo/branding visible
- [ ] Hero section displays
- [ ] Navigation menu present

### Test: Registration Flow

- [ ] Navigate to Register
- [ ] Fill registration form with test data
- [ ] Submit form
- [ ] Check if success message appears
- [ ] Verify redirects to login

**Checklist:**

- [ ] Registration form renders
- [ ] Form validation works
- [ ] Can submit registration
- [ ] Success notification appears

### Test: Login Flow

- [ ] Navigate to Login
- [ ] Enter test user credentials
- [ ] Submit login
- [ ] Check if redirected to dashboard

**Checklist:**

- [ ] Login form renders
- [ ] Can submit credentials
- [ ] Authentication successful
- [ ] Redirects to dashboard

### Test: Event Discovery

- [ ] Check if events list displays
- [ ] View event details modal
- [ ] Check if register button works
- [ ] Attempt to register for event

**Checklist:**

- [ ] Events load and display
- [ ] Event details visible
- [ ] Modal opens/closes properly
- [ ] Registration successful

### Test: User Profile

- [ ] Navigate to profile section
- [ ] Display user information
- [ ] Edit profile information
- [ ] Save changes

**Checklist:**

- [ ] Profile page loads
- [ ] User data displays correctly
- [ ] Can edit profile
- [ ] Changes persist

### Browser Console Check

- [ ] Open DevTools (F12)
- [ ] Check Console tab
- [ ] Look for errors/warnings

**Checklist:**

- [ ] No critical errors in console
- [ ] No XSS vulnerabilities
- [ ] Network requests successful (check Network tab)

---

## Phase 9: Integration Testing (30 minutes)

### Full User Journey Test

#### Journey 1: Registration → Login → Browse → Register

1. Register new user via frontend
2. Logout
3. Login with new credentials
4. Browse events
5. Register for event
6. Verify registration appears in profile

**Checklist:**

- [ ] User registration works end-to-end
- [ ] Login maintains session
- [ ] Can browse and register for events
- [ ] Registration persists in database

#### Journey 2: Event Creation → Registration → Check-in

1. Create event via API as admin
2. Register for event via frontend
3. Check-in via API
4. Verify status changed in database

**Checklist:**

- [ ] Event creation successful
- [ ] Registration works
- [ ] Check-in updates database
- [ ] Status change is persistent

#### Journey 3: Review & Certificate

1. Register for event
2. Check in
3. Add review via API
4. Generate certificate
5. View certificate in profile

**Checklist:**

- [ ] Reviews persist to database
- [ ] Certificates can be generated
- [ ] User can view their certificates
- [ ] Data flows correctly between systems

---

## Phase 10: Database Persistence Testing (10 minutes)

### Verify Data Survives Restart

```bash
# Query database to count records
docker compose exec postgres psql -U rutick_user -d rutick -c "SELECT COUNT(*) FROM \"users\";"

# Restart services
docker compose restart

# Query again - should have same count
docker compose exec postgres psql -U rutick_user -d rutick -c "SELECT COUNT(*) FROM \"users\";"
```

**Checklist:**

- [ ] Data persists after container restart
- [ ] Record counts match
- [ ] No data loss during restart

---

## Phase 11: Error Handling Testing (15 minutes)

### Test Invalid Inputs

```bash
# Missing required fields
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'

# Expected: 400 Bad Request with validation errors
```

**Checklist:**

- [ ] Validation errors returned (HTTP 400)
- [ ] Error messages are clear
- [ ] Invalid data rejected safely

### Test Unauthorized Access

```bash
# Try to access protected endpoint without token
curl -X GET http://localhost:5000/api/users/profile

# Expected: 401 Unauthorized
```

**Checklist:**

- [ ] Protected endpoints require auth (HTTP 401)
- [ ] API rejects requests without valid token

### Test Not Found

```bash
curl -X GET http://localhost:5000/api/events/invalid-id-123
```

**Checklist:**

- [ ] Non-existent resources return 404
- [ ] Error message is informative

### Test Duplicate Registration

```bash
# Try to register for same event twice
curl -X POST http://localhost:5000/api/registrations \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"eventId": "'$EVENT_ID'"}'

# (run twice)
# Expected: 400 or 409 on second attempt
```

**Checklist:**

- [ ] Backend prevents duplicate registrations
- [ ] Appropriate error returned

---

## Phase 12: Performance & Load Testing (15 minutes)

### Response Time Testing

```bash
# Time a request
time curl -X GET http://localhost:5000/api/events

# Expected: < 500ms for typical request
```

**Checklist:**

- [ ] API responses within reasonable time
- [ ] No timeout issues

### Concurrent Requests

```bash
# Send 10 requests simultaneously using GNU Parallel or similar
seq 1 10 | parallel -j 10 "curl -s http://localhost:5000/api/events" | wc -l

# Expected: All 10 requests succeed
```

**Checklist:**

- [ ] API handles concurrent requests
- [ ] No dropped connections
- [ ] Response times remain consistent

### Memory Usage

```bash
docker stats --no-stream
```

**Expected Behavior:**

- PostgreSQL: < 150MB
- Backend: < 300MB
- Frontend: < 100MB

**Checklist:**

- [ ] No memory leaks visible
- [ ] Containers within resource limits
- [ ] No "out of memory" errors

---

## Phase 13: Security Testing (20 minutes)

### Test CORS

```bash
curl -X OPTIONS http://localhost:5000/api/events \
  -H "Origin: http://attacker.com" \
  -H "Access-Control-Request-Method: GET"
```

**Expected:** CORS should respect allowed origins only

**Checklist:**

- [ ] CORS headers correct
- [ ] Requests from unauthorized origins blocked

### Test Rate Limiting

```bash
# Send 150 requests rapidly
for i in {1..150}; do
  curl -s http://localhost:5000/api/health &
done

# Expected: Some requests start failing after ~100
```

**Checklist:**

- [ ] Rate limiting active
- [ ] Requests throttled appropriately
- [ ] Returns 429 Too Many Requests when exceeded

### Test SQL Injection (Safe Test)

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com\" OR \"1\"=\"1",
    "password": "test"
  }'

# Expected: Request fails safely, no data leak
```

**Checklist:**

- [ ] SQL injection attempts blocked
- [ ] Database remains secure
- [ ] No sensitive data leaked

### Test XSS (Safe Test)

```bash
curl -X POST http://localhost:5000/api/reviews \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "eventId": "'$EVENT_ID'",
    "rating": 5,
    "comment": "<script>alert(\"XSS\")</script>"
  }'

# View response - comment should be escaped
```

**Checklist:**

- [ ] HTML/script tags are escaped
- [ ] No XSS vulnerabilities visible

---

## Phase 14: Logging & Monitoring (10 minutes)

### Check Backend Logs

```bash
docker compose logs backend | tail -50
```

**Should contain:**

- Application startup messages
- Database connection confirmation
- Request logs
- No stack traces or errors

**Checklist:**

- [ ] Logs are informative
- [ ] No errors logged
- [ ] Connection info visible

### Check PostgreSQL Logs

```bash
docker compose logs postgres | tail -20
```

**Checklist:**

- [ ] No connection errors
- [ ] Queries executing successfully

### Check Health Checks

```bash
docker compose ps
```

**Expected:**

```
NAME              STATUS
rutick-postgres   Up (healthy)
rutick-backend    Up (healthy)
rutick-frontend   Up
```

**Checklist:**

- [ ] All services report healthy status
- [ ] No repeated restart attempts

---

## Phase 15: Pre-Production Preparation (15 minutes)

### Documentation Review

- [ ] Read [DOCKER_TESTING_GUIDE.md](DOCKER_TESTING_GUIDE.md)
- [ ] Review [DOCKER_POSTGRESQL_TEST_REPORT.md](DOCKER_POSTGRESQL_TEST_REPORT.md)
- [ ] Check [SECURITY.md](SECURITY.md) for requirements

**Checklist:**

- [ ] Understand security requirements
- [ ] Know deployment steps
- [ ] Familiar with common issues

### Production Preparation

```bash
# Current .env (development)
DB_HOST=postgres
CORS_ORIGIN=http://localhost
NODE_ENV=development

# Will need to change for production:
# - DB_HOST (if not Docker)
# - CORS_ORIGIN (your domain)
# - NODE_ENV=production
# - JWT_SECRET (rotate to new value)
# - SMTP_HOST, SMTP_USER, SMTP_PASSWORD (real email service)
# - FRONTEND_URL (production URL)
```

**Checklist:**

- [ ] Know what needs to change for production
- [ ] Have access to production secrets
- [ ] Have production domain ready
- [ ] Have email service credentials ready

### Cleanup

```bash
# Optional: Remove test data before production
docker compose exec postgres psql -U rutick_user -d rutick -c "DELETE FROM \"users\";"

# Or keep for reference:
docker compose exec postgres psql -U rutick_user -d rutick -c "SELECT COUNT(*) FROM \"users\";"
```

**Checklist:**

- [ ] Decided on test data cleanup
- [ ] Verified cleanup methods work

---

## ✅ Testing Complete Checklist

### Summary of Phases

- [ ] Phase 1: Pre-Testing Setup (15 min)
- [ ] Phase 2: Configuration Validation (5 min)
- [ ] Phase 3: Docker Build (30-45 min)
- [ ] Phase 4: Service Startup (2 min)
- [ ] Phase 5: Service Health Checks (10 min)
- [ ] Phase 6: Database Testing (15 min)
- [ ] Phase 7: API Testing (45 min)
- [ ] Phase 8: Frontend Testing (30 min)
- [ ] Phase 9: Integration Testing (30 min)
- [ ] Phase 10: Database Persistence (10 min)
- [ ] Phase 11: Error Handling (15 min)
- [ ] Phase 12: Performance Testing (15 min)
- [ ] Phase 13: Security Testing (20 min)
- [ ] Phase 14: Logging & Monitoring (10 min)
- [ ] Phase 15: Pre-Production Prep (15 min)

**Total Estimated Time:** 3.5-4 hours

### Final Sign-Off

After completing all phases:

- [ ] All services start and run healthily
- [ ] Database operations work correctly
- [ ] All API endpoints functional
- [ ] Frontend UI works properly
- [ ] Full user journeys complete successfully
- [ ] Data persists correctly
- [ ] Error handling appropriate
- [ ] Performance acceptable
- [ ] No security vulnerabilities found
- [ ] Ready for production deployment

---

## Issues Found During Testing

If you encounter issues, document them here:

| Issue | Status | Resolution |
| ----- | ------ | ---------- |
|       |        |            |

---

## Next Steps After Testing

Once all phases pass:

1. ✅ Rotate JWT secrets to production values
2. ✅ Update .env with real SMTP credentials
3. ✅ Change CORS_ORIGIN to production domain
4. ✅ Set NODE_ENV=production
5. ✅ Review security checklist one more time
6. ✅ Deploy to production
7. ✅ Monitor production health
8. ✅ Set up automated backups

---

**Date Completed:** ******\_\_\_******
**Tested By:** ******\_\_\_******
**Status:** **\_** PASS / **\_** FAIL
**Notes:** **************\_**************
