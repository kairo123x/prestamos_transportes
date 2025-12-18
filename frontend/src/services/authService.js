import apiClient from "./interceptor";

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
    localStorage.removeItem('token-prestamo');
    localStorage.removeItem('user-prestamo');
  },

  // Obtener token y usuario del localStorage
  getToken() {
    return localStorage.getItem('token-prestamo');
  },

  getUser() {
    const user = localStorage.getItem('user-prestamo');
    return user ? JSON.parse(user) : null;
  },

  // Guardar datos de sesión
  saveSession(token, user) {
    localStorage.setItem('token-prestamo', token);
    localStorage.setItem('user-prestamo', JSON.stringify(user));
  },

  isAuthenticated() {
    return !!localStorage.getItem('token-prestamo');
  }
};
