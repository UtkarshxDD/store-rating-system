import { useEffect, useState } from 'react';
import apiService from '../../api/apiService';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Pagination from '../../components/Pagination';
import StarRating from '../../components/ui/StarRating';
import AdminDashboard from './AdminDashboard';
import CreateUserModal from './CreateUserModal';
import CreateStoreModal from './CreateStoreModal';
import { BarChart3, Users, Building2, Plus } from 'lucide-react';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    page: 1, limit: 10, sortBy: 'name', sortOrder: 'asc', search: ''
  });
  const [showUserModal, setShowUserModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await apiService.getUsers(filters);
      setUsers(data.users || []);
      setPagination(data.pagination || { currentPage: filters.page, totalPages: 1 });
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  const fetchStores = async () => {
    setLoading(true);
    try {
      const data = await apiService.getStores(filters);
      setStores(data.stores || []);
      setPagination(data.pagination || { currentPage: filters.page, totalPages: 1 });
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (activeTab === 'users') fetchUsers();
    if (activeTab === 'stores') fetchStores();
    // eslint-disable-next-line
  }, [activeTab, filters]);

  const handleSearch = (e) => setFilters({ ...filters, search: e.target.value, page: 1 });
  const handleSort = (field) => setFilters((f) => ({
    ...f,
    sortBy: field,
    sortOrder: f.sortBy === field && f.sortOrder === 'asc' ? 'desc' : 'asc',
    page: 1
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        {activeTab === 'users' && (
          <Button onClick={() => setShowUserModal(true)}>
            <Plus size={16} className="mr-1" /> Add User
          </Button>
        )}
        {activeTab === 'stores' && (
          <Button onClick={() => setShowStoreModal(true)}>
            <Plus size={16} className="mr-1" /> Add Store
          </Button>
        )}
      </div>

      <div className="border-b">
        <nav className="flex space-x-6">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: BarChart3 },
            { id: 'users', name: 'Users', icon: Users },
            { id: 'stores', name: 'Stores', icon: Building2 }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 text-sm font-medium ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon size={16} className="mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === 'dashboard' && <AdminDashboard />}

      {(activeTab === 'users' || activeTab === 'stores') && (
        <div>
          <Input
            placeholder={`Search ${activeTab}...`}
            value={filters.search}
            onChange={handleSearch}
            className="max-w-sm"
          />
          <Card className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th onClick={() => handleSort('name')}
                      className="px-6 py-3 text-left text-xs font-medium cursor-pointer">Name</th>
                  <th onClick={() => handleSort('email')}
                      className="px-6 py-3 text-left text-xs font-medium cursor-pointer">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium">Address</th>
                  {activeTab === 'users' && (
                    <th className="px-6 py-3 text-left text-xs font-medium">Role</th>
                  )}
                  {activeTab === 'stores' && (
                    <th className="px-6 py-3 text-left text-xs font-medium">Rating</th>
                  )}
                </tr>
              </thead>
              <tbody className="bg-white divide-y">
                {loading && (
                  <tr><td colSpan="4" className="p-6 text-center">Loading...</td></tr>
                )}

                {!loading && activeTab === 'users' && users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4">{u.address}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : u.role === 'store_owner'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                  </tr>
                ))}

                {!loading && activeTab === 'stores' && stores.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{s.name}</td>
                    <td className="px-6 py-4">{s.email}</td>
                    <td className="px-6 py-4">{s.address}</td>
                    <td className="px-6 py-4 flex items-center">
                      <StarRating rating={parseFloat(s.rating || 0)} readonly />
                      <span className="ml-2 text-sm text-gray-600">
                        {s.rating ?? '0.0'} ({s.total_ratings ?? 0} reviews)
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t">
                <Pagination
                  currentPage={pagination.currentPage}
                  totalPages={pagination.totalPages}
                  onPageChange={(p) => setFilters({ ...filters, page: p })}
                />
              </div>
            )}
          </Card>
        </div>
      )}

      <CreateUserModal
        isOpen={showUserModal}
        onClose={() => setShowUserModal(false)}
        onSuccess={fetchUsers}
      />
      <CreateStoreModal
        isOpen={showStoreModal}
        onClose={() => setShowStoreModal(false)}
        onSuccess={fetchStores}
      />
    </div>
  );
};

export default AdminPanel;
