# Backend Deployment Guide for Render

## Prerequisites

1. A Render account (free tier available)
2. A PostgreSQL database (you can use Render's PostgreSQL service)
3. Your backend code pushed to a Git repository (GitHub, GitLab, etc.)

## Step 1: Set up PostgreSQL Database on Render

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New +" and select "PostgreSQL"
3. Configure your database:
   - **Name**: `roxiler-db` (or your preferred name)
   - **Database**: `roxiler_db`
   - **User**: `roxiler_user`
   - **Plan**: Free (or your preferred plan)
4. Click "Create Database"
5. Once created, note down the connection details from the "Connections" tab

## Step 2: Deploy Backend Service

1. In Render Dashboard, click "New +" and select "Web Service"
2. Connect your Git repository
3. Configure the service:
   - **Name**: `roxiler-backend`
   - **Root Directory**: `backend` (if your backend is in a subdirectory)
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

## Step 3: Configure Environment Variables

In your Render service settings, add these environment variables:

### Required Variables:
- `NODE_ENV`: `production`
- `PORT`: `10000` (Render's default)
- `DB_HOST`: Your PostgreSQL host (from Step 1)
- `DB_PORT`: `5432` (default PostgreSQL port)
- `DB_NAME`: Your database name
- `DB_USER`: Your database user
- `DB_PASSWORD`: Your database password
- `JWT_SECRET`: A strong secret key for JWT tokens
- `FRONTEND_URL`: Your frontend URL (e.g., `https://your-frontend-app.onrender.com`)

### Example Environment Variables:
```
NODE_ENV=production
PORT=10000
DB_HOST=dpg-xxxxxxxxxxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_NAME=roxiler_db
DB_USER=roxiler_user
DB_PASSWORD=your-database-password
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=https://your-frontend-app.onrender.com
```

## Step 4: Deploy and Test

1. Click "Create Web Service"
2. Render will automatically build and deploy your application
3. Once deployed, test your API endpoints:
   - Health check: `https://your-app-name.onrender.com/health`
   - API base: `https://your-app-name.onrender.com/api`

## Step 5: Database Migration

After deployment, you may need to run database migrations:

1. Go to your service's "Shell" tab in Render
2. Run: `npm run migrate` (if you have migration scripts)

## Troubleshooting

### Common Issues:

1. **Build Failures**: Check the build logs for missing dependencies
2. **Database Connection**: Ensure all database environment variables are correctly set
3. **CORS Issues**: Make sure `FRONTEND_URL` is set correctly
4. **Port Issues**: Render uses port 10000 by default, ensure your app uses `process.env.PORT`

### Logs:
- Check the "Logs" tab in your Render service for debugging information
- Use the health check endpoint to verify the service is running

## Security Notes

- Never commit `.env` files to your repository
- Use strong, unique JWT secrets
- Keep your database credentials secure
- Consider using Render's environment variable encryption for sensitive data

## Cost Optimization

- Free tier includes 750 hours per month
- Your service will sleep after 15 minutes of inactivity
- First request after sleep may take 30-60 seconds to wake up
