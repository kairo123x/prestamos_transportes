import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com', // O el servidor SMTP de tu empresa
  port: 465,
  secure: true,
  auth: {
    user: 'tucorreo@empresa.com',
    pass: 'tu_contraseña_o_token_app'
  }
});

export const enviarCorreoNotificacion = async (destinatario, asunto, mensaje) => {
  try {
    await transporter.sendMail({
      from: '"Sistema Interno" <tucorreo@empresa.com>',
      to: destinatario,
      subject: asunto,
      text: mensaje,
    });
    console.log(`✉️ Correo enviado a ${destinatario}`);
  } catch (error) {
    console.error("❌ Error al enviar correo:", error.message);
  }
};
