<template>
  <div class="crud-container">
    <h2>📦 Materiales Asignados</h2>

    <!-- Botón para abrir modal -->
    <button class="btn-primary" @click="openModal()">➕ Asignar Material</button>

    <!-- Tabla de préstamos -->
    <el-table
      :data="materialesAsignados"
      style="width: 100%"
      stripe
      border
      highlight-current-row
      :header-cell-style="{
        backgroundColor: '#007bff', 
        color: 'white',
        fontWeight: 'bold',
        fontSize: '14px'
      }"
      :cell-style="{ color: '#2c3e50', fontSize: '14px' }"
      :row-class-name="tableRowClassName"
    >
      <el-table-column prop="idMaterialAsignado" label="Id" width="180" />
      <el-table-column prop="dni" label="DNI" width="180" />
      <el-table-column prop="codEmpresa" label="Codigo Empresa" width="180" />
      <el-table-column prop="tipoProducto" label="Tipo de Producto" width="180" />
      <el-table-column prop="codProducto" label="Codigo de Producto" width="180" />
      <el-table-column prop="cantidad" label="Cantidad" width="180" />
      <el-table-column prop="fechaAsignado" label="Fecha Asignada" width="180"> 
        <template #default="scope">
          {{ formatDate(scope.row.fechaAsignada) }}
        </template>
      </el-table-column>

      <!-- Columna de acciones -->
      <el-table-column label="Acciones" width="200">
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
import { onMounted, ref } from "vue"
import {listarProductos, listarMaterialesAsignados, listarTrabajadores, asignarMaterial, listarMaterialesAsignadosTotal, ConsumirMaterialAsignado} from "../services/prestamoService"
import { useAuthStore } from "../stores/auth";
const auth = useAuthStore();

const dniUsuario = ref(null);

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
  dniUsuario.value = auth.currentUser.Dni
  
  loadListaAsignados();
  if (window.innerWidth < 768) {
    dialogWidth.value = '90%' // en móviles casi toda la pantalla
  }

  await loadProductos();
  await loadTrabajadores();
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
    alert('Complete todos los campos')
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
      alert('Se guardo la asignacion');
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
    alert('Debes ingresar una cantidad mayor a 0');
    return;
  }
  try {
    console.log(item);

    const data = {
      cantidad: cantidadConsumida.value,
      idMaterialAsignado: materialSeleccionado.value.idMaterialAsignado
    }
    
    const response = await ConsumirMaterialAsignado(data);

    if(response.data.success){
      loadListaAsignados()
      alert('Material consumido con éxito')
    }
  } catch (error) {
    console.log('Error al consumir material', error);
  }
};
</script>

<style scoped>
.crud-container {
  padding: 20px;
  background: #f9f9f9;
  min-height: 100vh;
  font-family: "Segoe UI", Roboto, sans-serif;
}

h2 {
  margin-bottom: 20px;
}

.btn-primary {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 15px;
}
.btn-primary:hover {
  background: #0056b3;
}

.crud-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}
.crud-table th, .crud-table td {
  padding: 10px;
  border: 1px solid #ddd;
  text-align: left;
}
.crud-table th {
  background: #007bff;
  color: white;
}

.btn-edit {
  background: #ffc107;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 6px;
}
.btn-edit:hover {
  background: #e0a800;
}

.btn-delete {
  background: #dc3545;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  color: white;
}
.btn-delete:hover {
  background: #c82333;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}
.modal h3 {
  margin-top: 0;
}
.modal label {
  display: block;
  margin-top: 10px;
  font-weight: 600;
}
.modal input {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.modal-actions {
  margin-top: 15px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
.btn-secondary {
  background: #6c757d;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}
.btn-secondary:hover {
  background: #5a6268;
}

.row-even {
  background-color: #f9f9f9;
}
.row-odd {
  background-color: #ffffff;
}

/* Hover elegante */
.el-table__row:hover {
  background-color: #eaf2f8 !important;
  transition: background-color 0.3s ease;
}

/* Botones más elegantes */
.el-button {
  margin: 0 4px;
}

</style>
