import React, { useState, useEffect } from 'react';
import { Users, Search, ShoppingBag, Eye, Calendar, Phone, MapPin, Loader2 } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import Modal from '../../components/Modal';
import { TableSkeleton } from '../../components/SkeletonLoader';
import userService from '../../services/userService';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatCurrency';

const AdminCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Customer Orders Modal
  const [selectedCustomerDetails, setSelectedCustomerDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fetchingDetails, setFetchingDetails] = useState(false);

  const { addToast } = useToast();

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      const res = await userService.getCustomers(params);
      if (res.data.success) {
        setCustomers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load customers:', err);
      addToast('Failed to load customer directory.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchCustomers();
  };

  const handleViewCustomer = async (cust) => {
    try {
      setIsModalOpen(true);
      setFetchingDetails(true);
      const res = await userService.getCustomerDetails(cust.id || cust._id);
      if (res.data.success) {
        setSelectedCustomerDetails(res.data.data);
      }
    } catch (err) {
      addToast('Failed to load customer order history.', 'error');
    } finally {
      setFetchingDetails(false);
    }
  };

  return (
    <AdminLayout
      title="Registered Customer Directory"
      subtitle="View customer accounts, contact details, and lifetime purchase history."
    >
      <div className="space-y-6">
        {/* Search Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by customer name, email, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          <span className="text-xs font-bold text-slate-500">
            Total Customers: {customers.length}
          </span>
        </div>

        {/* Customers Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <TableSkeleton rows={6} cols={6} />
          ) : customers.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Users className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">No Customers Found</h4>
              <p className="text-xs text-slate-400">No customer records matching your query.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                    <th className="py-3.5 px-6">Customer</th>
                    <th className="py-3.5 px-4">Contact Phone</th>
                    <th className="py-3.5 px-4">Orders Placed</th>
                    <th className="py-3.5 px-4">Total Spent</th>
                    <th className="py-3.5 px-4">Joined Date</th>
                    <th className="py-3.5 px-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((cust) => (
                    <tr key={cust.id || cust._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-black">
                            {cust.name?.charAt(0).toUpperCase() || 'C'}
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{cust.name}</h4>
                            <p className="text-[10px] text-slate-400">{cust.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-slate-700">
                        {cust.phone || 'N/A'}
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-extrabold px-2.5 py-1 rounded-lg bg-slate-100 text-slate-800">
                          {cust.orderCount || 0} Orders
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {formatCurrency(cust.totalSpent || 0)}
                      </td>

                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(cust.createdAt).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => handleViewCustomer(cust)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-1 ml-auto"
                        >
                          <Eye className="w-3.5 h-3.5" /> History
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Customer Orders History Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Customer Order History"
        subtitle="Review past purchases and contact information."
        maxWidth="max-w-2xl"
      >
        {fetchingDetails ? (
          <div className="py-12 flex flex-col items-center justify-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-amber-600" />
            <span className="text-xs text-slate-500">Loading customer history...</span>
          </div>
        ) : selectedCustomerDetails ? (
          <div className="space-y-6 text-xs">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
              <h4 className="font-black text-slate-900 text-sm">{selectedCustomerDetails.customer.name}</h4>
              <p className="text-slate-600">Email: {selectedCustomerDetails.customer.email}</p>
              <p className="text-slate-600">Phone: {selectedCustomerDetails.customer.phone}</p>
              <p className="text-slate-600">
                Address:{' '}
                {selectedCustomerDetails.customer.address?.fullAddress ||
                  selectedCustomerDetails.customer.address?.street ||
                  'No default address'}
              </p>
            </div>

            <div className="space-y-3">
              <h5 className="font-extrabold text-slate-900 uppercase text-[10px]">
                Past Orders ({selectedCustomerDetails.orders?.length || 0})
              </h5>

              {selectedCustomerDetails.orders?.length === 0 ? (
                <p className="text-slate-400 py-4 text-center">No previous orders on record.</p>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-100 rounded-2xl overflow-hidden max-h-64 overflow-y-auto">
                  {selectedCustomerDetails.orders.map((ord) => (
                    <div key={ord._id} className="p-3 flex justify-between items-center bg-white">
                      <div>
                        <span className="font-mono font-bold text-slate-900">#{ord.orderNumber}</span>
                        <p className="text-[10px] text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString('en-IN')} • {ord.items.length} item(s)
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-slate-900 block">{formatCurrency(ord.total)}</span>
                        <span className="text-[10px] font-bold text-amber-700">{ord.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs"
              >
                Close
              </button>
            </div>
          </div>
        ) : null}
      </Modal>
    </AdminLayout>
  );
};

export default AdminCustomers;
