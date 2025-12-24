/**
 * Servicio de Email
 */
declare class EmailServicio {
    private transporter;
    constructor();
    /**
     * Verificar conexión SMTP
     */
    private verificarConexion;
    /**
     * Enviar email de verificación
     */
    enviarEmailVerificacion(email: string, nombre: string, token: string): Promise<void>;
    /**
     * Enviar email de bienvenida (después de verificar)
     */
    enviarEmailBienvenida(email: string, nombre: string): Promise<void>;
    /**
     * Enviar notificación de nueva solicitud al admin
     */
    enviarNotificacionNuevaSolicitud(nombreUsuario: string, nombreEvento: string, idSolicitud: number): Promise<void>;
    /**
     * Enviar notificación de cambio de estado al usuario
     */
    enviarNotificacionCambioEstado(emailUsuario: string, nombreUsuario: string, nombreEvento: string, nuevoEstado: string, idSolicitud: number): Promise<void>;
    /**
     * Enviar email de recuperación de contraseña
     */
    enviarEmailRecuperacion(email: string, nombre: string, token: string): Promise<void>;
}
declare const _default: EmailServicio;
export default _default;
//# sourceMappingURL=email.servicio.d.ts.map