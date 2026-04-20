// src/services/productServices.js
import API from './api';

const productServices = {
  // Saare products mangwana
  getAllProducts: async function() {
    const response = await API.get('/products');
    return response.data;
  },

  // Kisi aik product ki detail mangwana
  getProductById: async function(id) {
    const response = await API.get(`/products/${id}`);
    return response.data;
  },

  // Naya product add karna (Admin ke liye)
  addProduct: async function(productData) {
    const response = await API.post('/products', productData);
    return response.data;
  },

  // Product delete karna (Admin ke liye)
  deleteProduct: async function(id) {
    const response = await API.delete(`/products/${id}`);
    return response.data;
  }
};

export default productServices;