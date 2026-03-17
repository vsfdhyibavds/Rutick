#!/bin/bash

# RUTick Setup Script

echo "🚀 RUTick Project Setup"
echo "======================"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 14+."
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Check MongoDB
if ! command -v mongod &> /dev/null; then
    echo "⚠️  MongoDB is not installed. Please install MongoDB:"
    echo "   - Download from: https://www.mongodb.com/try/download/community"
    echo "   - Or use Docker: docker run -d -p 27017:27017 --name mongo mongodb/mongodb-community-server"
fi

# Backend setup
echo ""
echo "📦 Setting up Backend..."
cd backend

# Create .env file
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo "⚠️  Please update backend/.env with your configuration:"
    echo "   - MONGODB_URI"
    echo "   - JWT_SECRET"
    echo "   - SMTP_* (email settings)"
    echo "   - FRONTEND_URL"
fi

# Install dependencies
echo "Installing dependencies..."
npm install

echo ""
echo "✅ Backend setup complete!"
echo ""
echo "📝 Configuration Steps:"
echo "1. Edit backend/.env with your settings"
echo "2. Ensure MongoDB is running"
echo "3. Start backend: npm run dev (in backend directory)"
echo ""
echo "🌐 Frontend Configuration:"
echo "1. Open index.html in a web browser"
echo "2. Update API_BASE_URL in scripts/api.js if needed"
echo ""
echo "📚 Documentation:"
echo "   - Backend: backend/README.md"
echo "   - Frontend: See inline comments in index.html"
echo ""
echo "🎉 Setup complete! Happy coding!"
