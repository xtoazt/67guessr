#!/bin/bash

# Set environment variables for development
export MONGODB="mongodb://localhost:27017/67guessr"
export REDIS_URI="redis://localhost:6379"
export JWT_SECRET="67guessr_jwt_secret_key_2025_development_only"
export NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="AIzaSyB9vKASqiPS-xWAVBy5YlqOJLEvLwpA6iw"
export NEXT_PUBLIC_API_URL="localhost:3000"
export NEXT_PUBLIC_WS_HOST="localhost:3002"
export PORT="3000"
export NODE_ENV="development"
export MAINTENANCE_SECRET="67guessr_maintenance_secret_2025"

echo "🚀 Starting 67guessr development servers..."
echo "📊 API Server: http://localhost:3000"
echo "🌐 Frontend: http://localhost:3001"
echo "🔌 WebSocket: ws://localhost:3002"

# Start the development servers
npm run dev-full
