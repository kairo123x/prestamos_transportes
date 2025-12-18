import express from 'express';

import { verifyApiKey } from '../middlewares/verifyApiKey.js';
import { 
    listarProductos, 
    listarMaterialesAsignados, 
    AsignarMaterial, 
    listarTrabajadores, 
    listarMaterialesAsignadosTotal,
    ConsumirMaterialAsignado 
} from '../controllers/prestamos.controller.js';

const router = express.Router();

router.get('/lista-productos', listarProductos);
router.get('/materiales-asignados', listarMaterialesAsignados)
router.post('/asignar-marterial', AsignarMaterial)
router.get('/listar-trabajadores', listarTrabajadores)
router.get('/materiales-asignados-total', listarMaterialesAsignadosTotal)
router.post('/consumir-material-asignado', ConsumirMaterialAsignado)

export default router;

