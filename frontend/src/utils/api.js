import axios from 'axios';

const baseURL = 'http://localhost:8080';

// Separate instance for auth calls (no interceptor)
const authApi = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Instance for authenticated calls
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ecoToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Auth API Calls ---

export const loginUser = async (loginData) => {
  try {
    // Use the unauthenticated instance
    const res = await authApi.post('/api/auth/login', loginData);
    return res.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const signupUser = async (signupData) => {
  try {
    // Use the unauthenticated instance
    const res = await authApi.post('/api/auth/signup', signupData);
    return res.data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

// Product related API calls
export const fetchProducts = async (category) => {
  try {
    // Pass the category as a query parameter if it exists and is not 'All'
    const params = (category && category !== 'All') ? { category } : {};
    const res = await api.get('/api/products', { params });
    return res.data;
  } catch (error) {
    console.error('Error fetching eco products:', error);
    throw error;
  }
};

// --- Admin Product Management API Calls ---

export const adminGetProducts = async () => {
  try {
    const res = await api.get('/api/products');
    return res.data;
  } catch (error) {
    console.error('Error fetching products for admin:', error);
    throw error;
  }
};

export const adminAddProduct = async (productData) => {
  try {
    const res = await api.post('/api/products', productData);
    return res.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const adminUpdateProduct = async (id, productData) => {
  try {
    const res = await api.put(`/api/products/${id}`, productData);
    return res.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const adminDeleteProduct = async (id) => {
  try {
    await api.delete(`/api/products/${id}`);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// --- Order API Calls ---

export const createOrder = async (orderData) => {
  try {
    const res = await api.post('/api/orders', orderData);
    return res.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error.response.data || error;
  }
};

export const getProductById = async (id) => {
  try {
    const res = await api.get(`/api/products/${id}`);
    return res.data;
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    throw error;
  }
};

// EcoCoin related API calls
export const earnEcoCoins = async (userId, amount) => {
  try {
    const ecoCoins = calculateEcoCoins(amount);
    const res = await api.post('/eco-coins/earn', {
      userId,
      amount,
      ecoCoins
    });
    return res.data;
  } catch (error) {
    console.error('Error earning eco coins:', error);
    throw error;
  }
};

export const redeemEcoCoins = async (userId, optionId, coinsAmount) => {
  try {
    const res = await api.post('/eco-coins/redeem', {
      userId,
      optionId,
      coinsAmount
    });
    return res.data;
  } catch (error) {
    console.error('Error redeeming eco coins:', error);
    throw error;
  }
};

// Helper function to calculate EcoCoins based on purchase amount
export const calculateEcoCoins = (price) => {
  // 10 EcoCoins for every full 100 rupees spent on a single item
  return Math.floor(price / 100) * 10;
};
