import { configLogin, executeQuery, executeQueryMultiple } from '../db/config.js';
import path from 'path';

export async function listarItemsDocumentoService(idDocument) {
  try {
    const query = `
          EXEC DATA_SIRE_DETALLE @idDocument = @idDocument`;

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
}


export const obtenerCorreoUsuario = async (idUsuario) => {
  const query = `
    SELECT TRAB_EMAILGO
    FROM RRHH_TRABAJADORES
    WHERE TRAB_ID = @idUsuario
  `;

  const params = { idUsuario };
  const result = await executeQuery(configLogin, query, params);

  if (result && result.length > 0) {
    return result[0].TRAB_EMAILGO;
  } else {
    throw new Error(`No se encontró el correo del usuario con ID ${idUsuario}`);
  }
};


export async function guardarRutaArchivoEnBD(idDocument, Path_File_relac, IdUserLogged, UsuarioLogged, Doc_Title, Doc_Description) {
  try {
    const query = `
          EXEC SP_INSERTAR_DOCUMENTO_RELACIONADO
            @IdDocumento = @idDocument,
            @Path_File_relac = @Path_File_relac,
            @IdUserLogged = @IdUserLogged,
            @UsuarioLogged = @UsuarioLogged,
            @Doc_Title = @Doc_Title,
            @Doc_Description = @Doc_Description
        `;

    const params = { idDocument, Path_File_relac, IdUserLogged, UsuarioLogged, Doc_Title, Doc_Description };
    const result = await executeQuery(configLogin, query, params);
    return result;

  } catch (error) {
    console.error('❌ Error servicio: ', error);
    throw new Error(error.message || 'Error del servidor');
  }
}

export async function actualizarDocumentoBD(Id_Relac, Path_toBD, id_user, user_email, file_titulo, file_descripcion) {
  try {
    const query = `
          EXEC SP_EDITAR_DOCUMENTO_RELACIONADO
              @ID = @Id_Relac,
              @Path_File_relac = @Path_toBD,
              @IdUserLogged = @id_user,
              @UsuarioLogged = @user_email,
              @Doc_Title = @file_titulo,
              @Doc_Description = @file_descripcion `;

    const params = { Id_Relac, Path_toBD, id_user, user_email, file_titulo, file_descripcion };
    const result = await executeQuery(configLogin, query, params);
    return result;

  } catch (error) {
    console.error('❌ Error servicio: ', error);
    throw new Error(error.message || 'Error del servidor');
  }
}


export async function obtenerFacturaConDetalles(idDocument) {
  try {
    const query = `
      EXEC SP_OBTENER_FACTURA_CON_DETALLES
        @IdDocument = @idDocument`;

    const params = { idDocument };
    const result = await executeQueryMultiple(configLogin, query, params);

    return {
      factura: result.recordsets[0]?.[0] || null,
      detalles: result.recordsets[1] || [],
      doc_relacionados: result.recordsets[2] || [],
      cuotas_relacionados: result.recordsets[3] || []
    };

  } catch (error) {
    console.error('❌ Error servicio: ', error);
    throw new Error(error.message || 'Error del servidor');
  }
}



export function construyeFilenamePdf(file_titulo) {
  try {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    const fechaNumerico = `${año}${mes}${dia}_${horas}${minutos}${segundos}`;

    const fileName = `${file_titulo}_${fechaNumerico}.pdf`;
    return fileName;

  } catch (error) {
    console.error('❌ Error servicio: ', error);
    throw new Error(error.message || 'Error del servicio');
  }
}

export function construyeFilenameConExtension(file_titulo,nombre_archivo ) {
  try {
    const fecha = new Date();
    const año = fecha.getFullYear();
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const dia = fecha.getDate().toString().padStart(2, '0');
    const horas = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    const fechaNumerico = `${año}${mes}${dia}_${horas}${minutos}${segundos}`;
    const extension = path.extname(nombre_archivo) || '.pdf';
    const sanitizedExtension = extension.toLowerCase();

    const fileName = `${file_titulo}_${fechaNumerico}${sanitizedExtension}`;
    return fileName;

  } catch (error) {
    console.error('❌ Error servicio: ', error);
    throw new Error(error.message || 'Error del servicio');
  }
}






