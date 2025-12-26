<template>
  <div v-if="auth.isAuthenticated" class="dashboard-container">
    <!-- Overlay cuando está abierto el sidebar -->
    <div v-if="showMenu" class="sidebar-overlay" @click="closeMenu"></div>
    
    <!-- Navbar -->
    <nav class="navbar">
      <div class="navbar-left">
        <button 
          @click="toggleMenu" 
          class="btn-burger"
          :class="{ active: showMenu }"
          title="Menú de navegación"
        >
          ☰
        </button>
        <router-link to="/dashboard" class="navbar-brand">
          <h2>Gestión de Préstamos - Transporte</h2>
        </router-link>
      </div>
      <div class="navbar-right">
        <div class="user-info">
          <span class="user-name">{{ auth.currentUser?.Nombres }} {{ auth.currentUser?.Apellidos }}</span>
          <small class="user-role">{{ auth.currentUser?.Rolname }}</small>
        </div>
        <button @click="handleLogout" class="btn-logout" title="Cerrar sesión">
          Cerrar sesión
        </button>
      </div>
    </nav>

    <!-- Sidebar -->
    <aside class="sidebar" :class="{ active: showMenu }">
      <div class="sidebar-header">
        <h3>Menú principal</h3>
        <button class="btn-close-sidebar" @click="closeMenu">✕</button>
      </div>
      
      <nav class="sidebar-nav">
        <!-- <router-link 
          to="/dashboard" 
          @click="closeMenu" 
          class="sidebar-link"
          active-class="active"
        >
          <span class="icon">📊</span>
          <span class="label">Dashboard</span>
        </router-link>
        
        <router-link 
          to="/reportes" 
          @click="closeMenu" 
          class="sidebar-link"
          active-class="active"
        >
          <span class="icon">📈</span>
          <span class="label">Reportes</span>
        </router-link>
        
        <router-link 
          to="/usuarios" 
          @click="closeMenu" 
          class="sidebar-link"
          active-class="active"
        >
          <span class="icon">👥</span>
          <span class="label">Usuarios</span>
        </router-link> -->

        <router-link 
          to="/productos-asignados" 
          @click="closeMenu" 
          class="sidebar-link"
          active-class="active"
        >
          <span class="icon">▢</span>
          <span class="label">Materiales asignados</span>
        </router-link>

        <router-link 
          to="/prestamos" 
          @click="closeMenu" 
          class="sidebar-link"
          active-class="active"
        >
          <span class="icon">⇄</span>
          <span class="label">Préstamos realizados</span>
        </router-link>

        <router-link 
          to="/prestamos-recibidos" 
          @click="closeMenu" 
          class="sidebar-link"
          active-class="active"
        >
          <span class="icon">↧</span>
          <span class="label">Préstamos recibidos</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <button @click="handleLogout" class="btn-logout-sidebar">
          <span class="icon">⎋</span>
          <span class="label">Cerrar sesión</span>
        </button>
      </div>
    </aside>

    <router-view />
  </div>
  <div v-else>
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const auth = useAuthStore()
const showMenu = ref(false)
const router = useRouter()

onMounted(() => {
  console.log(auth.currentUser);
  
})

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const closeMenu = () => {
  showMenu.value = false
}

const handleLogout = async () => {
  auth.logout();
  showMenu.value = false;
  await router.push('/login');
  window.location.reload();
}
</script>

<style>
/* Importar variables CSS globales */
@import './assets/styles/variables.css';

/* ===== ESTILOS BASE GLOBALES ===== */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  font-size: var(--font-size-base);
  line-height: 1.6;
  color: var(--color-gray-700);
  background: var(--color-gray-100);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}

.dashboard-container {
  min-height: 100vh;
  background: var(--color-gray-100);
  display: flex;
  flex-direction: column;
}

/* Navbar */
.navbar {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: var(--color-white);
  padding: var(--spacing-md) var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 100;
  flex-wrap: wrap;
  gap: 15px;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 0 1 auto;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 0 1 auto;
}

.navbar-brand {
  text-decoration: none;
  color: inherit;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.navbar-brand:hover {
  opacity: 0.9;
}

.navbar-brand h2 {
  margin: 0;
  font-size: 1.3rem;
  white-space: nowrap;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.user-info {
  display: flex;
  flex-direction: column;
  text-align: right;
  min-width: 150px;
}

.user-name {
  font-weight: 700;
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-role {
  font-size: 0.8rem;
  opacity: 0.85;
  margin-top: 2px;
}

.btn-burger {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 1.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  height: 44px;
}

.btn-burger:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: scale(1.05);
}

.btn-burger.active {
  background: rgba(255, 255, 255, 0.4);
}

.btn-logout {
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-size: 0.95rem;
}

.btn-logout:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Overlay */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 280px;
  height: 100vh;
  background: linear-gradient(180deg, #1f2937 0%, #111827 60%, #020617 100%);
  color: white;
  z-index: 101;
  display: flex;
  flex-direction: column;
  transform: translateX(-100%);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.3);
}

.sidebar.active {
  transform: translateX(0);
}

.sidebar-header {
  padding: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h3 {
  margin: 0;
  font-size: 1.2rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.btn-close-sidebar {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 4px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.btn-close-sidebar:hover {
  background: rgba(255, 255, 255, 0.2);
}

.sidebar-nav {
  flex: 1;
  padding: 20px 0;
  overflow-y: auto;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  font-weight: 500;
}

.sidebar-link:hover {
  background: rgba(255, 255, 255, 0.08);
  color: white;
  padding-left: 24px;
  border-left-color: #667eea;
}

.sidebar-link.active {
  background: rgba(102, 126, 234, 0.15);
  color: #a5b4fc;
  border-left-color: #667eea;
  padding-left: 24px;
}

.sidebar-link .icon {
  font-size: 1.3rem;
  min-width: 24px;
  display: flex;
  align-items: center;
}

.sidebar-link .label {
  flex: 1;
  font-size: 0.95rem;
}

.sidebar-footer {
  padding: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.btn-logout-sidebar {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.btn-logout-sidebar:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.btn-logout-sidebar .icon {
  font-size: 1.2rem;
  min-width: 24px;
  display: flex;
  align-items: center;
}

.btn-logout-sidebar .label {
  flex: 1;
  text-align: left;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .navbar {
    padding: 12px 15px;
    gap: 12px;
  }

  .navbar-brand h2 {
    font-size: 1.2rem;
  }

  .user-info {
    min-width: 140px;
  }

  .user-name {
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .navbar {
    padding: 12px 12px;
    gap: 10px;
  }

  .navbar-left {
    flex: 1 0 auto;
    order: 1;
  }

  .navbar-right {
    flex: 0 1 auto;
    order: 2;
  }

  .navbar-brand h2 {
    font-size: 1.1rem;
  }

  .user-info {
    flex: 1;
    text-align: left;
    min-width: unset;
  }

  .user-name {
    font-size: 0.9rem;
  }

  .user-role {
    font-size: 0.75rem;
  }

  .btn-logout {
    font-size: 0.85rem;
    padding: 8px 12px;
  }

  .sidebar {
    width: 260px;
  }

  .sidebar-header {
    padding: 16px;
  }

  .sidebar-header h3 {
    font-size: 1.1rem;
  }

  .sidebar-link {
    padding: 12px 16px;
  }

  .sidebar-link:hover {
    padding-left: 20px;
  }

  .sidebar-link.active {
    padding-left: 20px;
  }

  .sidebar-nav {
    padding: 16px 0;
  }

  .sidebar-footer {
    padding: 16px;
  }
}

@media (max-width: 480px) {
  .navbar {
    padding: 10px 10px;
    gap: 8px;
  }

  .navbar-left {
    gap: 10px;
  }

  .navbar-right {
    width: 100%;
  }

  .navbar-brand h2 {
    font-size: 0.95rem;
  }

  .btn-burger {
    min-width: 40px;
    height: 40px;
    padding: 8px;
  }

  .user-info {
    min-width: 80px;
  }

  .user-name {
    font-size: 0.8rem;
  }

  .user-role {
    font-size: 0.7rem;
  }

  .btn-logout {
    font-size: 0.75rem;
    padding: 8px 10px;
  }

  .sidebar {
    width: 240px;
  }

  .sidebar-header {
    padding: 14px;
  }

  .sidebar-header h3 {
    font-size: 1rem;
  }

  .btn-close-sidebar {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }

  .sidebar-link {
    padding: 10px 14px;
    font-size: 0.9rem;
    gap: 10px;
  }

  .sidebar-link .icon {
    font-size: 1.1rem;
  }

  .btn-logout-sidebar {
    font-size: 0.85rem;
    padding: 10px 12px;
    gap: 10px;
  }

  .btn-logout-sidebar .icon {
    font-size: 1rem;
  }
}

/* ===== Element Plus MessageBox Custom Styles ===== */
.el-message-box {
  width: 480px !important;
  max-width: 92vw !important;
  border-radius: var(--border-radius-xl) !important;
  overflow: hidden !important;
  box-shadow: var(--shadow-xl) !important;
  border: none !important;
  font-family: var(--font-family) !important;
}

.el-message-box__header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%) !important;
  padding: var(--spacing-lg) var(--spacing-xl) !important;
  border-bottom: none !important;
}

.el-message-box__title {
  color: var(--color-white) !important;
  font-size: var(--font-size-xl) !important;
  font-weight: 700 !important;
  font-family: var(--font-family) !important;
  letter-spacing: 0.3px !important;
}

.el-message-box__headerbtn {
  top: 20px !important;
  right: 20px !important;
  width: 36px !important;
  height: 36px !important;
  background: rgba(255, 255, 255, 0.15) !important;
  border-radius: var(--border-radius-sm) !important;
  transition: all 0.2s ease !important;
}

.el-message-box__headerbtn:hover {
  background: rgba(255, 255, 255, 0.25) !important;
}

.el-message-box__headerbtn .el-message-box__close {
  color: var(--color-white) !important;
  font-size: 18px !important;
}

.el-message-box__content {
  padding: var(--spacing-xl) !important;
  background: var(--color-gray-50) !important;
}

.el-message-box__message {
  font-size: var(--font-size-lg) !important;
  color: var(--color-primary) !important;
  line-height: 1.7 !important;
  font-family: var(--font-family) !important;
}

.el-message-box__message p {
  margin: 0 !important;
}

.el-message-box__status {
  font-size: 32px !important;
}

.el-message-box__status.el-message-box-icon--warning {
  color: var(--color-accent) !important;
}

.el-message-box__status.el-message-box-icon--success {
  color: var(--color-success) !important;
}

.el-message-box__status.el-message-box-icon--error {
  color: var(--color-error) !important;
}

.el-message-box__status.el-message-box-icon--info {
  color: var(--color-primary-light) !important;
}

.el-message-box__btns {
  padding: var(--spacing-lg) var(--spacing-xl) var(--spacing-xl) !important;
  background: var(--color-gray-50) !important;
  display: flex !important;
  justify-content: flex-end !important;
  gap: var(--spacing-md) !important;
}

.el-message-box__btns .el-button {
  padding: 14px 28px !important;
  border-radius: var(--border-radius-md) !important;
  font-size: var(--font-size-base) !important;
  font-weight: 600 !important;
  font-family: var(--font-family) !important;
  transition: all 0.2s ease !important;
  min-width: 120px !important;
}

.el-message-box__btns .el-button--default {
  background: var(--color-white) !important;
  border: 2px solid var(--color-gray-200) !important;
  color: var(--color-gray-600) !important;
}

.el-message-box__btns .el-button--default:hover {
  background: var(--color-gray-100) !important;
  border-color: var(--color-gray-300) !important;
}

.el-message-box__btns .el-button--primary {
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-dark) 100%) !important;
  border: none !important;
  color: var(--color-primary) !important;
  font-weight: 700 !important;
  box-shadow: 0 4px 14px rgba(255, 205, 0, 0.4) !important;
}

.el-message-box__btns .el-button--primary:hover {
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 22px rgba(255, 205, 0, 0.5) !important;
}

/* ===== Element Plus Message (Toast) Custom Styles ===== */
.el-message {
  min-width: 380px !important;
  padding: 18px 24px !important;
  border-radius: var(--border-radius-md) !important;
  box-shadow: var(--shadow-lg) !important;
  border: none !important;
  font-family: var(--font-family) !important;
}

.el-message__content {
  font-size: var(--font-size-base) !important;
  font-weight: 500 !important;
  color: var(--color-primary) !important;
  line-height: 1.6 !important;
}

.el-message--success {
  background: linear-gradient(135deg, var(--color-success-light) 0%, #a7f3d0 100%) !important;
}

.el-message--success .el-message__icon {
  color: var(--color-success) !important;
  font-size: 24px !important;
}

.el-message--warning {
  background: linear-gradient(135deg, var(--color-warning-light) 0%, #fde68a 100%) !important;
}

.el-message--warning .el-message__icon {
  color: var(--color-accent) !important;
  font-size: 24px !important;
}

.el-message--error {
  background: linear-gradient(135deg, var(--color-error-light) 0%, #fecaca 100%) !important;
}

.el-message--error .el-message__icon {
  color: var(--color-error) !important;
  font-size: 24px !important;
}

.el-message--info {
  background: linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-gray-200) 100%) !important;
}

.el-message--info .el-message__icon {
  color: var(--color-primary-light) !important;
  font-size: 24px !important;
}

/* ===== Element Plus Input Number in MessageBox ===== */
.el-message-box .el-input-number {
  width: 100% !important;
}

.el-message-box .el-input-number .el-input__wrapper {
  border-radius: var(--border-radius-md) !important;
  padding: 12px 16px !important;
  box-shadow: var(--shadow-sm) !important;
  border: 2px solid var(--color-gray-200) !important;
  font-size: var(--font-size-lg) !important;
}

.el-message-box .el-input-number .el-input__wrapper:hover {
  border-color: var(--color-accent) !important;
}

.el-message-box .el-input-number .el-input.is-focus .el-input__wrapper {
  border-color: var(--color-accent) !important;
  box-shadow: 0 0 0 4px rgba(245, 169, 107, 0.2) !important;
}

.el-message-box .el-input-number .el-input__inner {
  font-size: var(--font-size-xl) !important;
  font-weight: 600 !important;
}

/* ===== Overlay ===== */
.el-overlay {
  background: rgba(45, 58, 79, 0.6) !important;
  backdrop-filter: blur(6px) !important;
}
</style>
