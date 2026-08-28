import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertTriangle,
  Check,
  X,
  Loader2,
  SlidersHorizontal,
  ExternalLink,
} from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import Modal from '../../components/Modal';
import { TableSkeleton } from '../../components/SkeletonLoader';
import productService from '../../services/productService';
import categoryService from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';
import { formatCurrency } from '../../utils/formatCurrency';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { addToast } = useToast();

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [currentProduct, setCurrentProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete confirmation
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form State
  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    brand: '',
    sku: '',
    image: '',
    isActive: true,
    featured: false,
  });

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const params = { all: 'true', limit: 100 };
      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'all') params.category = selectedCategory;

      const [prodRes, catRes] = await Promise.all([
        productService.getProducts(params),
        categoryService.getCategories({ all: 'true' }),
      ]);

      if (prodRes.data.success) {
        setProducts(prodRes.data.data);
      }
      if (catRes.data.success) {
        setCategories(catRes.data.data);
      }
    } catch (err) {
      console.error('Failed to load products:', err);
      addToast('Failed to load products.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const handleOpenCreate = () => {
    setModalMode('create');
    setCurrentProduct(null);
    setForm({
      name: '',
      description: '',
      price: '',
      stock: '25',
      category: categories[0]?._id || '',
      brand: 'General',
      sku: '',
      image: '',
      isActive: true,
      featured: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (prod) => {
    setModalMode('edit');
    setCurrentProduct(prod);
    setForm({
      name: prod.name,
      description: prod.description || '',
      price: String(prod.price),
      stock: String(prod.stock),
      category: prod.category?._id || prod.category || '',
      brand: prod.brand || '',
      sku: prod.sku || '',
      image: prod.image || '',
      isActive: prod.isActive !== undefined ? prod.isActive : true,
      featured: Boolean(prod.featured),
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      addToast('Name, Price, and Category are required.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        price: Number(form.price),
        stock: parseInt(form.stock, 10) || 0,
        category: form.category,
        brand: form.brand.trim(),
        sku: form.sku.trim() || undefined,
        image: form.image.trim(),
        isActive: form.isActive,
        featured: form.featured,
      };

      if (modalMode === 'create') {
        const res = await productService.createProduct(payload);
        if (res.data.success) {
          addToast('Product created successfully.', 'success');
          setIsModalOpen(false);
          fetchProducts();
        }
      } else {
        const res = await productService.updateProduct(currentProduct._id, payload);
        if (res.data.success) {
          addToast('Product updated successfully.', 'success');
          setIsModalOpen(false);
          fetchProducts();
        }
      }
    } catch (err) {
      console.error('Save product error:', err);
      const msg = err.response?.data?.message || 'Failed to save product.';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteTarget) return;
    try {
      setSubmitting(true);
      const res = await productService.deleteProduct(deleteTarget._id);
      if (res.data.success) {
        addToast(res.data.message || 'Product deleted.', 'success');
        setIsDeleteModalOpen(false);
        setDeleteTarget(null);
        fetchProducts();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete product.';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Product Inventory Management"
      subtitle="Add, edit, restock, and manage stationery items and curriculum books."
    >
      <div className="space-y-6">
        {/* Controls Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
              <input
                type="text"
                placeholder="Search by title, brand, SKU..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:bg-white"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </form>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-amber-500"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md self-start md:self-auto transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <TableSkeleton rows={8} cols={6} />
          ) : products.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Package className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="font-bold text-slate-800 text-sm">No Products Found</h4>
              <p className="text-xs text-slate-400">Try adjusting your search criteria or add a new product.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                    <th className="py-3.5 px-6">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((prod) => (
                    <tr key={prod._id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Product details & thumbnail */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            <img
                              src={prod.image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=200&q=80'}
                              alt={prod.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <h4 className="font-bold text-slate-900 truncate">{prod.name}</h4>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                              <span>SKU: {prod.sku || 'N/A'}</span>
                              <span>•</span>
                              <span>{prod.brand || 'General'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 font-bold text-slate-700">
                        {prod.category?.name || 'Uncategorized'}
                      </td>

                      {/* Price */}
                      <td className="py-3.5 px-4 font-black text-slate-900">
                        {formatCurrency(prod.price)}
                      </td>

                      {/* Stock Level */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`font-black px-2.5 py-1 rounded-lg text-xs ${
                            prod.stock <= 0
                              ? 'bg-rose-100 text-rose-800'
                              : prod.stock <= 5
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {prod.stock} units
                        </span>
                      </td>

                      {/* Active Toggle Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            prod.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {prod.isActive ? 'Active' : 'Disabled'}
                        </span>
                      </td>

                      {/* Action buttons */}
                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(prod)}
                            className="p-2 rounded-lg text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => {
                              setDeleteTarget(prod);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Add New Product' : 'Edit Product'}
        subtitle="Configure product details, stock, pricing, and category."
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Product Title *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Classmate 6-Subject Spiral Notebook"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Price (INR ₹) *</label>
              <input
                type="number"
                step="0.5"
                min="0"
                required
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="199.00"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Stock Quantity *</label>
              <input
                type="number"
                min="0"
                required
                value={form.stock}
                onChange={(e) => setForm({ ...form, stock: e.target.value })}
                placeholder="25"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Category *</label>
              <select
                required
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800 focus:ring-2 focus:ring-amber-500"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">Brand / Publisher</label>
              <input
                type="text"
                value={form.brand}
                onChange={(e) => setForm({ ...form, brand: e.target.value })}
                placeholder="e.g. Classmate, Camlin, Arihant"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-700">SKU (Auto-generated if empty)</label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="e.g. SURYA-NB-001"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Image URL</label>
            <input
              type="url"
              value={form.image}
              onChange={(e) => setForm({ ...form, image: e.target.value })}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Description</label>
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Full product details, specifications, edition notes..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600"
              />
              <span className="font-bold text-slate-800">Available for Online Order (Active)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600"
              />
              <span className="font-bold text-slate-800">Featured On Homepage</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold shadow-md flex items-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {modalMode === 'create' ? 'Create Product' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Product Deletion"
        subtitle="This action cannot be undone."
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Are you sure you want to permanently delete{' '}
            <strong>"{deleteTarget?.name}"</strong> from the store catalog?
          </p>

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteProduct}
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              {submitting ? 'Deleting...' : 'Delete Product'}
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminProducts;
