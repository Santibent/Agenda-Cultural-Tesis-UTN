import { Request, Response } from 'express';
/**
 * Controlador de Autenticación
 */
export declare class AutenticacionControlador {
    /**
     * Registro de nuevo usuario
     * POST /api/v1/auth/registro
     */
    static registro(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Login de usuario
     * POST /api/v1/auth/login
     */
    static login(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Obtener perfil del usuario autenticado
     * GET /api/v1/auth/perfil
     */
    static obtenerPerfil(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Actualizar perfil del usuario
     * PUT /api/v1/auth/perfil
     */
    static actualizarPerfil(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Verificar email
     * GET/POST /api/v1/auth/verificar-email
     */
    static verificarEmail(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Reenviar email de verificación
     * POST /api/v1/auth/reenviar-verificacion
     */
    static reenviarVerificacion(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Solicitar recuperación de contraseña
     * POST /api/v1/auth/recuperar-password
     */
    static recuperarPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Restablecer contraseña con token
     * POST /api/v1/auth/restablecer-password
     */
    static restablecerPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Cambiar contraseña (usuario autenticado)
     * POST /api/v1/auth/cambiar-password
     */
    static cambiarPassword(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Refrescar token de acceso
     * POST /api/v1/auth/refresh-token
     */
    static refrescarToken(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=autenticacion.controlador.d.ts.map