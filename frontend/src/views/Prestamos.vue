<template>
  <div class="crud-container">
    <h2>📦 Préstamos de Materiales</h2>

    <!-- Botón para abrir modal -->
    <button class="btn-primary" @click="openModal()">➕ Nuevo Préstamo</button>

    <!-- Tabla de préstamos -->
    <el-table
      :data="tableData"
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
      <el-table-column prop="date" label="Fecha" width="180" />
      <el-table-column prop="name" label="Nombre" width="180" />
      <el-table-column prop="address" label="Dirección" />

      <!-- Columna de acciones -->
      <el-table-column label="Acciones" width="200">
        <template #default="scope">
          <el-button
            type="primary"
            size="small"
            @click="editar(scope.row)"
          >
            Editar
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="eliminar(scope.row)"
          >
            Eliminar
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- Modal -->
    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ editingLoan ? 'Editar Préstamo' : 'Nuevo Préstamo' }}</h3>
        <form @submit.prevent="saveLoan">
          <label>Material</label>
          <input v-model="form.material" required />

          <label>Cantidad</label>
          <input type="number" v-model="form.cantidad" required />

          <label>Solicitante</label>
          <input v-model="form.solicitante" required />

          <label>Fecha</label>
          <input type="date" v-model="form.fecha" required />

          <div class="modal-actions">
            <button type="submit" class="btn-primary">💾 Guardar</button>
            <button type="button" class="btn-secondary" @click="closeModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue"

const tableData = [
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
  },
]

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

function closeModal() {
  showModal.value = false
}

function saveLoan() {
  if (editingLoan.value) {
    const index = loans.value.findIndex(l => l.id === editingLoan.value.id)
    loans.value[index] = { ...form.value }
  } else {
    form.value.id = loans.value.length + 1
    loans.value.push({ ...form.value })
  }
  closeModal()
}

function deleteLoan(id) {
  loans.value = loans.value.filter(l => l.id !== id)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("es-PE", {
    year: "numeric",
    month: "long",
    day: "numeric"
  })
}
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
