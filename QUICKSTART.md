# RUTick Quick Start Guide

Get RUTick up and running in 5 minutes!

## 🚀 Super Quick Start

### Option 1: Using Docker (Fastest)

```bash
# 1. Clone and navigate
git clone <repo-url>
cd rutick

# 2. Configure environment
cp backend/.env.example backend/.env
# Edit backend/.env with your settings

# 3. Start everything
docker-compose up -d

# 4. Seed database (optional)
docker-compose exec backend npm run seed

# 5. Open in browser
# Frontend: http://localhost
# API: http://localhost:5000/api
```

### Option 2: Manual Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env
# Edit .env with your settings
npm run dev

# Frontend (in another terminal)
# Open index.html in browser
# Or use: python -m http.server 8000
# Then visit http://localhost:8000
```

## 📧 Test Accounts

After seeding the database, use these credentials:

### Student Account

```
Email: john.doe@riarauniversity.ac.ke
Password: Password@123
```

### Staff Account

```
Email: staff@riarauniversity.ac.ke
Password: Staff@123
```

### Admin Account

```
Email: admin@riarauniversity.ac.ke
Password: Admin@123
```

## 🌐 Access Points

- **Frontend**: http://localhost (or http://localhost:8000)
- **API Base**: http://localhost:5000/api
- **Database**: mongodb://localhost:27017/rutick (if running locally)
- **MongoDB Admin**: http://localhost:27017/admin (if exposed)

## 🔑 Key Features to Try

### 1. User Registration

1. Go to home page
2. Click "Get Started"
3. Click "Register"
4. Fill in details using format: `firstname.lastname@riarauniversity.ac.ke`
5. Create account

### 2. Event Discovery

1. Login to dashboard
2. See list of available events
3. Filter by category (Academic, Social, Administrative)
4. Search events by name

### 3. Event Registration

1. Click "View Details" on any event
2. Click "Register" button
3. Get instant QR code ticket
4. View ticket anytime

### 4. Leave Review

1. Attend event (check-in as staff/admin)
2. Go to event details
3. Click "Leave a Review"
4. Rate and comment on event

### 5. Get Certificate

1. Attend event (must be checked in)
2. Navigate to dashboard
3. View certificates section
4. Download certificate of participation

## 🔧 Configuration

### Environment Variables

Key variables in `backend/.env`:

```env
# API
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/rutick

# Authentication
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Frontend
FRONTEND_URL=http://localhost:3000
```

### Frontend API Configuration

Edit `scripts/api.js`:

```javascript
const API_BASE_URL = "http://localhost:5000/api"; // Change this if needed
```

## 📱 Mobile Testing

Open on mobile device:

```bash
# Get your computer IP
ipconfig (Windows) or ifconfig (Mac/Linux)

# Open in mobile browser
http://YOUR_IP:8000
```

## 🔍 Troubleshooting

### Port Already in Use

```bash
# Change port in .env or use different port
npm run dev -- --port 5001

# Or kill process using port
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -i :5000
kill -9 <PID>
```

### MongoDB Connection Failed

```bash
# Check MongoDB is running
# Windows: Run MongoDB from Services
# Mac: brew services start mongodb-community
# Linux: sudo systemctl start mongod

# Or use MongoDB Atlas instead
# Update MONGODB_URI in .env to cloud connection string
```

### CORS Error

Ensure `CORS_ORIGIN` in backend/.env matches your frontend URL:

```env
CORS_ORIGIN=http://localhost:3000
```

### Email Not Sending

1. Verify SMTP credentials in .env
2. Check "Less secure apps" setting (Gmail)
3. Use app password instead of account password (Gmail)
4. Check spam folder

## 📚 Next Steps

1. **Read Documentation**
   - [Backend README](./backend/README.md)
   - [Full README](./README.md)
   - [Deployment Guide](./DEPLOYMENT.md)

2. **Understand API**
   - Check endpoints in backend/README.md
   - Test using Postman or similar tool

3. **Customize**
   - Update colors in styles/style.css
   - Modify branding in index.html
   - Add features as needed

4. **Deploy**
   - Follow [Deployment Guide](./DEPLOYMENT.md)
   - Set up production database
   - Configure domain and SSL

## 🆘 Getting Help

### Common Commands

```bash
# Backend development
cd backend
npm run dev           # Start with auto-reload
npm test             # Run tests
npm run seed         # Seed database
npm start            # Production start

# Check API health
curl http://localhost:5000/api/health

# View logs
pm2 logs rutick      # If using PM2
```

### Debug Mode

```bash
# Enable verbose logging
DEBUG=* npm run dev

# Test API endpoint
curl -X GET http://localhost:5000/api/events
```

## 📊 Performance Tips

- Use browser dev tools (F12) to check network
- Monitor API response times
- Check database indexes
- Use caching headers
- Optimize image sizes

## 🔐 Security Notes

⚠️ **Development Only**

- The .env.example uses weak secrets
- Never commit .env to version control
- Use strong passwords in production
- Enable HTTPS in production
- Regular security audits

## 🎯 Project Structure

```
rutick/
├── index.html           # Main UI
├── scripts/
│   ├── api.js          # API client
│   ├── eventManager.js  # Event logic
│   └── ...other managers
├── styles/
│   └── style.css       # Styling
└── backend/
    ├── src/
    │   ├── models/     # Database schemas
    │   ├── controllers/ # Business logic
    │   ├── routes/     # API endpoints
    │   └── server.js   # Express app
    └── package.json
```

## ✅ Verification Checklist

- [ ] Backend starts without errors
- [ ] Database connects successfully
- [ ] Frontend loads in browser
- [ ] Can register new user
- [ ] Can login with test account
- [ ] Can view events
- [ ] Can register for event
- [ ] Email sends (check spam)
- [ ] API returns 200 status codes

## 🎓 Learning Path

1. **Basics** (1-2 hours)
   - Understand project structure
   - Try all user workflows
   - Explore API endpoints

2. **Development** (2-4 hours)
   - Add a new feature
   - Modify UI appearance
   - Test with different scenarios

3. **Deployment** (2-3 hours)
   - Set up production environment
   - Configure email service
   - Deploy to cloud

4. **Advanced** (ongoing)
   - Add payment processing
   - Implement mobile app
   - Add analytics
   - Optimize performance

---

**Happy coding! 🚀**

Last Updated: February 26, 2026
