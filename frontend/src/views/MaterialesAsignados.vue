<template>
  <div class="crud-container">
    <div class="page-layout">
      <header class="page-header">
        <div class="page-title-block">
          <h2>Materiales asignados</h2>
          <p class="page-subtitle">
            Visualice y gestione los materiales asignados al personal de transporte.
          </p>
        </div>
        <div class="page-actions">
          <button class="btn-primary" @click="openModal()">Asignar material</button>
        </div>
      </header>

      <section class="page-card">
        <div class="card-header">
          <h3>Listado de materiales</h3>
        </div>
        <div class="card-body table-wrapper">
          <el-table
            :data="materialesAsignados"
            style="width: 100%"
            stripe
            border
            highlight-current-row
            :header-cell-style="{
              backgroundColor: '#2563eb', 
              color: 'white',
              fontWeight: 'bold',
              fontSize: '13px'
            }"
            :cell-style="{ color: '#1f2933', fontSize: '13px' }"
          >
            <el-table-column prop="idMaterialAsignado" label="Id" width="120" />
            <el-table-column prop="dni" label="DNI" width="120" />
            <el-table-column prop="codEmpresa" label="Empresa" width="110" />
            <el-table-column prop="tipoProducto" label="Tipo" width="140" />
            <el-table-column prop="codProducto" label="Código" width="150" />
            <el-table-column prop="cantidad" label="Cantidad" width="120" />
            <el-table-column prop="fechaAsignado" label="Fecha asignada" width="160"> 
              <template #default="scope">
                {{ formatDate(scope.row.fechaAsignada) }}
              </template>
            </el-table-column>

            <el-table-column label="Acciones" width="150" :fixed="isMobile ? false : 'right'">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="openConsumirModal(scope.row)"
                >
                  Consumir
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
    </div>

    <!-- Modal -->
    <el-dialog v-model="showModal" title="Asignar Material" :width="dialogWidth">
      <el-form :model="form">
        <el-form-item label="Trabajador" :label-width="formLabelWidth">
          <el-select
            v-model="formNuevaAsignacion.dni"
            filterable
            placeholder="Buscar trabajador"
          >
            <el-option
              v-for="item in listaTrabajadores"
              :key="item.TRAB_DNI"
              :label="item.TRAB_NOMBRES+' '+item.TRAB_APELLPAT+' '+item.TRAB_APELLMAT"
              :value="item.TRAB_DNI"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="DNI" :label-width="formLabelWidth">
          <el-input v-model="formNuevaAsignacion.dni" autocomplete="off" disabled />
        </el-form-item>
        <el-form-item label="Producto" :label-width="formLabelWidth">
          <el-select
            v-model="productoSeleccionado"
            filterable
            remote
            reserve-keyword
            placeholder="Buscar producto"
            :remote-method="loadProductos"
            :loading="loadingProductos"
          >
            <el-option
              v-for="item in listaProductos"
              :key="item"
              :label="item.NOMBRE"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Cantidad" :label-width="formLabelWidth">
          <el-input-number v-model="formNuevaAsignacion.cantidad" :min="1" :max="10" @change="handleChange" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showModal = false">Cancel</el-button>
          <el-button type="primary" @click="guardarAsignacionMaterial">
            Guardar
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- Modal Consumir Modal -->
    <el-dialog v-model="showConsumirModal" title="Consumir Material" :width="dialogWidth">
      <el-form :model="form">
        <el-form-item label="Cantidad" :label-width="formLabelWidth">
          <el-input-number v-model="cantidadConsumida" :min="0" :max="materialSeleccionado.cantidad" @change="handleChange" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showModal = false">Cancel</el-button>
          <el-button type="primary" @click="confirmarConsumoMaterial">
            Confirmar Consumo
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue"
import { ElMessage, ElMessageBox } from "element-plus";
import {listarProductos, listarMaterialesAsignados, listarTrabajadores, asignarMaterial, listarMaterialesAsignadosTotal, ConsumirMaterialAsignado} from "../services/prestamoService"
import { useAuthStore } from "../stores/auth";
const auth = useAuthStore();

const dniUsuario = ref(null);
const isMobile = ref(window.innerWidth < 768);

const handleResize = () => {
  isMobile.value = window.innerWidth < 768;
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

const dialogWidth = ref('30%');

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
const admins = [
  '76370982'
];

const loadListaAsignados = async () => {
  try {
    let response = null;    
    if(admins.some(item=> item == dniUsuario.value)){
      console.log('es admin');
      
      response = await listarMaterialesAsignadosTotal();
    }else{
      console.log('no es admin');

      response = await listarMaterialesAsignados(dniUsuario.value);
    }
    if(response.data.success){
      materialesAsignados.value = response.data.data;
    }
  } catch (error) {
    console.log('Error en prestamos', error);
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
.crud-container {
  min-height: 100vh;
  padding: 24px;
  background: radial-gradient(circle at top left, #e5edff 0, #edf2ff 45%, #e5e7eb 100%);
  font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Roboto", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.page-layout {
  width: 100%;
  max-width: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 18px;
}

.page-title-block {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

h2 {
  font-size: 22px;
  font-weight: 600;
  color: #1f2933;
}

.page-subtitle {
  font-size: 13px;
  color: #4b5563;
}

.page-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.btn-primary {
  background: linear-gradient(135deg, #0066cc, #004c99);
  color: #ffffff;
  border: none;
  padding: 8px 18px;
  border-radius: 8px;
  cursor: pointer;
  margin-bottom: 16px;
  font-size: 14px;
  font-weight: 500;
  box-shadow: 0 2px 6px rgba(0, 102, 204, 0.28);
  transition: background 0.25s ease, box-shadow 0.25s ease, transform 0.1s ease;
}

.btn-primary:hover {
  background: linear-gradient(135deg, #005bb5, #004280);
  box-shadow: 0 4px 12px rgba(0, 90, 180, 0.35);
  transform: translateY(-1px);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 90, 180, 0.25);
}

.el-table {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(15, 35, 52, 0.06);
  padding: 4px 0 12px 0;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  overflow-y: visible;
}

.page-card {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(15, 23, 42, 0.08);
  border: 1px solid #e5e7eb;
}

.card-header {
  padding: 14px 18px;
  border-bottom: 1px solid #e5e7eb;
}

.card-header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: #111827;
}

.card-body {
  padding: 0;
}

.el-table__header th {
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.el-table__row:hover {
  background-color: #f0f5ff !important;
  transition: background-color 0.25s ease;
}

.el-button {
  border-radius: 6px;
  font-size: 13px;
}

.dialog-footer {
  padding-top: 8px;
}

@media (max-width: 768px) {
  .crud-container {
    padding: 12px;
  }

  h2 {
    font-size: 18px;
    text-align: center;
  }

  .btn-primary {
    width: 100%;
    justify-content: center;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .page-actions {
    justify-content: flex-start;
  }

  .page-layout {
    max-width: 100%;
  }

  .page-card {
    border-radius: 10px;
  }

  .card-body {
    padding: 8px 10px 10px 10px;
  }
}

</style>
