"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.esPropietarioOAdmin = exports.esAdmin = exports.verificarRol = void 0;
const respuesta_util_1 = require("../utilidades/respuesta.util");
const enums_1 = require("../tipos/enums");
/**
 * Middleware para verificar que el usuario tiene el rol necesario
 */
const verificarRol = (...rolesPermitidos) => {
    return (req, res, next) => {
        // Verificar que existe usuario en el request (debe pasar primero por autenticación)
        if (!req.usuario) {
            respuesta_util_1.RespuestaUtil.noAutorizado(res, 'Usuario no autenticado');
            return;
        }
        // Verificar que el rol del usuario está en los roles permitidos
        if (!rolesPermitidos.includes(req.usuario.rol)) {
            respuesta_util_1.RespuestaUtil.prohibido(res, 'No tienes permisos para acceder a este recurso');
            return;
        }
        next();
    };
};
exports.verificarRol = verificarRol;
/**
 * Middleware específico para verificar rol de administrador
 */
exports.esAdmin = (0, exports.verificarRol)(enums_1.RolUsuario.ADMIN);
/**
 * Middleware para verificar que el usuario es dueño del recurso o es admin
 */
const esPropietarioOAdmin = (obtenerIdPropietario) => {
    return (req, res, next) => {
        if (!req.usuario) {
            respuesta_util_1.RespuestaUtil.noAutorizado(res, 'Usuario no autenticado');
            return;
        }
        const idPropietario = obtenerIdPropietario(req);
        // Si es admin o es el propietario, permitir acceso
        if (req.usuario.rol === enums_1.RolUsuario.ADMIN || req.usuario.id === idPropietario) {
            next();
            return;
        }
        respuesta_util_1.RespuestaUtil.prohibido(res, 'No tienes permisos para acceder a este recurso');
    };
};
exports.esPropietarioOAdmin = esPropietarioOAdmin;
//# sourceMappingURL=autorizacion.middleware.js.map