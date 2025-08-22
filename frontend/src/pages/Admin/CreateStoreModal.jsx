import { useState } from 'react';
import apiService from '../../api/apiService';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const CreateStoreModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', email: '', address: '', ownerEmail: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      await apiService.createStore(formData);
      onSuccess?.();
      onClose?.();
    } catch (err) {
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Create New Store</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.general && <p className="text-red-600">{errors.general}</p>}

          <Input label="Store Name (20-60 chars)" value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            minLength={20} maxLength={60} required />

          <Input label="Store Email" type="email" value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Address</label>
            <textarea className="w-full px-3 py-2 border rounded-md"
              rows={3}
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required />
          </div>

          <Input label="Owner Email" type="email" placeholder="Existing store owner email"
            value={formData.ownerEmail}
            onChange={(e) => setFormData({ ...formData, ownerEmail: e.target.value })}
            required />

          <div className="flex space-x-3 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Store'}
            </Button>
            <Button variant="outline" type="button" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default CreateStoreModal;
