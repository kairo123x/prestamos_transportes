<template>
    <!-- Botón de menú (hamburger) -->
    <button class="menu-btn" @click="open = !open">
        <!-- Ícono de tres líneas -->
        <svg class="icon" viewBox="0 0 24 24">
        <path
            d="M3 6h18M3 12h18M3 18h18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
        />
        </svg>
    </button>

    <!-- Dropdown / menú -->
    <ul v-if="open" class="nav-menu">
        <li><router-link to="/">Inicio</router-link></li>
        <li><router-link to="/dashboard">Dashboard</router-link></li>
        <li><router-link to="/perfil">Perfil</router-link></li>
        <li><router-link to="/configuracion">Configuración</router-link></li>
    </ul>
</template>

<script setup>
import { ref } from "vue"

const open = ref(false)
</script>

<style scoped>
/* Barra fija abajo */
.navbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: #fff;
  border-top: 1px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-shadow: 0 -2px 6px rgba(0,0,0,0.1);
  font-family: "Segoe UI", Roboto, sans-serif;
  z-index: 1000;
}

/* Botón menú */
.menu-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
}
.icon {
  width: 24px;
  height: 24px;
  color: #000; /* negro elegante */
}

/* Marca */
.brand {
  font-size: 16px;
  font-weight: bold;
  color: #000;
}

/* Menú desplegable */
.nav-menu {
  position: absolute;
  bottom: 60px; /* aparece arriba de la barra */
  left: 0;
  right: 0;
  list-style: none;
  background: #fff;
  border-top: 1px solid #ddd;
  box-shadow: 0 -4px 12px rgba(0,0,0,0.1);
  padding: 12px 0;
  display: flex;
  flex-direction: column;
}
.nav-menu li {
  padding: 10px 16px;
}
.nav-menu li a {
  text-decoration: none;
  color: #000;
  font-size: 14px;
}
.nav-menu li a:hover {
  color: #007bff;
}
</style>