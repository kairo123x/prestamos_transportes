import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";

import Login from "../components/Login.vue";
import Dashboard from "../components/Dashboard.vue";
import Prestamos from "../views/PrestamosRealizados.vue";
import PrestamosRecibidos from "../views/PrestamosRecibidos.vue";
import MaterialesAsignados from "../views/MaterialesAsignados.vue";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { guestOnly: true },
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  {
    path: "/prestamos",
    name: "Prestamos",
    component: Prestamos,
    meta: { requiresAuth: true },
  },
  {
    path: "/prestamos-recibidos",
    name: "PrestamosRecibidos",
    component: PrestamosRecibidos,
    meta: { requiresAuth: true },
  },
  {
    path: "/productos-asignados",
    name: "ProductosAsignados",
    component: MaterialesAsignados,
    meta: { requiresAuth: true },
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  authStore.checkSession();

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next({ name: "Login" });
  } else if (to.meta.guestOnly && authStore.isAuthenticated) {
    next({ name: "Dashboard" });
  } else {
    next();
  }
});

export default router;