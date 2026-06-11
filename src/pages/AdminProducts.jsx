import React, { useState, useContext } from 'react';
import { ShopContext } from '../context/ShopContext';
import { Plus, Edit, Trash2, Search, X, Save, Upload } from 'lucide-react';

const AdminProducts = ({ categoryFilter: propCategoryFilter, setCategoryFilter: propSetCategoryFilter }) => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = useContext(ShopContext);
  
  // Fallback to local state if props are not provided
  const [localCategoryFilter, setLocalCategoryFilter] = useState('');
  const categoryFilter = propCategoryFilter !== undefined ? propCategoryFilter : localCategoryFilter;
  const setCategoryFilter = propSetCategoryFilter !== undefined ? propSetCategoryFilter : setLocalCategoryFilter;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    ingredients: '',
    image: '',
    isBestseller: false,
    isEcoPiece: false,
    inStock: true,
    isLiquid: false,
    isSolid: true,
    isPieces: false
  });
  const [productWeights, setProductWeights] = useState([]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          product.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter ? product.category === categoryFilter : true;
    return matchesSearch && matchesCategory;
  });

  const handleTogglePricingType = (type) => {
    setFormData(prev => ({
      ...prev,
      isSolid: type === 'solid',
      isLiquid: type === 'liquid',
      isPieces: type === 'pieces'
    }));

    // Re-initialize productWeights based on type
    let defaults = [];
    if (type === 'pieces') {
      defaults = [
        { value: '1pc', label: '1 Pc', price: '', enabled: true, isCustom: false },
        { value: '2pcs', label: '2 Pcs', price: '', enabled: true, isCustom: false },
        { value: '3pcs', label: '3 Pcs', price: '', enabled: true, isCustom: false }
      ];
    } else if (type === 'liquid') {
      defaults = [
        { value: '250ml', label: '250ML', price: '', enabled: true, isCustom: false },
        { value: '500ml', label: '500ML', price: '', enabled: true, isCustom: false },
        { value: '1lt', label: '1LT', price: '', enabled: true, isCustom: false }
      ];
    } else {
      defaults = [
        { value: '250g', label: '250g', price: '', enabled: true, isCustom: false },
        { value: '500g', label: '500g', price: '', enabled: true, isCustom: false },
        { value: '1kg', label: '1kg', price: '', enabled: true, isCustom: false }
      ];
    }
    setProductWeights(defaults);
  };

  const handleWeightCheckboxChange = (index, checked) => {
    setProductWeights(prev => prev.map((w, idx) => idx === index ? { ...w, enabled: checked } : w));
  };

  const handleWeightPriceChange = (index, value) => {
    setProductWeights(prev => prev.map((w, idx) => idx === index ? { ...w, price: value } : w));
  };

  const handleWeightLabelChange = (index, labelVal) => {
    const valKey = labelVal.toLowerCase().replace(/\s+/g, '');
    setProductWeights(prev => prev.map((w, idx) => idx === index ? { ...w, label: labelVal, value: valKey } : w));
  };

  const handleAddCustomWeight = () => {
    const placeholderLabel = formData.isPieces ? '5 Pcs' : formData.isLiquid ? '5L' : '2kg';
    const placeholderValue = formData.isPieces ? '5pcs' : formData.isLiquid ? '5l' : '2kg';
    setProductWeights(prev => [
      ...prev,
      {
        value: placeholderValue,
        label: placeholderLabel,
        price: '',
        enabled: true,
        isCustom: true
      }
    ]);
  };

  const handleRemoveCustomWeight = (index) => {
    setProductWeights(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      
      const hasLiquidLabels = product.weightLabels && product.weightLabels.some(opt => 
        opt.label.toUpperCase().includes('ML') || opt.label.toUpperCase().includes('LT') || opt.label.toUpperCase().includes(' L') || opt.label.toUpperCase().endsWith('L')
      );
      const hasPiecesLabels = product.weightLabels && product.weightLabels.some(opt => 
        opt.label.toUpperCase().includes('PC')
      );
      
      const isPieces = !!hasPiecesLabels || !!product.isEcoPiece;
      const isLiq = !isPieces && !!hasLiquidLabels;
      const isSol = !isPieces && !isLiq;

      let loadedWeights = [];
      if (product.weightLabels && product.weightLabels.length > 0) {
        loadedWeights = product.weightLabels.map(opt => {
          const valLower = opt.value.toLowerCase();
          const isDefault = isPieces
            ? ['1pc', '2pcs', '3pcs'].includes(valLower)
            : isLiq 
            ? ['250ml', '500ml', '1lt'].includes(valLower)
            : ['250g', '500g', '1kg'].includes(valLower);
            
          return {
            value: opt.value,
            label: opt.label,
            price: opt.price || '',
            enabled: true,
            isCustom: !isDefault
          };
        });
        
        // Ensure default options are present (as disabled if not in weightLabels)
        const defaultList = isPieces
          ? [
              { value: '1pc', label: '1 Pc' },
              { value: '2pcs', label: '2 Pcs' },
              { value: '3pcs', label: '3 Pcs' }
            ]
          : isLiq 
          ? [
              { value: '250ml', label: '250ML' },
              { value: '500ml', label: '500ML' },
              { value: '1lt', label: '1LT' }
            ]
          : [
              { value: '250g', label: '250g' },
              { value: '500g', label: '500g' },
              { value: '1kg', label: '1kg' }
            ];
            
        defaultList.forEach(def => {
          const exists = loadedWeights.some(w => w.value.toLowerCase() === def.value);
          if (!exists) {
            loadedWeights.push({
              value: def.value,
              label: def.label,
              price: '',
              enabled: false,
              isCustom: false
            });
          }
        });

        // Sort defaults first
        loadedWeights.sort((a, b) => {
          if (a.isCustom && !b.isCustom) return 1;
          if (!a.isCustom && b.isCustom) return -1;
          return 0;
        });
      } else {
        // Fallback using legacy database columns if no weightLabels
        if (isPieces) {
          loadedWeights = [
            { value: '1pc', label: '1 Pc', price: product.price250g || '', enabled: !!product.price250g, isCustom: false },
            { value: '2pcs', label: '2 Pcs', price: product.price500g || '', enabled: !!product.price500g, isCustom: false },
            { value: '3pcs', label: '3 Pcs', price: product.price1kg || '', enabled: !!product.price1kg, isCustom: false }
          ];
        } else if (isSol) {
          loadedWeights = [
            { value: '250g', label: '250g', price: product.price250g || '', enabled: !!product.price250g, isCustom: false },
            { value: '500g', label: '500g', price: product.price500g || '', enabled: !!product.price500g, isCustom: false },
            { value: '1kg', label: '1kg', price: product.price1kg || '', enabled: !!product.price1kg, isCustom: false }
          ];
        } else {
          loadedWeights = [
            { value: '250ml', label: '250ML', price: product.price250g || '', enabled: !!product.price250g, isCustom: false },
            { value: '500ml', label: '500ML', price: product.price500g || '', enabled: !!product.price500g, isCustom: false },
            { value: '1lt', label: '1LT', price: product.price1kg || '', enabled: !!product.price1kg, isCustom: false }
          ];
        }
      }

      setProductWeights(loadedWeights);

      setFormData({
        name: product.name,
        category: product.category,
        description: product.description,
        ingredients: product.ingredients,
        image: product.image,
        isBestseller: product.isBestseller || false,
        isEcoPiece: product.isEcoPiece || false,
        inStock: product.inStock !== false,
        isLiquid: isLiq,
        isSolid: isSol,
        isPieces: isPieces
      });
      setImagePreview(product.image || '');
    } else {
      setEditingProduct(null);
      setProductWeights([
        { value: '250g', label: '250g', price: '', enabled: true, isCustom: false },
        { value: '500g', label: '500g', price: '', enabled: true, isCustom: false },
        { value: '1kg', label: '1kg', price: '', enabled: true, isCustom: false }
      ]);
      setFormData({
        name: '',
        category: '',
        description: '',
        ingredients: '',
        image: '',
        isBestseller: false,
        isEcoPiece: false,
        inStock: true,
        isLiquid: false,
        isSolid: true,
        isPieces: false
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
    
    // Save only enabled weights with valid prices
    const enabledWeights = productWeights.filter(w => w.enabled && w.price !== '');

    const getPriceForVal = (val) => {
      const match = enabledWeights.find(w => w.value.toLowerCase() === val.toLowerCase());
      return match ? Number(match.price) : 0;
    };
    
    let p250 = 0;
    let p500 = 0;
    let p1k = 0;
    
    if (formData.isPieces) {
      p250 = getPriceForVal('1pc');
      p500 = getPriceForVal('2pcs');
      p1k = getPriceForVal('3pcs');
    } else if (formData.isLiquid) {
      p250 = getPriceForVal('250ml');
      p500 = getPriceForVal('500ml');
      p1k = getPriceForVal('1lt');
    } else {
      p250 = getPriceForVal('250g');
      p500 = getPriceForVal('500g');
      p1k = getPriceForVal('1kg');
    }

    const weightLabels = enabledWeights.map(w => ({
      value: w.value,
      label: w.label,
      price: Number(w.price)
    }));

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
      isEcoPiece: formData.isPieces,
      inStock: formData.inStock,
      weightLabels: weightLabels.length > 0 ? weightLabels : null
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Products Management</h1>
          {categoryFilter && (
            <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
              Showing products in <span className="font-semibold text-orange-600 px-2 py-0.5 rounded-md bg-orange-50 border border-orange-100">{categoryFilter}</span>
            </p>
          )}
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="bg-[#3B1E0A] hover:bg-[#2B1507] text-white px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold transition-colors cursor-pointer shadow-sm"
        >
          <Plus size={18} />
          Add Product
        </button>
      </div>

      {/* Search & Category Filter */}
      <div className="bg-white rounded-2xl shadow-md p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] text-sm transition-all"
          />
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative w-full md:w-64">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B1E0A] text-sm bg-white appearance-none cursor-pointer pr-10 font-medium text-gray-700"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {/* Dropdown arrow icon */}
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
          
          {categoryFilter && (
            <button
              onClick={() => setCategoryFilter('')}
              className="px-4 py-2.5 border border-orange-200 hover:border-orange-300 text-orange-600 bg-orange-50 hover:bg-orange-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition whitespace-nowrap cursor-pointer"
            >
              <X size={14} /> Clear Filter
            </button>
          )}
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

                {/* Product Form Type: Solid vs Liquid */}
                <div className="border border-orange-100 rounded-2xl p-5 bg-orange-50/20 space-y-6">
                  <div className="flex items-center justify-between border-b border-orange-100 pb-3">
                    <span className="text-xs font-bold text-svada-dark uppercase tracking-wider">
                      ⚖️ PRICING & QUANTITY CONFIGURATION
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleTogglePricingType('solid')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          formData.isSolid
                            ? 'bg-[#3B1E0A] text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Solid (Grams/KG)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTogglePricingType('liquid')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          formData.isLiquid
                            ? 'bg-[#3B1E0A] text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Liquid (ML/Liters)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleTogglePricingType('pieces')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          formData.isPieces
                            ? 'bg-[#3B1E0A] text-white shadow-sm'
                            : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        Pieces (Pcs)
                      </button>
                    </div>
                  </div>

                  {/* Weights List */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-12 gap-3 text-[10px] font-extrabold text-[#3B1E0A] uppercase tracking-wider px-1">
                      <div className="col-span-2 text-center">Enable</div>
                      <div className="col-span-5">Size / Label</div>
                      <div className="col-span-4">Price (₹)</div>
                      <div className="col-span-1"></div>
                    </div>

                    {productWeights.map((w, idx) => (
                      <div key={idx} className={`grid grid-cols-12 gap-3 items-center p-2 rounded-xl border transition ${
                        w.enabled ? 'bg-white border-orange-100' : 'bg-gray-50/60 border-gray-100 opacity-60'
                      }`}>
                        {/* Checkbox */}
                        <div className="col-span-2 flex justify-center">
                          <input
                            type="checkbox"
                            checked={w.enabled}
                            onChange={(e) => handleWeightCheckboxChange(idx, e.target.checked)}
                            className="rounded border-gray-300 text-[#3B1E0A] focus:ring-[#3B1E0A] w-4.5 h-4.5 cursor-pointer"
                          />
                        </div>
                        
                        {/* Label (Read-only for default, input for custom) */}
                        <div className="col-span-5">
                          {w.isCustom ? (
                            <input
                              type="text"
                              value={w.label}
                              onChange={(e) => handleWeightLabelChange(idx, e.target.value)}
                              placeholder="e.g. 2kg or 5L"
                              required
                              className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#3B1E0A]"
                            />
                          ) : (
                            <span className="text-xs font-semibold text-gray-700 ml-1">{w.label}</span>
                          )}
                        </div>

                        {/* Price */}
                        <div className="col-span-4">
                          <input
                            type="number"
                            value={w.price}
                            onChange={(e) => handleWeightPriceChange(idx, e.target.value)}
                            placeholder="Price"
                            required={w.enabled}
                            disabled={!w.enabled}
                            className="w-full px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#3B1E0A] disabled:bg-gray-100"
                          />
                        </div>

                        {/* Actions (Delete button for custom weights) */}
                        <div className="col-span-1 flex justify-center">
                          {w.isCustom && (
                            <button
                              type="button"
                              onClick={() => handleRemoveCustomWeight(idx)}
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
                              title="Remove size"
                            >
                              <X size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Custom Weight Trigger */}
                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleAddCustomWeight}
                      className="text-xs font-semibold text-[#3B1E0A] bg-orange-50 hover:bg-orange-100 border border-orange-200 px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus size={14} />
                      Add Custom Size
                    </button>
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


