import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Trash2, Edit, X, Package, Layers, Share2, CheckCircle } from 'lucide-react';
import './ProductManagement.css';

// ✅ API Base URL
const API_BASE = 'https://zust-mu.vercel.app';

const CATEGORY_DATA = {
  Clothes: {
    Men: ["Shirts", "Jeans", "Jackets"],
    Women: ["Shirts", "Dresses", "Jeans"],
    Baby: ["Bags", "Cloths"],
  },
  Electronics: {
    Mobiles: [],
    Laptops: [],
    Accessories: ["Chargers", "Headphones"]
  },
  "Decor & Kitchen": { 
    Decor: [],          
    Kitchen: []         
  },
  Beauty: {
    Skincare: ["Creams", "Serums"],
    Makeup: ["Lipstick", "Eyeliner"]
  }
};

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(Array(6).fill(null));
  const [previews, setPreviews] = useState(Array(6).fill(null));
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [statusMsg, setStatusMsg] = useState({ show: false, text: '' });

  const [formData, setFormData] = useState({
    title: '', price: '', stock: '', text: '',
    mainCategory: 'Clothes', 
    subCategory: 'Men', 
    subSubCategory: 'Shirts'
  });

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/products`);
      setProducts(res.data);
    } catch (err) { console.error("Fetch Error:", err); }
  };

  // ✅ ADVANCED SHARE: COPY TEXT & DOWNLOAD ALL IMAGES
  const handleShare = async (product) => {
    // 1. Prepare Share Text
    const shareText = `*${product.title}*\n\n` +
                      `💰 *Price:* Rs. ${product.price?.toLocaleString()}\n` +
                      `📝 *Description:* ${product.text}\n\n` +
                      `🛒 *Order Online:* ${window.location.origin}/product/${product._id}`;

    try {
      // 2. Copy to Clipboard
      await navigator.clipboard.writeText(shareText);

      // 3. Loop through and download all images
      if (product.images && product.images.length > 0) {
        for (let i = 0; i < product.images.length; i++) {
          const imgUrl = product.images[i].startsWith('http') 
            ? product.images[i] 
            : `${API_BASE}${product.images[i]}`;

          const response = await fetch(imgUrl);
          const blob = await response.blob();
          const blobUrl = window.URL.createObjectURL(blob);
          
          const link = document.createElement('a');
          link.href = blobUrl;
          // Clean filename with index
          link.download = `${product.title.replace(/\s+/g, '-').toLowerCase()}-img-${i + 1}.jpg`;
          
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          
          window.URL.revokeObjectURL(blobUrl);
          // 100ms delay to prevent browser from blocking multiple downloads
          await new Promise(resolve => setTimeout(resolve, 150));
        }
        showFlash(`Details Copied & ${product.images.length} Images Downloaded! 📥✨`);
      }
    } catch (err) {
      console.error("Share error:", err);
      alert("Sharing failed. Please allow multiple downloads in your browser.");
    }
  };

  const handleMainCatChange = (val) => {
    const subs = Object.keys(CATEGORY_DATA[val]);
    const firstSub = subs[0];
    const firstSubSub = CATEGORY_DATA[val][firstSub]?.[0] || "";
    setFormData({ ...formData, mainCategory: val, subCategory: firstSub, subSubCategory: firstSubSub });
  };

  const handleSubCatChange = (val) => {
    const firstSubSub = CATEGORY_DATA[formData.mainCategory][val]?.[0] || "";
    setFormData({ ...formData, subCategory: val, subSubCategory: firstSubSub });
  };

  const handleBoxFileChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const newImages = [...images];
      newImages[index] = file;
      setImages(newImages);
      const newPreviews = [...previews];
      newPreviews[index] = URL.createObjectURL(file);
      setPreviews(newPreviews);
    }
  };

  const removeImage = (index) => {
    const newImages = [...images]; newImages[index] = null; setImages(newImages);
    const newPreviews = [...previews]; newPreviews[index] = null; setPreviews(newPreviews);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? Yeh product database se delete ho jayega.")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
      showFlash("Product Deleted! 🗑️");
    } catch (err) { alert("Delete failed!"); }
  };

  const handleEditClick = (p) => {
    setIsEditing(true);
    setCurrentProductId(p._id);
    let mainCat = p.category?.main === "Home & Kitchen" ? "Decor & Kitchen" : (p.category?.main || 'Clothes');
    let subCat = p.category?.sub === "Furniture" ? "Decor" : (p.category?.sub || '');
    
    setFormData({
      title: p.title, price: p.price, stock: p.stock || 0, text: p.text || '',
      mainCategory: mainCat, subCategory: subCat, subSubCategory: p.category?.subSub || ''
    });

    const newPreviews = Array(6).fill(null);
    if (p.images) p.images.forEach((img, i) => { 
        if(i < 6) newPreviews[i] = img.startsWith('http') ? img : `${API_BASE}${img}`; 
    });
    setPreviews(newPreviews);
    setImages(Array(6).fill(null));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const showFlash = (msg) => {
    setStatusMsg({ show: true, text: msg });
    setTimeout(() => setStatusMsg({ show: false, text: '' }), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    images.forEach((file) => { if (file) data.append('images', file); });

    try {
      const config = { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } };
      if (isEditing) {
        await axios.put(`${API_BASE}/api/products/${currentProductId}`, data, config);
        showFlash("Product Updated! ✨");
      } else {
        await axios.post(`${API_BASE}/api/products`, data, config);
        showFlash("Product Published! 🚀");
      }
      resetForm(); fetchProducts();
    } catch (err) { 
      alert(err.response?.data?.message || "Operation failed!"); 
    } finally { setLoading(false); }
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentProductId(null);
    setFormData({ title: '', price: '', stock: '', text: '', mainCategory: 'Clothes', subCategory: 'Men', subSubCategory: 'Shirts' });
    setImages(Array(6).fill(null)); setPreviews(Array(6).fill(null));
  };

  return (
    <div className="admin-section animate-in">
      {statusMsg.show && (
        <div className="flash-message">
          <CheckCircle size={18} /> {statusMsg.text}
        </div>
      )}

      <div className="admin-header">
        <h2>{isEditing ? "📝 Edit Product" : "📦 Add New Product"}</h2>
        {isEditing && <button className="cancel-btn" onClick={resetForm}><X size={16}/> Cancel</button>}
      </div>

      <form className="admin-form-card card-shadow" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="input-group">
            <label><Package size={14}/> Product Title</label>
            <input type="text" placeholder="Product Title" value={formData.title} onChange={(e)=>setFormData({...formData, title: e.target.value})} required />
          </div>

          <div className="input-group">
            <label>Price (Rs.)</label>
            <input type="number" placeholder="0.00" value={formData.price} onChange={(e)=>setFormData({...formData, price: e.target.value})} required />
          </div>

          <div className="input-group">
            <label>Stock</label>
            <input type="number" value={formData.stock} onChange={(e)=>setFormData({...formData, stock: e.target.value})} required />
          </div>
          
          <div className="input-group">
            <label><Layers size={14}/> Main Category</label>
            <select value={formData.mainCategory} onChange={(e) => handleMainCatChange(e.target.value)}>
              {Object.keys(CATEGORY_DATA).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label>Sub Category</label>
            <select value={formData.subCategory} onChange={(e) => handleSubCatChange(e.target.value)}>
              {Object.keys(CATEGORY_DATA[formData.mainCategory]).map(sub => <option key={sub} value={sub}>{sub}</option>)}
            </select>
          </div>

          <div className="input-group">
            <label>Sub-Sub</label>
            <select value={formData.subSubCategory} onChange={(e) => setFormData({...formData, subSubCategory: e.target.value})}>
              {CATEGORY_DATA[formData.mainCategory][formData.subCategory]?.length > 0 ? 
                CATEGORY_DATA[formData.mainCategory][formData.subCategory].map(ss => <option key={ss} value={ss}>{ss}</option>) : 
                <option value="">None</option>}
            </select>
          </div>
        </div>

        <div className="textarea-group">
          <label>Description</label>
          <textarea value={formData.text} onChange={(e)=>setFormData({...formData, text: e.target.value})} />
        </div>

        <div className="image-upload-section">
          <label>Images (Max 6)</label>
          <div className="image-upload-grid">
            {previews.map((preview, index) => (
              <div key={index} className="image-box">
                {preview ? (
                  <div className="preview-wrapper">
                    <img src={preview} alt="preview" />
                    <button type="button" className="remove-img" onClick={() => removeImage(index)}><X size={14}/></button>
                  </div>
                ) : (
                  <label className="upload-placeholder">
                    <Plus size={20} />
                    <input type="file" hidden accept="image/*" onChange={(e) => handleBoxFileChange(e, index)} />
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="btn-submit" disabled={loading}>
          {loading ? "Processing..." : isEditing ? "Update Product" : "Publish Product"}
        </button>
      </form>

      <div className="table-container card-shadow">
        <h3>Inventory List</h3>
        <table className="admin-table">
          <thead>
            <tr><th>Product</th><th>Price</th><th>Stock</th><th>Category</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p._id}>
                <td data-label="Product" className="product-cell">
                  <img src={p.images[0]?.startsWith('http') ? p.images[0] : `${API_BASE}${p.images[0]}`} alt="p" />
                  <span>{p.title}</span>
                </td>
                <td data-label="Price">Rs. {p.price}</td>
                <td data-label="Stock" className={p.stock < 5 ? "stock-low" : ""}>{p.stock}</td>
                <td data-label="Category">{p.category?.main}</td>
                <td data-label="Actions" className="actions-cell">
                  <button className="share-btn-act" title="Share & Download All" onClick={() => handleShare(p)}><Share2 size={16}/></button>
                  <button className="edit-btn-act" title="Edit" onClick={() => handleEditClick(p)}><Edit size={16}/></button>
                  <button className="delete-btn-act" title="Delete" onClick={() => handleDelete(p._id)}><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ProductManagement;