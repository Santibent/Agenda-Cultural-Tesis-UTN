"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RespuestaUtil = void 0;
/**
 * Clase para manejar respuestas HTTP estandarizadas
 */
class RespuestaUtil {
    /**
     * Respuesta exitosa
     */
    static exito(res, mensaje, datos, codigoEstado = 200, meta) {
        const respuesta = {
            exito: true,
            mensaje,
            datos,
            meta,
        };
        return res.status(codigoEstado).json(respuesta);
    }
    /**
     * Respuesta de error
     */
    static error(res, mensaje, codigoEstado = 400, errores, datos, codigo) {
        const respuesta = {
            exito: false,
            mensaje,
            errores,
            datos,
            codigo,
        };
        return res.status(codigoEstado).json(respuesta);
    }
    /**
     * Respuesta de creación exitosa (201)
     */
    static creado(res, mensaje, datos) {
        return this.exito(res, mensaje, datos, 201);
    }
    /**
     * Respuesta sin contenido (204)
     */
    static sinContenido(res) {
        return res.status(204).send();
    }
    /**
     * Respuesta de error de validación (422)
     */
    static errorValidacion(res, errores) {
        return this.error(res, 'Error de validación', 422, errores, 'VALIDATION_ERROR');
    }
    /**
     * Respuesta de no autorizado (401)
     */
    static noAutorizado(res, mensaje = 'No autorizado') {
        return this.error(res, mensaje, 401, undefined, 'UNAUTHORIZED');
    }
    /**
     * Respuesta de prohibido (403)
     */
    static prohibido(res, mensaje = 'Acceso prohibido') {
        return this.error(res, mensaje, 403, undefined, 'FORBIDDEN');
    }
    /**
     * Respuesta de no encontrado (404)
     */
    static noEncontrado(res, mensaje = 'Recurso no encontrado') {
        return this.error(res, mensaje, 404, undefined, 'NOT_FOUND');
    }
    /**
     * Respuesta de conflicto (409)
     */
    static conflicto(res, mensaje = 'Conflicto con el estado actual') {
        return this.error(res, mensaje, 409, undefined, 'CONFLICT');
    }
    /**
     * Respuesta de error del servidor (500)
     */
    static errorServidor(res, mensaje = 'Error interno del servidor', error) {
        console.error('Error del servidor:', error);
        return this.error(res, mensaje, 500, process.env.NODE_ENV === 'development' ? [error] : undefined, 'INTERNAL_SERVER_ERROR');
    }
}
exports.RespuestaUtil = RespuestaUtil;
//# sourceMappingURL=respuesta.util.js.map