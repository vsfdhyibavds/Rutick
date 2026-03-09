# RUTick - Quick Reference Card

Print this page or bookmark it for quick access to common tasks.

## 🚀 Essential Commands

### First Time Setup (in order)

```bash
# Step 1: Generate JWT secrets
node setup-env-generator.js

# Step 2: Install dependencies
setup.bat          (Windows)
bash setup.sh      (Linux/Mac)

# Step 3: Start MongoDB
docker run -p 27017:27017 --name rutick-mongo mongo:7.0

# Step 4: Start Backend
cd backend && npm run dev

# Step 5: Start Frontend
python -m http.server 3000
# Then open: http://localhost:3000
```

### Development

```bash
# Backend development
cd backend && npm run dev      # Start with auto-reload

# Run tests
cd backend && npm test

# Format code
cd backend && npm run format

# Check vulnerabilities
cd backend && npm audit

# Seed database with test data
cd backend && npm run seed

# Check MongoDB connection
mongosh mongodb://localhost:27017/rutick
```

### Docker

```bash
# Start everything with Docker Compose
docker-compose up -d

# View logs
docker logs rutick-backend
docker logs rutick-mongo

# Stop everything
docker-compose down

# Rebuild containers
docker-compose build

# Run specific service
docker-compose up backend
```

### Database

```bash
# Connect to MongoDB
mongosh mongodb://localhost:27017/rutick

# View all collections
show collections

# Count documents
db.users.countDocuments()
db.events.countDocuments()

# Reset database (delete all data)
db.dropDatabase()

# View indexes
db.events.getIndexes()
```

## 📁 Important Files & What They Do

| File                    | Purpose                                    | Edit When                     |
| ----------------------- | ------------------------------------------ | ----------------------------- |
| `backend/.env`          | Environment variables (secrets, DB, email) | Configuring for your setup    |
| `backend/src/server.js` | Main API entry point                       | Adding routes or middleware   |
| `scripts/api.js`        | Frontend API client library                | Changing backend URL          |
| `index.html`            | Frontend UI                                | Changing branding/layout      |
| `docker-compose.yml`    | Container orchestration                    | Changing ports/versions       |
| `.env.example`          | Template for .env                          | Never (reference only)        |
| `setup.bat`             | Windows setup helper                       | Rarely needed after first run |

## 🔐 Environment Variables (Key Ones)

| Variable        | Example                            | What It's For           |
| --------------- | ---------------------------------- | ----------------------- |
| `NODE_ENV`      | `development`                      | dev/prod mode           |
| `PORT`          | `5000`                             | Backend server port     |
| `MONGODB_URI`   | `mongodb://localhost:27017/rutick` | Database connection     |
| `JWT_SECRET`    | `long-random-hex-string-32-chars`  | Token signing           |
| `SMTP_USER`     | `your-email@gmail.com`             | Email account           |
| `SMTP_PASSWORD` | `16-char-app-password`             | Email password          |
| `FRONTEND_URL`  | `http://localhost:3000`            | Frontend location       |
| `CORS_ORIGIN`   | `http://localhost:3000`            | Allowed frontend origin |

## 🎯 API Base URL

**Development**: `http://localhost:5000/api`
**Production**: `https://your-domain.com/api`

Update in `scripts/api.js`:

```javascript
const API_BASE_URL = "http://localhost:5000/api";
```

## 📊 API Endpoints (Quick Reference)

### Authentication

```
POST /api/auth/register         - Create account
POST /api/auth/login            - Login
POST /api/auth/refresh-token    - Get new token
POST /api/auth/forgot-password  - Start reset
POST /api/auth/reset-password   - Complete reset
POST /api/auth/logout           - Logout
GET  /api/auth/me               - Get current user
```

### Events

```
GET  /api/events                - List all
GET  /api/events/:id            - Get one
POST /api/events                - Create (staff/admin)
PUT  /api/events/:id            - Update (staff/admin)
DELETE /api/events/:id          - Delete (staff/admin)
GET  /api/events/my/registrations - User's events
```

### Registrations

```
GET  /api/registrations/:id     - Get ticket
POST /api/events/:id/register   - Register for event
DELETE /api/registrations/:id   - Cancel registration
GET  /api/events/:id/registrations - View registrations (staff)
POST /api/registrations/:id/check-in - Check-in attendee (staff)
```

### Users

```
GET  /api/users/profile         - Get profile
PUT  /api/users/profile         - Update profile
PATCH /api/users/password       - Change password
GET  /api/users/attendance      - Attendance history
GET  /api/users/stats           - Dashboard stats
DELETE /api/users/account       - Deactivate (soft delete)
```

### Reviews

```
GET  /api/events/:id/reviews    - List reviews
POST /api/events/:id/reviews    - Create review
PUT  /api/reviews/:id           - Update review
DELETE /api/reviews/:id         - Delete review
PATCH /api/reviews/:id/like     - Like review
```

### Certificates

```
GET  /api/certificates          - User's certificates
POST /api/certificates          - Generate certificate
GET  /api/certificates/:id      - Download certificate
GET  /api/events/:id/certificates - Event certificates (staff)
DELETE /api/certificates/:id    - Revoke certificate (staff)
```

## 🧪 Test Data

After running `npm run seed`:

| Email                                 | Password | Role    |
| ------------------------------------- | -------- | ------- |
| rutick_student1@riarauniversity.ac.ke | password | Student |
| rutick_student2@riarauniversity.ac.ke | password | Student |
| rutick_staff@riarauniversity.ac.ke    | password | Staff   |
| rutick_admin@riarauniversity.ac.ke    | password | Admin   |

## 📱 Frontend Managers (JavaScript Classes)

| Manager             | Location                       | What It Does                          |
| ------------------- | ------------------------------ | ------------------------------------- |
| eventManager        | scripts/eventManager.js        | Events: CRUD, search, display         |
| registrationManager | scripts/registrationManager.js | Register, cancel, check-in            |
| reviewManager       | scripts/reviewManager.js       | Create, edit, delete reviews          |
| certificateManager  | scripts/certificateManager.js  | Generate and download certs           |
| profileManager      | scripts/profileManager.js      | User profile, password, stats         |
| adminManager        | scripts/adminManager.js        | Admin features (registrations, certs) |

## 🐛 Common Issues & Quick Fixes

| Problem                | Fix                                                 |
| ---------------------- | --------------------------------------------------- |
| Port 5000 in use       | Change PORT in .env to 5001                         |
| MongoDB not connecting | Start Docker: `docker run -p 27017:27017 mongo`     |
| 404 errors on API      | Check backend running: `npm run dev`                |
| CORS error             | Verify CORS_ORIGIN in .env matches frontend URL     |
| .env file missing      | Run: `node setup-env-generator.js`                  |
| Blank frontend         | Check browser console (F12), verify API_BASE_URL    |
| Emails not sending     | Check SMTP settings in .env, test with app password |
| Can't login            | Verify seed ran: `npm run seed`, check credentials  |

For more: See [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

## 📚 Documentation Files

| File                                                   | Read When              |
| ------------------------------------------------------ | ---------------------- |
| [WINDOWS_SETUP.md](WINDOWS_SETUP.md)                   | Setting up on Windows  |
| [QUICKSTART.md](QUICKSTART.md)                         | Quick overview (5 min) |
| [TROUBLESHOOTING.md](TROUBLESHOOTING.md)               | Something's broken     |
| [DEPLOYMENT.md](DEPLOYMENT.md)                         | Going to production    |
| [CONTRIBUTING.md](CONTRIBUTING.md)                     | Making code changes    |
| [PRE_LAUNCH_CHECKLIST.md](PRE_LAUNCH_CHECKLIST.md)     | Before launch          |
| [backend/README.md](backend/README.md)                 | API details            |
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | What's implemented     |

## 🎨 Frontend File Structure

```
index.html              Main HTML page
styles/
  style.css            Main styles
scripts/
  api.js               API client
  eventManager.js      Event handling
  profileManager.js    User profile
  registrationManager.js Event registration
  reviewManager.js     Reviews/ratings
  certificateManager.js Certificates
  adminManager.js      Admin features
  utils.js             Utilities
```

## 🗄️ Backend Models

| Model        | Purpose               | Key Fields                         |
| ------------ | --------------------- | ---------------------------------- |
| User         | User accounts         | email, password, role, studentId   |
| Event        | Events                | title, date, capacity, organizer   |
| Registration | Event tickets         | user, event, ticketId, qrCode      |
| Review       | Event ratings         | user, event, rating (1-5), comment |
| Certificate  | Participation records | user, event, certificateId         |
| Reminder     | Scheduled emails      | user, event, reminderType, sentAt  |

## 🔐 Security Checklist

- [ ] JWT_SECRET is long random string (32+ chars)
- [ ] Database password changed from default
- [ ] CORS_ORIGIN set to actual frontend URL (not localhost in prod)
- [ ] Email password uses app password (not account password)
- [ ] NODE_ENV=production on live server
- [ ] Database backups enabled
- [ ] HTTPS/SSL certificate installed
- [ ] Rate limiting enabled
- [ ] No .env file in version control

## 📍 Key Ports

| Service        | Port  | URL                       |
| -------------- | ----- | ------------------------- |
| Backend API    | 5000  | http://localhost:5000     |
| Frontend       | 3000  | http://localhost:3000     |
| MongoDB        | 27017 | mongodb://localhost:27017 |
| Nginx (Docker) | 80    | http://localhost          |

## 🚨 Emergency Commands

```bash
# Kill all Node processes
taskkill /IM node.exe /F        (Windows)
killall node                    (Mac/Linux)

# Reset Docker
docker-compose down -v
docker-compose up -d

# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Force kill port
netstat -ano | findstr :5000    (Windows)
lsof -i :5000                   (Mac/Linux)
```

## 💡 Pro Tips

1. **Keep 3 terminals open**: MongoDB, Backend, Frontend
2. **Watch backend logs**: Look for "MongoDB connected" and "Server running"
3. **Check browser console**: F12 for JavaScript errors
4. **Use Postman**: For testing API endpoints
5. **Check .env**: Most issues are .env configuration
6. **Read error messages**: They often tell you exactly what's wrong
7. **Restart services**: 90% of issues fixed by restarting

## 🎯 Next Learning Steps

1. **Frontend**: Learn eventManager.js → understand how UI works
2. **Backend**: Study authController.js → understand business logic
3. **Database**: Play with MongoDB → see how data is stored
4. **API**: Test endpoints with Postman → understand flow
5. **Deployment**: Follow DEPLOYMENT.md → get ready for production

---

## Version Info

- **Node.js**: 14+ required
- **MongoDB**: 4.4+ required
- **Docker**: 20.10+ (optional)
- **npm**: 6+ (comes with Node.js)

---

**Print this card, keep it handy!** 📌

Last Updated: 2024
