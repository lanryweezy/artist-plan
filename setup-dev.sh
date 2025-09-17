#!/bin/bash

echo "Setting up Artist Plan development environment..."

# Copy environment files if they don't exist
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file from .env.example"
fi

if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "Created backend/.env file from backend/.env.example"
fi

# Install frontend dependencies
echo "Installing frontend dependencies..."
npm install

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
pip install -r requirements.txt
cd ..

# Start Docker services
echo "Starting Docker services..."
docker-compose up -d mongodb redis

echo "Development environment setup complete!"
echo ""
echo "To start the development servers:"
echo "1. Frontend: npm run dev"
echo "2. Backend: cd backend && python main.py"
echo "3. Or use Docker: docker-compose up"
echo ""
echo "Services will be available at:"
echo "- Frontend: http://localhost:3000"
echo "- Backend API: http://localhost:8000"
echo "- MongoDB: localhost:27017"
echo "- Redis: localhost:6379"
echo "- Mongo Express: http://localhost:8081"