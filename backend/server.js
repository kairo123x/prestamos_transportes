import express from 'express';
import http from 'http'; 
import cors from 'cors';
/* import comprasRoutes from './routes/compras.routes.js';
import seguimientoRoutes from './routes/Seguimiento.routes.js';
import trabajadoresRoutes from './routes/trabajadores.routes.js';
import vacacionesRoutes from './routes/vacaciones.routes.js';
import guiassRoutes from './routes/guias.routes.js';
import cargasRoutes from './routes/cargaTransporte.routes.js'; */
import authRoutes from './routes/auth.routes.js';
import { initSocket } from './services/socket.js';
/* import boletasRoutes from './routes/boletas.routes.js';
import tareoRoutes from './routes/tareos.routes.js'; */
import dotenv from "dotenv";
import prestamoRoutes from './routes/prestamo.routes.js';
/* import filePersonalRoutes from './routes/filePersonal.routes.js';
import dashboardRoutes from './routes/dashboard.routes.js'
import contratosRoutes from './routes/contratos.routes.js';
import tesoreriaRoutes from './routes/tesoreria.routes.js';
import almacenRoutes from './routes/almacen.routes.js'; */

dotenv.config();

const app = express();
const server = http.createServer(app);

// Inicializar Socket.io
initSocket(server);

const host = process.env.API_HOST || 'localhost';
const port = process.env.API_PORT || 3000;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api', authRoutes);
app.use('/api/prestamos', prestamoRoutes);

/* app.use('/app4/dashboard', dashboardRoutes);
app.use('/app4/seguimiento', seguimientoRoutes);
app.use('/app4/compras', comprasRoutes);
app.use('/app4/vacaciones', vacacionesRoutes);
app.use('/app4/trabajadores', trabajadoresRoutes);
app.use('/app4/guias', guiassRoutes);
app.use('/app4/cargas', cargasRoutes);
app.use('/app4/boletas', boletasRoutes);
app.use('/app4/tareos', tareoRoutes);
app.use('/app4/filePersonal', filePersonalRoutes);
app.use('/app4/contratos', contratosRoutes); 
app.use('/app4/tesoreria', tesoreriaRoutes);
app.use('/app4/almacen', almacenRoutes); */

server.listen(port, host, () => {
  console.log(`🚀 Servidor corriendo en http://${host}:${port}`);
});

