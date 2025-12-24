"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizarBusqueda = exports.validarIdParametro = exports.validar = exports.manejarErroresValidacion = void 0;
const express_validator_1 = require("express-validator");
const respuesta_util_1 = require("../utilidades/respuesta.util");
/**
 * Middleware para manejar errores de validación de express-validator
 */
const manejarErroresValidacion = (req, res, next) => {
    const errores = (0, express_validator_1.validationResult)(req);
    if (!errores.isEmpty()) {
        const erroresFormateados = errores.array().map((error) => ({
            campo: error.path || error.param,
            mensaje: error.msg,
            valor: error.value,
        }));
        respuesta_util_1.RespuestaUtil.errorValidacion(res, erroresFormateados);
        return;
    }
    next();
};
exports.manejarErroresValidacion = manejarErroresValidacion;
/**
 * Función helper para ejecutar validaciones
 */
const validar = (validaciones) => {
    return async (req, res, next) => {
        // Ejecutar todas las validaciones
        for (const validacion of validaciones) {
            await validacion.run(req);
        }
        // Manejar errores
        (0, exports.manejarErroresValidacion)(req, res, next);
    };
};
exports.validar = validar;
/**
 * Middleware para validar ID en parámetros
 */
const validarIdParametro = (nombreParametro = 'id') => {
    return (req, res, next) => {
        const id = parseInt(req.params[nombreParametro]);
        if (isNaN(id) || id <= 0) {
            respuesta_util_1.RespuestaUtil.error(res, `El parámetro ${nombreParametro} debe ser un número válido mayor a 0`, 400);
            return;
        }
        next();
    };
};
exports.validarIdParametro = validarIdParametro;
/**
 * Middleware para sanitizar entrada de búsqueda
 */
const sanitizarBusqueda = (req, _res, next) => {
    if (req.query.busqueda) {
        // Remover caracteres especiales peligrosos
        req.query.busqueda = String(req.query.busqueda)
            .trim()
            .replace(/[<>]/g, '');
    }
    next();
};
exports.sanitizarBusqueda = sanitizarBusqueda;
//# sourceMappingURL=validacion.middleware.js.map