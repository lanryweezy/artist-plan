# 🚀 Artist Plan MVP Deployment Guide

## Quick Deploy to Railway (Recommended)

### Step 1: Deploy Backend to Railway

1. **Sign up at [Railway.app](https://railway.app)** with GitHub
2. **Create new project** → "Deploy from GitHub repo"
3. **Select your repository** → Choose `backend` folder
4. **Railway will auto-detect** your `railway.json` config

### Step 2: Add Databases

1. **Add MongoDB**: In your Railway project → "New" → "Database" → "MongoDB"
2. **Add Redis**: "New" → "Database" → "Redis"
3. **Copy connection strings** from each database service

### Step 3: Configure Environment Variables

In your Railway backend service, add these environment variables:

```bash
# Database
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/artist_plan?retryWrites=true&w=majority
REDIS_URL=redis://default:password@redis-host:6379

# Security
JWT_SECRET_KEY=your-super-secret-jwt-key-change-this-in-production
ENVIRONMENT=production

# CORS (update with your frontend URL)
CORS_ORIGINS=https://your-frontend-url.vercel.app,https://your-custom-domain.com
```

### Step 4: Deploy Frontend to Vercel

1. **Sign up at [Vercel.com](https://vercel.com)** with GitHub
2. **Import your repository**
3. **Configure build settings**:
   - Framework: Next.js
   - Root Directory: `/` (root)
   - Build Command: `npm run build`
   - Output Directory: `.next`

4. **Add environment variables**:
```bash
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

### Step 5: Custom Domain (Optional but Recommended)

1. **Buy domain** from Namecheap/GoDaddy (~$10/year)
2. **Add to Vercel**: Project Settings → Domains
3. **Update CORS** in Railway backend with your domain

## 🎯 Alternative: All-in-One Railway Deployment

If you prefer everything on Railway:

1. **Deploy backend** (as above)
2. **Deploy frontend** to Railway:
   - Create new service → "Deploy from GitHub"
   - Select root folder
   - Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app`

## 💰 Cost Breakdown (3 Months Free)

- **Railway**: $5/month credit (FREE for 3+ months)
- **Vercel**: FREE tier (unlimited for personal projects)
- **MongoDB Atlas**: FREE tier (512MB)
- **Domain**: ~$10/year (optional)

**Total: $0 for first 3 months!**

## 🚀 Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify user registration/login
- [ ] Check database connections
- [ ] Test file uploads (if any)
- [ ] Set up monitoring/alerts
- [ ] Configure backup strategy

## 📈 Ready to Monetize?

Once deployed, you can:
1. **Add Stripe integration** for payments
2. **Implement subscription tiers**
3. **Add analytics** (Google Analytics, Mixpanel)
4. **Set up user feedback** collection
5. **Create landing page** for marketing

## 🆘 Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Your app will be live in ~10 minutes!
