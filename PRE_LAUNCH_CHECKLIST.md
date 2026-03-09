# RUTick - Pre-Launch Checklist

This checklist helps you prepare RUTick for use. Follow the steps in order.

## Phase 1: Environment Setup ✓ (Developer responsibility)

- [ ] **Install Node.js 14+**
  - Download from https://nodejs.org/
  - Verify: `node --version`
  - Verify: `npm --version`

- [ ] **Install MongoDB**
  - Option A: Docker Desktop (recommended)
  - Option B: Local MongoDB installation
  - Option C: MongoDB Atlas (cloud)
  - Verify: `mongo --version` or `docker ps`

- [ ] **Install Git** (optional, for version control)
  - Download from https://git-scm.com/
  - Verify: `git --version`

- [ ] **Clone/Download Project**
  - Clone: `git clone <repo> rutick`
  - Or: Download ZIP and extract

- [ ] **Run Windows Setup Script**
  - Double-click `setup.bat` in root folder
  - Or: Run in terminal: `setup.bat`
  - This installs backend dependencies

- [ ] **Generate JWT Secrets**
  - Run: `node setup-env-generator.js`
  - This creates `backend\.env` with secure secrets

---

## Phase 2: Configuration ✓ (Customize for your institution)

- [ ] **Update .env File**
  - Edit: `backend\.env`
  - Key settings to configure:
    - [ ] `MONGODB_URI` - your MongoDB connection
    - [ ] `SMTP_HOST`, `SMTP_USER`, `SMTP_PASSWORD` - email settings
    - [ ] `FRONTEND_URL` - where frontend will run
    - [ ] `CORS_ORIGIN` - frontend origin (dev: http://localhost:3000)
    - [ ] `NODE_ENV` - set to `production` for deploy

- [ ] **Configure Email**
  - If using Gmail:
    - [ ] Enable 2-Step Verification: https://myaccount.google.com/security
    - [ ] Generate App Password: https://myaccount.google.com/apppasswords
    - [ ] Copy 16-char password to `SMTP_PASSWORD` in .env
  - If using corporate email:
    - [ ] Get SMTP details from IT
    - [ ] Update `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
  - If skipping email for now:
    - [ ] Edit `backend/src/utils/email.js` to return success without sending

- [ ] **Customize Branding (Optional)**
  - [ ] Update `index.html` title: Change "RUTick" to your app name
  - [ ] Update `styles/style.css` colors if desired
  - [ ] Update email templates in `backend/src/utils/emailTemplates.js`

---

## Phase 3: Verify Setup ✓ (Test everything works)

### 3.1 Start Services

**Terminal 1 - MongoDB:**

```cmd
docker run -p 27017:27017 --name rutick-mongo mongo:7.0
```

(Keep running in background)

**Terminal 2 - Backend:**

```cmd
cd backend
npm run dev
```

You should see:

```
✓ MongoDB connected at mongodb://localhost:27017/rutick
✓ Server running on http://localhost:5000
```

**Terminal 3 - Frontend:**

```cmd
# Option A: Use Python server
python -m http.server 3000

# Option B: Double-click index.html in Windows Explorer

# Option C: Use any HTTP server
```

### 3.2 Test API Health

Open browser and visit:

```
http://localhost:5000/api
```

You should see welcome message. If you get an error:

- Check backend terminal for error messages
- Verify MongoDB is running: `docker ps`
- Check .env file is properly configured
- See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) for more help

### 3.3 Test Frontend Load

Open browser and visit:

```
http://localhost:3000
```

(or wherever you opened index.html)

You should see the RUTick interface. If blank:

- Check browser console (F12) for errors
- Verify backend is running (check terminal)
- Check in `scripts/api.js` that `API_BASE_URL` matches your backend URL

---

## Phase 4: Populate Test Data ✓ (Optional but recommended)

Seed test data to see the system in action:

```cmd
cd backend
npm run seed
```

This creates:

- 4 test users (student, staff, admin)
- 3 sample events
- Sample registrations and reviews

Test accounts:
| Role | Email | Password |
|------|-------|----------|
| Student | rutick_student1@riarauniversity.ac.ke | password |
| Student | rutick_student2@riarauniversity.ac.ke | password |
| Admin | rutick_admin@riarauniversity.ac.ke | password |
| Staff | rutick_staff@riarauniversity.ac.ke | password |

**Note**: Email might fail if SMTP not configured (that's OK for testing)

---

## Phase 5: Production Configuration ⚠️ (Before deploying to production)

- [ ] **Change All Secrets**
  - [ ] JWT_SECRET - run `node setup-env-generator.js` again
  - [ ] REFRESH_TOKEN_SECRET - generate new
  - [ ] MONGO_PASSWORD - change from default
  - All should be long, random strings

- [ ] **Update Security Settings**
  - [ ] NODE_ENV=production
  - [ ] RATE_LIMIT_MAX=100
  - [ ] RATE_LIMIT_WINDOW=15
  - [ ] CORS_ORIGIN=https://your-actual-domain.com (NOT localhost)
  - [ ] FRONTEND_URL=https://your-actual-domain.com

- [ ] **Set Up Database**
  - [ ] Use MongoDB Atlas (enterprise hosting)
  - [ ] Enable authentication and encryption
  - [ ] Restrict IP access
  - [ ] Set up automated backups
  - [ ] Update MONGODB_URI to production database

- [ ] **Configure Email for Production**
  - [ ] Switch from personal Gmail to institutional email
  - [ ] Use dedicated service account (not personal)
  - [ ] Update SMTP_FROM to official email address
  - [ ] Test email delivery with real account

- [ ] **Set Up HTTPS/SSL**
  - [ ] Get SSL certificate (Let's Encrypt for free)
  - [ ] Configure in reverse proxy (Nginx, Docker)
  - [ ] Update FRONTEND_PROD_URL to https://

- [ ] **Review Security Checklist**
  - [ ] All validation active
  - [ ] Rate limiting enabled
  - [ ] CORS properly configured
  - [ ] SQL injection prevention (Mongoose provides this)
  - [ ] Password hashing enabled (bcryptjs)
  - [ ] No console.log of sensitive data

- [ ] **Set Up Monitoring**
  - [ ] Error logging service (Sentry, Rollbar)
  - [ ] Performance monitoring
  - [ ] Database backup alerts
  - [ ] Uptime monitoring

- [ ] **Prepare for Deployment**
  - [ ] Docker images built and tested
  - [ ] .dockerignore configured
  - [ ] .env variables stored in deployment platform
  - [ ] Database migrations planned
  - [ ] Rollback plan documented

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed production setup.

---

## Phase 6: Launch! 🎉

When everything above is checked:

1. **For Docker Deployment:**

   ```cmd
   docker-compose up -d
   ```

2. **For Cloud Deployment:**
   - Follow your platform's guide (Heroku, AWS, Azure, DigitalOcean, etc.)
   - See [DEPLOYMENT.md](DEPLOYMENT.md) for platform-specific instructions

3. **Announce to Users:**
   - [ ] Share sign-up link
   - [ ] Conduct user training
   - [ ] Set up help desk process
   - [ ] Monitor early adoption

---

## Feature Checklist ✓ (What's included)

### User Features

- [x] Registration with email verification
- [x] Login/logout
- [x] Password reset via email
- [x] User profile management
- [x] Event browsing and search
- [x] Event registration
- [x] QR code tickets
- [x] Email reminders (24h, 1h, day-of)
- [x] Attendance tracking
- [x] Event reviews and ratings
- [x] Certificate generation
- [x] Certificate download (text format)

### Admin/Staff Features

- [x] Create events
- [x] Edit events
- [x] Delete events (soft delete)
- [x] View registrations
- [x] Check-in attendees (via QR scan)
- [x] Manage registrations
- [x] Issue certificates
- [x] View event reviews
- [x] Dashboard with statistics
- [x] User list (admin only)

### Technical Features

- [x] JWT authentication
- [x] Refresh token rotation
- [x] Role-based access (student/staff/admin)
- [x] Email notifications
- [x] Automated reminders
- [x] QR code generation
- [x] MongoDB database
- [x] REST API
- [x] Error handling
- [x] Rate limiting
- [x] CORS security
- [x] Password hashing
- [x] Input validation
- [x] Docker support
- [x] Responsive UI

---

## API Endpoints Summary

Total: **28 endpoints** across 6 resource types

| Resource      | Endpoints | Methods                                                                   |
| ------------- | --------- | ------------------------------------------------------------------------- |
| Auth          | 7         | POST (register, login, refresh, forgot, reset, logout, getMe)             |
| Events        | 6         | GET (all, one), POST (create), PUT (update), DELETE (soft)                |
| Registrations | 5         | GET, POST, PATCH, DELETE, check-in                                        |
| Users         | 6         | GET (profile, stats), PUT (update), PATCH (password), DELETE (deactivate) |
| Reviews       | 5         | GET, POST, PUT, DELETE, PATCH (like)                                      |
| Certificates  | 5         | GET, POST (generate), DELETE (revoke)                                     |

See [backend/README.md](backend/README.md) for full endpoint documentation.

---

## Troubleshooting Quick Links

Having issues? Check here first:

- **Setup Issues**: [WINDOWS_SETUP.md](WINDOWS_SETUP.md#troubleshooting)
- **Common Errors**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md#common-errors---quick-reference)
- **Database Issues**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md#database-issues)
- **Email Issues**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md#email-issues)
- **Docker Issues**: [TROUBLESHOOTING.md](TROUBLESHOOTING.md#docker-issues)

---

## Success Criteria ✅

You're ready to go when:

1. ✅ All services start without errors
2. ✅ Frontend loads at http://localhost:3000 (or your URL)
3. ✅ Can register a test user (may fail, that's OK)
4. ✅ Can login with seed data account
5. ✅ Can view events in the system
6. ✅ Can open browser console without major errors
7. ✅ Backend logs show successful requests

---

## Getting Help

1. **Check documentation**: Start with TROUBLESHOOTING.md
2. **Search existing issues**: Look in GitHub Issues
3. **Ask team**: Contact your development team
4. **Create issue**: If it's a bug, create a GitHub issue
5. **Join community**: Join our Slack/Discord for discussions

---

## Next Steps After Launch

- Monitor system stability for first week
- Collect user feedback
- Plan feature enhancements
- Set up analytics/monitoring
- Plan future improvements

---

Last Updated: 2024
Version: 1.0.0
