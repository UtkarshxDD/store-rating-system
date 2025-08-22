# 🚀 Vercel Deployment Guide

## **Step-by-Step Deployment Instructions**

### **1. Install Vercel CLI (Optional but Recommended)**
```bash
npm install -g vercel
```

### **2. Build Your Project Locally (Test First)**
```bash
cd frontend
npm run build
```

### **3. Deploy to Vercel**

#### **Option A: Deploy via Vercel Dashboard (Recommended for first time)**

1. **Go to [vercel.com](https://vercel.com)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"**
4. **Import your repository**: `utkarshxdd/store-rating-system`
5. **Framework Preset**: Select **"Vite"** (or it should auto-detect)
6. **Root Directory**: Set to `frontend`
7. **Build Command**: `npm run build`
8. **Output Directory**: `dist`
9. **Install Command**: `npm install`
10. **Click "Deploy"**

#### **Option B: Deploy via Vercel CLI**
```bash
cd frontend
vercel
```

### **4. Configure Environment Variables**

In your Vercel dashboard, go to **Settings > Environment Variables** and add:

```
VITE_API_BASE_URL=https://your-backend-url.com/api
```

**For development/testing, you can use:**
```
VITE_API_BASE_URL=http://localhost:3000/api
```

### **5. Update Backend CORS**

Update your backend `.env` file to allow your Vercel domain:
```env
FRONTEND_URL=https://your-project.vercel.app
```

### **6. Automatic Deployments**

- **Every push to main branch** will automatically deploy
- **Preview deployments** for pull requests
- **Custom domains** can be added in Vercel dashboard

## **🔧 Troubleshooting**

### **Build Fails?**
- Check if `npm run build` works locally
- Verify all dependencies are in `package.json`
- Check Vercel build logs

### **API Calls Fail?**
- Verify `VITE_API_BASE_URL` is set correctly
- Check backend CORS settings
- Ensure backend is accessible from Vercel

### **Routing Issues?**
- The `vercel.json` file handles SPA routing
- All routes redirect to `index.html`

## **📱 Your App Will Be Available At:**
```
https://your-project-name.vercel.app
```

## **🔄 Update Backend CORS**
Don't forget to update your backend server to allow requests from your Vercel domain!
