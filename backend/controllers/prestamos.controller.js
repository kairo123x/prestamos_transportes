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

export const listarPrestamosRealizados = async (req, res) => {
  try {
    const { dniPrestador } = req.query;

    const query = `
    SELECT 
          p.*,
          m.descripcionProducto,
          CONCAT(t1.TRAB_APELLPAT, ' ', t1.TRAB_APELLMAT, ' ', t1.TRAB_NOMBRES) AS nombrePrestador,
          CONCAT(t2.TRAB_APELLPAT, ' ', t2.TRAB_APELLMAT, ' ', t2.TRAB_NOMBRES) AS nombreRecepcionador
      FROM PrestamoMateriales p
      INNER JOIN MaterialesAsignados m 
          ON p.tipoProducto = m.tipoProducto 
        AND p.codProducto = m.codProducto 
        AND p.dniPrestador = m.dni
      INNER JOIN RRHH_TRABAJADORES t1 
          ON t1.TRAB_DNI = p.dniPrestador 
        AND t1.TRAB_ESTADO = 1
      INNER JOIN RRHH_TRABAJADORES t2 
          ON t2.TRAB_DNI = p.dniRecepcionador 
        AND t2.TRAB_ESTADO = 1
      WHERE p.dniPrestador = @dniPrestador`;

    const params = {
      dniPrestador: dniPrestador
    }

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

export const listarPrestamosRecibidos = async (req, res) => {
  try {
    const { dniRecepcionador } = req.query;

    const query = `
      SELECT 
          p.*,
          m.descripcionProducto,
          CONCAT(t1.TRAB_APELLPAT, ' ', t1.TRAB_APELLMAT, ' ', t1.TRAB_NOMBRES) AS nombrePrestador,
          CONCAT(t2.TRAB_APELLPAT, ' ', t2.TRAB_APELLMAT, ' ', t2.TRAB_NOMBRES) AS nombreRecepcionador
      FROM PrestamoMateriales p
      INNER JOIN MaterialesAsignados m 
          ON p.tipoProducto = m.tipoProducto 
        AND p.codProducto = m.codProducto 
        AND p.dniPrestador = m.dni
      INNER JOIN RRHH_TRABAJADORES t1 
          ON t1.TRAB_DNI = p.dniPrestador 
        AND t1.TRAB_ESTADO = 1
      INNER JOIN RRHH_TRABAJADORES t2 
          ON t2.TRAB_DNI = p.dniRecepcionador 
        AND t2.TRAB_ESTADO = 1
      WHERE dniRecepcionador=@dniRecepcionador`;

    const params = {
      dniRecepcionador: dniRecepcionador
    }

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

export const prestarMaterial = async (req, res) => {
  try {
    const { dniPrestador, dniRecepcionador, codEmpresa, tipoProducto, codProducto, prestamoAprobado, devolverPrestamo, cantidad, fechaPrestamo } = req.body;

    const query = `
    insert into PrestamoMateriales(dniPrestador, dniRecepcionador, codEmpresa, tipoProducto, codProducto, prestamoAprobado, devolverPrestamo, devolucionConfirmada, cantidad, fechaPrestamo) 
    values (@dniPrestador, @dniRecepcionador, @codEmpresa, @tipoProducto, @codProducto, 0, 0, 0, @cantidad, @fechaPrestamo)
    
    update MaterialesAsignados
    set cantidad = cantidad - @cantidad
    where dni = @dniPrestador and codEmpresa = @codEmpresa and tipoProducto = @tipoProducto and codProducto = @codProducto`;

    const params = {
      dniPrestador: dniPrestador,
      dniRecepcionador: dniRecepcionador, 
      codEmpresa: codEmpresa,
      tipoProducto: tipoProducto,
      codProducto: codProducto,
      prestamoAprobado: prestamoAprobado,
      devolverPrestamo: devolverPrestamo,
      cantidad: cantidad,
      fechaPrestamo: fechaPrestamo
    }

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

export const cancelarPrestamo = async (req, res) => {
  try {
    const { idPrestamo } = req.body;

    const query = `
    UPDATE ma
    SET ma.cantidad = ma.cantidad + pm.cantidad
    FROM MaterialesAsignados AS ma
    INNER JOIN PrestamoMateriales AS pm
        ON ma.tipoProducto = pm.tipoProducto
      AND ma.codProducto  = pm.codProducto
      AND ma.dni          = pm.dniPrestador
    WHERE ma.codEmpresa = '02'
      AND pm.idPrestamo = @idPrestamo
      
    delete from PrestamoMateriales
    WHERE idPrestamo = @idPrestamo
    `;

    
    const params = {
      idPrestamo: idPrestamo
    }

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

export const aprobarMaterialRecibido = async (req, res) => {
  try {

    const { idPrestamo } = req.body;

    const query = `
      DECLARE 
        @dniRecepcionador VARCHAR(8),
        @codEmpresa VARCHAR(2),
        @tipoProducto VARCHAR(6),
        @codProducto VARCHAR(30),
        @cantidad INT,
        @fechaPrestamo DATE,
        @descripcionProducto VARCHAR(255);

      SELECT 
        @dniRecepcionador = dniRecepcionador,
        @codEmpresa = codEmpresa,
        @tipoProducto = tipoProducto,
        @codProducto = codProducto,
        @cantidad = cantidad,
        @fechaPrestamo = fechaPrestamo
      FROM PrestamoMateriales
      WHERE idPrestamo = @idPrestamo;

      SELECT 
        @descripcionProducto = STMPDH_DESCRP
      FROM [02STMA].[dbo].[STMPDH]
      WHERE STMPDH_ARTCOD = @codProducto
        AND STMPDH_TIPPRO = @tipoProducto;

      UPDATE PrestamoMateriales 
      SET prestamoAprobado = 1
      WHERE idPrestamo = @idPrestamo;

      IF EXISTS (
        SELECT 1 FROM MaterialesAsignados 
        WHERE dni = @dniRecepcionador
          AND codEmpresa = @codEmpresa
          AND tipoProducto = @tipoProducto
          AND codProducto = @codProducto
      )
      BEGIN
        UPDATE MaterialesAsignados
        SET cantidad = cantidad + @cantidad
        WHERE dni = @dniRecepcionador
          AND codEmpresa = @codEmpresa
          AND tipoProducto = @tipoProducto
          AND codProducto = @codProducto;
      END
      ELSE
      BEGIN
        INSERT INTO MaterialesAsignados(
          dni,
          codEmpresa,
          tipoProducto,
          codProducto,
          descripcionProducto,
          cantidad,
          fechaAsignada
        )
        VALUES (
          @dniRecepcionador,
          @codEmpresa,
          @tipoProducto,
          @codProducto,
          ISNULL(@descripcionProducto, @codProducto),
          @cantidad,
          @fechaPrestamo
        );
      END
    `;

    const params = {
      idPrestamo: idPrestamo
    }

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

export const listarMaterialesTrabajadorCombinado = async (req, res) => {
  try {
    const { dni } = req.query;

    const query = `
      SELECT 
        src.dni,
        src.codEmpresa,
        src.tipoProducto,
        src.codProducto,
        src.descripcionProducto,
        SUM(src.cantidad) AS cantidad
      FROM (
        SELECT 
          MA.dni,
          MA.codEmpresa,
          MA.tipoProducto,
          MA.codProducto,
          MA.descripcionProducto,
          MA.cantidad
        FROM MaterialesAsignados MA
        WHERE MA.dni = @dni
        UNION ALL
        SELECT 
          PM.dniRecepcionador AS dni,
          PM.codEmpresa,
          PM.tipoProducto,
          PM.codProducto,
          PM.codProducto AS descripcionProducto,
          PM.cantidad
        FROM PrestamoMateriales PM
        WHERE PM.dniRecepcionador = @dni
          AND PM.prestamoAprobado = 1
          AND PM.devolverPrestamo = 0
      ) AS src
      GROUP BY 
        src.dni,
        src.codEmpresa,
        src.tipoProducto,
        src.codProducto,
        src.descripcionProducto
    `;

    const params = {
      dni: dni
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

export const devolverMaterial = async (req, res) => {
  try {
    const { idPrestamo } = req.body

    const query = `
      UPDATE M
      SET M.cantidad = M.cantidad - P.cantidad
      FROM MaterialesAsignados M
      INNER JOIN PrestamoMateriales P
          ON M.dni = P.dniRecepcionador
        AND M.codEmpresa = P.codEmpresa
        AND M.codProducto = P.codProducto
      WHERE P.idPrestamo = @idPrestamo;

      UPDATE PrestamoMateriales
      SET devolverPrestamo = 1
      WHERE idPrestamo = @idPrestamo
    `;

    const params = {
      idPrestamo: idPrestamo 
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


export const confirmarDevolucion = async (req, res) => {
  try {
    const { idPrestamo } = req.body

    const query = `
      UPDATE M
      SET M.cantidad = M.cantidad + P.cantidad
      FROM MaterialesAsignados M
      INNER JOIN PrestamoMateriales P
          ON M.dni = P.dniPrestador
        AND M.codEmpresa = P.codEmpresa
        AND M.codProducto = P.codProducto
      WHERE P.idPrestamo = @idPrestamo;

      UPDATE PrestamoMateriales
      SET devolverPrestamo = 1,
          devolucionConfirmada = 1
      WHERE idPrestamo = @idPrestamo;
    `;

    const params = {
      idPrestamo: idPrestamo 
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

export const cancelarDevolucion = async (req, res) => {
  try {
    const { idPrestamo } = req.body

    const query = `
      UPDATE M
      SET M.cantidad = M.cantidad + P.cantidad
      FROM MaterialesAsignados M
      INNER JOIN PrestamoMateriales P
          ON M.dni = P.dniRecepcionador
        AND M.codEmpresa = P.codEmpresa
        AND M.codProducto = P.codProducto
      WHERE P.idPrestamo = @idPrestamo;

      UPDATE PrestamoMateriales
      SET devolverPrestamo = 0,
          devolucionConfirmada = 0;
    `;

    const params = {
      idPrestamo: idPrestamo 
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