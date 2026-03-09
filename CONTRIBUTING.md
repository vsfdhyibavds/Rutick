# Contributing to RUTick

Thank you for your interest in contributing to RUTick! This guide covers how to set up your development environment, structure code changes, and submit contributions.

## Table of Contents

- [Development Setup](#development-setup)
- [Code Structure](#code-structure)
- [Adding Features](#adding-features)
- [Code Style](#code-style)
- [Testing](#testing)
- [Git Workflow](#git-workflow)
- [Common Tasks](#common-tasks)

## Development Setup

### 1. Fork & Clone

```bash
# Fork the repo on GitHub
# Then clone your fork:
git clone https://github.com/YOUR-USERNAME/rutick.git
cd rutick
```

### 2. Create Development Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-name
```

### 3. Install Dependencies

```bash
# Windows
setup.bat

# Linux/Mac
bash setup.sh
```

### 4. Set Up Environment

```bash
node setup-env-generator.js
# Edit backend/.env with your settings
```

### 5. Start Development

**Terminal 1 - MongoDB:**

```bash
docker run -p 27017:27017 --name rutick-mongo mongo:7.0
```

**Terminal 2 - Backend:**

```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**

```bash
python -m http.server 3000
```

## Code Structure

### Backend (`/backend/src`)

```
backend/src/
├── models/           # Database schemas
│   ├── User.js
│   ├── Event.js
│   ├── Registration.js
│   ├── Review.js
│   ├── Certificate.js
│   └── Reminder.js
├── controllers/      # Business logic
│   ├── authController.js
│   ├── eventController.js
│   ├── registrationController.js
│   ├── userController.js
│   ├── reviewController.js
│   └── certificateController.js
├── routes/          # API endpoints
│   ├── authRoutes.js
│   ├── eventRoutes.js
│   ├── registrationRoutes.js
│   ├── userRoutes.js
│   ├── reviewRoutes.js
│   └── certificateRoutes.js
├── middleware/      # Express middleware
│   ├── auth.js
│   ├── roles.js
│   └── errorHandler.js
├── utils/          # Utility functions
│   ├── tokenUtils.js
│   ├── qrCodeUtils.js
│   ├── emailTemplates.js
│   ├── email.js
│   └── reminderScheduler.js
├── config/         # Configuration
│   ├── database.js
│   └── email.js
└── server.js       # Entry point
```

### Frontend (`/scripts`)

```
scripts/
├── api.js                  # API client library
├── eventManager.js         # Event feature logic
├── profileManager.js       # Profile/user logic
├── registrationManager.js  # Registration logic
├── reviewManager.js        # Reviews logic
├── certificateManager.js   # Certificates logic
├── adminManager.js         # Admin features
└── utils.js                # Utilities (notifications, formatting, etc.)
```

## Adding Features

### Adding a New API Endpoint

**Step 1: Create/Update Model**

`backend/src/models/YourModel.js`:

```javascript
const mongoose = require("mongoose");

const yourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("YourModel", yourSchema);
```

**Step 2: Create Controller**

`backend/src/controllers/yourController.js`:

```javascript
const YourModel = require("../models/YourModel");
const { ApiError } = require("../middleware/errorHandler");

// Get all
exports.getAll = async (req, res, next) => {
  try {
    const items = await YourModel.find();
    res.json({
      success: true,
      data: items,
    });
  } catch (error) {
    next(error);
  }
};

// Get one
exports.getOne = async (req, res, next) => {
  try {
    const item = await YourModel.findById(req.params.id);
    if (!item) {
      throw new ApiError(404, "Item not found");
    }
    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// Create
exports.create = async (req, res, next) => {
  try {
    const item = new YourModel(req.body);
    await item.save();
    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// Update
exports.update = async (req, res, next) => {
  try {
    const item = await YourModel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) {
      throw new ApiError(404, "Item not found");
    }
    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    next(error);
  }
};

// Delete
exports.delete = async (req, res, next) => {
  try {
    const item = await YourModel.findByIdAndDelete(req.params.id);
    if (!item) {
      throw new ApiError(404, "Item not found");
    }
    res.json({
      success: true,
      message: "Item deleted",
    });
  } catch (error) {
    next(error);
  }
};
```

**Step 3: Create Routes**

`backend/src/routes/yourRoutes.js`:

```javascript
const express = require("express");
const router = express.Router();
const yourController = require("../controllers/yourController");
const { authMiddleware } = require("../middleware/auth");
const { roleMiddleware } = require("../middleware/roles");

// Public endpoints
router.get("/", yourController.getAll);
router.get("/:id", yourController.getOne);

// Protected endpoints
router.post("/", authMiddleware, yourController.create);
router.put("/:id", authMiddleware, yourController.update);
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  yourController.delete,
);

module.exports = router;
```

**Step 4: Mount Routes**

`backend/src/server.js`:

```javascript
const yourRoutes = require("./routes/yourRoutes");

app.use("/api/your-resource", yourRoutes);
```

**Step 5: Update Frontend API**

`scripts/api.js`:

```javascript
const yourAPI = {
  getAll: () => apiGet("/your-resource"),
  getOne: (id) => apiGet(`/your-resource/${id}`),
  create: (data) => apiPost("/your-resource", data),
  update: (id, data) => apiPut(`/your-resource/${id}`, data),
  delete: (id) => apiDelete(`/your-resource/${id}`),
};
```

### Adding Frontend Feature Manager

`scripts/yourManager.js`:

```javascript
class YourManager {
  async loadItems() {
    try {
      const response = await yourAPI.getAll();
      this.displayItems(response.data);
    } catch (error) {
      showNotification("Error loading items", "error");
      console.error(error);
    }
  }

  displayItems(items) {
    const container = document.getElementById("items-container");
    container.innerHTML = items
      .map(
        (item) => `
      <div class="item-card">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <button onclick="yourManager.viewItem('${item._id}')">View</button>
        <button onclick="yourManager.deleteItem('${item._id}')">Delete</button>
      </div>
    `,
      )
      .join("");
  }

  async deleteItem(id) {
    if (!confirm("Are you sure?")) return;
    try {
      await yourAPI.delete(id);
      showNotification("Item deleted", "success");
      this.loadItems();
    } catch (error) {
      showNotification("Error deleting item", "error");
    }
  }
}

const yourManager = new YourManager();
```

## Code Style

### JavaScript Style Guide

- **Indentation**: 2 spaces
- **Semicolons**: Yes, always use them
- **Quotes**: Use single quotes `'` except in HTML/JSON
- **Variables**: Use `const` by default, `let` if reassigned, avoid `var`
- **Naming**: camelCase for variables/functions, PascalCase for classes
- **Comments**: Add JSDoc comments for functions

```javascript
/**
 * Validates user email
 * @param {string} email - The email to validate
 * @returns {boolean} Whether email is valid
 */
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
```

### Error Handling

Always include try-catch in async functions:

```javascript
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
```

### Response Format

Always follow consistent response format:

```javascript
// Success
res.json({
  success: true,
  data: {
    /* your data */
  },
  message: "Optional success message",
});

// Error (handled by errorHandler middleware)
throw new ApiError(400, "Error message");
```

## Testing

### Manual API Testing

Use Postman or VS Code REST Client:

**test.http**:

```http
### Get all items
GET http://localhost:5000/api/your-resource

### Get specific item
GET http://localhost:5000/api/your-resource/123

### Create item
POST http://localhost:5000/api/your-resource
Content-Type: application/json

{
  "name": "Test Item",
  "description": "Test Description"
}

### Update item
PUT http://localhost:5000/api/your-resource/123
Content-Type: application/json

{
  "name": "Updated Name"
}

### Delete item
DELETE http://localhost:5000/api/your-resource/123
```

### Unit Testing

Add tests in `backend/tests/`:

```javascript
const request = require("supertest");
const app = require("../src/server");

describe("Your Resource API", () => {
  test("GET /api/your-resource returns items", async () => {
    const response = await request(app).get("/api/your-resource");
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  test("POST /api/your-resource creates item", async () => {
    const response = await request(app).post("/api/your-resource").send({
      name: "Test Item",
      description: "Test",
    });
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
  });
});
```

Run tests:

```bash
cd backend
npm test
```

## Git Workflow

### Making Changes

```bash
# Create branch
git checkout -b feature/add-notifications

# Make your changes
# Edit files...

# Stage changes
git add .

# Commit with clear message
git commit -m "feat: add email notifications for events"

# Push to your fork
git push origin feature/add-notifications
```

### Commit Messages

Follow conventional commits:

```
feat: add new feature
fix: fix a bug
docs: documentation changes
style: code style changes (no logic)
refactor: refactor code without changing behavior
test: add/update tests
chore: dependency updates, build changes
```

Examples:

```
feat: add reminder email notifications
fix: resolve CORS error on event registration
docs: update API documentation
```

### Creating Pull Request

1. Push your branch to GitHub
2. Go to repository and click "Compare & Pull Request"
3. Add title and description
4. Add screenshots/gifs if UI changes
5. Submit PR for review

PR Template:

```markdown
## What does this PR do?

Brief description of changes

## Why?

Why is this change needed?

## How to test?

Steps to verify the changes work

## Screenshots (if applicable)

Add images/gifs showing the change

## Checklist

- [ ] Code follows style guide
- [ ] Self-reviewed my code
- [ ] Added/updated comments
- [ ] Updated documentation
- [ ] No breaking changes
```

## Common Tasks

### Adding a Database Field

1. Update model:

   ```javascript
   // backend/src/models/YourModel.js
   yourSchema.add({
     newField: {
       type: String,
       required: false,
     },
   });
   ```

2. Create migration (for existing data):

   ```bash
   # Create a script to update existing records
   node backend/src/scripts/migrations/add-newfield.js
   ```

3. Update validations if needed

4. Update API documentation

### Adding Email Template

1. Edit `backend/src/utils/emailTemplates.js`:

   ```javascript
   exports.yourEmailTemplate = (user, data) => ({
     subject: "Email Subject",
     html: `
       <h1>Hello ${user.firstName}</h1>
       <p>${data.message}</p>
     `,
   });
   ```

2. Use in controller:
   ```javascript
   const { yourEmailTemplate } = require("../utils/emailTemplates");
   const emailData = yourEmailTemplate(user, { message: "Test" });
   await sendEmail(user.email, emailData.subject, emailData.html);
   ```

### Adding Admin Feature

1. Add route with role check:

   ```javascript
   router.post(
     "/admin/action",
     authMiddleware,
     roleMiddleware("admin"),
     adminController.action,
   );
   ```

2. Add frontend button:
   ```javascript
   // Only show to admins
   if (user.role === "admin") {
     showElement("admin-actions");
   }
   ```

### Updating Dependencies

```bash
cd backend
npm outdated           # See what's outdated
npm update             # Update to latest compatible
npm install pkg@latest # Update specific package
npm audit              # Check for vulnerabilities
npm audit fix          # Fix vulnerabilities
```

## Need Help?

- **Issues**: Open an issue on GitHub
- **Discussions**: Start a discussion for questions
- **Documentation**: Check docs/ folder
- **Slack/Chat**: Join our community chat

## Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Report inappropriate behavior

Thank you for contributing! 🎉
