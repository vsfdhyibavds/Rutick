# MongoDB to PostgreSQL Migration Guide

## ✅ What Has Been Migrated

### 1. Database Configuration

- **Before**: `database.js` used Mongoose with MongoDB connection
- **After**: `database.js` uses Sequelize with PostgreSQL connection
- **File**: [src/config/database.js](src/config/database.js)

### 2. All Models Converted

Converted from Mongoose to Sequelize:

- ✅ User model
- ✅ Event model
- ✅ Registration model
- ✅ Review model
- ✅ Certificate model
- ✅ Reminder model
- ✅ Model associations/relationships ([src/models/index.js](src/models/index.js))

### 3. Dependencies Updated

- ❌ Removed: `mongoose`, `mongodb`
- ✅ Added: `sequelize`, `pg`, `pg-hstore`
- **File**: [backend/package.json](package.json)

### 4. Environment Configuration

- **Before**: `MONGODB_URI` environment variable
- **After**: Individual PostgreSQL environment variables
  - `DB_HOST` (default: localhost)
  - `DB_PORT` (default: 5432)
  - `DB_NAME` (default: rutick)
  - `DB_USER` (default: postgres)
  - `DB_PASSWORD` (default: postgres)
- **File**: [.env.example](.env.example)

### 5. Docker Compose Updated

- **Before**: MongoDB container
- **After**: PostgreSQL container with proper healthcheck
- **File**: [docker-compose.yml](../docker-compose.yml)

### 6. Seed Script Updated

- **Before**: Used Mongoose operations
- **After**: Uses Sequelize operations
- **File**: [src/scripts/seedDatabase.js](src/scripts/seedDatabase.js)

### 7. Database Test Script Updated

- **Before**: MongoDB connection test
- **After**: PostgreSQL connection test
- **File**: [src/scripts/testMongoConnection.js](src/scripts/testMongoConnection.js)
- **Command**: `npm run test:db`

### 8. Server Entry Point Updated

- Updated import from `require()` to destructured import for database connection
- **File**: [src/server.js](src/server.js)

---

## 🔄 What Still Needs To Be Updated

### Controllers (CRITICAL)

All controllers need to be updated to use Sequelize methods instead of Mongoose:

**Key Changes Needed:**

```javascript
// MONGOOSE (OLD)
await User.findById(id);
await User.find({ email: "test@test.com" });
await User.updateOne({ _id: id }, { field: value });
await User.deleteMany({});

// SEQUELIZE (NEW)
await User.findByPk(id);
await User.findAll({ where: { email: "test@test.com" } });
await User.update({ field: value }, { where: { id } });
await User.destroy({ where: {} }); // destructive, be careful
```

**Controllers to Update:**

1. [src/controllers/authController.js](src/controllers/authController.js)
2. [src/controllers/userController.js](src/controllers/userController.js)
3. [src/controllers/eventController.js](src/controllers/eventController.js)
4. [src/controllers/registrationController.js](src/controllers/registrationController.js)
5. [src/controllers/reviewController.js](src/controllers/reviewController.js)
6. [src/controllers/certificateController.js](src/controllers/certificateController.js)

### Routes

- Update any `populate()` calls to Sequelize `include` syntax
- Update error handling to work with Sequelize errors

### Middleware

- [src/middleware/auth.js](src/middleware/auth.js) - Verify JWT middleware works with Sequelize
- [src/middleware/roles.js](src/middleware/roles.js) - Update role checking

### Utils

- [src/utils/reminderScheduler.js](src/utils/reminderScheduler.js) - Update database queries
- [src/utils/qrCodeUtils.js](src/utils/qrCodeUtils.js) - May need updates
- [src/utils/emailTemplates.js](src/utils/emailTemplates.js) - Check for database references

---

## 🚀 Getting Started

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup PostgreSQL Database

**Option A: Using Docker**

```bash
docker-compose up -d postgres
```

**Option B: Local Installation**

- Install PostgreSQL from https://www.postgresql.org/download/
- Create database:
  ```sql
  CREATE DATABASE rutick;
  CREATE USER rutick_user WITH PASSWORD 'rutick_password';
  GRANT ALL PRIVILEGES ON DATABASE rutick TO rutick_user;
  ```

**Option C: Using Heroku or AWS RDS**

- Create a PostgreSQL database
- Use the connection string in your `.env` file

### 3. Create `.env` File

```bash
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=rutick
DB_USER=postgres
DB_PASSWORD=your_password
PORT=5000
NODE_ENV=development
JWT_SECRET=your_long_random_secret_key_at_least_32_chars
JWT_EXPIRE=7d
REFRESH_TOKEN_SECRET=another_long_random_secret_key
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX=100
```

### 4. Test Database Connection

```bash
npm run test:db
```

### 5. Seed Database (Optional)

```bash
npm run seed
```

### 6. Start Development Server

```bash
npm run dev
```

---

## 📌 Important Notes

### ID Format Change

- **MongoDB**: Used ObjectId (e.g., `507f1f77bcf86cd799439011`)
- **PostgreSQL/Sequelize**: Now using UUID (e.g., `550e8400-e29b-41d4-a716-446655440000`)

**This means:**

- Update any API responses that reference IDs
- Update frontend code that stores/uses MongoDB ObjectIds
- Ensure all migrations handle the ID format change

### Migration Tool Needed

You might want to create a migration script to transfer data from MongoDB to PostgreSQL if you have existing data.

### Relationship Queries

**MongoDB (Mongoose):**

```javascript
const user = await User.findById(id)
  .populate("registrations")
  .populate("reviews");
```

**PostgreSQL (Sequelize):**

```javascript
const user = await User.findByPk(id, {
  include: ["registrations", "reviews"],
});
```

---

## 🔗 Model Associations Reference

All relationships are defined in [src/models/index.js](src/models/index.js):

- **User** ↔ **Event**: User can organize events
- **User** ↔ **Registration**: User can register for events
- **Event** ↔ **Registration**: Events have registrations
- **User** ↔ **Review**: Users can write reviews
- **Event** ↔ **Review**: Events have reviews
- **User** ↔ **Certificate**: Users can receive certificates
- **Event** ↔ **Certificate**: Events issue certificates
- **User** ↔ **Reminder**: Users get reminders
- **Event** ↔ **Reminder**: Events have reminders

---

## ✨ Next Steps

1. Update all controllers to use Sequelize methods
2. Test each endpoint with Postman/Insomnia
3. Update frontend to handle new UUID format for IDs
4. Update any database-related utilities
5. Run full test suite
6. Deploy to production with PostgreSQL database

---

## 📚 Learning Resources

- **Sequelize Documentation**: https://sequelize.org/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Query Comparison**: See examples in controllers when updating

---

Generated: March 10, 2026
