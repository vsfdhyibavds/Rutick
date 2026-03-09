# RUTick Backend API

Comprehensive backend API for RUTick - Riara University Event Management System

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `SMTP_*` - Email configuration
- `FRONTEND_URL` - Frontend base URL

### 3. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongo mongodb/mongodb-community-server

# Or install locally and run
mongod
```

### 4. Run Server

```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh-token` - Refresh JWT token
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password/:token` - Reset password
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get event details
- `POST /api/events` - Create event (staff/admin)
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `GET /api/events/user/my-events` - Get user's registered events

### Registrations

- `POST /api/registrations/events/:eventId/register` - Register for event
- `DELETE /api/registrations/events/:eventId/unregister` - Cancel registration
- `GET /api/registrations/events/:eventId/registration` - Get user's registration
- `GET /api/registrations/events/:eventId/registrations` - Get all registrations (staff/admin)
- `POST /api/registrations/:registrationId/check-in` - Check in attendee

### Users

- `GET /api/users/profile/:userId` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/change-password` - Change password
- `GET /api/users/attendance/:userId` - Get attendance record
- `DELETE /api/users/deactivate` - Deactivate account
- `GET /api/users/dashboard/stats` - Get dashboard statistics

### Reviews

- `GET /api/reviews/events/:eventId/reviews` - Get event reviews
- `POST /api/reviews/events/:eventId/reviews` - Create review
- `PUT /api/reviews/:reviewId` - Update review
- `DELETE /api/reviews/:reviewId` - Delete review
- `POST /api/reviews/:reviewId/like` - Like review

### Certificates

- `POST /api/certificates/events/:eventId/certificates` - Generate certificate
- `GET /api/certificates/users/:userId/certificates` - Get user certificates
- `GET /api/certificates/:certificateId` - Get certificate details
- `GET /api/certificates/events/:eventId/certificates` - Get event certificates (staff/admin)
- `DELETE /api/certificates/:certificateId` - Revoke certificate

## Database Models

### User

- firstName, lastName, email, studentId
- department, role (student/staff/admin)
- password, avatar, bio, phone
- isEmailVerified, isActive
- Timestamps: createdAt, updatedAt, lastLogin

### Event

- title, description, category
- date, time, duration, location, capacity
- registeredCount, attendedCount
- organizer (User reference)
- rating, reviewCount
- status (upcoming/ongoing/completed/cancelled)
- registrants, attendees arrays
- Soft delete support

### Registration

- user (User reference)
- event (Event reference)
- ticketId, qrCode
- status (registered/checked-in/cancelled)
- checkedInAt, checkedInBy

### Review

- user, event references
- rating (1-5), title, comment
- likes, verified status
- Timestamps

### Certificate

- user, event references
- certificateId, title, fileUrl
- issueDate, expiryDate
- status (issued/revoked)

### Reminder

- user, event references
- reminderType (24h-before/1h-before/day-of)
- scheduledFor, sentAt
- status (pending/sent/failed)
- method (email/sms)

## Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT authentication
- ✅ Role-based access control (RBAC)
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Helmet security headers
- ✅ Input validation with express-validator
- ✅ Email verification flow
- ✅ Password reset with secure tokens

## Key Features

- User authentication and authorization
- Event management (create, read, update, delete)
- Event registration with QR code tickets
- Automatic event reminders via email
- User reviews and ratings
- Certificate generation for attendance
- Event attendance tracking
- Dashboard statistics
- Admin dashboard

## Development Notes

- Uses MongoDB for data persistence
- Node cron for scheduled tasks (reminders)
- QR code generation for tickets
- Email templates for notifications
- Soft delete support for events

## Future Enhancements

- SMS reminders integration
- PDF certificate generation
- Photo gallery management
- Advanced analytics
- Mobile app integration
- Payment integration for paid events
