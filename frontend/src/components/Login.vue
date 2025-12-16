<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <h1>🚗 Préstamos Transporte</h1>
        <p>Sistema de Gestión</p>
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

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import authService from '../services/authService'

export default {
  name: 'Login',
  emits: ['login-success'],
  setup(props, { emit }) {
    const router = useRouter()
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
        const response = await authService.login(
          form.value.email,
          form.value.password
        )

        if (response.data.success) {
          // Guardar token y usuario
          authService.saveSession(
            response.data.data.Token,
            response.data.data
          )

          // Emitir evento de éxito
          router.push('/dashboard')

          // Limpiar formulario
          form.value = {
            email: '',
            password: ''
          }
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

    return {
      form,
      loading,
      error,
      handleLogin
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.login-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
  padding: 40px;
}

.login-header {
  text-align: center;
  margin-bottom: 30px;
}

.login-header h1 {
  color: #333;
  font-size: 1.8rem;
  margin: 0 0 5px 0;
}

.login-header p {
  color: #666;
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
  color: #333;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.form-group input {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.btn-login {
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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
  box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
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
  color: #666;
  font-size: 0.9rem;
}

.login-footer a {
  color: #667eea;
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
