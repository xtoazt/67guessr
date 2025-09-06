# 67guessr Deployment Guide

This guide will help you deploy 67guessr to production with both frontend (Vercel) and backend services (Railway).

## 🚀 Quick Deployment Overview

- **Frontend**: Vercel (Next.js app)
- **API Server**: Railway
- **WebSocket Server**: Railway  
- **Cron Jobs**: Railway
- **Database**: MongoDB Atlas (your existing)
- **Cache**: Redis Cloud (your existing)

## 📋 Prerequisites

1. **GitHub Repository**: Push your code to GitHub
2. **MongoDB Atlas**: Your existing database
3. **Redis Cloud**: Your existing Redis instance
4. **Vercel Account**: [vercel.com](https://vercel.com)
5. **Railway Account**: [railway.app](https://railway.app)

## 🎯 Step 1: Deploy Frontend to Vercel

### 1.1 Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Framework: Next.js (auto-detected)

### 1.2 Set Environment Variables in Vercel
```bash
# Database (your existing credentials)
MONGODB=mongodb+srv://mynameisrohanandthisismyemail:<db_password>@cluster0.p6iwx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
REDIS_URI=redis://redis-18605.c278.us-east-1-4.ec2.redns.redis-cloud.com:18605

# Authentication (generate a secure random string)
JWT_SECRET=your_generated_64_character_hex_string_here

# API URLs (will be set after Railway deployment)
NEXT_PUBLIC_API_URL=your-api-server.railway.app
NEXT_PUBLIC_WS_HOST=your-websocket-server.railway.app

# Optional
MAINTENANCE_SECRET=another_secure_random_string
```

### 1.3 Generate JWT Secret
```bash
# Run this command to generate a secure JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 1.4 Deploy
- Click "Deploy"
- Wait for deployment to complete
- Note your Vercel domain: `your-app-name.vercel.app`

## 🚂 Step 2: Deploy Backend Services to Railway

### 2.1 Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository

### 2.2 Deploy API Server
1. In Railway dashboard, click "New Service"
2. Select "GitHub Repo" → your repository
3. **Service Name**: `67guessr-api`
4. **Root Directory**: `/` (root)
5. **Build Command**: `npm install`
6. **Start Command**: `npm run railway:api`

### 2.3 Deploy WebSocket Server
1. Click "New Service" again
2. Select "GitHub Repo" → your repository  
3. **Service Name**: `67guessr-ws`
4. **Root Directory**: `/` (root)
5. **Build Command**: `npm install`
6. **Start Command**: `npm run railway:ws`

### 2.4 Deploy Cron Jobs (Optional)
1. Click "New Service" again
2. Select "GitHub Repo" → your repository
3. **Service Name**: `67guessr-cron`
4. **Root Directory**: `/` (root)
5. **Build Command**: `npm install`
6. **Start Command**: `npm run railway:cron`

### 2.5 Set Environment Variables in Railway
For each service, add these environment variables:

```bash
# Database
MONGODB=mongodb+srv://mynameisrohanandthisismyemail:<db_password>@cluster0.p6iwx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
REDIS_URI=redis://redis-18605.c278.us-east-1-4.ec2.redns.redis-cloud.com:18605

# Authentication (same as Vercel)
JWT_SECRET=your_generated_64_character_hex_string_here

# Server Configuration
NODE_ENV=production
API_PORT=3001
WS_PORT=3002

# Optional
MAINTENANCE_SECRET=another_secure_random_string
```

## 🔗 Step 3: Connect Frontend to Backend

### 3.1 Get Railway URLs
1. In Railway dashboard, click on each service
2. Go to "Settings" → "Domains"
3. Note the generated domains:
   - API: `https://67guessr-api-production-xxxx.up.railway.app`
   - WebSocket: `https://67guessr-ws-production-xxxx.up.railway.app`

### 3.2 Update Vercel Environment Variables
1. Go back to Vercel dashboard
2. Go to your project → "Settings" → "Environment Variables"
3. Update these variables:
   ```bash
   NEXT_PUBLIC_API_URL=67guessr-api-production-xxxx.up.railway.app
   NEXT_PUBLIC_WS_HOST=67guessr-ws-production-xxxx.up.railway.app
   ```
4. Redeploy your Vercel app

## 🧪 Step 4: Test Your Deployment

### 4.1 Test Frontend
1. Visit your Vercel URL: `https://your-app-name.vercel.app`
2. Try to register a new account
3. Test the login functionality

### 4.2 Test API
1. Visit: `https://your-api-url.railway.app/api/auth`
2. Should return a 405 error (Method Not Allowed) - this is expected for GET requests

### 4.3 Test WebSocket
1. Check Railway logs for WebSocket service
2. Look for "Connected to Redis" and "WebSocket server started" messages

## 🔧 Troubleshooting

### Common Issues

#### 1. CORS Errors
If you get CORS errors, update your API server to allow your Vercel domain:
```javascript
// In server.js, update CORS configuration
app.use(cors({
  origin: ['https://your-app-name.vercel.app'],
  credentials: true
}));
```

#### 2. WebSocket Connection Issues
- Check that WebSocket service is running
- Verify `NEXT_PUBLIC_WS_HOST` is set correctly
- Check Railway logs for WebSocket service

#### 3. Database Connection Issues
- Verify MongoDB connection string
- Check that your MongoDB Atlas allows connections from Railway IPs
- Verify Redis connection string

#### 4. Environment Variables Not Loading
- Make sure variables are set in both Vercel and Railway
- Redeploy services after changing environment variables
- Check variable names match exactly (case-sensitive)

## 📊 Monitoring

### Railway Monitoring
- Check service logs in Railway dashboard
- Monitor resource usage
- Set up alerts for service downtime

### Vercel Monitoring
- Check deployment logs
- Monitor performance metrics
- Set up error tracking

## 💰 Cost Estimation

### Vercel
- **Hobby Plan**: Free (perfect for personal projects)
- **Pro Plan**: $20/month (for production apps)

### Railway
- **Starter Plan**: $5/month per service
- **Developer Plan**: $20/month (unlimited services)

### Total Estimated Cost
- **Minimum**: $15/month (Vercel Hobby + Railway Starter)
- **Recommended**: $40/month (Vercel Pro + Railway Developer)

## 🎉 You're Done!

Your 67guessr app should now be fully deployed and accessible at your Vercel URL. Users can:

- ✅ Register and login with username/password
- ✅ Play single-player games
- ✅ Join multiplayer games (when WebSocket is working)
- ✅ View their stats and game history

## 🔄 Updates and Maintenance

### Deploying Updates
1. Push changes to GitHub
2. Vercel will auto-deploy frontend changes
3. Railway will auto-deploy backend changes (if enabled)

### Environment Variable Updates
1. Update in Vercel/Railway dashboards
2. Redeploy services
3. Test functionality

### Database Backups
- MongoDB Atlas handles automatic backups
- Consider setting up additional backup strategies for production

---

**Need Help?** Check the logs in both Vercel and Railway dashboards for detailed error messages.
