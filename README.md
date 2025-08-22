
# Default admin credentials:
Email: admin@example.com
Password: Admin@123

# 🏪 Store Rating System

A full-stack web application that allows users to rate stores, built with React (frontend) and Node.js/Express (backend) with PostgreSQL database.

## ✨ Features

- **User Authentication**: Secure login/register system with JWT tokens
- **Role-Based Access Control**: Three user roles (Admin, Store Owner, Normal User)
- **Store Management**: Admins can create and manage stores
- **Rating System**: Users can rate stores from 1-5 stars
- **Responsive UI**: Modern, mobile-friendly interface built with Tailwind CSS
- **Real-time Updates**: Dynamic content updates without page refresh

## 🚀 Tech Stack

### Frontend
- **React 19** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Context API** - State management

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Relational database
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Joi** - Input validation
- **CORS** - Cross-origin resource sharing

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **PostgreSQL** database server
- **Git** for version control

## 🛠️ Installation

### 1. Clone the Repository
```bash
git clone https://github.com/UtkarshxDD/store-rating-system.git
cd store-rating-system
```

### 2. Backend Setup
```bash
cd backend
npm install

# Create .env file with your database configuration
# Copy the example below and update with your values
```

**Backend Environment Variables** (create `backend/.env`):
```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=store_rating_system
DB_USER=your_postgres_username
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h

# Frontend URL (optional, CORS is relaxed in dev)
FRONTEND_URL=http://localhost:5173

# Environment
NODE_ENV=development
```

**Database Setup**:
```bash
# Create PostgreSQL database
createdb store_rating_system

# Run database migration
npm run migrate

# Fix database constraints (if needed)
npm run fix-constraints
```

**Start Backend Server**:
```bash
npm run dev    # Development mode with auto-reload
# or
npm start      # Production mode
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 🔐 Default Admin Account

After running the migration, you can login with:
- **Email**: `admin@example.com`
- **Password**: `Admin@123`

## 📱 User Roles & Permissions

### 👑 Admin
- Create and manage users
- Create and manage stores
- View system dashboard
- Access to all system data

### 🏪 Store Owner
- View store-specific dashboard
- Manage store information
- View ratings and feedback

### 👤 Normal User
- Browse stores
- Rate stores (1-5 stars)
- View store information
- Update profile

## 🗄️ Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name (3-60 characters)
- `email` - Unique email address
- `password` - Hashed password
- `address` - User's address (max 400 characters)
- `role` - User role (admin, normal, store_owner)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### Stores Table
- `id` - Primary key
- `name` - Store name (3-60 characters)
- `email` - Store contact email
- `address` - Store address (max 400 characters)
- `owner_id` - Reference to store owner
- `created_at` - Store creation timestamp
- `updated_at` - Last update timestamp

### Ratings Table
- `id` - Primary key
- `user_id` - Reference to user
- `store_id` - Reference to store
- `rating` - Rating value (1-5)
- `created_at` - Rating timestamp
- `updated_at` - Last update timestamp

## 🚀 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `PUT /api/auth/update-password` - Password update

### Admin
- `GET /api/admin/dashboard` - Admin dashboard data
- `POST /api/admin/users` - Create new user
- `POST /api/admin/stores` - Create new store
- `GET /api/admin/users` - List all users
- `GET /api/admin/stores` - List all stores

### User
- `GET /api/user/stores` - List stores for rating
- `POST /api/user/stores/:id/rating` - Submit store rating

### Store Owner
- `GET /api/store-owner/dashboard` - Store owner dashboard

## 🎨 UI Components

- **Navbar** - Navigation with user info and logout
- **Card** - Reusable card component
- **Button** - Styled button variants
- **Input** - Form input fields
- **Select** - Dropdown selection
- **StarRating** - Interactive star rating component
- **Pagination** - Page navigation

## 🔧 Available Scripts

### Backend
```bash
npm run dev          # Start development server
npm start            # Start production server
npm run migrate      # Run database migration
npm run fix-constraints  # Fix database constraints
```

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## 🌐 Environment Setup

### Development
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`
- Database: PostgreSQL on localhost:5432

### Production
- Update `FRONTEND_URL` in backend `.env`
- Set `NODE_ENV=production`
- Configure production database
- Use HTTPS in production

## 🐛 Troubleshooting

### Common Issues

1. **"Failed to fetch" Error**
   - Ensure backend server is running
   - Check CORS configuration
   - Verify API endpoint URLs

2. **Database Connection Error**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists

3. **Validation Errors**
   - Password must be 8-16 characters with 1 uppercase and 1 special character
   - Name must be 3-60 characters
   - Email must be valid format

4. **Port Already in Use**
   - Change port in `.env` file
   - Kill existing process using the port

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 👨‍💻 Author

**Utkarsh Singh**
- GitHub: [@UtkarshxDD](https://github.com/UtkarshxDD)

## 🙏 Acknowledgments

- React team for the amazing framework
- Tailwind CSS for the utility-first approach
- Express.js community for the robust backend framework
- PostgreSQL for the reliable database system

---

⭐ **Star this repository if you find it helpful!**
