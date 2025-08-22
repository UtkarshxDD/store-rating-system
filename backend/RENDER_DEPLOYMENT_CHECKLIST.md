# Render Deployment Checklist

## ✅ Pre-Deployment Checklist

### 1. Code Preparation
- [ ] All code is committed to Git repository
- [ ] No sensitive data in code (API keys, passwords, etc.)
- [ ] Environment variables are properly configured
- [ ] Database connection uses environment variables
- [ ] CORS is configured for production

### 2. Database Setup
- [ ] Create PostgreSQL database on Render
- [ ] Note down database connection details:
  - Host: `dpg-xxxxxxxxxxxxx-a.oregon-postgres.render.com`
  - Port: `5432`
  - Database name: `roxiler_db`
  - Username: `roxiler_user`
  - Password: `[your-password]`

### 3. Environment Variables (Set in Render Dashboard)
- [ ] `NODE_ENV` = `production`
- [ ] `PORT` = `10000`
- [ ] `DB_HOST` = [your-database-host]
- [ ] `DB_PORT` = `5432`
- [ ] `DB_NAME` = [your-database-name]
- [ ] `DB_USER` = [your-database-user]
- [ ] `DB_PASSWORD` = [your-database-password]
- [ ] `JWT_SECRET` = [strong-secret-key]
- [ ] `FRONTEND_URL` = [your-frontend-url]

## 🚀 Deployment Steps

### Step 1: Create Web Service
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" → "Web Service"
3. Connect your Git repository
4. Configure service:
   - **Name**: `roxiler-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

### Step 2: Set Environment Variables
1. In your service settings, go to "Environment" tab
2. Add all required environment variables listed above
3. Save changes

### Step 3: Deploy
1. Click "Create Web Service"
2. Monitor build logs for any errors
3. Wait for deployment to complete

### Step 4: Test Deployment
1. Check health endpoint: `https://your-app-name.onrender.com/health`
2. Test API endpoints: `https://your-app-name.onrender.com/api`
3. Verify database connection
4. Test authentication endpoints

## 🔧 Post-Deployment

### Database Migration
- [ ] Migration should run automatically via `postinstall` script
- [ ] Verify tables are created in database
- [ ] Check default admin user is created:
  - Email: `admin@example.com`
  - Password: `Admin@123`

### Monitoring
- [ ] Check service logs for any errors
- [ ] Monitor database connections
- [ ] Test all API endpoints
- [ ] Verify CORS is working with frontend

## 🐛 Troubleshooting

### Common Issues:
1. **Build fails**: Check package.json and dependencies
2. **Database connection fails**: Verify environment variables
3. **CORS errors**: Check FRONTEND_URL setting
4. **Port issues**: Ensure app uses `process.env.PORT`

### Useful Commands:
- Check logs: Render Dashboard → Your Service → Logs
- Access shell: Render Dashboard → Your Service → Shell
- Manual migration: `npm run migrate`

## 📝 Notes
- Free tier services sleep after 15 minutes of inactivity
- First request after sleep may take 30-60 seconds
- Database migrations run automatically on deployment
- Health check endpoint: `/health`
- API base URL: `/api`
