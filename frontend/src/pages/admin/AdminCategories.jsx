import React, { useState, useEffect } from 'react';
import { Layers, Plus, Edit2, Trash2, Loader2, AlertCircle } from 'lucide-react';
import AdminLayout from '../../layouts/AdminLayout';
import Modal from '../../components/Modal';
import { TableSkeleton } from '../../components/SkeletonLoader';
import categoryService from '../../services/categoryService';
import { useToast } from '../../context/ToastContext';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [currentCategory, setCurrentCategory] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    isActive: true,
  });

  const { addToast } = useToast();

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await categoryService.getCategories({ all: 'true' });
      if (res.data.success) {
        setCategories(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
      addToast('Failed to load categories.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleOpenCreate = () => {
    setModalMode('create');
    setCurrentCategory(null);
    setForm({ name: '', description: '', image: '', isActive: true });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setModalMode('edit');
    setCurrentCategory(cat);
    setForm({
      name: cat.name,
      description: cat.description || '',
      image: cat.image || '',
      isActive: cat.isActive !== undefined ? cat.isActive : true,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      addToast('Category name is required.', 'error');
      return;
    }

    try {
      setSubmitting(true);
      if (modalMode === 'create') {
        const res = await categoryService.createCategory(form);
        if (res.data.success) {
          addToast('Category created successfully.', 'success');
          setIsModalOpen(false);
          fetchCategories();
        }
      } else {
        const res = await categoryService.updateCategory(currentCategory._id, form);
        if (res.data.success) {
          addToast('Category updated successfully.', 'success');
          setIsModalOpen(false);
          fetchCategories();
        }
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save category.';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteTarget) return;
    try {
      setSubmitting(true);
      const res = await categoryService.deleteCategory(deleteTarget._id);
      if (res.data.success) {
        addToast(res.data.message || 'Category deleted successfully.', 'success');
        setIsDeleteModalOpen(false);
        setDeleteTarget(null);
        fetchCategories();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete category.';
      addToast(msg, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout
      title="Store Departments &amp; Categories"
      subtitle="Manage product departments and catalog taxonomy."
    >
      <div className="space-y-6">
        {/* Header Button */}
        <div className="flex justify-end">
          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-colors"
          >
            <Plus className="w-4 h-4" /> Add New Category
          </button>
        </div>

        {/* Categories Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {loading ? (
            <TableSkeleton rows={5} cols={5} />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold">
                    <th className="py-3.5 px-6">Department Name</th>
                    <th className="py-3.5 px-4">Slug</th>
                    <th className="py-3.5 px-4">Products Count</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                            <img
                              src={cat.image || 'https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?auto=format&fit=crop&w=200&q=80'}
                              alt={cat.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900">{cat.name}</h4>
                            <p className="text-[10px] text-slate-400 line-clamp-1 max-w-xs">{cat.description}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-500">{cat.slug}</td>

                      <td className="py-3.5 px-4">
                        <span className="font-extrabold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-900 border border-amber-200">
                          {cat.productCount || 0} Products
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                            cat.isActive
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {cat.isActive ? 'Active' : 'Hidden'}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(cat)}
                            className="p-2 rounded-lg text-slate-600 hover:text-amber-700 hover:bg-amber-50 transition-colors"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTarget(cat);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                            title="Delete Category"
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

      {/* Add / Edit Category Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalMode === 'create' ? 'Add New Category' : 'Edit Category'}
        subtitle="Organize store items into searchable customer departments."
      >
        <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Category Name *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. School Guides &amp; Question Banks"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-slate-700">Cover Image URL</label>
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
              placeholder="Brief description of items in this department..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-amber-500"
            ></textarea>
          </div>

          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="w-4 h-4 rounded text-amber-600"
              />
              <span className="font-bold text-slate-800">Visible on Storefront (Active)</span>
            </label>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold shadow-md flex items-center gap-2"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {modalMode === 'create' ? 'Create Department' : 'Save Department'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Category Safety Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Category Deletion"
        subtitle="Checks for linked catalog products before deletion."
      >
        <div className="space-y-4 text-xs">
          <p className="text-slate-600">
            Are you sure you want to delete category <strong>"{deleteTarget?.name}"</strong>?
          </p>

          {deleteTarget?.productCount > 0 && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <p>
                <strong>Warning:</strong> This category contains <strong>{deleteTarget.productCount}</strong> products. Deletion will be blocked until these products are moved to another category or deleted.
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteCategory}
              disabled={submitting}
              className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold"
            >
              {submitting ? 'Deleting...' : 'Delete Department'}
            </button>
          </div>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminCategories;
