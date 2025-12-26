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
          <el-table
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
            <el-table-column prop="dniPrestador" label="DNI prestador" width="150" />
            <el-table-column prop="dniRecepcionador" label="DNI recepcionador" width="150" />
            <el-table-column prop="codEmpresa" label="Empresa" width="120" />
            <el-table-column prop="tipoProducto" label="Tipo de producto" width="150" />
            <el-table-column prop="codEmpresa" label="Código de producto" width="150" />
            <el-table-column prop="prestamoEstado" label="Estado del Préstamo">
              <template #default="scope">
                <el-tag
                  :type="getStatusPrestamoStyle(scope.row.prestamoAprobado, scope.row.devolverPrestamo, scope.row.confirmaDevolucion)"
                  disable-transitions
                  effect="dark"
                >
                  <b>
                    {{ getStatusPrestamo(scope.row.prestamoAprobado, scope.row.devolverPrestamo, scope.row.confirmaDevolucion) }}
                  </b>
                </el-tag>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="prestamoAprobado" label="Aprobado" width="120" >
              <template #default="scope">
                <span class="status-badge" :class="scope.row.prestamoAprobado ? 'approved' : 'pending'">
                  <svg v-if="scope.row.prestamoAprobado" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 6v6l4 2"/>
                  </svg>
                  {{ scope.row.prestamoAprobado ? 'Sí' : 'No' }}
                </span>
              </template>
            </el-table-column>
            <el-table-column prop="devolverPrestamo" label="Devuelto" width="120" >
              <template #default="scope">
                {{ scope.row.devolverPrestamo ? 'Sí' : 'No' }}
              </template>
            </el-table-column> -->
            <el-table-column prop="fechaPrestamo" label="Fecha de préstamo" width="160">
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
                  v-if="!scope.row.prestamoAprobado" 
                  class="btn-aprobar" 
                  @click="aprobarRecepcionPrestamo(scope.row)"
                  v-if="scope.row.prestamoAprobado==false"
                >
                  Aprobar recepción
                </el-button>
                <el-button
                  type="primary"
                  size="small"
                  @click="devolverPrestamo(scope.row)"
                  v-else-if="scope.row.prestamoAprobado==true && scope.row.devolverPrestamo==false"
                >
                  Devolver
                </el-button>
                <span v-else>---</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { ElMessage, ElMessageBox } from "element-plus";
import {listarProductos, ListarPrestamosRecibidos, listarTrabajadores, aprobarMaterialRecibido, confirmarDevolucion, devolverMaterial} from "../services/prestamoService"
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { FormatFechaCorta, getStatusPrestamo, getStatusPrestamoStyle } from "../utils";

const router = useRouter()

const dniUser = ref(null);
const isMobile = ref(window.innerWidth < 768);

const tableRowClassName = ({ rowIndex }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row';
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

const loadListaPrestamos = async () => {
  try {    
    const response = await ListarPrestamosRecibidos(dniUser.value);
    if(response.data.success){
      prestamos.value = response.data.data;
    }
  } catch (error) {
    console.log('Error en prestamos', error);
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

const aprobar = (loan) => {
  alert(`Préstamo aprobado para ${loan.dniRecepcionador}`);
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
</script>

<style scoped>
/* ===== Layout Principal ===== */
.view-wrapper {
  min-height: calc(100vh - 74px);
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
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
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.header-icon svg {
  width: 28px;
  height: 28px;
  color: white;
}

.header-text h1 {
  color: #0f172a;
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 6px 0;
  letter-spacing: -0.5px;
}

.header-text p {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

/* ===== Table Card ===== */
.table-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.table-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.table-card-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
}

.record-count {
  background: #d1fae5;
  color: #047857;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
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
  color: #64748b;
}

.dni-cell.receptor svg {
  color: #10b981;
}

.dni-cell span {
  font-weight: 600;
  color: #1e293b;
}

.producto-code {
  font-weight: 600;
  color: #0f172a;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 6px;
}

.tipo-badge {
  display: inline-flex;
  padding: 6px 12px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
  border-radius: 8px;
  font-weight: 600;
  font-size: 13px;
}

.empresa-badge {
  display: inline-flex;
  padding: 6px 12px;
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1e40af;
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
  background: linear-gradient(135deg, #d1fae5, #a7f3d0);
  color: #047857;
}

.status-badge.pending {
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  color: #92400e;
}

.status-badge.returned {
  background: linear-gradient(135deg, #dbeafe, #bfdbfe);
  color: #1e40af;
}

.status-badge.not-returned {
  background: linear-gradient(135deg, #fee2e2, #fecaca);
  color: #dc2626;
}

.fecha-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.fecha-cell svg {
  width: 16px;
  height: 16px;
  color: #10b981;
}

.fecha-cell span {
  font-size: 13px;
  color: #475569;
}

.btn-aprobar {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.btn-aprobar svg {
  width: 16px;
  height: 16px;
}

.btn-aprobar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
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
</style>
