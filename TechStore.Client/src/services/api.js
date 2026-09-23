import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Не делаем редирект для запросов авторизации и регистрации
      const isAuthRequest = error.config?.url?.includes('/Auth/login') ||
                           error.config?.url?.includes('/Auth/register');

      if (!isAuthRequest) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authService = {
  async login(email, password) {
    const response = await api.post('/Auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(email, password, fullName) {
    const response = await api.post('/Auth/register', { email, password, fullName });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined' || user === 'null') return null;
    try {
      return JSON.parse(user);
    } catch (e) {
      return null;
    }
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },
};

export const categoryService = {
  async getAll() {
    const response = await api.get('/Categories');
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/Categories/${id}`);
    return response.data;
  },
};

export const productService = {
  async getAll(params = {}) {
    const response = await api.get('/Products', { params });
    return response.data;
  },

  async getById(id) {
    const response = await api.get(`/Products/${id}`);
    return response.data;
  },

  async search(searchTerm, params = {}) {
    const response = await api.get('/Products', {
      params: { searchTerm, ...params },
    });
    return response.data;
  },
};

export const cartService = {
  async getCart() {
    const response = await api.get('/Cart');
    return response.data;
  },

  async addItem(productId, quantity = 1) {
    const response = await api.post('/Cart/items', { productId, quantity });
    return response.data;
  },

  async updateItem(productId, quantity) {
    const response = await api.put(`/Cart/items/${productId}`, { quantity });
    return response.data;
  },

  async removeItem(productId) {
    const response = await api.delete(`/Cart/items/${productId}`);
    return response.data;
  },

  async clearCart() {
    const response = await api.delete('/Cart');
    return response.data;
  },
};

export const orderService = {
  async createOrder(shippingAddress) {
    const response = await api.post('/Orders', { shippingAddress });
    return response.data;
  },

  async getMyOrders() {
    const response = await api.get('/Orders/my');
    return response.data;
  },

  async getOrderById(id) {
    const response = await api.get(`/Orders/${id}`);
    return response.data;
  },
};

export const paymentService = {
  async processPayment(orderId) {
    const response = await api.post('/Payments/process', { orderId });
    return response.data;
  },
};

export const userService = {
  async updateEmail(email) {
    const response = await api.put('/Users/email', { email });
    return response.data;
  },

  async changePassword(currentPassword, newPassword) {
    const response = await api.put('/Users/password', { currentPassword, newPassword });
    return response.data;
  },
};

export default api;
