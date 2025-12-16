import { google } from 'googleapis';

// La función para subir archivos a Google Drive
export async function subirArchivoADrive(fileBuffer, filename, tokens) {
  console.log('🚀 Iniciando subida de archivo a Google Drive');

  // Configura el cliente OAuth con los tokens
  const auth = new google.auth.OAuth2();
  auth.setCredentials(tokens);

  const drive = google.drive({ version: 'v3', auth });

  try {
    const response = await drive.files.create({
      requestBody: {
        name: filename,
        mimeType: 'application/pdf', // O el tipo adecuado para tu archivo
      },
      media: {
        mimeType: 'application/pdf',
        body: Buffer.from(fileBuffer),
      },
    });

    console.log('✅ Archivo creado en Drive. ID:', response.data.id);

    // Crear permisos para hacer público el archivo
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // URL pública para el archivo
    const publicUrl = `https://drive.google.com/uc?id=${response.data.id}&export=download`;
    console.log('🌐 URL pública generada:', publicUrl);

    return publicUrl;

  } catch (error) {
    console.error('❌ Error al subir archivo a Google Drive:', error);
    throw error;
  }
}
