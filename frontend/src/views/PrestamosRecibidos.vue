<template>
  <div class="crud-container">
    <div class="page-layout">
      <header class="page-header">
        <div class="page-title-block">
          <h2>Préstamos de materiales recibidos</h2>
          <p class="page-subtitle">
            Revise y apruebe la recepción de materiales prestados por otros colaboradores.
          </p>
        </div>
      </header>

      <section class="page-card">
        <div class="card-header">
          <h3>Listado de préstamos recibidos</h3>
        </div>
        <div class="card-body table-wrapper">
          <el-table
            :data="prestamos"
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
                {{ scope.row.prestamoAprobado ? 'Sí' : 'No' }}
              </template>
            </el-table-column>
            <el-table-column prop="devolverPrestamo" label="Devuelto" width="120" >
              <template #default="scope">
                {{ scope.row.devolverPrestamo ? 'Sí' : 'No' }}
              </template>
            </el-table-column> -->
            <el-table-column prop="fechaPrestamo" label="Fecha de préstamo" width="160">
              <template #default="scope">
                {{ FormatFechaCorta(scope.row.fechaPrestamo) }}
              </template>
            </el-table-column>

            <el-table-column label="Acciones" width="180" :fixed="isMobile ? false : 'right'">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
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

.el-table {
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 8px 20px rgba(15, 35, 52, 0.06);
  padding: 4px 0 12px 0;
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

.table-wrapper {
  width: 100%;
  overflow-x: auto;
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

@media (max-width: 768px) {
  .crud-container {
    padding: 12px;
  }

  h2 {
    font-size: 18px;
    text-align: center;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
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
