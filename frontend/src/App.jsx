import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginForm from './pages/Auth/LoginForm';
import RegisterForm from './pages/Auth/RegisterForm';
import AdminPanel from './pages/Admin/AdminPanel';
import UserStoreList from './pages/User/UserStoreList';
import Navbar from './components/Navbar';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [isLogin, setIsLogin] = useState(true);

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return isLogin 
      ? <LoginForm onToggleMode={() => setIsLogin(false)} /> 
      : <RegisterForm onToggleMode={() => setIsLogin(true)} />;
  }

  return (
    <>
      <Navbar />
      <div className="p-6">
        {user.role === 'admin' && <AdminPanel />}
        {user.role === 'normal' && <UserStoreList />}
        {user.role === 'store_owner' && <div>Store Owner Dashboard Coming...</div>}
      </div>
    </>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
