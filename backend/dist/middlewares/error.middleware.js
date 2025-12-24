"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncHandler = exports.rutaNoEncontrada = exports.manejarErrores = void 0;
const errores_util_1 = require("../utilidades/errores.util");
const respuesta_util_1 = require("../utilidades/respuesta.util");
/**
 * Middleware global para manejo de errores
 */
const manejarErrores = (error, req, res, _next) => {
    // Log del error en desarrollo
    if (process.env.NODE_ENV === 'development') {
        console.error('❌ Error capturado:', {
            nombre: error.name,
            mensaje: error.message,
            stack: error.stack,
            ruta: req.path,
            metodo: req.method,
        });
    }
    // Si es un error personalizado
    if (error instanceof errores_util_1.ErrorPersonalizado) {
        return respuesta_util_1.RespuestaUtil.error(res, error.message, error.codigoEstado, error.detalles ? [error.detalles] : undefined, error.codigo);
    }
    // Errores de Sequelize
    if (error.name === 'SequelizeValidationError') {
        const errores = error.errors.map((err) => ({
            campo: err.path,
            mensaje: err.message,
        }));
        return respuesta_util_1.RespuestaUtil.errorValidacion(res, errores);
    }
    if (error.name === 'SequelizeUniqueConstraintError') {
        return respuesta_util_1.RespuestaUtil.conflicto(res, 'Ya existe un registro con esos datos');
    }
    if (error.name === 'SequelizeForeignKeyConstraintError') {
        return respuesta_util_1.RespuestaUtil.error(res, 'Error de integridad: referencia a un registro inexistente', 400);
    }
    // Error genérico del servidor
    return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error interno del servidor', process.env.NODE_ENV === 'development' ? error : undefined);
};
exports.manejarErrores = manejarErrores;
/**
 * Middleware para rutas no encontradas (404)
 */
const rutaNoEncontrada = (req, res, _next) => {
    return respuesta_util_1.RespuestaUtil.noEncontrado(res, `Ruta ${req.method} ${req.path} no encontrada`);
};
exports.rutaNoEncontrada = rutaNoEncontrada;
/**
 * Wrapper para async/await en controladores
 * Captura errores y los pasa al middleware de manejo de errores
 */
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
//# sourceMappingURL=error.middleware.js.map