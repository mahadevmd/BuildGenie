#!/bin/bash

set -e

echo "🚀 Starting BuildGenie Production Deployment..."

# Check if required environment variables are set
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it from .env.example"
    exit 1
fi

# Build and deploy containers
echo "📦 Building Docker containers..."
docker-compose build

echo "🔧 Starting services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Health checks
echo "🏥 Checking service health..."
if curl -f http://localhost/health; then
    echo "✅ Backend service is healthy"
else
    echo "❌ Backend service is not responding"
    exit 1
fi

# Build mobile app
echo "📱 Building mobile app..."
cd frontend
npm run build
npx cap sync
cd ..

echo "🎉 Deployment completed successfully!"
echo "🌐 Web App: https://your-domain.com"
echo "📱 Mobile: Run 'npm run mobile:android' or 'npm run mobile:ios' to build native apps"