<template>
  <div class="dashboard-wrapper">
    <div class="dashboard-content">
      <!-- Welcome Section -->
      <div class="welcome-section">
        <div class="welcome-text">
          <h1>Bienvenido, <span class="highlight">{{ usuario?.Nombres }}</span></h1>
          <p>Gestiona tus préstamos y materiales desde el panel de control</p>
        </div>
        <div class="welcome-date">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <line x1="16" x2="16" y1="2" y2="6"/>
            <line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/>
          </svg>
          <span>{{ fechaActual }}</span>
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        <router-link to="/productos-asignados" class="stat-card stat-materials">
          <div class="stat-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
              <path d="m3.3 7 8.7 5 8.7-5"/>
              <path d="M12 22V12"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Materiales Asignados</span>
            <span class="stat-value">Ver listado</span>
          </div>
          <div class="stat-arrow">→</div>
        </router-link>

        <router-link to="/prestamos" class="stat-card stat-loans">
          <div class="stat-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Préstamos Realizados</span>
            <span class="stat-value">Gestionar</span>
          </div>
          <div class="stat-arrow">→</div>
        </router-link>

        <router-link to="/prestamos-recibidos" class="stat-card stat-received">
          <div class="stat-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 3v12"/>
              <path d="m8 11 4 4 4-4"/>
              <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Préstamos Recibidos</span>
            <span class="stat-value">Revisar</span>
          </div>
          <div class="stat-arrow">→</div>
        </router-link>

        <div class="stat-card stat-reports">
          <div class="stat-icon-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 3v18h18"/>
              <path d="m19 9-5 5-4-4-3 3"/>
            </svg>
          </div>
          <div class="stat-info">
            <span class="stat-label">Reportes</span>
            <span class="stat-value">Próximamente</span>
          </div>
          <div class="stat-arrow">→</div>
        </div>
      </div>

      <!-- User Info Section -->
      <div class="info-section">
        <div class="section-header">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
          <h2>Información del Trabajador</h2>
        </div>
        <div class="info-grid">
          <div class="info-item">
            <label>ID de Usuario</label>
            <p>{{ usuario?.IdUser || '---' }}</p>
          </div>
          <div class="info-item">
            <label>Correo Electrónico</label>
            <p>{{ usuario?.Email || '---' }}</p>
          </div>
          <div class="info-item">
            <label>Área</label>
            <p>{{ usuario?.Area || '---' }}</p>
          </div>
          <div class="info-item">
            <label>Rol</label>
            <p>{{ usuario?.Rolname || '---' }}</p>
          </div>
          <div class="info-item">
            <label>Empresa</label>
            <p>{{ usuario?.EmpresaName || '---' }}</p>
          </div>
          <div class="info-item">
            <label>Permisos Logística</label>
            <p :class="usuario?.HasPermisoLogistica ? 'status-active' : 'status-inactive'">
              {{ usuario?.HasPermisoLogistica ? 'Habilitado' : 'No habilitado' }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'

const usuario = ref();

const fechaActual = computed(() => {
  const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const fecha = new Date().toLocaleDateString('es-PE', opciones);
  return fecha.charAt(0).toUpperCase() + fecha.slice(1);
});

onMounted(() => {  
  usuario.value = JSON.parse(localStorage.getItem('user'));
});
</script>

<style scoped>
/* ===== Layout Principal ===== */
.dashboard-wrapper {
  min-height: calc(100vh - 74px);
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 32px;
}

.dashboard-content {
  max-width: 1400px;
  margin: 0 auto;
}

/* ===== Welcome Section ===== */
.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  flex-wrap: wrap;
  gap: 16px;
}

.welcome-text h1 {
  color: #0f172a;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 8px 0;
  letter-spacing: -0.5px;
}

.welcome-text h1 .highlight {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.welcome-text p {
  color: #64748b;
  font-size: 1.05rem;
  margin: 0;
}

.welcome-date {
  display: flex;
  align-items: center;
  gap: 10px;
  background: white;
  padding: 12px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  color: #475569;
  font-weight: 500;
}

.welcome-date svg {
  width: 20px;
  height: 20px;
  color: #3b82f6;
}

/* ===== Stats Grid ===== */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  cursor: pointer;
  text-decoration: none;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  border-radius: 4px 0 0 4px;
}

.stat-materials::before { background: linear-gradient(180deg, #3b82f6, #1d4ed8); }
.stat-loans::before { background: linear-gradient(180deg, #8b5cf6, #6d28d9); }
.stat-received::before { background: linear-gradient(180deg, #10b981, #059669); }
.stat-reports::before { background: linear-gradient(180deg, #f59e0b, #d97706); }

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
}

.stat-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-materials .stat-icon-wrapper { background: linear-gradient(135deg, #dbeafe, #bfdbfe); }
.stat-loans .stat-icon-wrapper { background: linear-gradient(135deg, #ede9fe, #ddd6fe); }
.stat-received .stat-icon-wrapper { background: linear-gradient(135deg, #d1fae5, #a7f3d0); }
.stat-reports .stat-icon-wrapper { background: linear-gradient(135deg, #fef3c7, #fde68a); }

.stat-icon-wrapper svg {
  width: 28px;
  height: 28px;
}

.stat-materials .stat-icon-wrapper svg { color: #1d4ed8; }
.stat-loans .stat-icon-wrapper svg { color: #6d28d9; }
.stat-received .stat-icon-wrapper svg { color: #059669; }
.stat-reports .stat-icon-wrapper svg { color: #d97706; }

.stat-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #0f172a;
}

.stat-arrow {
  font-size: 1.5rem;
  color: #cbd5e1;
  transition: all 0.3s ease;
}

.stat-card:hover .stat-arrow {
  color: #3b82f6;
  transform: translateX(4px);
}

/* ===== Info Section ===== */
.info-section {
  background: white;
  border-radius: 16px;
  padding: 28px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.04);
}

.section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e2e8f0;
}

.section-header svg {
  width: 24px;
  height: 24px;
  color: #3b82f6;
}

.section-header h2 {
  color: #0f172a;
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  padding: 16px 20px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.info-item:hover {
  border-color: #cbd5e1;
  background: #f1f5f9;
}

.info-item label {
  display: block;
  font-weight: 600;
  color: #64748b;
  font-size: 0.75rem;
  margin-bottom: 6px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item p {
  margin: 0;
  color: #1e293b;
  font-size: 1rem;
  font-weight: 500;
}

.status-active {
  color: #059669 !important;
  font-weight: 600;
}

.status-inactive {
  color: #dc2626 !important;
  font-weight: 600;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .dashboard-wrapper {
    padding: 20px 16px;
  }

  .welcome-section {
    flex-direction: column;
  }

  .welcome-text h1 {
    font-size: 1.5rem;
  }

  .welcome-date {
    width: 100%;
    justify-content: center;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stat-card {
    padding: 20px;
  }

  .info-section {
    padding: 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
