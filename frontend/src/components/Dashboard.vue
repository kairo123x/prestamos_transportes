<template>
  <div class="dashboard-container">
    <nav class="navbar">
      <div class="navbar-brand">
        <h2>🚗 Préstamos Transporte</h2>
      </div>
      <div class="navbar-menu">
        <div class="user-info">
          <span>{{ usuario.Nombres }} {{ usuario.Apellidos }}</span>
          <small>{{ usuario.Rolname }}</small>
        </div>
        <button @click="handleLogout" class="btn-logout">
          Cerrar Sesión
        </button>
      </div>
    </nav>

    <div class="dashboard-content">
      <div class="welcome-section">
        <h1>Bienvenido, {{ usuario.Nombres }}</h1>
        <p>Gestiona tus préstamos y pagos desde aquí</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📋</div>
          <div class="stat-info">
            <h3>Préstamos Activos</h3>
            <p class="stat-number">0</p>
            <small>Haz clic para ver detalles</small>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💰</div>
          <div class="stat-info">
            <h3>Total a Pagar</h3>
            <p class="stat-number">S/. 0.00</p>
            <small>Saldo pendiente</small>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">✓</div>
          <div class="stat-info">
            <h3>Pagos Realizados</h3>
            <p class="stat-number">0</p>
            <small>Este período</small>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <h3>Reportes</h3>
            <p class="stat-number">→</p>
            <small>Ver análisis completo</small>
          </div>
        </div>
      </div>

      <div class="info-section">
        <h2>Datos del Trabajador</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>ID de Usuario</label>
            <p>{{ usuario.IdUser }}</p>
          </div>
          <div class="info-item">
            <label>Email</label>
            <p>{{ usuario.Email }}</p>
          </div>
          <div class="info-item">
            <label>Área</label>
            <p>{{ usuario.Area }}</p>
          </div>
          <div class="info-item">
            <label>Rol</label>
            <p>{{ usuario.Rolname }}</p>
          </div>
          <div class="info-item">
            <label>Empresa</label>
            <p>{{ usuario.EmpresaName }}</p>
          </div>
          <div class="info-item">
            <label>Permisos Logística</label>
            <p :class="usuario.HasPermisoLogistica ? 'status-active' : 'status-inactive'">
              {{ usuario.HasPermisoLogistica ? 'Sí' : 'No' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  props: {
    usuario: {
      type: Object,
      required: true
    }
  },
  emits: ['logout'],
  setup(props, { emit }) {
    const handleLogout = () => {
      emit('logout')
    }

    const formatDate = (date) => {
      if (!date) return 'N/A'
      return new Date(date).toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    return {
      handleLogout,
      formatDate
    }
  }
}
</script>

<style scoped>
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

.dashboard-content {
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  margin-bottom: 40px;
}

.welcome-section h1 {
  color: #333;
  font-size: 2rem;
  margin: 0 0 10px 0;
}

.welcome-section p {
  color: #666;
  font-size: 1.1rem;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: white;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  gap: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.12);
}

.stat-icon {
  font-size: 2.5rem;
  display: flex;
  align-items: center;
}

.stat-info {
  flex: 1;
}

.stat-info h3 {
  margin: 0 0 5px 0;
  color: #333;
  font-size: 0.95rem;
}

.stat-number {
  margin: 5px 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #667eea;
}

.stat-info small {
  color: #999;
  font-size: 0.85rem;
}

.info-section {
  background: white;
  border-radius: 10px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.info-section h2 {
  color: #333;
  margin-top: 0;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  padding: 15px;
  background: #f9f9f9;
  border-radius: 6px;
}

.info-item label {
  display: block;
  font-weight: 600;
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 5px;
  text-transform: uppercase;
}

.info-item p {
  margin: 0;
  color: #333;
  font-size: 1rem;
}

.status-active {
  color: #10b981;
  font-weight: 600;
}

.status-inactive {
  color: #ef4444;
  font-weight: 600;
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
</style>
