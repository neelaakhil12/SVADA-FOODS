import React, { useState, useContext, useRef } from 'react';
import { ShopContext, DEFAULT_CATEGORY_METADATA } from '../context/ShopContext';
import { Plus, Trash2, X, Save, Edit2, Upload, ImageIcon, Package } from 'lucide-react';

const AdminCategories = ({ onViewProducts }) => {
  const {
    categories,
    categoryMetadata,
    addCategory,
    deleteCategory,
    updateCategoryMetadata,
    renameCategory,
    products
  } = useContext(ShopContext);

  // ─── Add Category State ───────────────────────────────────────────────────────
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatImage, setNewCatImage] = useState('');
  const [newCatImagePreview, setNewCatImagePreview] = useState('');
  const addFileRef = useRef(null);

  // ─── Edit Modal State ─────────────────────────────────────────────────────────
  const [editingCategory, setEditingCategory] = useState(null); // original name
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editImagePreview, setEditImagePreview] = useState('');
  const editFileRef = useRef(null);

  // ─── Helpers ──────────────────────────────────────────────────────────────────
  const getCategoryMeta = (name) => {
    const uploaded = categoryMetadata[name] || {};
    const defaults = DEFAULT_CATEGORY_METADATA[name] || {};
    return {
      image: uploaded.image || defaults.image || '',
      desc: uploaded.desc || defaults.desc || '',
    };
  };

  const getProductCount = (name) => products.filter(p => p.category === name).length;

  const toBase64 = (file, onDone) => {
    if (file.size > 3 * 1024 * 1024) {
      alert('Image must be under 3 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => onDone(reader.result);
    reader.readAsDataURL(file);
  };

  // ─── Add Form Handlers ────────────────────────────────────────────────────────
  const handleAddImageChange = (e) => {
    const file = e.target.files[0];
    if (file) toBase64(file, (b64) => { setNewCatImage(b64); setNewCatImagePreview(b64); });
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const name = newCatName.trim();
    if (!name) return;
    addCategory(name, newCatImage, newCatDesc.trim());
    setNewCatName('');
    setNewCatDesc('');
    setNewCatImage('');
    setNewCatImagePreview('');
    if (addFileRef.current) addFileRef.current.value = '';
  };

  // ─── Edit Modal Handlers ──────────────────────────────────────────────────────
  const openEdit = (name) => {
    const meta = getCategoryMeta(name);
    setEditingCategory(name);
    setEditName(name);
    setEditDesc(meta.desc);
    setEditImage(meta.image);
    setEditImagePreview(meta.image);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) toBase64(file, (b64) => { setEditImage(b64); setEditImagePreview(b64); });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const newName = editName.trim();
    if (!newName) return;
    renameCategory(editingCategory, newName, editImage, editDesc.trim());
    setEditingCategory(null);
  };

  const handleDeleteCategory = (name) => {
    if (getProductCount(name) > 0) {
      alert(`Cannot delete "${name}" — it has products. Reassign or delete products first.`);
      return;
    }
    if (window.confirm(`Delete category "${name}"?`)) deleteCategory(name);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">Categories Management</h1>

      {/* ─── ADD CATEGORY FORM ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-md p-6 border border-orange-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Plus size={18} className="text-[#3B1E0A]" />
          Add New Category
        </h2>

        <form onSubmit={handleAddSubmit} className="space-y-4">
          {/* Name + Description */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Pickles & Powders"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
              <input
                type="text"
                value={newCatDesc}
                onChange={(e) => setNewCatDesc(e.target.value)}
                placeholder="e.g. Traditional Avakaya & Podis"
                className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] text-sm"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
            <div className="flex items-start gap-4">
              {/* Preview box */}
              <div
                onClick={() => addFileRef.current?.click()}
                className="w-28 h-24 rounded-xl border-2 border-dashed border-orange-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#3B1E0A] transition bg-orange-50 flex-shrink-0 overflow-hidden"
              >
                {newCatImagePreview ? (
                  <img src={newCatImagePreview} alt="preview" className="w-full h-full object-cover rounded-xl" />
                ) : (
                  <>
                    <ImageIcon size={24} className="text-orange-300 mb-1" />
                    <span className="text-[10px] text-orange-400 font-semibold">Upload Image</span>
                  </>
                )}
              </div>

              <div className="flex flex-col gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => addFileRef.current?.click()}
                  className="flex items-center gap-2 text-xs font-semibold text-[#3B1E0A] bg-orange-50 hover:bg-orange-100 border border-orange-200 px-4 py-2 rounded-xl transition"
                >
                  <Upload size={14} />
                  Choose Image
                </button>
                {newCatImagePreview && (
                  <button
                    type="button"
                    onClick={() => { setNewCatImage(''); setNewCatImagePreview(''); if (addFileRef.current) addFileRef.current.value = ''; }}
                    className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 transition"
                  >
                    <X size={12} /> Remove
                  </button>
                )}
                <p className="text-[10px] text-gray-400">Max 3 MB · PNG, JPG, WebP</p>
              </div>

              <input ref={addFileRef} type="file" accept="image/*" onChange={handleAddImageChange} className="hidden" />
            </div>
          </div>

          <button
            type="submit"
            className="bg-[#3B1E0A] hover:bg-[#2B1507] text-white px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors"
          >
            <Plus size={16} />
            Add Category
          </button>
        </form>
      </div>

      {/* ─── CATEGORIES GRID ─────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-md border border-orange-100">
        <div className="p-6 border-b border-orange-50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            All Categories <span className="text-sm font-normal text-gray-400">({categories.length})</span>
          </h2>
        </div>

        <div className="p-6">
          {categories.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Package size={40} className="mx-auto mb-3 opacity-30" />
              <p className="text-sm">No categories yet. Add one above.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categories.map((name) => {
                const meta = getCategoryMeta(name);
                const count = getProductCount(name);
                return (
                  <div
                    key={name}
                    className="group relative border border-orange-100 rounded-2xl overflow-hidden hover:shadow-lg hover:border-orange-300 transition-all duration-300 bg-white flex flex-col"
                  >
                    {/* Image Area */}
                    <div className="relative w-full aspect-[3/2] bg-[#FAF7F2] flex items-center justify-center overflow-hidden">
                      {meta.image ? (
                        <img
                          src={meta.image}
                          alt={name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-orange-200">
                          <ImageIcon size={32} />
                          <span className="text-[10px] mt-1 font-semibold">No image</span>
                        </div>
                      )}

                      {/* Hover action buttons overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <button
                          onClick={() => onViewProducts && onViewProducts(name)}
                          className="w-9 h-9 rounded-full bg-white text-[#3B1E0A] flex items-center justify-center hover:bg-orange-50 transition shadow-md"
                          title="View Products"
                        >
                          <Package size={15} />
                        </button>
                        <button
                          onClick={() => openEdit(name)}
                          className="w-9 h-9 rounded-full bg-white text-[#3B1E0A] flex items-center justify-center hover:bg-orange-50 transition shadow-md"
                          title="Edit Category"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(name)}
                          className="w-9 h-9 rounded-full bg-white text-red-600 flex items-center justify-center hover:bg-red-50 transition shadow-md"
                          title="Delete Category"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="px-4 py-3 flex flex-col flex-1">
                      <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2">{name}</h3>
                      {meta.desc && <p className="text-[11px] text-gray-400 mt-0.5 line-clamp-1">{meta.desc}</p>}
                      <div className="mt-auto pt-2 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => onViewProducts && onViewProducts(name)}
                          className="text-[10px] font-semibold text-orange-600 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded-full transition-colors flex items-center gap-1 cursor-pointer"
                          title="View Products"
                        >
                          <Package size={10} className="text-orange-500" />
                          {count} {count === 1 ? 'product' : 'products'}
                        </button>
                        <button
                          onClick={() => openEdit(name)}
                          className="text-[11px] text-[#3B1E0A] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <Edit2 size={11} /> Edit
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ─── EDIT MODAL ──────────────────────────────────────────────────────── */}
      {editingCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-orange-100 bg-orange-50">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                <Edit2 size={18} className="text-[#3B1E0A]" />
                Edit Category
              </h2>
              <button
                onClick={() => setEditingCategory(null)}
                className="p-1.5 rounded-lg hover:bg-orange-200 text-gray-500 transition"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] text-sm"
                />
                {editName !== editingCategory && (
                  <p className="text-[10px] text-amber-600 mt-1 font-semibold">
                    ⚠ Renaming will update all products in this category.
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="e.g. Traditional Avakaya & Podis"
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] text-sm"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category Image</label>
                <div className="flex items-start gap-4">
                  <div
                    onClick={() => editFileRef.current?.click()}
                    className="w-28 h-24 rounded-xl border-2 border-dashed border-orange-200 flex flex-col items-center justify-center cursor-pointer hover:border-[#3B1E0A] transition bg-orange-50 flex-shrink-0 overflow-hidden"
                  >
                    {editImagePreview ? (
                      <img src={editImagePreview} alt="preview" className="w-full h-full object-cover rounded-xl" />
                    ) : (
                      <>
                        <ImageIcon size={24} className="text-orange-300 mb-1" />
                        <span className="text-[10px] text-orange-400 font-semibold">Upload Image</span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => editFileRef.current?.click()}
                      className="flex items-center gap-2 text-xs font-semibold text-[#3B1E0A] bg-orange-50 hover:bg-orange-100 border border-orange-200 px-4 py-2 rounded-xl transition"
                    >
                      <Upload size={14} />
                      Change Image
                    </button>
                    {editImagePreview && (
                      <button
                        type="button"
                        onClick={() => { setEditImage(''); setEditImagePreview(''); if (editFileRef.current) editFileRef.current.value = ''; }}
                        className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 transition"
                      >
                        <X size={12} /> Remove Image
                      </button>
                    )}
                    <p className="text-[10px] text-gray-400">Max 3 MB · PNG, JPG, WebP</p>
                  </div>

                  <input ref={editFileRef} type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#3B1E0A] hover:bg-[#2B1507] text-white px-4 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
                >
                  <Save size={16} />
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditingCategory(null)}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;


