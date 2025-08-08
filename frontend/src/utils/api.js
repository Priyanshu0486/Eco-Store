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
    const token = localStorage.getItem('jwt');
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

export const searchProducts = async (query) => {
  try {
    const res = await api.get('/api/products/search', { params: { query } });
    return res.data;
  } catch (error) {
    console.error('Error searching products:', error);
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

// --- Payment API Calls ---

export const createPaymentOrder = async (amount) => {
  try {
    // The backend expects the amount in the main currency unit (e.g., Rupees).
    // It will handle the conversion to the smallest unit (e.g., paise).
    const res = await api.post('/api/payments/create', { amount });
    return res.data;
  } catch (error) {
    console.error('Error creating payment order:', error);
    throw error.response?.data || error;
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

// --- Admin Order Management API Calls ---

export const adminGetAllOrders = async () => {
  try {
    const res = await api.get('/api/admin/orders');
    return res.data;
  } catch (error) {
    console.error('Error fetching all orders for admin:', error);
    throw error;
  }
};

export const adminUpdateOrderStatus = async (orderId, orderStatus) => {
  try {
    const res = await api.put(`/api/admin/orders/${orderId}/status`, { orderStatus });
    return res.data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export const adminUpdatePaymentStatus = async (orderId, paymentStatus) => {
  try {
    const res = await api.put(`/api/admin/orders/${orderId}/payment-status`, { paymentStatus });
    return res.data;
  } catch (error) {
    console.error('Error updating payment status:', error);
    throw error;
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

// Helper function to calculate EcoCoins based on purchase amount
export const calculateEcoCoins = (price) => {
  // 1 EcoCoin for every ₹10 spent (10 EcoCoins per ₹100)
  return Math.floor(price / 10);
};

// --- Dashboard API Calls ---

/**
 * Fetch user's dashboard statistics
 * @returns {Promise} Dashboard stats including total spent, saved, ecocoins, carbon saved
 */
export const fetchDashboardStats = async () => {
  try {
    const res = await api.get('/api/dashboard/stats');
    return res.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

/**
 * Fetch all user orders for purchase history
 * @returns {Promise} List of all user orders
 */
export const fetchUserOrders = async () => {
  try {
    const res = await api.get('/api/dashboard/orders');
    return res.data;
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
};

/**
 * Fetch recent user orders (limited to last 5)
 * @returns {Promise} List of recent user orders
 */
export const fetchRecentOrders = async () => {
  try {
    const res = await api.get('/api/dashboard/recent-orders');
    return res.data;
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    throw error;
  }
};

// ==================== EcoCoin API Functions ====================

/**
 * Get user's current EcoCoin balance
 */
export const fetchEcoCoinBalance = async () => {
  try {
    const token = localStorage.getItem('jwt');
    if (!token) {
      console.warn('No JWT token found, user needs to log in');
      return 0; // Return 0 instead of throwing error
    }

    const response = await fetch(`${baseURL}/api/ecocoins/balance`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.balance || 0;
  } catch (error) {
    console.error('Error fetching EcoCoin balance:', error);
    throw error;
  }
};

/**
 * Redeem EcoCoins for discount
 * @param {number} ecoCoins - Number of EcoCoins to redeem
 */
export const redeemEcoCoins = async (ecoCoins) => {
  try {
    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${baseURL}/api/ecocoins/redeem`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ecoCoins }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error redeeming EcoCoins:', error);
    throw error;
  }
};

/**
 * Calculate potential EcoCoins from order amount
 * @param {number} amount - Order amount
 */
export const calculatePotentialEcoCoins = async (amount) => {
  try {
    const token = localStorage.getItem('jwt');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${baseURL}/api/ecocoins/calculate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.ecoCoinsEarned || 0;
  } catch (error) {
    console.error('Error calculating potential EcoCoins:', error);
    throw error;
  }
};
