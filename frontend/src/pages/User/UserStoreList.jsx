import { useEffect, useState } from 'react';
import apiService from '../../api/apiService';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import StarRating from '../../components/ui/StarRating';
import Button from '../../components/ui/Button';
import Pagination from '../../components/Pagination';

const UserStoreList = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1 });
  const [filters, setFilters] = useState({
    page: 1, limit: 10, search: '', sortBy: 'name', sortOrder: 'asc'
  });

  const [ratingStore, setRatingStore] = useState(null);
  const [newRating, setNewRating] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const fetchStores = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiService.getUserStores(filters);
      setStores(data.stores || []);
      setPagination(data.pagination || { currentPage: filters.page, totalPages: 1 });
    } catch (err) {
      setError(err.message || 'Failed to fetch stores');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStores(); /* eslint-disable-next-line */ }, [filters]);

  const submitRating = async () => {
    if (!ratingStore || newRating === 0) return;
    setSubmitting(true);
    setError('');
    try {
      const response = await apiService.submitRating(ratingStore.id, newRating);
      
      // Update the store's rating in the local state immediately
      if (response.updatedStore) {
        setStores(prevStores => 
          prevStores.map(store => 
            store.id === response.updatedStore.id 
              ? { ...store, rating: response.updatedStore.rating, total_ratings: response.updatedStore.total_ratings }
              : store
          )
        );
      }
      
      setSuccessMessage(`Rating submitted successfully! ${ratingStore.name} now has ${response.updatedStore.rating} stars.`);
      setRatingStore(null);
      setNewRating(1);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to submit rating');
    } finally {
      setSubmitting(false);
    }
  };

  const onPageChange = (p) => setFilters((f) => ({ ...f, page: p }));

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-md text-sm">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <Input
          className="sm:max-w-sm"
          placeholder="Search stores..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
        />
      </div>

      <Card className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Address</th>
              <th className="px-6 py-3 text-left text-xs font-medium">Rating</th>
              <th className="px-6 py-3"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {loading && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-600">Loading...</td>
              </tr>
            )}



            {!loading && !error && stores.length === 0 && (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-600">No stores found</td>
              </tr>
            )}

            {!loading && !error && stores.map((store) => (
              <tr key={store.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{store.name}</td>
                <td className="px-6 py-4">{store.email}</td>
                <td className="px-6 py-4">{store.address}</td>
                <td className="px-6 py-4 flex items-center">
                  <StarRating rating={parseFloat(store.rating || 0)} readonly />
                  <span className="ml-2 text-sm text-gray-600">
                    {store.rating ? `${store.rating}` : 'No ratings'} ({store.total_ratings || 0} reviews)
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button size="sm" onClick={() => { 
                    setRatingStore(store); 
                    setNewRating(1); 
                    setError(''); 
                    setSuccessMessage(''); 
                  }}>
                    Rate
                  </Button>
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
              onPageChange={onPageChange}
            />
          </div>
        )}
      </Card>

      {/* Rating Modal */}
      {ratingStore && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900">Rate {ratingStore.name}</h3>
            <p className="text-sm text-gray-600 mb-3">Click a star to choose your rating.</p>

            <div className="mb-4">
              <StarRating rating={newRating} onRatingChange={setNewRating} />
            </div>

            <div className="flex gap-3">
              <Button onClick={submitRating} disabled={submitting || newRating < 1}>
                {submitting ? 'Submitting...' : 'Submit'}
              </Button>
              <Button variant="outline" onClick={() => setRatingStore(null)}>
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserStoreList;
