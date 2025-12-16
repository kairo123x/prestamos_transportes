import express from 'express';
import { loginController, listarEmpresas} from '../controllers/auth.controller.js';
import { verifyApiKey } from '../middlewares/verifyApiKey.js';

const router = express.Router();

// Rutas públicas (sin autenticación)
router.post('/auth/login', loginController);

// Rutas protegidas (requieren API Key)
router.get('/empresas/list', verifyApiKey, listarEmpresas);

export default router;

