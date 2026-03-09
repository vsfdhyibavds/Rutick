# RUTick - Complete Event Management System

A comprehensive event management platform for Riara University, designed to streamline the way students, faculty, and staff discover, register, and participate in campus events.

## 🚀 Quick Start (Choose Your Path)

| Your Situation                     | Next Step                                      |
| ---------------------------------- | ---------------------------------------------- |
| **Windows user, first time setup** | Read [WINDOWS_SETUP.md](WINDOWS_SETUP.md)      |
| **Docker user**                    | Run `docker-compose up -d`                     |
| **Linux/Mac user**                 | Read [QUICKSTART.md](QUICKSTART.md)            |
| **Something went wrong**           | Check [TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| **Want to contribute**             | Read [CONTRIBUTING.md](CONTRIBUTING.md)        |
| **Security concerns**              | Read [SECURITY.md](SECURITY.md)                |

## 📚 Documentation Map

- 📖 **[WINDOWS_SETUP.md](WINDOWS_SETUP.md)** - Complete Windows setup guide (Node.js, MongoDB, secrets)
- 🚀 **[QUICKSTART.md](QUICKSTART.md)** - 5-minute quick start for any platform
- 🐛 **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** - Fix common issues
- 🔧 **[DEPLOYMENT.md](DEPLOYMENT.md)** - Production deployment guide
- 🛠️ **[CONTRIBUTING.md](CONTRIBUTING.md)** - Contributing guidelines
- 🔒 **[SECURITY.md](SECURITY.md)** - Security policy and hardening guide
- 📋 **[backend/README.md](backend/README.md)** - API documentation
- ✅ **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)** - What's implemented

## 💻 Minimum Requirements

- **Node.js 14+** (test with `node --version`)
- **MongoDB 4.4+** (local or cloud)
- **npm 6+** (comes with Node.js)
- **2GB RAM, 500MB disk space**

## 📋 Features

### User Features

- ✅ User authentication (register, login, password reset)
- ✅ Event discovery and browsing
- ✅ Event registration with QR code tickets
- ✅ Event reminders (24h, 1h, day-of)
- ✅ Event reviews and ratings
- ✅ Attendance tracking
- ✅ Certificate generation and download
- ✅ User profile management
- ✅ Attendance history

### Admin/Staff Features

- ✅ Create and manage events
- ✅ View registrations and attendance
- ✅ Check-in attendees via QR code
- ✅ Issue and manage certificates
- ✅ Event analytics and statistics
- ✅ User management
- ✅ Email reminders scheduling

### Technical Features

- ✅ Secure JWT-based authentication
- ✅ Role-based access control (RBAC)
- ✅ Email notifications
- ✅ Automated reminders with cron jobs
- ✅ QR code generation and verification
- ✅ RESTful API with proper error handling
- ✅ Data validation and sanitization
- ✅ Rate limiting and security headers
- ✅ MongoDB database with proper indexing
- ✅ Responsive mobile-friendly UI

## 🗂️ Project Structure

```
rutick/
├── index.html                 # Main frontend application
├── scripts/
│   ├── api.js                # API client library
│   ├── eventManager.js        # Event management utilities
│   ├── profileManager.js      # User profile utilities
│   ├── reviewManager.js       # Review management utilities
│   ├── certificateManager.js  # Certificate utilities
│   ├── adminManager.js        # Admin utilities
│   └── utils.js               # General utilities
├── styles/
│   └── style.css              # Frontend styles
├── backend/                   # Node.js/Express backend
│   ├── src/
│   │   ├── models/           # MongoDB schemas
│   │   ├── controllers/      # Business logic
│   │   ├── routes/           # API endpoints
│   │   ├── middleware/       # Auth, error handling
│   │   ├── utils/            # Helper functions
│   │   ├── config/           # Database, email config
│   │   └── server.js         # Express app
│   ├── package.json
│   ├── .env.example
│   └── README.md             # Backend documentation
└── README.md                 # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 14.x or higher
- MongoDB 4.4 or higher (or MongoDB Atlas cloud)
- npm or yarn package manager
- Modern web browser

### Installation

#### 1. Clone and Navigate

```bash
cd rutick
```

#### 2. Backend Setup

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
npm install
npm run dev  # Start development server
```

#### 3. Frontend Setup

```bash
# Open index.html in your browser or serve with a simple HTTP server
python -m http.server 8000
# Then visit http://localhost:8000
```

### Environment Variables (.env)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/rutick

# JWT
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRE=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Frontend
FRONTEND_URL=http://localhost:3000
```

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register          - Register new user
POST   /api/auth/login             - Login user
POST   /api/auth/refresh-token     - Refresh JWT
POST   /api/auth/forgot-password   - Request password reset
POST   /api/auth/reset-password    - Reset password
GET    /api/auth/me                - Get current user
```

### Event Endpoints

```
GET    /api/events                 - Get all events
GET    /api/events/:id             - Get single event
POST   /api/events                 - Create event (staff/admin)
PUT    /api/events/:id             - Update event
DELETE /api/events/:id             - Delete event
GET    /api/events/user/my-events  - Get user's events
```

### Registration Endpoints

```
POST   /api/registrations/events/:eventId/register
DELETE /api/registrations/events/:eventId/unregister
GET    /api/registrations/events/:eventId/registration
GET    /api/registrations/events/:eventId/registrations
POST   /api/registrations/:registrationId/check-in
```

### User Endpoints

```
GET    /api/users/profile/:userId
PUT    /api/users/profile
POST   /api/users/change-password
GET    /api/users/attendance/:userId
GET    /api/users/dashboard/stats
DELETE /api/users/deactivate
```

### Review Endpoints

```
GET    /api/reviews/events/:eventId/reviews
POST   /api/reviews/events/:eventId/reviews
PUT    /api/reviews/:reviewId
DELETE /api/reviews/:reviewId
POST   /api/reviews/:reviewId/like
```

### Certificate Endpoints

```
POST   /api/certificates/events/:eventId/certificates
GET    /api/certificates/users/:userId/certificates
GET    /api/certificates/:certificateId
GET    /api/certificates/events/:eventId/certificates
DELETE /api/certificates/:certificateId
```

## 🔐 Security

- **Password Security**: Passwords are hashed with bcryptjs and never stored in plain text
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: All inputs validated on both client and server
- **CORS Protection**: Configured CORS for safe cross-origin requests
- **Rate Limiting**: API endpoints protected with rate limiting
- **Security Headers**: Helmet.js security middleware
- **Email Verification**: Email validation for account registration
- **Password Reset**: Secure token-based password reset

## 🧪 Testing

```bash
cd backend
npm test
```

## 📱 Responsive Design

The frontend is fully responsive and works on:

- Desktop (1920px and above)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎨 UI/UX Design

Built with modern web standards:

- Clean, intuitive user interface
- Gradient color scheme (purple/blue theme)
- Smooth animations and transitions
- Accessible form controls
- Mobile-first responsive design

## 🔄 Workflow

1. **User Registration**: Sign up with university email
2. **Event Discovery**: Browse events by category
3. **Registration**: Register with one click, get QR ticket
4. **Reminders**: Receive email reminders before event
5. **Attendance**: Check-in with QR code at event
6. **Review**: Rate and review the event
7. **Certificate**: Download certificate of attendance

## 🚢 Deployment

### Backend Deployment (Heroku example)

```bash
cd backend
heroku create your-app-name
heroku addons:create mongolab
git push heroku main
```

### Frontend Deployment (Netlify example)

```bash
npm run build  # (if using build tools)
# Deploy the dist folder to Netlify
```

## 📦 Database Schema

### Collections

- **users** - User accounts and profiles
- **events** - Event information
- **registrations** - User event registrations
- **reviews** - Event reviews and ratings
- **certificates** - Issued certificates
- **reminders** - Scheduled event reminders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

- **Developer**: AI Assistant
- **Project**: RUTick Event Management System
- **University**: Riara University

## 📞 Support

For issues, questions, or suggestions:

- Open an issue on GitHub
- Contact: support@riarauniversity.ac.ke

## 🔗 Links

- [MongoDB Docs](https://docs.mongodb.com/)
- [Express.js Docs](https://expressjs.com/)
- [JWT Auth](https://jwt.io/)
- [QR Code Generator](https://github.com/davidshimjs/qrcodejs)

---

**Made with ❤️ for Riara University**

Last Updated: February 26, 2026
