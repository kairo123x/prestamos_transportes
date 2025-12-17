import express from 'express';

import { verifyApiKey } from '../middlewares/verifyApiKey.js';
import { listarPrestamos } from '../controllers/prestamos.controller.js';

const router = express.Router();

router.get('/', listarPrestamos);

export default router;

