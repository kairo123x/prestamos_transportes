/**
 * @fileoverview Controlador de autenticación y gestión de empresas
 * @module controllers/auth
 */

import sql from 'mssql';
import bcrypt from 'bcrypt';
import { apiKeys } from '../middlewares/verifyApiKey.js';
import { configLogin } from '../db/config.js';
import { apiResponse } from '../utils/helper.js';
import express from 'express';
import cors from 'cors';

// Configuración de CORS y middleware
const app = express();
app.use(cors());
app.use(express.json());

/**
 * Controlador para la autenticación de usuarios
 * @async
 * @function loginController
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} req.body - Cuerpo de la solicitud
 * @param {string} req.body.email - Correo electrónico del usuario
 * @param {string} req.body.password - Contraseña del usuario
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<Object>} Respuesta con los datos del usuario y token de autenticación
 */
export const loginController = async (req, res) => {
  // Obtener email y password del cuerpo de la solicitud
  const { email, password } = req.body;
  // Validar que se proporcionen email y password
  if (!email || !password) {
    return apiResponse(res, false, 'Login y password son requeridos', null, 400);
  }
  // Intentar conectar a la base de datos y verificar las credenciales
  try {
    await sql.connect(configLogin);

    const request = new sql.Request();
    request.input('TRAB_EMAIL', sql.NVarChar, email);
    request.input('TRAB_PASSWORD', sql.NVarChar, password);
    const result = await request.execute('sp_LoginAppGO');
    const user = result.recordset[0]

    if (user.success === 1 ) {
      const apikey = await bcrypt.hash(user.TRAB_EMAIL, 10);

      // Almacenar la API Key en el mapa
      apiKeys.set(apikey, {
        email: user.TRAB_EMAIL,
        id: user.TRAB_ID,
        rol: user.TRAB_ROLNAME,
        area: user.TRAB_AREA
      });

      console.log("ingreso usuario al sistema:", user.TRAB_EMAIL);

      return apiResponse(res, true, 'Conexión exitosa', {
        IdUser: user.TRAB_ID,
        Dni:user.TRAB_DNI,
        TrabUsuInt: user.TRAB_USUINT,
        Nombres: user.TRAB_NOMBRES,
        Apellidos: user.TRAB_APELLPAT + ' ' + user.TRAB_APELLMAT,
        Rolname: user.TRAB_ROLNAME,
        Area: user.TRAB_AREA,
        Email: user.TRAB_EMAIL,
        Codemp: user.TRAB_CODEMP,
        EmpresaName: user.EMP_DESCRIPCION,
        HasPermisoLogistica: user.IsLogisticaSire,
        Token: apikey
      });

    } else {
      return apiResponse(res, false, 'Credenciales incorrectas', null, 401);
    }
  } catch (err) {
    console.error('Error en controlador', err.message);
    return apiResponse(res, false, 'Error del servidor', null, 500);
  } finally {
    sql.close();
  }
};



/**
 * Controlador para listar todas las empresas disponibles
 * @async
 * @function listarEmpresas
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Promise<Object>} Lista de empresas desde la base de datos
 * @description Ejecuta el procedimiento almacenado SP_LISTAR_EMPRESAS para obtener todas las empresas registradas
 */
export const listarEmpresas = async (req, res) => {
  try {
    // Establecer conexión con la base de datos
    const pool = await sql.connect(configLogin);

    // Ejecutar el procedimiento almacenado
    const query = `EXEC SP_LISTAR_EMPRESAS`;
    const result = await pool.request().query(query);

    // Devolver los resultados
    res.json(result.recordset);
  } catch (error) {
    console.error("❌ Error al ejecutar SP_LISTAR_EMPRESAS:", error);
    res.status(500).json({ success: false, message: "Error al obtener las empresas" });
  }
};


