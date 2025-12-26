<template>
  <div class="crud-container">
    <div class="page-layout">
      <header class="page-header">
        <div class="page-title-block">
          <h2>Préstamos de Materiales Asignados</h2>
          <p class="page-subtitle">
            Registre y gestione los préstamos de materiales realizados a otros colaboradores.
          </p>
        </div>
        <div class="page-actions">
          <button class="btn-primary" @click="openModal()">Nuevo préstamo</button>
        </div>
      </header>

      <section class="page-card">
        <div class="card-header">
          <h3>Listado de préstamos realizados</h3>
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
            <el-table-column prop="dniPrestador" label="DNI prestador" />
            <el-table-column prop="dniRecepcionador" label="DNI recepcionador" />
            <el-table-column prop="codProducto" label="Código producto"/>
            <el-table-column prop="tipoProducto" label="Tipo de producto"/>
            <el-table-column prop="codEmpresa" label="Empresa" width="120" />
            <el-table-column prop="prestamoEstado" label="Estado del Préstamo">
              <template #default="scope">
                <el-tag
                  :type="getStatusPrestamoStyle(scope.row.prestamoAprobado, scope.row.devolverPrestamo, scope.row.devolucionConfirmada)"
                  disable-transitions
                  effect="dark"
                >
                  <b>
                    {{ getStatusPrestamo(scope.row.prestamoAprobado, scope.row.devolverPrestamo, scope.row.devolucionConfirmada) }}
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
            </el-table-column>  -->
            <el-table-column prop="fechaPrestamo" label="Fecha de préstamo" width="160" >
              <template #default="scope">
                {{ FormatFechaCorta(scope.row.fechaPrestamo) }}
              </template>
            </el-table-column> 

            <el-table-column label="Acciones" width="210" :fixed="isMobile ? false : 'right'">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  @click="confirmarDevolucionMaterial(scope.row)"
                  v-if="scope.row.devolverPrestamo==true && scope.row.devolucionConfirmada==false"
                >
                  Confirmar Devolución
                </el-button>
                <el-button
                  type="danger"
                  size="small"
                  @click="eliminar(scope.row)"
                  v-if="scope.row.devolverPrestamo==false"
                >
                  Eliminar
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </section>
    </div>

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

.crud-container {
  min-height: 100vh;
  padding: 24px;
  background: radial-gradient(circle at top left, #e5edff 0, #edf2ff 45%, #e5e7eb 100%);
  font-family: "Segoe UI", system-ui, -apple-system, BlinkMacSystemFont, "Roboto", sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
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
