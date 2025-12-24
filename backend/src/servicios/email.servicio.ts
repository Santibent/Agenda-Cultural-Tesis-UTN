import nodemailer, { Transporter } from 'nodemailer';
import { configuracionServidor } from '../config/servidor.config';

class EmailServicio {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: configuracionServidor.smtp.host,
      port: configuracionServidor.smtp.port,
      secure: configuracionServidor.smtp.secure,
      auth: {
        user: configuracionServidor.smtp.user,
        pass: configuracionServidor.smtp.pass,
      },
    });

    this.verificarConexion();
  }

  private async verificarConexion(): Promise<void> {
    try {
      await this.transporter.verify();
      console.log('Servicio de email configurado correctamente');
    } catch (error) {
      console.error(' Error al configurar servicio de email:', error);
    }
  }

  async enviarEmailVerificacion(email: string, nombre: string, token: string): Promise<void> {
    const urlVerificacion = `${configuracionServidor.urlFrontend}/auth/verificar-email?token=${token}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #E53935 0%, #C62828 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border: 1px solid #ddd;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: #E53935;
              color: white !important;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎨 AGENDA CULTURAL</h1>
          </div>
          <div class="content">
            <h2>¡Hola ${nombre}!</h2>
            <p>Gracias por registrarte en <strong>Agenda Cultural</strong>.</p>
            <p>Para completar tu registro y verificar tu email, haz clic en el siguiente botón:</p>
            <div style="text-align: center;">
              <a href="${urlVerificacion}" class="button">✓ Verificar Email</a>
            </div>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #666; font-size: 12px;">${urlVerificacion}</p>
            <p><strong>⏰ Este enlace expirará en 24 horas.</strong></p>
            <p style="color: #999; font-size: 14px;">Si no creaste esta cuenta, puedes ignorar este email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Agenda Cultural. Todos los derechos reservados.</p>
          </div>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: `"Agenda Cultural" <${configuracionServidor.smtp.from}>`,
      to: email,
      subject: '✓ Verifica tu email - Agenda Cultural',
      html: htmlContent,
    });

    console.log(`✉️ Email de verificación enviado a: ${email}`);
  }

  async enviarEmailBienvenida(email: string, nombre: string): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #4CAF50 0%, #388E3C 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border: 1px solid #ddd;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: #4CAF50;
              color: white !important;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 12px;
            }
            .feature {
              background: white;
              padding: 15px;
              margin: 10px 0;
              border-radius: 5px;
              border-left: 4px solid #4CAF50;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 ¡Bienvenido a Agenda Cultural!</h1>
          </div>
          <div class="content">
            <h2>¡Hola ${nombre}!</h2>
            <p>Tu email ha sido verificado exitosamente. 🎊</p>
            <p>Ya puedes disfrutar de todas las funciones de <strong>Agenda Cultural</strong>:</p>
            
            <div class="feature">
              <strong>🎭 Descubre Eventos</strong><br>
              Explora una gran variedad de eventos culturales y artísticos.
            </div>
            
            <div class="feature">
              <strong>🎨 Solicita Flyers</strong><br>
              Pide diseños profesionales de flyers para tus eventos.
            </div>
            
            <div class="feature">
              <strong>📅 Gestiona tus Eventos</strong><br>
              Crea, edita y promociona tus propios eventos culturales.
            </div>

            <div style="text-align: center; margin-top: 30px;">
              <a href="${configuracionServidor.urlFrontend}/eventos" class="button">🚀 Explorar Eventos</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Agenda Cultural. Todos los derechos reservados.</p>
          </div>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: `"Agenda Cultural" <${configuracionServidor.smtp.from}>`,
      to: email,
      subject: '🎉 ¡Bienvenido a Agenda Cultural!',
      html: htmlContent,
    });

    console.log(`✉️ Email de bienvenida enviado a: ${email}`);
  }

  async enviarNotificacionNuevaSolicitud(nombreUsuario: string, nombreEvento: string, idSolicitud: number): Promise<void> {
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border: 1px solid #ddd;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: #2196F3;
              color: white !important;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🆕 Nueva Solicitud de Flyer</h1>
          </div>
          <div class="content">
            <h2>¡Nueva solicitud recibida!</h2>
            <p><strong>Usuario:</strong> ${nombreUsuario}</p>
            <p><strong>Evento:</strong> ${nombreEvento}</p>
            <p><strong>ID de Solicitud:</strong> #${idSolicitud}</p>
            <p>Una nueva solicitud de flyer ha sido creada y requiere tu atención.</p>
            <div style="text-align: center;">
              <a href="${configuracionServidor.urlFrontend}/admin/solicitudes/${idSolicitud}" class="button">📋 Revisar Solicitud</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Agenda Cultural - Panel de Administración</p>
          </div>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: `"Agenda Cultural" <${configuracionServidor.smtp.from}>`,
      to: 'admin@agendacultural.com',
      subject: '🆕 Nueva Solicitud de Flyer - Agenda Cultural',
      html: htmlContent,
    });

    console.log(`✉️ Notificación enviada al admin para solicitud #${idSolicitud}`);
  }

  async enviarNotificacionCambioEstado(emailUsuario: string, nombreUsuario: string, nombreEvento: string, nuevoEstado: string, idSolicitud: number): Promise<void> {
    const estados = {
      'PENDIENTE': 'Pendiente',
      'REVISANDO': 'En Revisión',
      'EN_PROCESO': 'En Proceso',
      'COMPLETADO': 'Completado',
      'RECHAZADO': 'Rechazado',
      'CANCELADO': 'Cancelado'
    };

    const estadoTexto = estados[nuevoEstado as keyof typeof estados] || nuevoEstado;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border: 1px solid #ddd;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: #FF9800;
              color: white !important;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 12px;
            }
            .status {
              background: #FFF3CD;
              border: 1px solid #FFC107;
              padding: 15px;
              border-radius: 5px;
              text-align: center;
              font-weight: bold;
              font-size: 18px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>📊 Actualización de Solicitud</h1>
          </div>
          <div class="content">
            <h2>¡Hola ${nombreUsuario}!</h2>
            <p>Tu solicitud para el evento <strong>"${nombreEvento}"</strong> ha sido actualizada.</p>
            <div class="status">
              Nuevo Estado: ${estadoTexto}
            </div>
            <p><strong>ID de Solicitud:</strong> #${idSolicitud}</p>
            <div style="text-align: center;">
              <a href="${configuracionServidor.urlFrontend}/mis-solicitudes/${idSolicitud}" class="button">📋 Ver Detalles</a>
            </div>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Agenda Cultural. Todos los derechos reservados.</p>
          </div>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: `"Agenda Cultural" <${configuracionServidor.smtp.from}>`,
      to: emailUsuario,
      subject: `📊 Solicitud Actualizada: ${estadoTexto} - Agenda Cultural`,
      html: htmlContent,
    });

    console.log(`✉️ Notificación de cambio de estado enviada a: ${emailUsuario}`);
  }

  async enviarEmailRecuperacion(email: string, nombre: string, token: string): Promise<void> {
    const urlRecuperacion = `${configuracionServidor.urlFrontend}/auth/restablecer-password?token=${token}`;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9f9f9;
              padding: 30px;
              border: 1px solid #ddd;
              border-radius: 0 0 10px 10px;
            }
            .button {
              display: inline-block;
              padding: 15px 30px;
              background: #FF9800;
              color: white !important;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .footer {
              text-align: center;
              padding: 20px;
              color: #666;
              font-size: 12px;
            }
            .warning {
              background: #FFF3CD;
              border: 1px solid #FFC107;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🔐 Recuperación de Contraseña</h1>
          </div>
          <div class="content">
            <h2>¡Hola ${nombre}!</h2>
            <p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en <strong>Agenda Cultural</strong>.</p>
            <p>Haz clic en el siguiente botón para crear una nueva contraseña:</p>
            <div style="text-align: center;">
              <a href="${urlRecuperacion}" class="button">🔑 Restablecer Contraseña</a>
            </div>
            <p>O copia y pega este enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #666; font-size: 12px;">${urlRecuperacion}</p>
            
            <div class="warning">
              <strong>⏰ Este enlace expirará en 1 hora.</strong>
            </div>

            <p style="color: #999; font-size: 14px;">Si no solicitaste restablecer tu contraseña, puedes ignorar este email de forma segura.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Agenda Cultural. Todos los derechos reservados.</p>
          </div>
        </body>
      </html>
    `;

    await this.transporter.sendMail({
      from: `"Agenda Cultural" <${configuracionServidor.smtp.from}>`,
      to: email,
      subject: '🔐 Recuperación de Contraseña - Agenda Cultural',
      html: htmlContent,
    });

    console.log(`✉️ Email de recuperación enviado a: ${email}`);
  }
}

export default new EmailServicio();