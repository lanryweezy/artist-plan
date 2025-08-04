# Fixing the "Bonk Page" Issue on Render

Your app is showing a blank page (bonk page) on Render due to two main issues that have now been fixed:

## ✅ Fixed Issues

### 1. React Router Client-Side Routing
- **Problem**: React Router handles navigation client-side, but Render was returning 404 for routes like `/dashboard`, `/tasks`, etc.
- **Solution**: Added `public/_redirects` file with `/*    /index.html   200` to redirect all routes to index.html

### 2. Missing Backend API URL
- **Problem**: The frontend was trying to connect to `localhost:5001` in production, which doesn't exist
- **Solution**: Added `VITE_BACKEND_API_URL` environment variable configuration

## 🚀 What You Need to Do on Render

### For Your Frontend Static Site:

1. **Deploy the Latest Build**:
   - The `_redirects` file is now included in your `dist` folder
   - Simply redeploy your site on Render (it will automatically pick up the new build)

2. **Set Environment Variables** in your Render Static Site dashboard:
   ```
   VITE_BACKEND_API_URL=https://your-backend-service-name.onrender.com/api
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Replace `your-backend-service-name` with your actual backend service name on Render.

### For Your Backend Web Service:

Make sure these environment variables are set:
```
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=90d
BACKEND_PORT=5001
```

## 📝 Steps to Deploy:

1. **Commit and push your changes**:
   ```bash
   git add .
   git commit -m "Fix: Add _redirects file and environment variables for production deployment"
   git push
   ```

2. **Update Render Environment Variables**:
   - Go to your Static Site dashboard on Render
   - Navigate to "Environment" tab
   - Add `VITE_BACKEND_API_URL` with your backend URL
   - Add `VITE_GEMINI_API_KEY` if needed

3. **Trigger Redeploy**:
   - Either push new commits or manually trigger redeploy
   - The `_redirects` file will now handle client-side routing
   - The frontend will connect to the correct backend URL

## 🔍 Testing:

After deployment:
- Navigate directly to routes like `/dashboard`, `/tasks` - they should work
- Check browser console for any API connection errors
- Verify authentication flow works properly

## 🐛 If Still Having Issues:

1. Check Render deployment logs for any build errors
2. Verify all environment variables are set correctly
3. Ensure your backend service is running and accessible
4. Check browser developer tools console for JavaScript errors

The blank page should now be resolved! 🎉