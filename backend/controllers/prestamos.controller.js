import { configLogin, executeQuery, executeQueryMultiple } from '../db/config.js';

export const listarProductos = async (req, res) => {
  try {
    const { search } = req.query
    const query = `
      SELECT TOP 50
        STMPDH_ARTCOD AS CODIGO,
        STMPDH_DESCRP AS NOMBRE,
        STMPDH_TIPPRO AS TIPO
      FROM [02STMA].[dbo].[STMPDH]
      WHERE STMPDH_DESCRP LIKE '%' + @q + '%'
    `
    const params = {
      q: search
    }
    const result = await executeQuery(configLogin, query, params)
    res.status(200).json({ success: true, data: result })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error del servidor' })
  }
}

export const listarMaterialesAsignados = async (req, res) => {
  try {
    const { dni } = req.query

    const query = `EXEC RECOVER_MATERIALES_ASIGNADOS @dni`;

    const params = { 
      dni:dni 
    };

    const result = await executeQuery(configLogin, query, params);

    res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error("❌ Error en el controlador:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
}

export const listarMaterialesAsignadosTotal = async (req, res) => {
  try {
    const { dni } = req.query

    const query = `SELECT * FROM MaterialesAsignados`;

    const result = await executeQuery(configLogin, query);

    res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error("❌ Error en el controlador:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
}

export const AsignarMaterial = async (req, res) => {
  try {
    const { dni, codEmpresa, tipoProducto, codProducto, descripcionProducto, cantidad, fechaAsignada } = req.body

    const query = `INSERT INTO MaterialesAsignados(dni, codEmpresa, tipoProducto, codProducto, descripcionProducto, cantidad, fechaAsignada)
      VALUES(@dni, @codEmpresa, @tipoProducto, @codProducto, @descripcionProducto, @cantidad, @fechaAsignada) `;

    const params = { 
      dni: dni,
      codEmpresa: codEmpresa,
      tipoProducto: tipoProducto,
      codProducto: codProducto,
      descripcionProducto: descripcionProducto,
      cantidad: cantidad,
      fechaAsignada: fechaAsignada,
      cantidad:cantidad 
    };

    const result = await executeQuery(configLogin, query, params);

    res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error("❌ Error en el controlador:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
}

export const ConsumirMaterialAsignado = async (req, res) => {
  try {
    const { cantidad, idMaterialAsignado } = req.body

    const query = `
      UPDATE MaterialesAsignados
      SET cantidad = cantidad - @cantidad
      WHERE idMaterialAsignado = @idMaterial
        AND cantidad >= @cantidad
    `;

    const params = {
      cantidad:cantidad,
      idMaterial: idMaterialAsignado 
    };

    const result = await executeQuery(configLogin, query, params);

    res.status(200).json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error("❌ Error en el controlador:", error);
    res.status(500).json({ success: false, message: "Error del servidor" });
  }
}

export const listarTrabajadores = async (req, res) => {
  try {
    const query = `select * from RRHH_TRABAJADORES where TRAB_AREA = 'TRANSPORTE' AND TRAB_ESTADO=1`;

    const result = await executeQuery(configLogin, query);

    res.status(200).json({
      success: true,
      data: result
    })
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