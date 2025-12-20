<template>
  <div class="crud-container">
    <h2>📦 Préstamos de Materiales Recibidos</h2>

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
      <el-table-column prop="dniPrestador" label="Codigo" width="180" />
      <el-table-column prop="dniRecepcionador" label="Nombre" width="180" />
      <el-table-column prop="codEmpresa" label="Tipo" />
      <el-table-column prop="tipoProducto" label="Tipo de Producto" />
      <el-table-column prop="codEmpresa" label="Codigo de Producto" />
      <el-table-column prop="prestamoAprobado" label="Aprobado" >
        <template #default="scope">
          {{ scope.row.prestamoAprobado==true?'SI':'NO' }}
        </template>
      </el-table-column>
      <el-table-column prop="prestamoDevuelto" label="Fue Devuelto" >
        <template #default="scope">
          {{ scope.row.prestamoDevuelto==true?'SI':'NO' }}
        </template>
      </el-table-column>
      <el-table-column prop="fechaPrestamo" label="Fecha de Prestamo">
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
            @click="aprobarRecepcionPrestamo(scope.row)"
            v-if="scope.row.prestamoAprobado==false"
          >
            Aprobar
          </el-button>
          <span v-else>---</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue"
import {listarProductos, ListarPrestamosRecibidos, listarTrabajadores, aprobarMaterialRecibido} from "../services/prestamoService"
import { useAuthStore } from "../stores/auth";
import { useRouter } from "vue-router";
import { FormatFechaCorta } from "../utils";

const router = useRouter()

const dniUser = ref(null);

const auth = useAuthStore();

onMounted(()=> {
  if(auth.currentUser==null){
    router.push({name:'Login'});
  }
  dniUser.value  = auth.currentUser.Dni;

  loadTrabajadores();
  loadListaPrestamos();
})

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
    const data = {
      idPrestamo: item.idPrestamo
    };
    const response = await aprobarMaterialRecibido(data);
    if(response.data.success){
      alert('Préstamo aprobado con éxito');
      loadListaPrestamos();
    }
  } catch (error) {
    console.log('Error al aprobar préstamo', error);
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
