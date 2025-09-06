# 🌊 67guessr - DigitalOcean App Platform FREE Deployment Guide

Deploy 67guessr completely free using **DigitalOcean App Platform** - the best free alternative with excellent performance!

## 🎯 Why DigitalOcean App Platform is Perfect

### ✅ **DigitalOcean Advantages:**
- **$5/month free credit** (1000 hours free - enough for 2 services 24/7)
- **No sleep mode** - services stay awake 24/7
- **Better performance** than Render
- **Full WebSocket support**
- **Easy GitHub integration**
- **Custom domains**
- **Automatic deployments**
- **Health checks**

## 🚀 Step 1: Deploy to DigitalOcean App Platform (FREE)

### 1.1 Sign Up
1. Go to [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Sign up with GitHub
3. Get $200 free credit (new accounts)

### 1.2 Deploy Using App Spec (Easiest Method)
1. Go to Apps → Create App
2. Choose "GitHub" as source
3. Select your repository
4. DigitalOcean will detect the `.do/app.yaml` file
5. Click "Create Resources"

### 1.3 Manual Deployment (Alternative)
If App Spec doesn't work, deploy services manually:

#### **API Server:**
1. Go to Apps → Create App
2. Choose "GitHub" as source
3. Select your repository
4. **Name**: `67guessr-api`
5. **Environment**: Node.js
6. **Build Command**: `npm install`
7. **Run Command**: `npm run do:api`
8. **Port**: `3001`

#### **WebSocket Server:**
1. Go to Apps → Create App
2. Choose "GitHub" as source
3. Select your repository
4. **Name**: `67guessr-ws`
5. **Environment**: Node.js
6. **Build Command**: `npm install`
7. **Run Command**: `npm run do:ws`
8. **Port**: `3002`

### 1.4 Set Environment Variables
For each service, add these environment variables:

```bash
# Database (your existing credentials)
MONGODB=mongodb+srv://mynameisrohanandthisismyemail:<db_password>@cluster0.p6iwx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
REDIS_URI=redis://redis-18605.c278.us-east-1-4.ec2.redns.redis-cloud.com:18605

# Authentication
JWT_SECRET=f4141d87f162acc1dbf663c5240a2cf300d098b6f632bdceebef2e9b6366efbbeee5211a1d3f18056b8161a0a8314fb09af905c56586c480462ac78e0a7c14d9

# Server Configuration
NODE_ENV=production
API_PORT=3001
WS_PORT=3002

# Optional
MAINTENANCE_SECRET=your_secure_maintenance_secret
```

## 🖥️ Step 2: Deploy Frontend to Vercel (FREE)

### 2.1 Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your repository
4. Framework: Next.js (auto-detected)

### 2.2 Set Environment Variables
```bash
# Database (your existing credentials)
MONGODB=mongodb+srv://mynameisrohanandthisismyemail:<db_password>@cluster0.p6iwx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
REDIS_URI=redis://redis-18605.c278.us-east-1-4.ec2.redns.redis-cloud.com:18605

# Authentication
JWT_SECRET=f4141d87f162acc1dbf663c5240a2cf300d098b6f632bdceebef2e9b6366efbbeee5211a1d3f18056b8161a0a8314fb09af905c56586c480462ac78e0a7c14d9

# API URLs (DigitalOcean will provide these)
NEXT_PUBLIC_API_URL=your-api-server.ondigitalocean.app
NEXT_PUBLIC_WS_HOST=your-websocket-server.ondigitalocean.app
```

## 🔗 Step 3: Connect Frontend to Backend

### 3.1 Get DigitalOcean URLs
1. In DigitalOcean dashboard, go to each app
2. Note the generated URLs:
   - API: `https://67guessr-api-xxxxx.ondigitalocean.app`
   - WebSocket: `https://67guessr-ws-xxxxx.ondigitalocean.app`

### 3.2 Update Vercel Environment Variables
1. Go to Vercel dashboard
2. Project → Settings → Environment Variables
3. Update:
   ```bash
   NEXT_PUBLIC_API_URL=67guessr-api-xxxxx.ondigitalocean.app
   NEXT_PUBLIC_WS_HOST=67guessr-ws-xxxxx.ondigitalocean.app
   ```
4. Redeploy Vercel app

## 🧪 Step 4: Test Your FREE Deployment

### 4.1 Test Frontend
- Visit: `https://your-app-name.vercel.app`
- Try registering a new account
- Test login functionality

### 4.2 Test API
- Visit: `https://your-api-url.ondigitalocean.app/api/health`
- Should return health status

### 4.3 Test WebSocket
- Check DigitalOcean logs for WebSocket service
- Look for "Connected to Redis" messages

## 💰 DigitalOcean Free Tier Details

### **$5/month Free Credit:**
- ✅ **1000 hours free** (enough for 2 services 24/7)
- ✅ **No sleep mode** - services stay awake 24/7
- ✅ **Better performance** than Render
- ✅ **Full WebSocket support**
- ✅ **Custom domains**
- ✅ **Automatic deployments**

### **New Account Bonus:**
- ✅ **$200 free credit** for new accounts
- ✅ **60 days to use** the credit
- ✅ **More than enough** for development and testing

### **Usage Monitoring:**
- Check DigitalOcean dashboard for credit usage
- Monitor service performance
- Set up alerts if approaching limits

## 🔧 Optimizing for DigitalOcean

### 1. Health Checks
- DigitalOcean automatically monitors your services
- Health check endpoints keep services healthy
- Automatic restarts if services fail

### 2. Performance
- Enable gzip compression
- Use CDN for static assets
- Optimize images and code

### 3. Monitoring
- Check DigitalOcean logs for issues
- Monitor resource usage
- Set up alerts for downtime

## 🎉 You're Done!

Your 67guessr app is now deployed **100% FREE** with:
- ✅ Frontend on Vercel
- ✅ API server on DigitalOcean
- ✅ WebSocket server on DigitalOcean
- ✅ Your existing free databases

**Total Monthly Cost: $0** 🎉

## 🔄 Maintenance

### Automatic Deployments:
- Push to GitHub → Vercel auto-deploys frontend
- Push to GitHub → DigitalOcean auto-deploys backend

### Monitoring:
- Check DigitalOcean logs for backend issues
- Check Vercel logs for frontend issues
- Monitor free tier usage limits

### Updates:
- Update environment variables in both platforms
- Redeploy services after changes
- Test functionality after updates

## 🚨 Important Notes

### DigitalOcean App Platform:
- **Services stay awake** 24/7 (no sleep mode)
- **Fast cold starts** (5-10 seconds)
- **Automatic scaling** based on demand
- **Health monitoring** and auto-restart

### Workarounds:
1. **Health Check Endpoints**: Already included in your app
2. **Monitoring**: Use DigitalOcean's built-in monitoring
3. **Alerts**: Set up alerts for service issues

## 🎯 Next Steps

1. **Deploy to DigitalOcean** (follow steps above)
2. **Deploy to Vercel** (follow steps above)
3. **Connect them together** (update environment variables)
4. **Test your app** (verify all functionality)
5. **Set up monitoring** (optional but recommended)

---

**Need Help?** 
- DigitalOcean Documentation: [docs.digitalocean.com](https://docs.digitalocean.com)
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Check service logs for detailed error messages

**Enjoy your FREE 67guessr deployment on DigitalOcean!** 🌊
