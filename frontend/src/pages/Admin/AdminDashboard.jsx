import { useEffect, useState } from 'react';
import apiService from '../../api/apiService';
import Card from '../../components/ui/Card';
import { Users, Building2, BarChart3 } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await apiService.getDashboard();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64 text-gray-500">Loading dashboard...</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card className="p-6 flex items-center">
        <Users className="text-blue-600 mr-3" size={32} />
        <div>
          <p className="text-sm font-medium text-gray-600">Total Users</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
        </div>
      </Card>
      <Card className="p-6 flex items-center">
        <Building2 className="text-green-600 mr-3" size={32} />
        <div>
          <p className="text-sm font-medium text-gray-600">Total Stores</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.totalStores || 0}</p>
        </div>
      </Card>
      <Card className="p-6 flex items-center">
        <BarChart3 className="text-purple-600 mr-3" size={32} />
        <div>
          <p className="text-sm font-medium text-gray-600">Total Ratings</p>
          <p className="text-2xl font-bold text-gray-900">{stats?.totalRatings || 0}</p>
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
