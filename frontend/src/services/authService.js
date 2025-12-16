import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token/API Key en cada petición
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    // Usar el token como API Key en el header
    config.headers['x-api-key'] = token;
  }
  return config;
});

export default {
  // Autenticación - Usar email y password
  login(email, password) {
    return apiClient.post('/auth/login', {
      email,
      password
    });
  },

  // Listar empresas
  getEmpresas() {
    return apiClient.get('/empresas/list');
  },

  // Verificar datos del usuario
  getMe() {
    return apiClient.get('/auth/me');
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Obtener token y usuario del localStorage
  getToken() {
    return localStorage.getItem('token');
  },

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Guardar datos de sesión
  saveSession(token, user) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
};
