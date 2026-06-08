import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Plus, Edit, Trash2, Search, X, Save, Upload } from 'lucide-react';

const AdminProducts = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useContext(ShopContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price250g: '',
    price500g: '',
    price1kg: '',
    description: '',
    ingredients: '',
    image: '',
    isBestseller: false,
    isEcoPiece: false,
    inStock: true,
    isLiquid: false,
    isSolid: true,
    liquid250ml: '',
    liquid500ml: '',
    liquid1lt: '',
    solid250g: '',
    solid500g: '',
    solid1kg: ''
  });

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      
      const hasLiquidLabels = product.weightLabels && product.weightLabels.some(opt => 
        opt.label.toUpperCase().includes('ML') || opt.label.toUpperCase().includes('LT')
      );
      
      const isLiq = !!hasLiquidLabels;
      const isSol = !isLiq;

      const getOptionPrice = (val) => {
        if (!product.weightLabels) return '';
        const opt = product.weightLabels.find(o => o.value === val);
        return opt ? opt.price : '';
      };

      setFormData({
        name: product.name,
        category: product.category,
        price250g: product.price250g,
        price500g: product.price500g,
        price1kg: product.price1kg,
        description: product.description,
        ingredients: product.ingredients,
        image: product.image,
        isBestseller: product.isBestseller || false,
        isEcoPiece: product.isEcoPiece || false,
        inStock: product.inStock !== false,
        isLiquid: isLiq,
        isSolid: isSol,
        liquid250ml: isLiq ? (getOptionPrice('250ml') || product.price250g || '') : '',
        liquid500ml: isLiq ? (getOptionPrice('500ml') || product.price500g || '') : '',
        liquid1lt: isLiq ? (getOptionPrice('1lt') || product.price1kg || '') : '',
        solid250g: isSol ? product.price250g : '',
        solid500g: isSol ? product.price500g : '',
        solid1kg: isSol ? product.price1kg : ''
      });
      setImagePreview(product.image || '');
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        category: '',
        price250g: '',
        price500g: '',
        price1kg: '',
        description: '',
        ingredients: '',
        image: '',
        isBestseller: false,
        isEcoPiece: false,
        inStock: true,
        isLiquid: false,
        isSolid: true,
        liquid250ml: '',
        liquid500ml: '',
        liquid1lt: '',
        solid250g: '',
        solid500g: '',
        solid1kg: ''
      });
      setImagePreview('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setImagePreview('');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('File size must be less than 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData(prev => ({ ...prev, image: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: '' }));
    setImagePreview('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let weightLabels = null;
    let p250 = 0;
    let p500 = 0;
    let p1k = 0;

    if (formData.isLiquid) {
      p250 = Number(formData.liquid250ml) || 0;
      p500 = Number(formData.liquid500ml) || 0;
      p1k = Number(formData.liquid1lt) || 0;
      
      weightLabels = [
        { value: '250ml', label: '250ML', price: p250 },
        { value: '500ml', label: '500ML', price: p500 },
        { value: '1lt', label: '1LT', price: p1k }
      ].filter(opt => opt.price > 0);
    } else {
      p250 = Number(formData.solid250g) || 0;
      p500 = Number(formData.solid500g) || 0;
      p1k = Number(formData.solid1kg) || 0;
      weightLabels = null;
    }

    const productData = {
      name: formData.name,
      category: formData.category,
      price250g: p250,
      price500g: p500,
      price1kg: p1k,
      description: formData.description,
      ingredients: formData.ingredients,
      image: formData.image,
      isBestseller: formData.isBestseller,
      isEcoPiece: formData.isEcoPiece,
      inStock: formData.inStock,
      weightLabels: weightLabels
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    handleCloseModal();
  };

  const handleDelete = (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Products Management</h1>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#3B1E0A] hover:bg-[#2B1507] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search products by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A]"
          />
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
             <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prices</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bestseller</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        250g: ₹{product.price250g}<br />
                        500g: ₹{product.price500g}<br />
                        1kg: ₹{product.price1kg}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.isBestseller ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">Yes</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">No</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.inStock !== false ? (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">In Stock</span>
                      ) : (
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">Out of Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenModal(product)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-600 hover:text-red-900 p-1"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A]"
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Liquid vs Solid Selection */}
                <div className="border border-orange-100 rounded-xl p-4 bg-orange-50/20 space-y-4">
                  
                  {/* Liquid Pricing Header */}
                  <div className="flex items-center justify-between border-b border-orange-100 pb-2">
                    <span className="text-xs font-bold text-svada-dark uppercase tracking-wider flex items-center gap-1.5">
                      ⚙️ LIQUID PRICING (ML/LT)
                    </span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <span className="text-xs font-bold text-gray-500 uppercase">ENABLE LIQUID</span>
                      <input
                        type="checkbox"
                        name="isLiquid"
                        checked={formData.isLiquid}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setFormData(prev => ({
                            ...prev,
                            isLiquid: val,
                            isSolid: !val
                          }));
                        }}
                        className="rounded text-green-600 focus:ring-green-500 w-4.5 h-4.5"
                      />
                    </label>
                  </div>

                  {/* Liquid Inputs Grid */}
                  <div className={`grid grid-cols-3 gap-3 transition-opacity ${!formData.isLiquid ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div>
                      <label className="block text-[10px] font-extrabold text-svada-light uppercase tracking-wider mb-1">250ML (₹)</label>
                      <input
                        type="number"
                        name="liquid250ml"
                        value={formData.liquid250ml}
                        onChange={handleInputChange}
                        required={formData.isLiquid}
                        disabled={!formData.isLiquid}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-svada-light uppercase tracking-wider mb-1">500ML (₹)</label>
                      <input
                        type="number"
                        name="liquid500ml"
                        value={formData.liquid500ml}
                        onChange={handleInputChange}
                        required={formData.isLiquid}
                        disabled={!formData.isLiquid}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-svada-light uppercase tracking-wider mb-1">1LT (₹)</label>
                      <input
                        type="number"
                        name="liquid1lt"
                        value={formData.liquid1lt}
                        onChange={handleInputChange}
                        required={formData.isLiquid}
                        disabled={!formData.isLiquid}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] text-xs"
                      />
                    </div>
                  </div>

                  {/* Solid Pricing Header */}
                  <div className="flex items-center justify-between border-b border-orange-100 pb-2 pt-2">
                    <span className="text-xs font-bold text-svada-dark uppercase tracking-wider flex items-center gap-1.5">
                      📦 SOLID PRICING (GRAMS)
                    </span>
                    <label className="flex items-center gap-1.5 cursor-pointer">
                      <span className="text-xs font-bold text-gray-500 uppercase">ENABLE SOLID</span>
                      <input
                        type="checkbox"
                        name="isSolid"
                        checked={formData.isSolid}
                        onChange={(e) => {
                          const val = e.target.checked;
                          setFormData(prev => ({
                            ...prev,
                            isSolid: val,
                            isLiquid: !val
                          }));
                        }}
                        className="rounded text-green-600 focus:ring-green-500 w-4.5 h-4.5"
                      />
                    </label>
                  </div>

                  {/* Solid Inputs Grid */}
                  <div className={`grid grid-cols-3 gap-3 transition-opacity ${!formData.isSolid ? 'opacity-40 pointer-events-none' : ''}`}>
                    <div>
                      <label className="block text-[10px] font-extrabold text-svada-light uppercase tracking-wider mb-1">250GRMS (₹)</label>
                      <input
                        type="number"
                        name="solid250g"
                        value={formData.solid250g}
                        onChange={handleInputChange}
                        required={formData.isSolid}
                        disabled={!formData.isSolid}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-svada-light uppercase tracking-wider mb-1">500GRMS (₹)</label>
                      <input
                        type="number"
                        name="solid500g"
                        value={formData.solid500g}
                        onChange={handleInputChange}
                        required={formData.isSolid}
                        disabled={!formData.isSolid}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-extrabold text-svada-light uppercase tracking-wider mb-1">1000GRMS (₹)</label>
                      <input
                        type="number"
                        name="solid1kg"
                        value={formData.solid1kg}
                        onChange={handleInputChange}
                        required={formData.isSolid}
                        disabled={!formData.isSolid}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] text-xs"
                      />
                    </div>
                  </div>

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows="3"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ingredients</label>
                  <input
                    type="text"
                    name="ingredients"
                    value={formData.ingredients}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Image</label>
                  
                  {/* File Upload */}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#3B1E0A]"
                    />
                    <p className="text-xs text-gray-500 mt-1">Maximum file size: 2MB</p>
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <div className="mt-3 relative">
                      <img
                        src={imagePreview}
                        alt="Product preview"
                        className="w-32 h-32 object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="isBestseller"
                      checked={formData.isBestseller}
                      onChange={handleInputChange}
                      className="rounded focus:ring-[#3B1E0A]"
                    />
                    <span className="text-sm text-gray-700">Bestseller</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="inStock"
                      checked={formData.inStock}
                      onChange={handleInputChange}
                      className="rounded focus:ring-[#3B1E0A]"
                    />
                    <span className="text-sm text-gray-700">In Stock</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-[#3B1E0A] hover:bg-[#2B1507] text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors"
                  >
                    <Save size={20} />
                    {editingProduct ? 'Update Product' : 'Add Product'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;


