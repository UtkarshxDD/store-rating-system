# CORS Troubleshooting Guide

## 🚨 "Failed to Fetch" Error Solution

### Step 1: Update Render Environment Variables

In your Render backend service dashboard:

1. Go to your service → "Environment" tab
2. Add/update these variables:
   ```
   FRONTEND_URL=https://store-rating-system-8n1d.vercel.app
   ```

### Step 2: Update Vercel Environment Variables

In your Vercel frontend project:

1. Go to your project → "Settings" → "Environment Variables"
2. Add this variable:
   ```
   VITE_API_BASE_URL=https://store-rating-system-04su.onrender.com/api
   ```

### Step 3: Redeploy Both Services

1. **Render Backend**: Will auto-redeploy when you save environment variables
2. **Vercel Frontend**: Will auto-redeploy when you save environment variables

## 🔍 Debugging Steps

### Check Backend CORS Logs

1. Go to Render Dashboard → Your Backend Service → "Logs"
2. Look for CORS-related messages
3. You should see: "CORS blocked origin: [your-frontend-url]" if there's an issue

### Test Backend Directly

1. Test health endpoint: `https://your-backend-app.onrender.com/health`
2. Should return: `{"status":"OK","timestamp":"...","uptime":...}`

### Test Frontend API Calls

1. Open browser dev tools (F12)
2. Go to Network tab
3. Try to login/register
4. Check if requests are being made to correct backend URL

## 🛠️ Common Issues & Solutions

### Issue 1: CORS Error in Browser Console
**Error**: `Access to fetch at 'https://backend-url' from origin 'https://frontend-url' has been blocked by CORS policy`

**Solution**: 
- Ensure `FRONTEND_URL` in Render matches your Vercel URL exactly
- Check that the URL includes `https://` protocol

### Issue 2: Backend Not Responding
**Error**: `Failed to fetch` with network error

**Solution**:
- Check if Render service is running (not sleeping)
- Verify backend URL is correct in frontend environment variable
- Test backend health endpoint directly

### Issue 3: Environment Variables Not Applied
**Error**: Still getting CORS errors after updating variables

**Solution**:
- Wait for auto-redeploy to complete (usually 1-2 minutes)
- Check Render logs for any deployment errors
- Verify environment variables are saved correctly

## 📝 Quick Checklist

- [ ] Backend `FRONTEND_URL` set to your Vercel URL
- [ ] Frontend `VITE_API_BASE_URL` set to your Render backend URL
- [ ] Both services redeployed
- [ ] Backend health endpoint working
- [ ] No CORS errors in browser console
- [ ] API requests reaching backend (check Network tab)

## 🔗 Example URLs

**Backend Health Check**: `https://store-rating-system-04su.onrender.com/health`
**API Base**: `https://store-rating-system-04su.onrender.com/api`
**Frontend**: `https://store-rating-system-8n1d.vercel.app`

## 📞 Still Having Issues?

1. Check Render service logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure both services are deployed and running
4. Test with a simple curl request to isolate the issue
