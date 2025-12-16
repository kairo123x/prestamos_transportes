/**
 * @fileoverview Controlador de autenticación y gestión de empresas
 * @module controllers/auth
 */

import sql from 'mssql';
import bcrypt from 'bcrypt';
import { configLogin } from '../db/config.js';

// Almacenamiento de API Keys en memoria
export const apiKeys = new Map();

/**
 * Utilidad para respuestas API
 */
export const apiResponse = (res, success, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success,
    message,
    data
  });
};

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
    return apiResponse(res, false, 'Email y password son requeridos', null, 400);
  }
  
  // Intentar conectar a la base de datos y verificar las credenciales
  try {
    const pool = new sql.ConnectionPool(configLogin);
    await pool.connect();

    const request = new sql.Request(pool);
    request.input('TRAB_EMAIL', sql.NVarChar, email);
    request.input('TRAB_PASSWORD', sql.NVarChar, password);
    
    const result = await request.execute('sp_LoginAppGO');
    const user = result.recordset[0];

    if (user && user.success === 1) {
      // Generar API Key basado en email del usuario
      const apikey = await bcrypt.hash(user.TRAB_EMAIL, 10);

      // Almacenar la API Key en el mapa
      apiKeys.set(apikey, {
        email: user.TRAB_EMAIL,
        id: user.TRAB_ID,
        rol: user.TRAB_ROLNAME,
        area: user.TRAB_AREA,
        empresa: user.TRAB_CODEMP
      });

      console.log(`✓ Ingreso usuario al sistema: ${user.TRAB_EMAIL}`);

      return apiResponse(res, true, 'Conexión exitosa', {
        IdUser: user.TRAB_ID,
        TrabUsuInt: user.TRAB_USUINT,
        Nombres: user.TRAB_NOMBRES,
        Apellidos: `${user.TRAB_APELLPAT} ${user.TRAB_APELLMAT}`,
        Rolname: user.TRAB_ROLNAME,
        Area: user.TRAB_AREA,
        Email: user.TRAB_EMAIL,
        Codemp: user.TRAB_CODEMP,
        EmpresaName: user.EMP_DESCRIPCION,
        HasPermisoLogistica: user.IsLogisticaSire,
        Token: apikey
      }, 200);

    } else {
      return apiResponse(res, false, 'Credenciales incorrectas', null, 401);
    }
  } catch (err) {
    console.error('❌ Error en loginController:', err.message);
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
    const pool = new sql.ConnectionPool(configLogin);
    await pool.connect();

    // Ejecutar el procedimiento almacenado
    const request = new sql.Request(pool);
    const result = await request.execute('SP_LISTAR_EMPRESAS');

    // Devolver los resultados
    return apiResponse(res, true, 'Empresas obtenidas correctamente', result.recordset, 200);

  } catch (error) {
    console.error("❌ Error al ejecutar SP_LISTAR_EMPRESAS:", error);
    return apiResponse(res, false, "Error al obtener las empresas", null, 500);
  } finally {
    sql.close();
  }
};

/**
 * Middleware para verificar API Key
 * @function verifyApiKey
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @param {Function} next - Siguiente middleware
 */
export const verifyApiKey = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return apiResponse(res, false, 'Token no proporcionado', null, 401);
  }

  const user = apiKeys.get(token);
  if (!user) {
    return apiResponse(res, false, 'Token inválido o expirado', null, 401);
  }

  req.user = user;
  next();
};

