<template>
  <div class="view-wrapper">
    <div class="view-container">
      <!-- Header Section -->
      <header class="view-header">
        <div class="header-content">
          <div class="header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 3v12"/>
              <path d="m8 11 4 4 4-4"/>
              <path d="M8 5H4a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-4"/>
            </svg>
          </div>
          <div class="header-text">
            <h1>Préstamos Recibidos</h1>
            <p>Revise y apruebe la recepción de materiales prestados por otros colaboradores</p>
          </div>
        </div>
      </header>

      <!-- Table Card -->
      <section class="table-card">
        <div class="table-card-header">
          <h3>Listado de préstamos recibidos</h3>
          <span class="record-count">{{ prestamos.length }} registros</span>
        </div>
        <div class="table-card-body">
          <!-- Loading Skeleton -->
          <div v-if="isLoading" class="loading-skeleton">
            <div class="skeleton-row" v-for="n in 5" :key="n">
              <div class="skeleton-cell skeleton-nombre"></div>
              <div class="skeleton-cell skeleton-nombre"></div>
              <div class="skeleton-cell skeleton-tipo"></div>
              <div class="skeleton-cell skeleton-codigo"></div>
              <div class="skeleton-cell skeleton-desc"></div>
              <div class="skeleton-cell skeleton-cantidad"></div>
              <div class="skeleton-cell skeleton-estado"></div>
              <div class="skeleton-cell skeleton-acciones"></div>
            </div>
          </div>

          <el-table
            v-else
            :data="prestamos"
            style="width: 100%"
            :header-cell-style="{
              backgroundColor: '#059669',
              color: 'white',
              fontWeight: '600',
              fontSize: '12px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              padding: '16px 12px'
            }"
            :cell-style="{ 
              color: '#334155', 
              fontSize: '14px',
              padding: '16px 12px'
            }"
            :row-class-name="tableRowClassName"
            class="custom-table"
          >
            <el-table-column prop="nombrePrestador" label="Prestador" width="150">
              <template #default="scope">
                <div class="dni-cell">
                  <span>{{ scope.row.nombrePrestador }}</span>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column prop="nombreRecepcionador" label="Receptor" width="150">
              <template #default="scope">
                <div class="dni-cell receptor">
                  <span>{{ scope.row.nombreRecepcionador }}</span>
                </div>
              </template>
            </el-table-column>
            
            <!-- <el-table-column prop="codEmpresa" label="Empresa" width="100">
              <template #default="scope">
                <span class="empresa-badge">{{ scope.row.codEmpresa }}</span>
              </template>
            </el-table-column> -->
            
            <el-table-column prop="tipoProducto" label="Tipo" width="140">
              <template #default="scope">
                <span class="tipo-badge">{{ scope.row.tipoProducto }}</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="codProducto" label="Código" min-width="140">
              <template #default="scope">
                <span class="producto-code">{{ scope.row.codProducto }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="descripcionProducto" label="Descripción" min-width="140">
              <template #default="scope">
                <span>{{ scope.row.descripcionProducto }}</span>
              </template>
            </el-table-column>

            <el-table-column prop="cantidad" label="Cantidad" width="120" align="center">
              <template #default="scope">
                <span>{{ scope.row.cantidad }}</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="prestamoEstado" label="Estado" width="160" align="center">
              <template #default="scope">
                <span 
                  class="status-badge-prestamo" 
                  :class="getStatusPrestamoClass(scope.row.prestamoAprobado, scope.row.devolverPrestamo, scope.row.devolucionConfirmada)"
                >
                  {{ getStatusPrestamo(scope.row.prestamoAprobado, scope.row.devolverPrestamo, scope.row.devolucionConfirmada) }}
                </span>
              </template>
            </el-table-column>
            
            <el-table-column prop="fechaPrestamo" label="Fecha" width="150">
              <template #default="scope">
                <div class="fecha-cell">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                    <line x1="16" x2="16" y1="2" y2="6"/>
                    <line x1="8" x2="8" y1="2" y2="6"/>
                    <line x1="3" x2="21" y1="10" y2="10"/>
                  </svg>
                  <span>{{ FormatFechaCorta(scope.row.fechaPrestamo) }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="Acciones" width="180" :fixed="isMobile ? false : 'right'" align="center">
              <template #default="scope">
                <button 
                  v-if="scope.row.prestamoAprobado==false" 
                  class="btn-aprobar" 
                  @click="aprobarRecepcionPrestamo(scope.row)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Aprobar
                </button>
                <button
                  v-else-if="scope.row.prestamoAprobado==true && scope.row.devolverPrestamo==false"
                  class="btn-devolver"
                  @click="devolverPrestamo(scope.row)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  Devolver
                </button>
                <button
                  v-else-if="scope.row.prestamoAprobado==true && scope.row.devolverPrestamo==true && scope.row.devolucionConfirmada==false"
                  class="btn-devolver"
                  @click="cancelarDevolucionMaterial(scope.row)"
                >
                  Cancelar Devolución
                </button>
                <span 
                  v-else-if="scope.row.devolucionConfirmada==true" 
                  class="status-completado"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Completado
                </span>
                <span v-else class="status-en-proceso">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  En proceso
                </span>
              </template>
            </el-table-column>
          </el-table>
          <!-- Paginación -->
          <div class="pagination-container" v-if="totalPages > 1">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[5, 10, 20, 50]"
              :total="totalItems"
              layout="total, sizes, prev, pager, next, jumper"
              @current-change="loadListaPrestamos"
              @size-change="() => loadListaPrestamos(1)"
              class="pagination"
            />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { ElMessage, ElMessageBox } from "element-plus";
import {listarProductos, ListarPrestamosRecibidos, listarTrabajadores, aprobarMaterialRecibido, confirmarDevolucion, devolverMaterial, cancelarDevolucion} from "../services/prestamoService"
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { FormatFechaCorta, getStatusPrestamo, getStatusPrestamoStyle } from "../utils";

const router = useRouter()

const dniUser = ref(null);
const isMobile = ref(window.innerWidth < 768);

// Paginación
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);

// Loading
const isLoading = ref(false);

const tableRowClassName = ({ rowIndex }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row';
};

const getStatusPrestamoClass = (aprobado, devolver, confirmado) => {
  if (confirmado) return 'status-completado-badge';
  if (devolver) return 'status-devolucion-badge';
  if (aprobado) return 'status-aprobado-badge';
  return 'status-pendiente-badge';
};

const auth = useAuthStore();

onMounted(()=> {
  if(auth.currentUser==null){
    router.push({name:'Login'});
  }
  dniUser.value  = auth.currentUser.Dni;

  loadTrabajadores();
  loadListaPrestamos();
})

const devolverPrestamo = async (item) => {
  try {
    const response = await devolverMaterial(item.idPrestamo);
    if(response.data.success){
      ElMessage.success('La devolución del material fue registrada correctamente.');
      loadListaPrestamos();
    }
  } catch (error) {
    console.log('Error al devolver préstamo', error);
  }
}

const showModal = ref(false)
const editingLoan = ref(null)
const form = ref({ id: null, material: "", cantidad: 1, solicitante: "", fecha: "" })

function openModal(loan = null) {
  if (loan) {
    editingLoan.value = loan
    form.value = { ...loan }
  } else {
    editingLoan.value = null
    form.value = { id: null, material: "", cantidad: 1, solicitante: "", fecha: "" }
  }
  showModal.value = true
}

const prestamos = ref([]);

const loadListaPrestamos = async (page = 1) => {
  try {
    isLoading.value = true;
    currentPage.value = page;
    const response = await ListarPrestamosRecibidos(dniUser.value, page, pageSize.value);
    if(response.data.success){
      prestamos.value = response.data.data;
      totalItems.value = response.data.pagination?.total || 0;
      totalPages.value = response.data.pagination?.totalPages || 0;
    }
  } catch (error) {
    console.log('Error en prestamos', error);
  } finally {
    isLoading.value = false;
  }
}

const listaTrabajadores = ref([]);

const loadTrabajadores = async() => {
  try {
    const response = await listarTrabajadores();
    if(response.data.success){
      listaTrabajadores.value = response.data.data;
    }
  } catch (error) {
    console.log('Error en lista de productos', error);
  }
};

const aprobarRecepcionPrestamo = async (item) => {
  try {
    await ElMessageBox.confirm(
      `¿Confirma que desea aprobar la recepción del material correspondiente al préstamo Nº ${item.idPrestamo}?`,
      'Confirmar recepción de material',
      {
        confirmButtonText: 'Sí, aprobar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }
    );

    const data = {
      idPrestamo: item.idPrestamo
    };
    const response = await aprobarMaterialRecibido(data);
    if(response.data.success){
      ElMessage.success('La recepción del material fue aprobada correctamente y el stock ha sido actualizado.');
      loadListaPrestamos();
    }
  } catch (error) {
    console.log('Error al aprobar préstamo', error);
    ElMessage.error('Se produjo un error al aprobar la recepción del material. Intente nuevamente.');
  }
};

const cancelarDevolucionMaterial = async (item) => {
  try {
    const responseConfirmacion = await ElMessageBox.confirm(
      `¿Confirma que desea cancelar la devolución del material correspondiente al préstamo Nº ${item.idPrestamo}?`,
      'Cancelar devolución de material',
      {
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'Mantener',
        type: 'warning'
      }
    );
    console.log(item);
    
    if(responseConfirmacion){
      const response = await cancelarDevolucion(item.idPrestamo);
      if(response.data.success){
        ElMessage.success('La devolución del material ha sido cancelada correctamente.');
        loadListaPrestamos();
      }
    }
  } catch (error) {
    console.log('Error al cancelar devolución', error);
    ElMessage.error('Se produjo un error al cancelar la devolución del material. Intente nuevamente.');
  }
};
</script>

<style scoped>
/* ===== Layout Principal ===== */
.view-wrapper {
  min-height: calc(100vh - 74px);
  background: linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-gray-200) 100%);
  padding: 32px;
}

.view-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* ===== Header Section ===== */
.view-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
  flex-wrap: wrap;
  gap: 20px;
}

.header-content {
  display: flex;
  align-items: flex-start;
  gap: 20px;
}

.header-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: var(--shadow-glow-accent);
}

.header-icon svg {
  width: 28px;
  height: 28px;
  color: var(--color-primary);
}

.header-text h1 {
  color: var(--color-primary);
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

.header-text p {
  color: var(--color-gray-500);
  font-size: 0.95rem;
  margin: 0;
}

/* ===== Table Card ===== */
.table-card {
  background: var(--color-white);
  border-radius: 16px;
  box-shadow: var(--shadow-md);
  border: 1px solid rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.table-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-gray-200);
  background: linear-gradient(135deg, var(--color-gray-50), var(--color-gray-100));
}

.table-card-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-primary);
}

.record-count {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  color: var(--color-primary);
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
}

.table-card-body {
  padding: 0;
  overflow-x: auto;
}

/* ===== Custom Table Cells ===== */
.dni-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dni-cell svg {
  width: 18px;
  height: 18px;
  color: var(--color-gray-500);
}

.dni-cell.receptor svg {
  color: var(--color-accent-dark);
}

.dni-cell span {
  font-weight: 600;
  color: var(--color-primary);
}

.producto-code {
  font-weight: 600;
  color: var(--color-primary);
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  background: var(--color-gray-100);
  padding: 4px 8px;
  border-radius: 6px;
}

.tipo-badge {
  display: inline-flex;
  padding: 6px 12px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  color: var(--color-primary);
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
}

.empresa-badge {
  display: inline-flex;
  padding: 6px 12px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-dark));
  color: var(--color-white);
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 13px;
}

.status-badge svg {
  width: 14px;
  height: 14px;
}

.status-badge.approved {
  background: linear-gradient(135deg, var(--color-success-light), #a7f3d0);
  color: var(--color-success);
}

.status-badge.pending {
  background: linear-gradient(135deg, var(--color-accent-light), var(--color-accent));
  color: var(--color-primary);
}

.status-badge.returned {
  background: linear-gradient(135deg, var(--color-info-light), #bfdbfe);
  color: #1e40af;
}

.status-badge.not-returned {
  background: linear-gradient(135deg, var(--color-error-light), #fecaca);
  color: var(--color-error);
}

.fecha-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fecha-cell svg {
  width: 16px;
  height: 16px;
  color: var(--color-accent-dark);
}

.fecha-cell span {
  font-size: 13px;
  color: var(--color-gray-600);
}

.btn-aprobar {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  color: var(--color-primary);
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: var(--shadow-glow-accent);
}

.btn-aprobar svg {
  width: 16px;
  height: 16px;
}

.btn-aprobar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 205, 0, 0.5);
}

.btn-devolver {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
}

.btn-devolver svg {
  width: 16px;
  height: 16px;
}

.btn-devolver:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

/* ===== Status Badge Préstamo ===== */
.status-badge-prestamo {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.status-pendiente-badge {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
}

.status-aprobado-badge {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1e40af;
}

.status-devolucion-badge {
  background: linear-gradient(135deg, #fce7f3, #fbcfe8);
  color: #9d174d;
}

.status-completado-badge {
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #047857;
}

.status-en-proceso {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #f59e0b;
  font-size: 13px;
  font-weight: 600;
}

.status-en-proceso svg {
  width: 16px;
  height: 16px;
}

.status-completado {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #10b981;
  font-size: 13px;
  font-weight: 600;
}

.status-completado svg {
  width: 16px;
  height: 16px;
}

.no-actions {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #10b981;
  font-size: 13px;
  font-weight: 500;
}

.no-actions svg {
  width: 16px;
  height: 16px;
}

/* ===== Element Plus Table Override ===== */
:deep(.custom-table) {
  border: none !important;
  border-radius: 0 0 16px 16px;
  overflow: hidden;
}

:deep(.custom-table .even-row) {
  background-color: #ffffff;
}

:deep(.custom-table .odd-row) {
  background-color: #f0fdf4;
}

:deep(.custom-table .el-table__row:hover > td) {
  background-color: #dcfce7 !important;
}

:deep(.custom-table td.el-table__cell) {
  border-bottom: 1px solid #e2e8f0 !important;
}

:deep(.custom-table .el-table__cell) {
  border-right: none !important;
}

/* ===== Responsive ===== */
@media (max-width: 768px) {
  .view-wrapper {
    padding: 20px 16px;
  }

  .view-header {
    flex-direction: column;
  }

  .header-content {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-text h1 {
    font-size: 1.4rem;
  }

  .table-card-header {
    padding: 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .table-card-body {
    padding: 0;
  }
}

/* ===== Paginación ===== */
.pagination-container {
  display: flex;
  justify-content: center;
  padding: 24px 20px;
  border-top: 2px solid var(--color-gray-200);
  background: linear-gradient(135deg, var(--color-gray-50) 0%, var(--color-white) 100%);
}

.pagination {
  color: var(--color-gray-700);
}

:deep(.el-pagination) {
  font-weight: 600;
  font-size: 14px;
}

:deep(.el-pagination .el-pagination__total) {
  font-weight: 600;
  color: var(--color-primary);
  background: var(--color-gray-100);
  padding: 8px 14px;
  border-radius: 8px;
  margin-right: 16px;
}

:deep(.el-pagination .el-pagination__sizes .el-input) {
  width: 110px;
}

:deep(.el-pagination .el-pagination__sizes .el-input__wrapper) {
  border-radius: 8px;
  padding: 4px 12px;
  box-shadow: none;
  border: 2px solid var(--color-gray-200);
}

:deep(.el-pagination .el-pager li) {
  min-width: 36px;
  height: 36px;
  line-height: 36px;
  border-radius: 8px;
  margin: 0 4px;
  font-weight: 600;
  background: var(--color-white);
  border: 2px solid var(--color-gray-200);
}

:deep(.el-pagination .el-pager li:hover) {
  color: var(--color-primary);
  border-color: var(--color-accent);
}

:deep(.el-pagination .el-pager li.is-active) {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  color: var(--color-primary);
  border-color: var(--color-accent);
  font-weight: 700;
}

:deep(.el-pagination .btn-prev),
:deep(.el-pagination .btn-next) {
  min-width: 36px;
  height: 36px;
  border-radius: 8px;
  background: var(--color-white);
  border: 2px solid var(--color-gray-200);
  margin: 0 4px;
}

:deep(.el-pagination .btn-prev:hover),
:deep(.el-pagination .btn-next:hover) {
  color: var(--color-primary);
  border-color: var(--color-accent);
  background: var(--color-accent-light);
}

:deep(.el-pagination .el-pagination__jump) {
  margin-left: 16px;
  font-weight: 500;
}

:deep(.el-pagination .el-pagination__jump .el-input__wrapper) {
  border-radius: 8px;
  padding: 4px 8px;
  box-shadow: none;
  border: 2px solid var(--color-gray-200);
  width: 60px;
}

/* ===== Loading Skeleton ===== */
.loading-skeleton {
  padding: 20px;
}

.skeleton-row {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 12px;
  border-bottom: 1px solid var(--color-gray-100);
}

.skeleton-row:last-child {
  border-bottom: none;
}

.skeleton-cell {
  height: 20px;
  background: linear-gradient(90deg, var(--color-gray-200) 25%, var(--color-gray-100) 50%, var(--color-gray-200) 75%);
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite ease-in-out;
  border-radius: 6px;
}

.skeleton-nombre {
  width: 120px;
}

.skeleton-tipo {
  width: 80px;
}

.skeleton-codigo {
  width: 100px;
}

.skeleton-desc {
  flex: 1;
  min-width: 120px;
}

.skeleton-cantidad {
  width: 60px;
}

.skeleton-estado {
  width: 100px;
}

.skeleton-acciones {
  width: 120px;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
