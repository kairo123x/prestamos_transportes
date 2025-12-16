import sql from 'mssql';

// Configuración de la conexión a la base de datos
export const configLogin = {
    user: 'sa',
    password: 'Ofisis2019',
    server: '190.119.104.44',
    database: 'CONEXION',
    options: {
      encrypt: true,
      trustServerCertificate: true,
      requestTimeout: 300000, // 5 minutos  
    }
  };
  

/*
export async function executeQuery(baseConfig, query, params = {}, dbName=null) {
    try {
     const dynamicConfig = dbName
        ? { ...baseConfig, database: dbName }
        : baseConfig;
    
      await sql.connect(dynamicConfig);
      const request = new sql.Request();
  
      for (const param in params) {
        request.input(param, params[param]);
      }
  
      const result = await request.query(query);
      return result.recordset;
    } catch (err) {
      console.error('Error al ejecutar executeQuery:', err);
      throw err;
    } finally {
      sql.close();
    }
  }


  
export async function executeQueryMultiple(baseConfig, query, params = {}, dbName=null) {
  try {
   const dynamicConfig = dbName
      ? { ...baseConfig, database: dbName }
      : baseConfig;
  
    await sql.connect(dynamicConfig);
    const request = new sql.Request();

    for (const param in params) {
      request.input(param, params[param]);
    }

    const result = await request.query(query);
    return result;
  } catch (err) {
    console.error('Error al ejecutar consulta:', err);
    throw err;
  } finally {
    sql.close();
  }
}


*/ 


// Versión mejorada con manejo adecuado de la conexión y cierre de la misma 
// después de cada operación para evitar problemas de conexión.
// Además, maneja múltiples conjuntos de resultados devueltos por la consulta.
// Retorna solo el recordset principal.
// Permite especificar una base de datos diferente si es necesario.
// Si no se especifica, usa la base de datos del config base.
export async function executeQuery(baseConfig, query, params = {}, dbName = null) {
  let pool;
  try {
    // Configuración dinámica para cambiar la base de datos si es necesario
    const dynamicConfig = dbName
      ? { ...baseConfig, database: dbName }
      : baseConfig;
      
    pool = await sql.connect(dynamicConfig);
    const request = new sql.Request();

    for (const param in params) {
      request.input(param, params[param]);
    }

    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error('Error al ejecutar executeQuery:', err);
    throw err;
  } finally {
    if (pool && pool.connected) {
      await pool.close();
    }
  }
}

// Versión mejorada con manejo adecuado de la conexión y retorno del objeto completo
// que incluye múltiples conjuntos de resultados si la consulta los devuelve.
// Permite especificar una base de datos diferente si es necesario.
// Si no se especifica, usa la base de datos del config base.
// Retorna el objeto completo con todos los resultados.
// Esto es útil para procedimientos almacenados que retornan múltiples conjuntos de datos.

export async function executeQueryMultiple(baseConfig, query, params = {}, dbName = null) {
  let pool;
  try {
    const dynamicConfig = dbName
      ? { ...baseConfig, database: dbName }
      : baseConfig;

    pool = await sql.connect(dynamicConfig);
    const request = new sql.Request();

    for (const param in params) {
      request.input(param, params[param]);
    }

    const result = await request.query(query);
    return result;
  } catch (err) {
    console.error('Error al ejecutar consulta:', err);
    throw err;
  } finally {
    if (pool && pool.connected) {
      await pool.close();
    }
  }
}