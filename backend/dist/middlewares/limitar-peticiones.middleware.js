"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.limitadorEmails = exports.limitadorRecuperacion = exports.limitadorRegistro = exports.limitadorCreacion = exports.limitadorAutenticacion = exports.limitadorGeneral = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const servidor_config_1 = require("../config/servidor.config");
const respuesta_util_1 = require("../utilidades/respuesta.util");
/**
 * Configuración base de rate limiting
 */
const configuracionBase = {
    windowMs: servidor_config_1.configuracionServidor.rateLimiting.ventanaTiempo * 60 * 1000, // Convertir minutos a ms
    standardHeaders: true, // Retornar info en headers `RateLimit-*`
    legacyHeaders: false, // Deshabilitar headers `X-RateLimit-*`
    handler: (_req, res) => {
        return respuesta_util_1.RespuestaUtil.error(res, 'Demasiadas peticiones desde esta IP, por favor intenta más tarde', 429, undefined, 'TOO_MANY_REQUESTS');
    },
};
/**
 * Rate limiter general para toda la API
 */
exports.limitadorGeneral = (0, express_rate_limit_1.default)({
    ...configuracionBase,
    max: servidor_config_1.configuracionServidor.rateLimiting.maxPeticiones,
    message: 'Demasiadas peticiones, intenta nuevamente en 15 minutos',
});
/**
 * Rate limiter estricto para autenticación (evitar fuerza bruta)
 */
exports.limitadorAutenticacion = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 intentos
    skipSuccessfulRequests: true, // No contar peticiones exitosas
    message: 'Demasiados intentos de inicio de sesión, intenta nuevamente en 15 minutos',
    handler: (_req, res) => {
        return respuesta_util_1.RespuestaUtil.error(res, 'Demasiados intentos fallidos. Por seguridad, tu IP ha sido bloqueada temporalmente', 429, undefined, 'TOO_MANY_LOGIN_ATTEMPTS');
    },
});
/**
 * Rate limiter para creación de recursos
 */
exports.limitadorCreacion = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 20, // 20 creaciones por hora
    message: 'Límite de creación alcanzado, intenta nuevamente en una hora',
});
/**
 * Rate limiter para registro de usuarios
 */
exports.limitadorRegistro = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: servidor_config_1.configuracionServidor.esDesarrollo() ? 1000 : 5, // 5 registros por hora (más alto en desarrollo)
    message: 'Demasiados registros desde esta IP, intenta nuevamente en una hora',
    handler: (_req, res) => {
        return respuesta_util_1.RespuestaUtil.error(res, 'Has alcanzado el límite de registros por hora', 429, undefined, 'TOO_MANY_REGISTRATIONS');
    },
});
/**
 * Rate limiter para recuperación de contraseña
 */
exports.limitadorRecuperacion = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 3, // 3 intentos por hora
    message: 'Demasiadas solicitudes de recuperación, intenta nuevamente en una hora',
});
/**
 * Rate limiter para envío de emails
 */
exports.limitadorEmails = (0, express_rate_limit_1.default)({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5, // 5 emails por hora
    message: 'Límite de envío de emails alcanzado, intenta nuevamente en una hora',
});
//# sourceMappingURL=limitar-peticiones.middleware.js.map