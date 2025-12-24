<template>
  <div class="login-wrapper">
    <!-- Panel Izquierdo - Imagen/Branding -->
    <div class="login-left">
      <div class="brand-overlay">
        <div class="brand-content">
          <div class="brand-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
              <path d="M19 17a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
              <path d="M13 6h5l3 5v6h-2"/>
              <path d="M5 17H3V6a1 1 0 0 1 1-1h9v12"/>
            </svg>
          </div>
          <h1 class="brand-title">Gestión de Préstamos</h1>
          <p class="brand-subtitle">Sistema de Control de Materiales y Préstamos para Transporte</p>
          <div class="brand-features">
            <div class="feature-item">
              <span class="feature-icon">✓</span>
              <span>Control de materiales asignados</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✓</span>
              <span>Gestión de préstamos en tiempo real</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">✓</span>
              <span>Seguimiento de entregas y recepciones</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Panel Derecho - Formulario -->
    <div class="login-right">
      <div class="login-card">
        <div class="login-header">
          <h2>Bienvenido</h2>
          <p>Ingresa tus credenciales para acceder al sistema</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="email">Correo electrónico</label>
            <div class="input-wrapper">
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              <input
                id="email"
                v-model="form.email"
                type="text"
                placeholder="correo@empresa.com"
                required
                :disabled="loading"
              />
            </div>
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <div class="input-wrapper">
              <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              <input
                id="password"
                v-model="form.password"
                type="password"
                placeholder="••••••••"
                required
                :disabled="loading"
              />
            </div>
          </div>

          <div class="form-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" />
              <span>Recordar sesión</span>
            </label>
            <a href="#" class="forgot-link">¿Olvidaste tu contraseña?</a>
          </div>

          <button
            type="submit"
            class="btn-login"
            :disabled="loading"
          >
            <span v-if="!loading">Iniciar Sesión</span>
            <span v-else class="loading-state">
              <svg class="spinner" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="32" stroke-linecap="round"/>
              </svg>
              Ingresando...
            </span>
          </button>
        </form>

        <div v-if="error" class="error-message">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <p>{{ error }}</p>
        </div>

        <div class="login-footer">
          <p>© 2024 Sistema de Gestión de Préstamos - Transporte</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// defineEmits reemplaza a emits en script setup
const emit = defineEmits(['login-success'])

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  email: '',
  password: ''
})
const loading = ref(false)
const error = ref('')
const rememberMe = ref(false)

const handleLogin = async () => {
  error.value = ''
  loading.value = true

  try {
    // Validar campos
    if (!form.value.email || !form.value.password) {
      error.value = 'Por favor completa todos los campos'
      loading.value = false
      return
    }

    // Llamar al API de login
    const response = await auth.login(
      form.value.email,
      form.value.password
    )

    if (response.data.success) {
      // Redirigir
      router.push('/dashboard')

      // Limpiar formulario
      form.value = { email: '', password: '' }
    }
  } catch (err) {
    console.error('Error de login:', err)
    if (err.response?.status === 401) {
      error.value = 'Credenciales inválidas. Verifica tu email y contraseña'
    } else if (err.response?.status === 400) {
      error.value = 'Por favor completa todos los campos'
    } else {
      error.value = 'Error en la conexión con el servidor'
    }
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* ===== Layout Principal ===== */
.login-wrapper {
  min-height: 100vh;
  display: flex;
  background: #f8fafc;
}

/* ===== Panel Izquierdo - Branding ===== */
.login-left {
  flex: 1;
  background: linear-gradient(135deg, #0f172a 0%, #1e3a5f 50%, #1e40af 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.login-left::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 50%);
  animation: pulse 15s ease-in-out infinite;
}

.login-left::after {
  content: '';
  position: absolute;
  bottom: -30%;
  right: -30%;
  width: 80%;
  height: 80%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.2) 0%, transparent 50%);
  animation: pulse 12s ease-in-out infinite reverse;
}

@keyframes pulse {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.1) rotate(5deg); }
}

.brand-overlay {
  position: relative;
  z-index: 1;
  padding: 60px;
  max-width: 520px;
}

.brand-content {
  color: white;
}

.brand-icon {
  width: 80px;
  height: 80px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.brand-icon svg {
  width: 44px;
  height: 44px;
  color: #60a5fa;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin: 0 0 16px 0;
  line-height: 1.2;
  letter-spacing: -0.5px;
}

.brand-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.75);
  margin: 0 0 40px 0;
  line-height: 1.6;
}

.brand-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
}

.feature-icon {
  width: 24px;
  height: 24px;
  background: rgba(34, 197, 94, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  color: #4ade80;
  flex-shrink: 0;
}

/* ===== Panel Derecho - Formulario ===== */
.login-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background: #ffffff;
}

.login-card {
  width: 100%;
  max-width: 420px;
}

.login-header {
  margin-bottom: 36px;
}

.login-header h2 {
  color: #0f172a;
  font-size: 2rem;
  margin: 0 0 8px 0;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.login-header p {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

/* ===== Formulario ===== */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
  font-size: 0.9rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 14px;
  width: 20px;
  height: 20px;
  color: #94a3b8;
  pointer-events: none;
  transition: color 0.2s;
}

.input-wrapper input {
  width: 100%;
  padding: 14px 14px 14px 48px;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s;
  background: #f8fafc;
}

.input-wrapper input:hover {
  border-color: #cbd5e1;
}

.input-wrapper input:focus {
  outline: none;
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.input-wrapper input:focus + .input-icon,
.input-wrapper:focus-within .input-icon {
  color: #3b82f6;
}

.input-wrapper input:disabled {
  background-color: #f1f5f9;
  cursor: not-allowed;
  opacity: 0.7;
}

.input-wrapper input::placeholder {
  color: #94a3b8;
}

/* ===== Opciones del formulario ===== */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -8px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #475569;
}

.remember-me input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: #3b82f6;
  cursor: pointer;
}

.forgot-link {
  font-size: 0.9rem;
  color: #3b82f6;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.forgot-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}

/* ===== Botón Login ===== */
.btn-login {
  padding: 16px 24px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  margin-top: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.35);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-state {
  display: flex;
  align-items: center;
  gap: 10px;
}

.spinner {
  width: 20px;
  height: 20px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* ===== Mensaje de Error ===== */
.error-message {
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
  border: 1px solid #fecaca;
  color: #dc2626;
  padding: 14px 16px;
  border-radius: 12px;
  font-size: 0.9rem;
  margin-top: 16px;
}

.error-message svg {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.error-message p {
  margin: 0;
  flex: 1;
}

/* ===== Footer ===== */
.login-footer {
  text-align: center;
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.login-footer p {
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
}

/* ===== Responsive ===== */
@media (max-width: 1024px) {
  .login-left {
    display: none;
  }
  
  .login-right {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .login-right {
    padding: 24px;
  }
  
  .login-header h2 {
    font-size: 1.75rem;
  }
  
  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  
  .input-wrapper input {
    padding: 12px 12px 12px 44px;
  }
}
</style>
