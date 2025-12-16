<template>
  <div id="app">
    <Login v-if="!isAuthenticated" @login-success="handleLoginSuccess" />
    <Dashboard v-else :usuario="currentUser" @logout="handleLogout" />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Login from './components/Login.vue'
import Dashboard from './components/Dashboard.vue'
import authService from './services/authService'

export default {
  name: 'App',
  components: {
    Login,
    Dashboard
  },
  setup() {
    const isAuthenticated = ref(false)
    const currentUser = ref(null)

    onMounted(() => {
      // Verificar si el usuario ya está autenticado
      if (authService.isAuthenticated()) {
        const user = authService.getUser()
        if (user) {
          currentUser.value = user
          isAuthenticated.value = true
        }
      }
    })

    const handleLoginSuccess = (usuario) => {
      currentUser.value = usuario
      isAuthenticated.value = true
    }

    const handleLogout = () => {
      authService.logout()
      currentUser.value = null
      isAuthenticated.value = false
    }

    return {
      isAuthenticated,
      currentUser,
      handleLoginSuccess,
      handleLogout
    }
  }
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: #f5f5f5;
}

#app {
  min-height: 100vh;
}
</style>
