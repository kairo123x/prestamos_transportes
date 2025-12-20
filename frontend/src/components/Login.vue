<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>Gestión de Préstamos - Transporte</h1>
        <p>Acceda al sistema con sus credenciales corporativas</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="text"
            placeholder="correo@example.com"
            required
            :disabled="loading"
          />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input
            id="password"
            v-model="form.password"
            type="password"
            placeholder="Ingresa tu contraseña"
            required
            :disabled="loading"
          />
        </div>

        <button
          type="submit"
          class="btn-login"
          :disabled="loading"
        >
          <span v-if="!loading">Iniciar Sesión</span>
          <span v-else>Cargando...</span>
        </button>
      </form>

      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
      </div>

      <div class="login-footer">
        <p>¿Olvidaste tu contraseña? <a href="#">Recuperar</a></p>
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
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: radial-gradient(circle at top left, #e5edff 0, #dbeafe 30%, #c7d2fe 60%, #bfdbfe 100%);
}

.login-card {
  background: #f9fafb;
  border-radius: 16px;
  box-shadow: 0 18px 45px rgba(15, 23, 42, 0.55);
  width: 100%;
  max-width: 420px;
  padding: 36px 32px;
  border: 1px solid rgba(148, 163, 184, 0.4);
}

.login-header {
  text-align: center;
  margin-bottom: 28px;
}

.login-header h1 {
  color: #0f172a;
  font-size: 1.6rem;
  margin: 0 0 6px 0;
  font-weight: 600;
}

.login-header p {
  color: #6b7280;
  font-size: 0.95rem;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  font-weight: 600;
  color: #111827;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-group input {
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #2563eb;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.btn-login {
  padding: 12px;
  background: linear-gradient(135deg, #1d4ed8 0%, #0b3b73 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  margin-top: 10px;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 20px rgba(37, 99, 235, 0.4);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  background-color: #fef2f2;
  border: 1px solid #fecaca;
  color: #b91c1c;
  padding: 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
}

.error-message p {
  margin: 0;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  color: #6b7280;
  font-size: 0.9rem;
}

.login-footer a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}

.login-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .login-header h1 {
    font-size: 1.5rem;
  }
}
</style>
