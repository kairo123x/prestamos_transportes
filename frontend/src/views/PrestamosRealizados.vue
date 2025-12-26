<template>
  <div class="view-wrapper">
    <div class="view-container">
      <!-- Header Section -->
      <header class="view-header">
        <div class="header-content">
          <div class="header-icon loans-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
              <path d="m15 5 4 4"/>
            </svg>
          </div>
          <div class="header-text">
            <h1>Préstamos Realizados</h1>
            <p>Registre y gestione los préstamos de materiales realizados a otros colaboradores</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-primary" @click="openModal()">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14"/>
              <path d="M5 12h14"/>
            </svg>
            Nuevo préstamo
          </button>
        </div>
      </header>

      <!-- Table Card -->
      <section class="table-card">
        <div class="table-card-header">
          <h3>Listado de préstamos realizados</h3>
          <span class="record-count">{{ prestamos.length }} registros</span>
        </div>
        <div class="table-card-body">
          <el-table
            :data="prestamos"
            style="width: 100%"
            :header-cell-style="{
              backgroundColor: '#6d28d9',
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
            <el-table-column prop="dniPrestador" label="DNI Prestador" width="150">
              <template #default="scope">
                <div class="dni-cell">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>{{ scope.row.dniPrestador }}</span>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column prop="dniRecepcionador" label="DNI Receptor" width="150">
              <template #default="scope">
                <div class="dni-cell receptor">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                  <span>{{ scope.row.dniRecepcionador }}</span>
                </div>
              </template>
            </el-table-column>
            
            <el-table-column prop="codProducto" label="Código" min-width="140">
              <template #default="scope">
                <span class="producto-code">{{ scope.row.codProducto }}</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="tipoProducto" label="Tipo" width="130">
              <template #default="scope">
                <span class="tipo-badge">{{ scope.row.tipoProducto }}</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="codEmpresa" label="Empresa" width="100">
              <template #default="scope">
                <span class="empresa-badge">{{ scope.row.codEmpresa }}</span>
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
                  class="btn-confirmar"
                  @click="confirmarDevolucionMaterial(scope.row)"
                  v-if="scope.row.devolverPrestamo==true && scope.row.devolucionConfirmada==false"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Confirmar
                </button>
                <button
                  class="btn-eliminar"
                  @click="eliminar(scope.row)"
                  v-if="scope.row.prestamoAprobado==false && scope.row.devolverPrestamo==false"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                  Eliminar
                </button>
                <span 
                  v-if="scope.row.devolucionConfirmada==true" 
                  class="status-completado"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  Completado
                </span>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>

      <!-- Modal Préstamo Material -->
      <el-dialog 
        v-model="showModal" 
        :width="dialogWidth"
        :show-close="false"
        class="custom-dialog"
      >
        <template #header>
          <div class="dialog-header">
            <div class="dialog-header-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                <path d="m15 5 4 4"/>
              </svg>
            </div>
            <div class="dialog-header-text">
              <h3>Nuevo Préstamo de Material</h3>
              <p>Registre un préstamo a otro colaborador</p>
            </div>
            <button class="dialog-close-btn" @click="showModal = false">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
        </template>

        <div class="dialog-body">
          <div class="form-section">
            <div class="form-group">
              <label class="form-label">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
                Trabajador receptor
              </label>
              <el-select
                v-model="formPrestamoMaterial.dniRecepcionador"
                filterable
                placeholder="Buscar trabajador por nombre..."
                class="custom-select"
              >
                <el-option
                  v-for="item in listaTrabajadores.filter(t => t.TRAB_DNI !== auth.currentUser.Dni)"
                  :key="item.TRAB_DNI"
                  :label="item.TRAB_NOMBRES+' '+item.TRAB_APELLPAT+' '+item.TRAB_APELLMAT"
                  :value="item.TRAB_DNI"
                />
              </el-select>
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                </svg>
                Producto a prestar
              </label>
              <el-select
                v-model="formPrestamoMaterial.codProducto"
                filterable
                placeholder="Seleccione un producto..."
                class="custom-select"
              >
                <el-option
                  v-for="item in listaProductos"
                  :key="item.codProducto"
                  :label="item.codProducto+' - '+item.descripcionProducto"
                  :value="item.codProducto"
                />
              </el-select>
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                Cantidad
              </label>
              <div class="quantity-wrapper">
                <el-input-number 
                  v-model="formPrestamoMaterial.cantidad" 
                  :min="0" 
                  :max="maxCantidadDisponible"
                  :disabled="!formPrestamoMaterial.codProducto"
                  class="custom-input-number"
                />
                <span class="max-stock" v-if="formPrestamoMaterial.codProducto">
                  Máx: {{ maxCantidadDisponible }} uds
                </span>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <button class="btn-cancel" @click="showModal = false">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
              Cancelar
            </button>
            <button class="btn-save" @click="guardarPrestamoMaterial">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Registrar Préstamo
            </button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue"
import { ElMessage, ElMessageBox } from "element-plus";
import { getStatusPrestamo, getStatusPrestamoStyle } from "../utils";
import { 
  ListarPrestamosRealizados, 
  listarTrabajadores, 
  PrestarMaterial, 
  listarMaterialesAsignados,
  confirmarDevolucion
} from "../services/prestamoService"
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { FormatFechaCorta } from "../utils";

const auth = useAuthStore();
const router = useRouter();

const dniUser = ref(null);
const isMobile = ref(window.innerWidth < 768);
const dialogWidth = ref(window.innerWidth < 768 ? '90%' : '500px');

const tableRowClassName = ({ rowIndex }) => {
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row';
};

const getStatusPrestamoClass = (aprobado, devolver, confirmado) => {
  if (confirmado) return 'status-completado-badge';
  if (devolver) return 'status-devolucion-badge';
  if (aprobado) return 'status-aprobado-badge';
  return 'status-pendiente-badge';
};

onMounted(()=> {
  if(auth.currentUser==null){
    router.push({name:'Login'});
  }
  dniUser.value  = auth.currentUser.Dni;
  loadTrabajadores();
  loadListaPrestamos();
  loadProductosPorTrabajador();
})

const formPrestamoMaterial = ref({
  dniPrestador: '',
  dniRecepcionador: '',
  codEmpresa: '', 
  tipoProducto: '', 
  codProducto: '', 
  prestamoAprobado: false, 
  devolverPrestamo: false,
  cantidad: 0, 
  fechaPrestamo: ''
});

const productoSeleccionado = ref(null);

const loans = ref([
  { id: 1, material: "Laptop", cantidad: 2, solicitante: "Juan Pérez", fecha: "2025-12-10" },
  { id: 2, material: "Proyector", cantidad: 1, solicitante: "María López", fecha: "2025-12-12" }
])

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

function formatDate(date) {
  return new Date(date).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

const prestamos = ref([]);

const loadListaPrestamos = async () => {
  try {
    const response = await ListarPrestamosRealizados(dniUser.value);
    if(response.data.success){
      prestamos.value = response.data.data;
      console.log(prestamos.value);
    }
  } catch (error) {
    console.log('Error en prestamos', error);
  }
}

const listaProductos = ref();
const loadingProductos = ref(false);

const loadProductosPorTrabajador = async () => {
  loadingProductos.value = true
  try {
    let response = null;
    
    response = await listarMaterialesAsignados(dniUser.value);
    
    if(response.data.success){
      listaProductos.value = response.data.data;
    }
  } catch (error) {
    console.log('Error en productos por trabajador', error);
  } finally {
    loadingProductos.value = false
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

const guardarPrestamoMaterial = async() => {
  try {
    //Validacion
    if(formPrestamoMaterial.value.cantidad==0){
      ElMessage.warning('Ingrese una cantidad mayor a 0 para registrar el préstamo.');
      return;
    }

    const productoStock = listaProductos.value.find(
      p => p.codProducto === formPrestamoMaterial.value.codProducto
    );

    if (!productoStock) {
      ElMessage.error('No se encontró información de stock para el producto seleccionado.');
      return;
    }

    if (formPrestamoMaterial.value.cantidad > productoStock.cantidad) {
      ElMessage.warning('La cantidad solicitada en préstamo no puede ser mayor al stock asignado que posee de este material.');
      return;
    }

    const producto = listaProductos.value.find(
      p => p.codProducto === formPrestamoMaterial.value.codProducto
    );

    formPrestamoMaterial.value.dniPrestador = auth.currentUser.Dni;
    formPrestamoMaterial.value.codProducto = producto.codProducto;
    formPrestamoMaterial.value.tipoProducto = producto.tipoProducto;
    formPrestamoMaterial.value.descripcionProducto = producto.descripcionProducto;
    formPrestamoMaterial.value.codEmpresa = producto.codEmpresa;
    const fecha = new Date();
    const fechaSQL = fecha.toISOString().split('T')[0];
    formPrestamoMaterial.value.fechaPrestamo = fechaSQL;

    const confirmar = await ElMessageBox.confirm(
      `¿Confirma que desea registrar el préstamo de ${formPrestamoMaterial.value.cantidad} unidad(es) del material ${producto.codProducto}?`,
      'Confirmar registro de préstamo',
      {
        confirmButtonText: 'Sí, registrar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }
    );

    const response = await PrestarMaterial(formPrestamoMaterial.value);
    if(response.data.success){
      ElMessage.success('El préstamo de material se registró correctamente.');
      showModal.value=false;
      loadListaPrestamos();
    }
  } catch (error) {
    console.log('Error de material', error);
    ElMessage.error('Ocurrió un error al registrar el préstamo de material. Inténtelo nuevamente.');
  }
}

const confirmarDevolucionMaterial = async(item) => {
  try {
    const response = await ElMessageBox.confirm(
      `¿Confirma que desea registrar la devolución del material prestado correspondiente al préstamo Nº ${item.idPrestamo}?`,
      'Confirmar devolución de material',
      {
        confirmButtonText: 'Sí, registrar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }
    );

    if(response){

      const resp = await confirmarDevolucion(item.idPrestamo);
      console.log(resp);
      
      if(resp.data.success){
        ElMessage.success('La devolución del material fue registrada correctamente.');
        loadListaPrestamos();
      }
    }
  } catch (error) {
    console.log('Error al confirmar devolución', error);
  }
};

const maxCantidadDisponible = computed(() => {
  if (!formPrestamoMaterial.value.codProducto) return 1;
  const producto = listaProductos.value.find(
    p => p.codProducto === formPrestamoMaterial.value.codProducto
  );
  return producto ? producto.cantidad : 1; 
});
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
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.loans-icon {
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
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

.header-actions {
  display: flex;
  gap: 12px;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
  transition: all 0.3s ease;
}

.btn-primary svg {
  width: 18px;
  height: 18px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.btn-primary:active {
  transform: translateY(0);
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
  background: #ede9fe;
  color: #5b21b6;
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
  color: #8b5cf6;
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

/* ===== Action Buttons ===== */
.btn-confirmar {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

.btn-confirmar svg {
  width: 14px;
  height: 14px;
}

.btn-confirmar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
}

.btn-eliminar {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.btn-eliminar svg {
  width: 14px;
  height: 14px;
}

.btn-eliminar:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
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
  color: #8b5cf6;
}

.fecha-cell span {
  font-size: 13px;
  color: #475569;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.btn-edit, .btn-delete {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-edit {
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  color: white;
  box-shadow: 0 2px 6px rgba(139, 92, 246, 0.3);
}

.btn-edit:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.btn-delete {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.3);
}

.btn-delete:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.btn-edit svg, .btn-delete svg {
  width: 16px;
  height: 16px;
}

.no-actions {
  color: #94a3b8;
  font-size: 14px;
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
  background-color: #faf5ff;
}

:deep(.custom-table .el-table__row:hover > td) {
  background-color: #f3e8ff !important;
}

:deep(.custom-table td.el-table__cell) {
  border-bottom: 1px solid #e2e8f0 !important;
}

:deep(.custom-table .el-table__cell) {
  border-right: none !important;
}

/* ===== Custom Dialog Styling ===== */
:deep(.custom-dialog) {
  border-radius: 20px !important;
  overflow: hidden;
}

:deep(.custom-dialog .el-dialog__header) {
  padding: 0 !important;
  margin: 0 !important;
}

:deep(.custom-dialog .el-dialog__body) {
  padding: 0 !important;
}

:deep(.custom-dialog .el-dialog__footer) {
  padding: 0 !important;
}

.dialog-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 24px;
  background: linear-gradient(135deg, #6d28d9 0%, #8b5cf6 100%);
  color: white;
  position: relative;
}

.dialog-header-icon {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dialog-header-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.dialog-header-text {
  flex: 1;
}

.dialog-header-text h3 {
  margin: 0 0 4px 0;
  font-size: 1.25rem;
  font-weight: 700;
}

.dialog-header-text p {
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
}

.dialog-close-btn {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.dialog-close-btn svg {
  width: 18px;
  height: 18px;
  color: white;
}

.dialog-close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.dialog-body {
  padding: 24px;
  background: #f8fafc;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
}

.form-label svg {
  width: 18px;
  height: 18px;
  color: #8b5cf6;
}

.custom-select {
  width: 100%;
}

:deep(.custom-select .el-input__wrapper) {
  border-radius: 10px;
  padding: 8px 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border: 2px solid #e2e8f0;
  transition: all 0.2s ease;
}

:deep(.custom-select .el-input__wrapper:hover) {
  border-color: #c4b5fd;
}

:deep(.custom-select .el-input.is-focus .el-input__wrapper) {
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.quantity-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

:deep(.custom-input-number) {
  width: 150px;
}

:deep(.custom-input-number .el-input__wrapper) {
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border: 2px solid #e2e8f0;
}

.max-stock {
  font-size: 0.85rem;
  color: #64748b;
  background: #f1f5f9;
  padding: 6px 12px;
  border-radius: 8px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  background: white;
  border-top: 1px solid #e2e8f0;
}

.btn-cancel,
.btn-save {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-cancel {
  background: #f1f5f9;
  color: #475569;
  border: 2px solid #e2e8f0;
}

.btn-cancel:hover {
  background: #e2e8f0;
}

.btn-save {
  background: linear-gradient(135deg, #8b5cf6, #6d28d9);
  color: white;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.btn-cancel svg,
.btn-save svg {
  width: 18px;
  height: 18px;
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

  .header-actions {
    width: 100%;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
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
