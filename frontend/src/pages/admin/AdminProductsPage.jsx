import React, { useEffect, useState } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Upload,
  AlertCircle,
  CheckCircle2,
  Package,
  Layers,
  Image as ImageIcon,
} from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { productAPI, categoryAPI } from '../../services/api';
import { useToast } from '../../context/ToastContext';

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    categoryId: '',
    imageUrl: '',
    featured: false,
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState('');

  // Delete State
  const [deletingId, setDeletingId] = useState(null);

  const { addToast } = useToast();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const [prodRes, catRes] = await Promise.all([
        productAPI.getAll({
          category: selectedCategory !== 'all' ? selectedCategory : undefined,
          search: searchQuery || undefined,
          limit: 200,
        }),
        categoryAPI.getAll(),
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts();
  };

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      stockQuantity: '20',
      categoryId: categories[0]?.id || '',
      imageUrl: '',
      featured: false,
    });
    setSelectedFile(null);
    setModalError('');
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      stockQuantity: product.stockQuantity.toString(),
      categoryId: product.categoryId.toString(),
      imageUrl: product.imageUrl || '',
      featured: Boolean(product.featured),
    });
    setSelectedFile(null);
    setModalError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setModalError('Product name is required.');
      return;
    }
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) < 0) {
      setModalError('Valid non-negative price is required.');
      return;
    }
    if (!formData.categoryId) {
      setModalError('Please select a category.');
      return;
    }

    try {
      setModalLoading(true);
      setModalError('');

      // Prepare payload (using FormData if file is selected, or JSON)
      if (selectedFile) {
        const data = new FormData();
        data.append('name', formData.name.trim());
        data.append('description', formData.description.trim());
        data.append('price', formData.price);
        data.append('stockQuantity', formData.stockQuantity || '0');
        data.append('categoryId', formData.categoryId);
        data.append('featured', formData.featured);
        data.append('image', selectedFile);

        if (editingProduct) {
          await productAPI.update(editingProduct.id, data);
          addToast(`Updated "${formData.name}" successfully.`, 'success');
        } else {
          await productAPI.create(data);
          addToast(`Added "${formData.name}" successfully.`, 'success');
        }
      } else {
        const payload = {
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price),
          stockQuantity: parseInt(formData.stockQuantity, 10) || 0,
          categoryId: parseInt(formData.categoryId, 10),
          imageUrl: formData.imageUrl.trim() || undefined,
          featured: formData.featured,
        };

        if (editingProduct) {
          await productAPI.updateJSON(editingProduct.id, payload);
          addToast(`Updated "${formData.name}" successfully.`, 'success');
        } else {
          await productAPI.createJSON(payload);
          addToast(`Added "${formData.name}" to catalog.`, 'success');
        }
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      console.error('Save product error:', err);
      const msg = err.response?.data?.message || 'Error saving product.';
      setModalError(msg);
      addToast(msg, 'error');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (productId, productName) => {
    if (!window.confirm(`Are you sure you want to delete "${productName}"?`)) {
      return;
    }

    try {
      setDeletingId(productId);
      const res = await productAPI.delete(productId);
      if (res.data.success) {
        addToast(`Deleted "${productName}".`, 'info');
        fetchProducts();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete product.';
      addToast(msg, 'error');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout
      title="Product Inventory Management"
      subtitle="Create, update, and manage catalog items, pricing, and stock."
    >
      <div className="space-y-6">
        {/* Top Action Bar */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center gap-3 flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="relative w-full">
              <input
                type="text"
                placeholder="Search products by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            </form>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-52 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
            >
              <option value="all">All Departments</option>
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Add Product Button */}
          <button
            onClick={openAddModal}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md shadow-amber-600/25 flex items-center justify-center gap-2 transition-all shrink-0"
          >
            <Plus className="w-4 h-4" /> Add New Product
          </button>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Loading product catalog...</div>
          ) : products.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-slate-500 font-semibold text-sm">No products found matching criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-100 text-slate-400 font-bold uppercase tracking-wider">
                    <th className="py-3.5 px-6">Product</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price</th>
                    <th className="py-3.5 px-4">Stock</th>
                    <th className="py-3.5 px-4">Badge</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Product Thumbnail + Name */}
                      <td className="py-3 px-6">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              product.imageUrl ||
                              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=100&q=80'
                            }
                            alt={product.name}
                            className="w-11 h-11 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-100"
                          />
                          <div className="min-w-0 max-w-xs sm:max-w-md">
                            <span className="font-bold text-slate-900 text-sm block truncate">
                              {product.name}
                            </span>
                            <span className="text-[11px] text-slate-400 truncate block">
                              ID: #{product.id} • {product.description ? product.description.slice(0, 50) + '...' : 'No description'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 font-semibold text-[11px] border border-amber-200/80">
                          {product.category?.name || 'General'}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="py-3 px-4 font-black text-slate-900 text-sm">
                        ₹{Number(product.price).toFixed(2)}
                      </td>

                      {/* Stock */}
                      <td className="py-3 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                            product.stockQuantity === 0
                              ? 'bg-rose-100 text-rose-800'
                              : product.stockQuantity <= 10
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {product.stockQuantity} units
                        </span>
                      </td>

                      {/* Featured */}
                      <td className="py-3 px-4">
                        {product.featured ? (
                          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 font-extrabold text-[10px]">
                            ★ Featured
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Standard</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(product)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            disabled={deletingId === product.id}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors disabled:opacity-50"
                            title="Delete product"
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-extrabold text-slate-900 text-lg">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingProduct ? `Updating product #${editingProduct.id}` : 'Fill in catalog details'}
                </p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-6 h-6" />
              </button>
            </div>

            {modalError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Classmate 6-Subject Notebook"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              {/* Category & Price */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Category *
                  </label>
                  <select
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="199.00"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                  placeholder="30"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detailed specifications, author, edition, or contents..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>

              {/* Image URL or Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Image Source (URL or Upload File)
                </label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs mb-2"
                />
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="imageFileInput"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files[0] || null)}
                    className="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-amber-100 file:text-amber-900 hover:file:bg-amber-200"
                  />
                </div>
              </div>

              {/* Featured Checkbox */}
              <div className="pt-2">
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Feature on Homepage (★ Popular Choice)
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="flex-1 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md disabled:opacity-50"
                >
                  {modalLoading ? 'Saving...' : editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminProductsPage;
