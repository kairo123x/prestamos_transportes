<template>
  <div class="dashboard-container">
    <nav class="navbar">
      <div class="navbar-brand">
        <h2>🚗 Préstamos Transporte</h2>
      </div>
      <div class="navbar-menu">
        <div class="user-info">
          <span>{{ usuario?.Nombres }} {{ usuario?.Apellidos }}</span>
          <small>{{ usuario?.Rolname }}</small>
        </div>
        <button @click="handleLogout" class="btn-logout">
          Cerrar Sesión
        </button>
      </div>
    </nav>
    <router-view />
  </div>
  
  <!-- <div id="app">
    <Login v-if="!isAuthenticated" @login-success="handleLoginSuccess" />
    <Dashboard v-else :usuario="currentUser" @logout="handleLogout" />
  </div> -->
</template>

<script setup>
import { ref, onMounted } from 'vue'
import authService from './services/authService'
import { useRouter } from 'vue-router'

const opciones = [
  { label: "Camión", value: "truck" },
  { label: "Bus", value: "bus" },
  { label: "Van", value: "van" },
]

const seleccionado = ref(null)


const isAuthenticated = ref(false)
const currentUser = ref(null)
const router = useRouter();

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

const handleLogout = () => {
  authService.logout()
  currentUser.value = null
  isAuthenticated.value = false
  router.push('Login')
}
</script>

<style>
.dashboard-container {
  min-height: 100vh;
  background: #f5f5f5;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.navbar-brand h2 {
  margin: 0;
  font-size: 1.5rem;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: 20px;
}

.user-info {
  display: flex;
  flex-direction: column;
  text-align: right;
}

.user-info span {
  font-weight: 600;
}

.user-info small {
  font-size: 0.85rem;
  opacity: 0.9;
}

.btn-logout {
  padding: 8px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
}

@media (max-width: 768px) {
  .navbar {
    flex-direction: column;
    gap: 15px;
  }

  .navbar-menu {
    width: 100%;
    justify-content: space-between;
  }

  .dashboard-content {
    padding: 15px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .welcome-section h1 {
    font-size: 1.5rem;
  }
}

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
