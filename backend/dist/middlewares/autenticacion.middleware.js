"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticacionOpcional = exports.verificarAutenticacion = void 0;
const token_servicio_1 = require("../servicios/token.servicio");
const respuesta_util_1 = require("../utilidades/respuesta.util");
const errores_util_1 = require("../utilidades/errores.util");
const usuario_modelo_1 = __importDefault(require("../modelos/usuario.modelo"));
/**
 * Middleware para verificar autenticación JWT
 */
const verificarAutenticacion = async (req, res, next) => {
    try {
        // Extraer token del header
        const authHeader = req.headers.authorization;
        const token = token_servicio_1.TokenServicio.extraerTokenDeHeader(authHeader);
        if (!token) {
            throw new errores_util_1.ErrorAutenticacion('Token no proporcionado');
        }
        // Verificar y decodificar token
        const payload = token_servicio_1.TokenServicio.verificarToken(token);
        // Verificar que el usuario existe y está activo
        const usuario = await usuario_modelo_1.default.findByPk(payload.id);
        if (!usuario || !usuario.activo) {
            throw new errores_util_1.ErrorAutenticacion('Usuario no válido o inactivo');
        }
        // Agregar información del usuario al request
        req.usuario = {
            id: payload.id,
            email: payload.email,
            rol: payload.rol,
            nombre: payload.nombre,
        };
        next();
    }
    catch (error) {
        if (error.name === 'JsonWebTokenError') {
            respuesta_util_1.RespuestaUtil.noAutorizado(res, 'Token inválido');
            return;
        }
        if (error.name === 'TokenExpiredError') {
            respuesta_util_1.RespuestaUtil.noAutorizado(res, 'Token expirado');
            return;
        }
        if (error instanceof errores_util_1.ErrorAutenticacion) {
            respuesta_util_1.RespuestaUtil.noAutorizado(res, error.message);
            return;
        }
        respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error en autenticación', error);
        return;
    }
};
exports.verificarAutenticacion = verificarAutenticacion;
/**
 * Middleware opcional: permite acceso con o sin autenticación
 * Si hay token, lo valida y agrega usuario al request
 */
const autenticacionOpcional = async (req, _res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = token_servicio_1.TokenServicio.extraerTokenDeHeader(authHeader);
        if (token) {
            const payload = token_servicio_1.TokenServicio.verificarToken(token);
            const usuario = await usuario_modelo_1.default.findByPk(payload.id);
            if (usuario && usuario.activo) {
                req.usuario = {
                    id: payload.id,
                    email: payload.email,
                    rol: payload.rol,
                    nombre: payload.nombre,
                };
            }
        }
        next();
    }
    catch (error) {
        // Si hay error en el token opcional, simplemente continuar sin usuario
        next();
    }
};
exports.autenticacionOpcional = autenticacionOpcional;
//# sourceMappingURL=autenticacion.middleware.js.map