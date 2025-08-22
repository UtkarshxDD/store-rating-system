import { useEffect, useState } from 'react';
import apiService from '../../api/apiService';
import Card from '../../components/ui/Card';
import StarRating from '../../components/ui/StarRating';

const StoreOwnerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const res = await apiService.getStoreOwnerDashboard();
        setData(res);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    run();
  }, []);

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Store Owner Dashboard</h1>
      <Card className="p-6">
        <h2 className="text-lg font-semibold">{data?.store?.name || 'Your Store'}</h2>
        <p className="text-sm text-gray-600">{data?.store?.email}</p>
        <p className="text-sm text-gray-600 mb-3">{data?.store?.address}</p>
        <div className="flex items-center">
          <StarRating rating={parseFloat(data?.store?.rating || 0)} readonly />
          <span className="ml-2 text-sm text-gray-600">
            {data?.store?.rating ?? '0.0'} ({data?.store?.total_ratings ?? 0} reviews)
          </span>
        </div>
      </Card>
    </div>
  );
};

export default StoreOwnerDashboard;
