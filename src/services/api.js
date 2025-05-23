import axios from 'axios';

const API_URL = 'http://localhost:3000/api/charles';

// Configuración de axios
axios.interceptors.request.use(
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

// Servicio de autenticación
export const authService = {
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      const { token, data } = response.data;
      if (token) {
        localStorage.setItem('token', token);
      }
      return { token, data };
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  logout: () => {
    localStorage.removeItem('token');
  }
};

// Servicio de usuarios
export const userService = {
  getAll: async () => {
    try {
      const response = await axios.get(`${API_URL}`);
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  getById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  create: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  update: async (id, userData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, userData);
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  },

  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (err) {
      throw err.response?.data || err;
    }
  }
};

export default axios; 