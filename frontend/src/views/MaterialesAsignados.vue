<template>
  <div class="view-wrapper">
    <div class="view-container">
      <!-- Header Section -->
      <header class="view-header">
        <div class="header-content">
          <div class="header-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
              <path d="m3.3 7 8.7 5 8.7-5"/>
              <path d="M12 22V12"/>
            </svg>
          </div>
          <div class="header-text">
            <h1>Materiales Asignados</h1>
            <p>Visualice y gestione los materiales asignados al personal de transporte</p>
          </div>
        </div>
        <div class="header-actions">
          <button class="btn-primary" @click="openModal()" v-if="havePermissions">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14"/>
              <path d="M5 12h14"/>
            </svg>
            Asignar material
          </button>
        </div>
      </header>

      <!-- Table Card -->
      <section class="table-card">
        <div class="table-card-header">
          <h3>Listado de materiales</h3>
          <span class="record-count">{{ materialesAsignados.length }} registros</span>
        </div>
        <div class="table-card-body">
          <!-- Loading Skeleton -->
          <div v-if="isLoading" class="loading-skeleton">
            <div class="skeleton-row" v-for="n in 5" :key="n">
              <div class="skeleton-cell skeleton-id"></div>
              <div class="skeleton-cell skeleton-dni"></div>
              <div class="skeleton-cell skeleton-tipo"></div>
              <div class="skeleton-cell skeleton-codigo"></div>
              <div class="skeleton-cell skeleton-desc"></div>
              <div class="skeleton-cell skeleton-cantidad"></div>
              <div class="skeleton-cell skeleton-fecha"></div>
              <div class="skeleton-cell skeleton-acciones"></div>
            </div>
          </div>

          <el-table
            v-else
            :data="materialesAsignados"
            style="width: 100%"
            :header-cell-style="{
              backgroundColor: '#1e40af', 
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
            <el-table-column prop="idMaterialAsignado" label="ID" width="100">
              <template #default="scope">
                <span class="id-badge">#{{ scope.row.idMaterialAsignado }}</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="dni" label="DNI" width="130">
              <template #default="scope">
                <div class="dni-cell">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  <span>{{ scope.row.dni }}</span>
                </div>
              </template>
            </el-table-column>
            
            <!-- <el-table-column prop="codEmpresa" label="Empresa" width="110">
              <template #default="scope">
                <span class="empresa-badge">{{ scope.row.codEmpresa }}</span>
              </template>
            </el-table-column> -->
            
            <el-table-column prop="tipoProducto" label="Tipo" width="140">
              <template #default="scope">
                <span class="tipo-badge">{{ scope.row.tipoProducto }}</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="codProducto" label="Código Producto" width="120">
              <template #default="scope">
                <div class="producto-cell">
                  <span class="producto-code">{{ scope.row.codProducto }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="descripcionProducto" label="Descripción" min-width="220">
              <template #default="scope">
                <span class="producto-code">{{ scope.row.descripcionProducto }}</span>
              </template>
            </el-table-column>
            
            <el-table-column prop="cantidad" label="Cantidad" width="120" align="center">
              <template #default="scope">
                <span 
                  class="cantidad-badge" 
                  :class="{ 
                    'low-stock': scope.row.cantidad > 0 && scope.row.cantidad <= 2,
                    'out-of-stock': scope.row.cantidad === 0 
                  }"
                >
                  {{ scope.row.cantidad }} uds
                </span>
              </template>
            </el-table-column>
            
            <el-table-column prop="fechaAsignado" label="Fecha Asignada" width="180">
              <template #default="scope">
                <div class="fecha-cell">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                    <line x1="16" x2="16" y1="2" y2="6"/>
                    <line x1="8" x2="8" y1="2" y2="6"/>
                    <line x1="3" x2="21" y1="10" y2="10"/>
                  </svg>
                  <span>{{ formatDate(scope.row.fechaAsignada) }}</span>
                </div>
              </template>
            </el-table-column>

            <el-table-column label="Acciones" width="150" :fixed="isMobile ? false : 'right'" align="center">
              <template #default="scope">
                <button 
                  v-if="scope.row.cantidad > 0"
                  class="btn-consumir" 
                  @click="openConsumirModal(scope.row)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M3 6h18"/>
                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                  </svg>
                  Consumir
                </button>
                <span v-else class="stock-agotado">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="4.93" x2="19.07" y1="4.93" y2="19.07"/>
                  </svg>
                  Agotado
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
              @current-change="loadListaAsignados"
              @size-change="() => loadListaAsignados(1)"
              class="pagination"
            />
          </div>
        </div>
      </section>

      <!-- Modal Asignar Material -->
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
                <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                <path d="m3.3 7 8.7 5 8.7-5"/>
                <path d="M12 22V12"/>
              </svg>
            </div>
            <div class="dialog-header-text">
              <h3>Asignar Material</h3>
              <p>Complete los datos para asignar un nuevo material</p>
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
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Trabajador
              </label>
              <el-select
                v-model="formNuevaAsignacion.dni"
                filterable
                placeholder="Buscar trabajador por nombre..."
                class="custom-select"
              >
                <el-option
                  v-for="item in listaTrabajadores"
                  :key="item.TRAB_DNI"
                  :label="item.TRAB_NOMBRES+' '+item.TRAB_APELLPAT+' '+item.TRAB_APELLMAT"
                  :value="item.TRAB_DNI"
                />
              </el-select>
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
                  <line x1="16" x2="16" y1="2" y2="6"/>
                  <line x1="8" x2="8" y1="2" y2="6"/>
                  <line x1="3" x2="21" y1="10" y2="10"/>
                </svg>
                DNI
              </label>
              <el-input 
                v-model="formNuevaAsignacion.dni" 
                disabled 
                placeholder="Se autocompleta al seleccionar trabajador"
                class="custom-input"
              />
            </div>

            <div class="form-group">
              <label class="form-label">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
                </svg>
                Producto
              </label>
              <el-select
                v-model="productoSeleccionado"
                filterable
                remote
                reserve-keyword
                placeholder="Escriba para buscar producto..."
                :remote-method="loadProductos"
                :loading="loadingProductos"
                class="custom-select"
              >
                <el-option
                  v-for="item in listaProductos"
                  :key="item"
                  :label="item.NOMBRE"
                  :value="item"
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
              <el-input-number 
                v-model="formNuevaAsignacion.cantidad" 
                :min="1" 
                :max="10" 
                class="custom-input-number"
              />
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
            <button class="btn-save" @click="guardarAsignacionMaterial">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
                <polyline points="17 21 17 13 7 13 7 21"/>
                <polyline points="7 3 7 8 15 8"/>
              </svg>
              Guardar Material
            </button>
          </div>
        </template>
      </el-dialog>

      <!-- Modal Consumir Material -->
      <el-dialog 
        v-model="showConsumirModal" 
        :width="dialogWidth"
        :show-close="false"
        class="custom-dialog"
      >
        <template #header>
          <div class="dialog-header consume-header">
            <div class="dialog-header-icon consume-icon">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 6h18"/>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                <line x1="10" x2="10" y1="11" y2="17"/>
                <line x1="14" x2="14" y1="11" y2="17"/>
              </svg>
            </div>
            <div class="dialog-header-text">
              <h3>Consumir Material</h3>
              <p>Ingrese la cantidad a consumir del material seleccionado</p>
            </div>
            <button class="dialog-close-btn" @click="showConsumirModal = false">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
            </button>
          </div>
        </template>

        <div class="dialog-body">
          <div class="consume-info" v-if="materialSeleccionado">
            <div class="info-badge">
              <span class="info-label">Stock disponible:</span>
              <span class="info-value">{{ materialSeleccionado.cantidad }} unidades</span>
            </div>
          </div>
          
          <div class="form-section">
            <div class="form-group">
              <label class="form-label">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                Cantidad a consumir
              </label>
              <el-input-number 
                v-model="cantidadConsumida" 
                :min="0" 
                :max="materialSeleccionado?.cantidad || 0"
                class="custom-input-number"
              />
            </div>
          </div>
        </div>

        <template #footer>
          <div class="dialog-footer">
            <button class="btn-cancel" @click="showConsumirModal = false">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
              </svg>
              Cancelar
            </button>
            <button class="btn-consume" @click="confirmarConsumoMaterial">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Confirmar Consumo
            </button>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from "vue"
import { ElMessage, ElMessageBox } from "element-plus";
import {listarProductos, listarMaterialesAsignados, listarTrabajadores, asignarMaterial, listarMaterialesAsignadosTotal, ConsumirMaterialAsignado} from "../services/prestamoService"
import { useAuthStore } from "../stores/auth";
import dnis from "../utils/permissions";

const auth = useAuthStore();

const dniUsuario = ref(null);
const isMobile = ref(window.innerWidth < 768);

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
};

const tableRowClassName = ({ row, rowIndex }) => {
  if (row.cantidad === 0) {
    return 'out-of-stock-row';
  }
  return rowIndex % 2 === 0 ? 'even-row' : 'odd-row';
};

const formNuevaAsignacion = ref({
  dni: '', 
  codEmpresa: '', 
  tipoProducto: '', 
  codProducto: '', 
  descripcionProducto: '', 
  cantidad: '', 
  fechaAsignada: ''
});
const productoSeleccionado = ref(null);

const materialSeleccionado = ref();

const cantidadConsumida = ref(0);

const dialogWidth = ref('600px');

// Paginación
const currentPage = ref(1);
const pageSize = ref(10);
const totalItems = ref(0);
const totalPages = ref(0);

// Loading
const isLoading = ref(false);

onMounted(async()=> {
  window.addEventListener('resize', handleResize);
  dniUsuario.value = auth.currentUser.Dni
  
  loadListaAsignados();
  if (window.innerWidth < 768) {
    dialogWidth.value = '90%' // en móviles casi toda la pantalla
  }

  await loadProductos();
  await loadTrabajadores();  
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});

const havePermissions = computed(() => {
  console.log('dnis', dnis);
  
  return dnis.some(item=> item == dniUsuario.value);
})

const showModal = ref(false)
const form = ref({ id: null, material: "", cantidad: 1, solicitante: "", fecha: "" })

function openModal() {
  showModal.value = true
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}

const materialesAsignados = ref([]);

const loadListaAsignados = async (page = 1) => {
  try {
    isLoading.value = true;
    let response = null;
    currentPage.value = page;
    
    if(dnis.some(item=> item == dniUsuario.value)){
      console.log('es admin');
      
      response = await listarMaterialesAsignadosTotal();
      if(response.data.success){
        materialesAsignados.value = response.data.data;
      }
    }else{
      console.log('no es admin');

      response = await listarMaterialesAsignados(dniUsuario.value, page, pageSize.value);
      if(response.data.success){
        materialesAsignados.value = response.data.data;
        totalItems.value = response.data.pagination?.total || 0;
        totalPages.value = response.data.pagination?.totalPages || 0;
      }
    }
  } catch (error) {
    console.log('Error en prestamos', error);
  } finally {
    isLoading.value = false;
  }
}

const listaProductos = ref();
const loadingProductos = ref(false);
const loadProductos = async(query) => {
  if (!query) {
    listaProductos.value = []
    return
  }
  loadingProductos.value = true
  try {
    const response = await listarProductos(query);
    if(response.data.success){
      listaProductos.value = response.data.data;
    }
  } catch (error) {
    console.log('Error en lista de productos', error);
  } finally {
    loadingProductos.value = false
  }
};

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

const guardarAsignacionMaterial = async() => {
  if(formNuevaAsignacion.value.cantidad=='' || productoSeleccionado.value==null || formNuevaAsignacion.value.dni==''){
    ElMessage.warning('Por favor, complete todos los campos obligatorios antes de registrar la asignación.');
    console.log(formNuevaAsignacion.value);
    return;
  }
  try {
    formNuevaAsignacion.value.codProducto = productoSeleccionado.value.CODIGO;
    formNuevaAsignacion.value.tipoProducto = productoSeleccionado.value.TIPO;
    formNuevaAsignacion.value.descripcionProducto = productoSeleccionado.value.NOMBRE;
    formNuevaAsignacion.value.codEmpresa = '02';
    const fecha = new Date();
    const fechaSQL = fecha.toISOString().split('T')[0];
    formNuevaAsignacion.value.fechaAsignada = fechaSQL;

    console.log(formNuevaAsignacion.value);
    
    const response = await asignarMaterial(formNuevaAsignacion.value);
    console.log('respuesta', response);
    
    if(response.data.success){
      ElMessage.success('La asignación de material se registró correctamente.');
      showModal.value = false;
      await loadListaAsignados();
    }
  } catch (error) {
    console.log('Error en lista de productos', error);
  } finally {
    productoSeleccionado.value = null;
  }
};

const showConsumirModal = ref(false);

const openConsumirModal = (item) => {
  showConsumirModal.value = true;  
  materialSeleccionado.value = item;
}

const confirmarConsumoMaterial = async(item) => {
  if(cantidadConsumida.value==0){
    ElMessage.warning('Debe ingresar una cantidad mayor a 0 para poder registrar el consumo.');
    return;
  }
  try {
    console.log(item);

    await ElMessageBox.confirm(
      `¿Confirma que desea registrar el consumo de ${cantidadConsumida.value} unidad(es) del material seleccionado?`,
      'Confirmar consumo de material',
      {
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar',
        type: 'warning'
      }
    );

    const data = {
      cantidad: cantidadConsumida.value,
      idMaterialAsignado: materialSeleccionado.value.idMaterialAsignado
    }
    
    const response = await ConsumirMaterialAsignado(data);

    if(response.data.success){
      await loadListaAsignados();
      ElMessage.success('El consumo de material se registró correctamente.');
      showConsumirModal.value = false;
      cantidadConsumida.value = 0;
    }
  } catch (error) {
    console.log('Error al consumir material', error);
    ElMessage.error('Se produjo un error al registrar el consumo de material. Intente nuevamente.');
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
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
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
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 12px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  transition: all 0.3s ease;
}

.btn-primary svg {
  width: 18px;
  height: 18px;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
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
  background: #e0e7ff;
  color: #3730a3;
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
.id-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: linear-gradient(135deg, var(--color-primary-light), var(--color-primary));
  color: var(--color-white);
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
}

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

.dni-cell span {
  font-weight: 600;
  color: var(--color-primary);
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

.tipo-badge {
  display: inline-flex;
  padding: 6px 12px;
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  color: var(--color-primary);
  border-radius: 8px;
  font-weight: 700;
  font-size: 13px;
}

.producto-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.producto-code {
  font-weight: 600;
  color: var(--color-primary);
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 13px;
}

.cantidad-badge {
  display: inline-flex;
  padding: 8px 14px;
  background: linear-gradient(135deg, var(--color-success-light), #a7f3d0);
  color: var(--color-success);
  border-radius: 20px;
  font-weight: 700;
  font-size: 14px;
}

.cantidad-badge.low-stock {
  background: linear-gradient(135deg, var(--color-error-light), #fecaca);
  color: var(--color-error);
}

.cantidad-badge.out-of-stock {
  background: linear-gradient(135deg, var(--color-gray-200), var(--color-gray-300));
  color: var(--color-gray-500);
}

.stock-agotado {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  background: linear-gradient(135deg, var(--color-gray-200), var(--color-gray-300));
  color: var(--color-gray-500);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
}

.stock-agotado svg {
  width: 16px;
  height: 16px;
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

.btn-consumir {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
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

.btn-consumir svg {
  width: 16px;
  height: 16px;
}

.btn-consumir:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 205, 0, 0.5);
}

/* ===== Element Plus Table Override ===== */
:deep(.custom-table) {
  border: none !important;
  border-radius: 0 0 16px 16px;
  overflow: hidden;
}

:deep(.custom-table .el-table__header-wrapper) {
  border-radius: 0;
}

:deep(.custom-table .el-table__body-wrapper) {
  border-radius: 0 0 16px 16px;
}

:deep(.custom-table .even-row) {
  background-color: var(--color-white);
}

:deep(.custom-table .odd-row) {
  background-color: var(--color-gray-50);
}

:deep(.custom-table .out-of-stock-row) {
  background-color: var(--color-gray-100) !important;
  opacity: 0.7;
}

:deep(.custom-table .out-of-stock-row > td) {
  color: #94a3b8 !important;
}

:deep(.custom-table .out-of-stock-row:hover > td) {
  background-color: #e2e8f0 !important;
}

:deep(.custom-table .el-table__row:hover > td) {
  background-color: #eff6ff !important;
}

:deep(.custom-table td.el-table__cell) {
  border-bottom: 1px solid #e2e8f0 !important;
}

:deep(.custom-table .el-table__cell) {
  border-right: none !important;
}
.el-table {
  --el-table-border-color: #e2e8f0;
  --el-table-header-bg-color: #1d4ed8;
  font-size: 14px;
}

:deep(.el-table__header th) {
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-size: 12px;
}

:deep(.el-table__row:hover > td) {
  background-color: #f0f9ff !important;
}

:deep(.el-button--primary) {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border: none;
  border-radius: 8px;
}

:deep(.el-button--primary:hover) {
  background: linear-gradient(135deg, #2563eb, #1e40af);
}

/* ===== Dialog Styling ===== */
:deep(.el-dialog) {
  border-radius: 16px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

:deep(.el-dialog__title) {
  font-weight: 600;
  color: #0f172a;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-form-item__label) {
  font-weight: 500;
  color: #334155;
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
  gap: 20px;
  padding: 28px 32px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: white;
  position: relative;
}

.consume-header {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
}

.dialog-header-icon {
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.dialog-header-icon svg {
  width: 28px;
  height: 28px;
  color: white;
}

.dialog-header-text {
  flex: 1;
}

.dialog-header-text h3 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 700;
}

.dialog-header-text p {
  margin: 0;
  font-size: 1.05rem;
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
  transform: scale(1.05);
}

.dialog-body {
  padding: 36px 40px;
  background: var(--color-gray-50);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-gray-700);
}

.form-label svg {
  width: 22px;
  height: 22px;
  color: var(--color-accent);
}

.custom-select {
  width: 100%;
}

:deep(.custom-select .el-input__wrapper) {
  border-radius: var(--border-radius-md);
  padding: 14px 18px;
  box-shadow: var(--shadow-sm);
  border: 2px solid var(--color-gray-200);
  transition: all 0.2s ease;
  font-size: 1.05rem;
}

:deep(.custom-select .el-input__wrapper:hover) {
  border-color: var(--color-gray-300);
}

:deep(.custom-select .el-input.is-focus .el-input__wrapper) {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 4px rgba(245, 169, 107, 0.15);
}

:deep(.custom-input .el-input__wrapper) {
  border-radius: var(--border-radius-md);
  padding: 12px 16px;
  box-shadow: var(--shadow-sm);
  border: 2px solid var(--color-gray-200);
  background: var(--color-gray-100);
  font-size: var(--font-size-base);
}

:deep(.custom-input-number) {
  width: 100%;
}

:deep(.custom-input-number .el-input__wrapper) {
  border-radius: var(--border-radius-md);
  padding: 14px 18px;
  box-shadow: var(--shadow-sm);
  border: 2px solid var(--color-gray-200);
  font-size: 1.1rem;
}

:deep(.custom-input-number .el-input__inner) {
  font-size: 1.1rem;
  font-weight: 600;
}

:deep(.custom-input-number .el-input-number__decrease),
:deep(.custom-input-number .el-input-number__increase) {
  border-radius: 8px;
}

.consume-info {
  margin-bottom: 20px;
}

.info-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #fef3c7, #fde68a);
  padding: 12px 16px;
  border-radius: 10px;
  border: 1px solid #f59e0b;
}

.info-label {
  font-size: 0.9rem;
  color: #92400e;
  font-weight: 500;
}

.info-value {
  font-size: 1rem;
  color: #78350f;
  font-weight: 700;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  padding: 24px 32px;
  background: var(--color-white);
  border-top: 1px solid var(--color-gray-200);
}

.btn-cancel,
.btn-save,
.btn-consume {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-base);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn-cancel {
  background: var(--color-gray-100);
  color: var(--color-gray-600);
  border: 2px solid var(--color-gray-200);
}

.btn-cancel:hover {
  background: var(--color-gray-200);
  border-color: var(--color-gray-300);
}

.btn-save {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  color: var(--color-primary);
  font-weight: 700;
  box-shadow: var(--shadow-glow-accent);
}

.btn-save:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 205, 0, 0.5);
}

.btn-consume {
  background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
  color: var(--color-primary);
  font-weight: 700;
  box-shadow: var(--shadow-glow-accent);
}

.btn-consume:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 205, 0, 0.5);
}

.btn-cancel svg,
.btn-save svg,
.btn-consume svg {
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

.skeleton-id {
  width: 60px;
}

.skeleton-dni {
  width: 100px;
}

.skeleton-tipo {
  width: 80px;
}

.skeleton-codigo {
  width: 120px;
}

.skeleton-desc {
  flex: 1;
  min-width: 150px;
}

.skeleton-cantidad {
  width: 70px;
}

.skeleton-fecha {
  width: 100px;
}

.skeleton-acciones {
  width: 100px;
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
