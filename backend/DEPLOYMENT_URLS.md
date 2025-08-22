# Deployment URLs Reference

## 🌐 Your Application URLs

### Frontend (Vercel)
- **URL**: https://store-rating-system-8n1d.vercel.app/
- **Environment Variable**: `VITE_API_BASE_URL=https://store-rating-system-04su.onrender.com/api`

### Backend (Render)
- **URL**: https://store-rating-system-04su.onrender.com
- **Health Check**: https://store-rating-system-04su.onrender.com/health
- **API Base**: https://store-rating-system-04su.onrender.com/api
- **Environment Variable**: `FRONTEND_URL=https://store-rating-system-8n1d.vercel.app`

## 🔧 Required Environment Variables

### Render Backend Environment Variables
```
NODE_ENV=production
PORT=10000
DB_HOST=[your-postgres-host]
DB_PORT=5432
DB_NAME=[your-database-name]
DB_USER=[your-database-user]
DB_PASSWORD=[your-database-password]
JWT_SECRET=[strong-secret-key]
FRONTEND_URL=https://store-rating-system-8n1d.vercel.app
```

### Vercel Frontend Environment Variables
```
VITE_API_BASE_URL=https://store-rating-system-04su.onrender.com/api
```

## 🧪 Testing URLs

### Backend Health Check
```
GET https://store-rating-system-04su.onrender.com/health
```

### API Endpoints
```
POST https://store-rating-system-04su.onrender.com/api/auth/login
POST https://store-rating-system-04su.onrender.com/api/auth/register
GET https://store-rating-system-04su.onrender.com/api/admin/dashboard
```

## 📝 Quick Setup Commands

### Test Backend Health
```bash
curl https://store-rating-system-04su.onrender.com/health
```

### Test Frontend-Backend Connection
1. Open https://store-rating-system-8n1d.vercel.app/
2. Try to login/register
3. Check browser dev tools for any CORS errors
