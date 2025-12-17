import { defineStore } from 'pinia'
import authService from '../services/authService'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isAuthenticated: false,
    currentUser: null
  }),
  actions: {
    async login(email, password) {
        const response = await authService.login(email, password);
        if (response.data.success) {
          this.isAuthenticated = true
          this.currentUser = response.data.data
          authService.saveSession(response.data.data.Token, response.data.data)
        }
        return response;
    },
    logout() {
      authService.logout()
      this.isAuthenticated = false
      this.currentUser = null
    },
    checkSession() {
      if (authService.isAuthenticated()) {
        this.isAuthenticated = true
        this.currentUser = authService.getUser()
        console.log("Verificacion", this.currentUser);
        
      }
    }
  }
})