# 🚗 Sistema de Gestión de Préstamos para Transporte

Aplicación full-stack para gestionar préstamos de transporte con autenticación de trabajadores.

## 📁 Estructura del Proyecto

```
prestamos_transporte/
├── backend/                    # API Express.js
│   ├── controllers/
│   │   └── authController.js  # Lógica de autenticación
│   ├── routes/
│   │   └── authRoutes.js      # Rutas de API
│   ├── db/
│   │   └── config.js          # Configuración de BD
│   ├── server.js              # Servidor principal
│   ├── .env                   # Variables de entorno
│   └── package.json
│
├── frontend/                   # Vue 3 + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.vue      # Pantalla de login
│   │   │   └── Dashboard.vue  # Panel principal
│   │   ├── services/
│   │   │   └── authService.js # Servicio HTTP
│   │   ├── App.vue
│   │   └── main.js
│   ├── .env                   # Variables de entorno
│   └── package.json
│
├── start-dev.bat              # Script para Windows (CMD)
├── start-dev.ps1              # Script para Windows (PowerShell)
└── README.md
```

## 🚀 Inicio Rápido

### Opción 1: Usar el Script (Windows)

#### Con CMD:
```bash
start-dev.bat
```

#### Con PowerShell:
```powershell
.\start-dev.ps1
```

### Opción 2: Inicio Manual

#### 1. Terminal 1 - Backend
```bash
cd backend
npm install
npm run dev
```

#### 2. Terminal 2 - Frontend
```bash
cd frontend
npm install
npm run dev
```

## ⚙️ Configuración

### Backend (.env)
```
PORT=3000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-2024
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
```

## 🔐 Autenticación

### Login
**POST** `/api/auth/login`

```json
{
  "TRAB_ID": "E001",
  "TRAB_PASSWORD": "password"
}
```

**Respuesta:**
```json
{
  "success": true,
  "token": "jwt_token...",
  "trabajador": {
    "TRAB_ID": "E001",
    "TRAB_NOMBRES": "Juan",
    "TRAB_EMAIL": "juan@example.com",
    ...
  }
}
```

## 📊 Base de Datos

Tabla principal: `RRHH_TRABAJADORES`

Campos utilizados:
- `TRAB_ID` - ID del trabajador
- `TRAB_PASSWORD` - Contraseña (bcrypt)
- `TRAB_NOMBRES` - Nombre completo
- `TRAB_EMAIL` - Correo electrónico
- `TRAB_ROLNAME` - Rol/Puesto
- `TRAB_AREA` - Área de trabajo
- `TRAB_DNI` - DNI
- `TRAB_FECHAINRESO` - Fecha de ingreso
- `TRAB_FECHACESE` - Fecha de cese

## 🛠️ Tecnologías

### Backend
- **Node.js** - Runtime
- **Express.js** - Framework web
- **MSSQL** - Conexión a BD SQL Server
- **bcryptjs** - Hash de contraseñas
- **jsonwebtoken** - Tokens JWT
- **CORS** - Control de origen
- **Dotenv** - Variables de entorno

### Frontend
- **Vue 3** - Framework de UI
- **Vite** - Herramienta de construcción
- **Axios** - Cliente HTTP
- **localStorage** - Almacenamiento local

## 📱 Características

✅ Autenticación con JWT
✅ Gestión de sesiones
✅ Interfaz responsive
✅ Validación de credenciales
✅ Dashboard personalizado
✅ Tokens con expiración (24h)

## 🔗 URLs

- **Frontend**: http://localhost:5173
- **Backend**: http://localhost:3000
- **API Base**: http://localhost:3000/api

## 📝 Scripts disponibles

### Backend
```bash
npm run dev      # Inicia en modo desarrollo con nodemon
npm start        # Inicia en modo producción
```

### Frontend
```bash
npm run dev      # Inicia servidor de desarrollo
npm run build    # Construye para producción
npm run preview  # Vista previa del build
```

## 🔒 Seguridad

- Contraseñas hasheadas con bcryptjs
- JWT con expiración de 24h
- CORS configurado
- Validación de entrada
- Variables sensibles en .env

## 🚨 Troubleshooting

### Puerto 3000 o 5173 en uso
```bash
# Cambiar puerto en .env
PORT=3001  # Backend

# O en package.json del frontend
"dev": "vite --port 5174"
```

### Conexión a BD rechazada
- Verificar credenciales en `db/config.js`
- Verificar que SQL Server está en ejecución
- Verificar firewall

### CORS Error
- Verificar que frontend está en `http://localhost:5173`
- Verificar que backend está en `http://localhost:3000`

## 📚 Documentación Adicional

Ver [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) en la carpeta backend.

## 👤 Autor

Desarrollado para Gestión de Préstamos de Transporte

## 📄 Licencia

MIT
