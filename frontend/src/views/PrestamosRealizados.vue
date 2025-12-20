<template>
  <div class="crud-container">
    <h2>📦 Préstamos de Materiales Asignados</h2>

    <!-- Botón para abrir modal -->
    <button class="btn-primary" @click="openModal()">➕ Nuevo Préstamo</button>

    <!-- Tabla de préstamos -->
    <el-table
      :data="prestamos"
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
      <el-table-column prop="dniPrestador" label="DNI Prestador" width="180" />
      <el-table-column prop="dniRecepcionador" label="DNI Recepcionador" width="180" />
      <el-table-column prop="codProducto" label="Codigo de Producto" />
      <el-table-column prop="tipoProducto" label="Tipo de Producto" />
      <el-table-column prop="codEmpresa" label="Codigo de Empresa" />
      <el-table-column prop="prestamoAprobado" label="Aprobado" >
        <template #default="scope">
          {{ scope==true?'SI':'NO' }}
        </template>
      </el-table-column> 
      <el-table-column prop="prestamoDevuelto" label="Fue Devuelto" >
        <template #default="scope">
          {{ scope.row.prestamoDevuelto==true?'SI':'NO' }}
        </template>
      </el-table-column> 
      <el-table-column prop="fechaPrestamo" label="Fecha de Prestamo" >
        <template #default="scope">
          {{ FormatFechaCorta(scope.row.fechaPrestamo) }}
        </template>
      </el-table-column> 
        

      <!-- Columna de acciones -->
      <el-table-column label="Acciones" width="200">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="editar(scope.row)"
            v-if="scope.row.prestamoDevuelto==false"
          >
            Editar
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="eliminar(scope.row)"
            v-if="scope.row.prestamoDevuelto==false"
          >
            Eliminar
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Modal -->
    <el-dialog v-model="showModal" title="Prestamo de material" :width="dialogWidth">
      <el-form :model="form">
        <el-form-item label="Trabajador" :label-width="formLabelWidth">
          <el-select
            v-model="formPrestamoMaterial.dniRecepcionador"
            filterable
            placeholder="Buscar trabajador"
          >
            <el-option
              v-for="item in listaTrabajadores.filter(t => t.TRAB_DNI !== auth.currentUser.Dni)"
              :key="item.TRAB_DNI"
              :label="item.TRAB_NOMBRES+' '+item.TRAB_APELLPAT+' '+item.TRAB_APELLMAT"
              :value="item.TRAB_DNI"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Producto" :label-width="formLabelWidth">
          <el-select
            v-model="formPrestamoMaterial.codProducto"
            filterable
            placeholder="Buscar producto"
          >
            <el-option
              v-for="item in listaProductos"
              :key="item.codProducto"
              :label="item.codProducto+' - '+item.descripcionProducto"
              :value="item.codProducto"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Cantidad" :label-width="formLabelWidth" :disabled="true">
          <el-input-number 
            v-model="formPrestamoMaterial.cantidad" 
            :min="0" 
            :max="maxCantidadDisponible"
            @change="handleChange" 
            :disabled="!formPrestamoMaterial.codProducto"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showModal = false">Cancel</el-button>
          <el-button type="primary" @click="guardarPrestamoMaterial">
            Guardar
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue"
import { 
  ListarPrestamosRealizados, 
  listarTrabajadores, 
  PrestarMaterial, 
  listarMaterialesAsignados,
  aprobarMaterialRecibido
} from "../services/prestamoService"
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { FormatFechaCorta } from "../utils";

const auth = useAuthStore();
const router = useRouter();

const dniUser = ref(null);

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
  prestamoDevuelto: false,
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
      alert('Coloque una cantidad mayor a 0')
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

    const response = await PrestarMaterial(formPrestamoMaterial.value);
    if(response.data.success){
      alert('Prestamo Realizado con Exito')
      showModal.value=false;
      loadListaPrestamos();
    }
  } catch (error) {
    console.log('Error de material', error);
  }
}

const maxCantidadDisponible = computed(() => {
  if (!formPrestamoMaterial.value.codProducto) return 1;
  const producto = listaProductos.value.find(
    p => p.codProducto === formPrestamoMaterial.value.codProducto
  );
  return producto ? producto.cantidadDisponible : 1; 
});
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
