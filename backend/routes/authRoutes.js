import express from 'express';
import { loginController, listarEmpresas, verifyApiKey, apiResponse } from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * POST /api/auth/login
 * Autentica un usuario con email y contraseña
 * Body: { email, password }
 * Respuesta: { success, message, data: { IdUser, Token, ... } }
 */
router.post('/login', loginController);

/**
 * GET /api/auth/empresas
 * Lista todas las empresas disponibles
 * Headers: Authorization: Bearer <token>
 */
router.get('/empresas', verifyApiKey, listarEmpresas);

/**
 * GET /api/auth/me
 * Obtiene los datos del usuario autenticado
 * Headers: Authorization: Bearer <token>
 */
router.get('/me', verifyApiKey, (req, res) => {
  return apiResponse(res, true, 'Datos del usuario', req.user, 200);
});

export default router;
