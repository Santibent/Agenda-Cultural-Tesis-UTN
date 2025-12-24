import { Response } from 'express';
/**
 * Clase para manejar respuestas HTTP estandarizadas
 */
export declare class RespuestaUtil {
    /**
     * Respuesta exitosa
     */
    static exito<T = any>(res: Response, mensaje: string, datos?: T, codigoEstado?: number, meta?: any): Response;
    /**
     * Respuesta de error
     */
    static error(res: Response, mensaje: string, codigoEstado?: number, errores?: any[], datos?: any, codigo?: string): Response;
    /**
     * Respuesta de creación exitosa (201)
     */
    static creado<T = any>(res: Response, mensaje: string, datos?: T): Response;
    /**
     * Respuesta sin contenido (204)
     */
    static sinContenido(res: Response): Response;
    /**
     * Respuesta de error de validación (422)
     */
    static errorValidacion(res: Response, errores: any[]): Response;
    /**
     * Respuesta de no autorizado (401)
     */
    static noAutorizado(res: Response, mensaje?: string): Response;
    /**
     * Respuesta de prohibido (403)
     */
    static prohibido(res: Response, mensaje?: string): Response;
    /**
     * Respuesta de no encontrado (404)
     */
    static noEncontrado(res: Response, mensaje?: string): Response;
    /**
     * Respuesta de conflicto (409)
     */
    static conflicto(res: Response, mensaje?: string): Response;
    /**
     * Respuesta de error del servidor (500)
     */
    static errorServidor(res: Response, mensaje?: string, error?: any): Response;
}
//# sourceMappingURL=respuesta.util.d.ts.map