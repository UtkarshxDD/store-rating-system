import { Building2, Shield, Store, User, LogOut } from 'lucide-react';
import Button from './ui/Button';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return <Shield size={20} />;
      case 'store_owner': return <Store size={20} />;
      default: return <User size={20} />;
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case 'admin': return 'System Administrator';
      case 'store_owner': return 'Store Owner';
      default: return 'Normal User';
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Building2 className="text-blue-600 mr-2" size={28} />
            <h1 className="text-xl font-bold text-gray-900">Store Rating System</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              {getRoleIcon(user.role)}
              <span>{user.name}</span>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                {getRoleName(user.role)}
              </span>
            </div>

            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut size={16} className="mr-1" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
