const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

const apiService = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('token');

    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      ...options,
    };

    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) throw new Error(data.error || 'Request failed');
    return data;
  },

  // Auth
  login: (credentials) => apiService.request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  register: (userData) => apiService.request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  updatePassword: (passwords) => apiService.request('/auth/update-password', {
    method: 'PUT',
    body: JSON.stringify(passwords),
  }),

  // Admin
  getDashboard: () => apiService.request('/admin/dashboard'),
  createUser: (userData) => apiService.request('/admin/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  createStore: (storeData) => apiService.request('/admin/stores', {
    method: 'POST',
    body: JSON.stringify(storeData),
  }),
  getUsers: (params) => apiService.request(`/admin/users?${new URLSearchParams(params)}`),
  getStores: (params) => apiService.request(`/admin/stores?${new URLSearchParams(params)}`),
  getUserDetails: (id) => apiService.request(`/admin/users/${id}`),

  // User
  getUserStores: (params) => apiService.request(`/user/stores?${new URLSearchParams(params)}`),
  submitRating: (storeId, rating) => apiService.request(`/user/stores/${storeId}/rating`, {
    method: 'POST',
    body: JSON.stringify({ rating }),
  }),

  // Store Owner
  getStoreOwnerDashboard: () => apiService.request('/store-owner/dashboard'),
};

export default apiService;
