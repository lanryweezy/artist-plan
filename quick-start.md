# 🚀 Quick Start - Deploy Your MVP in 10 Minutes

## Option 1: One-Click Railway Deployment (Recommended)

### Step 1: Deploy Backend
1. Go to [Railway.app](https://railway.app) and sign up with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository and choose the `backend` folder
4. Railway will automatically detect your `railway.json` and deploy

### Step 2: Add Databases
1. In your Railway project, click "New" → "Database" → "MongoDB"
2. Click "New" → "Database" → "Redis"
3. Copy the connection strings from each database

### Step 3: Configure Environment Variables
In your Railway backend service, add these variables:

```bash
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/artist_plan
REDIS_URL=redis://default:password@redis-host:6379
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this
CORS_ORIGINS=https://your-frontend-url.vercel.app
```

### Step 4: Deploy Frontend
1. Go to [Vercel.com](https://vercel.com) and sign up with GitHub
2. Import your repository
3. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app`
4. Deploy!

## Option 2: Command Line Deployment

Run this in PowerShell:
```powershell
.\railway-deploy.ps1
```

## 🎯 What You Get

- ✅ **Live MVP** in 10 minutes
- ✅ **FREE hosting** for 3+ months
- ✅ **Custom domain** support
- ✅ **Automatic SSL** certificates
- ✅ **Database backups** included
- ✅ **Easy scaling** when you get users

## 💰 Cost: $0 for 3 months!

- Railway: $5/month credit (FREE)
- Vercel: FREE tier
- MongoDB: FREE tier (512MB)
- Total: **$0**

## 🚀 Ready to Make Money?

Once deployed, you can immediately:
1. **Share your app** with potential users
2. **Collect feedback** through the app
3. **Add Stripe** for payments (when ready)
4. **Implement subscriptions** 
5. **Start marketing** your solution

Your MVP will be live at: `https://your-app.vercel.app`

**Start getting user feedback TODAY!** 🎵
