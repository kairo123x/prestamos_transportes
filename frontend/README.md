# Frontend - Gestión de Préstamos Transporte

Sistema completo de autenticación y dashboard para la gestión de préstamos de transporte construido con Vue 3 + Vite.

## 📁 Estructura de carpetas

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.vue          # Pantalla de login
│   │   └── Dashboard.vue      # Panel de control principal
│   ├── services/
│   │   └── authService.js     # Servicio de autenticación
│   ├── App.vue                # Componente raíz
│   ├── main.js                # Punto de entrada
│   ├── index.html             # HTML principal
│   ├── vite.config.js         # Configuración de Vite
│   └── package.json           # Dependencias
```

## 🎨 Componentes

### 1. Login.vue
- Formulario de autenticación
- Validación de credenciales
- Manejo de errores
- Guardado de token en localStorage

**Props:** Ninguno
**Emits:** `login-success`

### 2. Dashboard.vue
- Panel de bienvenida
- Información del trabajador
- Estadísticas de préstamos (placeholder)
- Botón de cierre de sesión

**Props:** 
- `usuario` (Object) - Datos del usuario autenticado

**Emits:** `logout`

### 3. App.vue
- Gestiona la lógica de autenticación
- Renderiza Login o Dashboard según autenticación
- Mantiene la sesión del usuario

## 🔐 Servicio de Autenticación (authService.js)

### Métodos disponibles:

```javascript
// Login
authService.login(TRAB_ID, TRAB_PASSWORD)

// Verificar token
authService.verifyToken()

// Logout
authService.logout()

// Obtener token
authService.getToken()

// Obtener usuario
authService.getUser()

// Guardar sesión
authService.saveSession(token, user)

// Verificar autenticación
authService.isAuthenticated()
```

## 🚀 Cómo ejecutar

### Desarrollo
```bash
cd frontend
npm run dev
```

Accede a: `http://localhost:5173`

### Build para producción
```bash
npm run build
```

### Vista previa de producción
```bash
npm run preview
```

## 🔄 Flujo de autenticación

1. **Usuario ingresa credenciales** en el componente Login
2. **Se validan los campos** (TRAB_ID y TRAB_PASSWORD)
3. **Se envía solicitud al API** (`POST /api/auth/login`)
4. **Backend valida credenciales** contra la BD
5. **Se genera JWT** si las credenciales son válidas
6. **Token se guarda** en localStorage
7. **Usuario ve el Dashboard** con sus datos

## 💾 Almacenamiento local

Los datos se guardan en `localStorage`:
- `token` - JWT para autenticación
- `user` - Datos del usuario (sin contraseña)

## 🔑 Interceptor de axios

El servicio agrega automáticamente el token en el header de cada petición:
```
Authorization: Bearer <token_jwt>
```

## 📱 Responsive

- ✅ Desktop (1200px+)
- ✅ Tablet (768px - 1199px)
- ✅ Mobile (< 768px)

## 🎯 Próximas mejoras

- [ ] Pantalla de recuperación de contraseña
- [ ] Gestión de préstamos
- [ ] Sistema de pagos
- [ ] Reportes y estadísticas
- [ ] Perfil de usuario
- [ ] Notificaciones

## ⚙️ Dependencias

- **Vue 3** - Framework de frontend
- **Vite** - Herramienta de construcción
- **Axios** - Cliente HTTP
- **@vitejs/plugin-vue** - Plugin de Vue para Vite

## 🔗 Conexión con Backend

El frontend se conecta con el backend en `http://localhost:3000`

**Endpoints utilizados:**
- `POST /api/auth/login` - Autenticación
- `GET /api/auth/me` - Verificar token (no implementado en UI aún)
