import { google } from 'googleapis';
import { config } from '../config.js';

const auth = new google.auth.GoogleAuth({
  keyFile: 'ruta/a/tu/credencial.json', 
  scopes: ['https://www.googleapis.com/auth/drive'],
});

const drive = google.drive({ version: 'v3', auth });

export async function subirArchivoADrive(fileBuffer, filename) {
  console.log('🚀 Iniciando subida de archivo a Google Drive');
  console.log('📄 Nombre del archivo:', filename);
  console.log('📦 Tamaño del archivo (bytes):', fileBuffer.length);

  try {
    const response = await drive.files.create({
      requestBody: {
        name: filename,
        parents: [config.driveFolderId],
        mimeType: 'application/pdf',
      },
      media: {
        mimeType: 'application/pdf',
        body: Buffer.from(fileBuffer),
      },
    });

    console.log('✅ Archivo creado en Drive. ID:', response.data.id);

    // Permiso público
    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const publicUrl = `https://drive.google.com/uc?id=${response.data.id}&export=download`;
    console.log('🌐 URL pública generada:', publicUrl);

    return publicUrl;

  } catch (error) {
    console.error('❌ Error al subir archivo a Google Drive:', error);
    throw error;
  }
}
