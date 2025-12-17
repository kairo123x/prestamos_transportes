import { configLogin, executeQuery, executeQueryMultiple } from '../db/config.js';
import path from 'path';

export const listarPrestamos = async (req, res) => {
  try {
    const query = `
          SELECT DISTINCT STMPDH_ARTCOD AS CODIGO , STMPDH_DESCRP AS NOMBRE, STMPDH_TIPPRO AS CODIGO    
            FROM [03DERE].[dbo].[STMPDH]`;

    const result = await executeQuery(configLogin, query);

    res.json(result)
  } catch (error) {
    console.error("❌ Error en el controlador:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
}


/* export async function AsignarProducto(idDocument) {
  try {
    const query = `
          INSERT INTO MaterialesAsignados @idDocument = @idDocument`;

    const params = { idDocument };
    const result = await executeQueryMultiple(configLogin, query, params);

    return {
      factura: result.recordsets[0]?.[0] || null,
      detalles: result.recordsets[1] || [],
      doc_relacionados: result.recordsets[2] || [],
    };

  } catch (error) {
    console.error('❌ Error servicio: ', error);
    throw new Error(error.message || 'Error del servidor');
  }
} */