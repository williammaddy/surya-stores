import api from './api';

export const userService = {
  getCustomers: (params) => api.get('/admin/customers', { params }),
  getCustomerDetails: (id) => api.get(`/admin/customers/${id}`),
  getDashboardStats: () => api.get('/admin/dashboard'),
};

export default userService;
