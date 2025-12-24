"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutenticacionControlador = void 0;
const respuesta_util_1 = require("../utilidades/respuesta.util");
const errores_util_1 = require("../utilidades/errores.util");
const usuario_modelo_1 = __importDefault(require("../modelos/usuario.modelo"));
const encriptacion_servicio_1 = require("../servicios/encriptacion.servicio");
const token_servicio_1 = require("../servicios/token.servicio");
const email_servicio_1 = __importDefault(require("../servicios/email.servicio"));
const enums_1 = require("../tipos/enums");
/**
 * Controlador de Autenticación
 */
class AutenticacionControlador {
    /**
     * Registro de nuevo usuario
     * POST /api/v1/auth/registro
     */
    static async registro(req, res) {
        try {
            const { nombre, email, password } = req.body;
            // Verificar si el email ya está registrado
            const usuarioExistente = await usuario_modelo_1.default.findOne({ where: { email } });
            if (usuarioExistente) {
                throw new errores_util_1.ErrorConflicto('El email ya está registrado');
            }
            // Hashear contraseña
            const passwordHash = await encriptacion_servicio_1.EncriptacionServicio.hashPassword(password);
            // Generar token de verificación
            const tokenVerificacion = encriptacion_servicio_1.EncriptacionServicio.generarToken();
            // Crear usuario
            const nuevoUsuario = await usuario_modelo_1.default.create({
                nombre,
                email,
                password: passwordHash,
                rol: enums_1.RolUsuario.USUARIO,
                emailVerificado: false,
                tokenVerificacion,
                activo: true,
            });
            // Enviar email de verificación
            try {
                await email_servicio_1.default.enviarEmailVerificacion(email, nombre, tokenVerificacion);
            }
            catch (error) {
                console.error('Error al enviar email de verificación:', error);
                // No lanzar error, permitir que el usuario se registre igual
            }
            // ✅ NO GENERAR TOKENS - El usuario debe verificar primero
            return respuesta_util_1.RespuestaUtil.creado(res, 'Usuario registrado exitosamente. Por favor verifica tu email antes de iniciar sesión.', {
                email: nuevoUsuario.email,
                nombre: nuevoUsuario.nombre,
                emailVerificado: false,
                mensaje: 'Hemos enviado un correo de verificación a tu email.'
            });
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorConflicto) {
                return respuesta_util_1.RespuestaUtil.conflicto(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al registrar usuario', error);
        }
    }
    /**
     * Login de usuario
     * POST /api/v1/auth/login
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            // Buscar usuario por email
            const usuario = await usuario_modelo_1.default.findOne({ where: { email } });
            console.log('🔍 Debug Login - Usuario encontrado:', {
                email,
                usuarioEncontrado: !!usuario,
                id: usuario?.id,
                activo: usuario?.activo,
                emailVerificado: usuario?.emailVerificado,
            });
            if (!usuario) {
                throw new errores_util_1.ErrorAutenticacion('Credenciales inválidas');
            }
            // Verificar que el usuario está activo
            if (!usuario.activo) {
                console.log('❌ Usuario inactivo detectado');
                throw new errores_util_1.ErrorAutenticacion('Usuario inactivo. Contacta al administrador.');
            }
            // ✅ Verificar que el email esté verificado
            if (!usuario.emailVerificado) {
                console.log('⚠️ Email no verificado:', email);
                return respuesta_util_1.RespuestaUtil.error(res, 'Debes verificar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.', 403, undefined, {
                    emailVerificado: false,
                    email: usuario.email
                });
            }
            console.log('✅ Usuario activo y verificado');
            // Verificar contraseña
            const passwordValida = await encriptacion_servicio_1.EncriptacionServicio.compararPassword(password, usuario.password);
            console.log('🔑 Verificación de password:', passwordValida);
            if (!passwordValida) {
                throw new errores_util_1.ErrorAutenticacion('Credenciales inválidas');
            }
            // Generar tokens JWT
            const payload = {
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol,
                nombre: usuario.nombre,
            };
            const tokenAcceso = token_servicio_1.TokenServicio.generarTokenAcceso(payload);
            const tokenRefresco = token_servicio_1.TokenServicio.generarTokenRefresco(payload);
            console.log('✅ Login exitoso para:', email);
            return respuesta_util_1.RespuestaUtil.exito(res, 'Login exitoso', {
                usuario: usuario.toJSON(),
                tokens: {
                    acceso: tokenAcceso,
                    refresco: tokenRefresco,
                },
                emailVerificado: usuario.emailVerificado,
            });
        }
        catch (error) {
            console.error('❌ Error en login:', error.message);
            if (error instanceof errores_util_1.ErrorAutenticacion) {
                return respuesta_util_1.RespuestaUtil.noAutorizado(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al iniciar sesión', error);
        }
    }
    /**
     * Obtener perfil del usuario autenticado
     * GET /api/v1/auth/perfil
     */
    static async obtenerPerfil(req, res) {
        try {
            if (!req.usuario) {
                throw new errores_util_1.ErrorAutenticacion('Usuario no autenticado');
            }
            const usuario = await usuario_modelo_1.default.findByPk(req.usuario.id);
            if (!usuario) {
                throw new errores_util_1.ErrorNoEncontrado('Usuario no encontrado');
            }
            return respuesta_util_1.RespuestaUtil.exito(res, 'Perfil obtenido exitosamente', usuario.toJSON());
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al obtener perfil', error);
        }
    }
    /**
     * Actualizar perfil del usuario
     * PUT /api/v1/auth/perfil
     */
    static async actualizarPerfil(req, res) {
        try {
            if (!req.usuario) {
                throw new errores_util_1.ErrorAutenticacion('Usuario no autenticado');
            }
            const { nombre } = req.body;
            const usuario = await usuario_modelo_1.default.findByPk(req.usuario.id);
            if (!usuario) {
                throw new errores_util_1.ErrorNoEncontrado('Usuario no encontrado');
            }
            // Actualizar datos
            if (nombre)
                usuario.nombre = nombre;
            await usuario.save();
            return respuesta_util_1.RespuestaUtil.exito(res, 'Perfil actualizado exitosamente', usuario.toJSON());
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al actualizar perfil', error);
        }
    }
    /**
     * Verificar email
     * GET/POST /api/v1/auth/verificar-email
     */
    static async verificarEmail(req, res) {
        try {
            // Aceptar token desde query params (GET) o body (POST)
            const token = req.query.token || req.body.token;
            if (!token) {
                throw new errores_util_1.ErrorValidacion('Token no proporcionado');
            }
            // Buscar usuario por token
            const usuario = await usuario_modelo_1.default.findOne({ where: { tokenVerificacion: token } });
            if (!usuario) {
                throw new errores_util_1.ErrorNoEncontrado('Token inválido o expirado');
            }
            // Ya verificado
            if (usuario.emailVerificado) {
                return respuesta_util_1.RespuestaUtil.exito(res, 'Email ya verificado anteriormente');
            }
            // Actualizar usuario
            usuario.emailVerificado = true;
            usuario.tokenVerificacion = null;
            await usuario.save();
            // Enviar email de bienvenida
            try {
                await email_servicio_1.default.enviarEmailBienvenida(usuario.email, usuario.nombre);
            }
            catch (error) {
                console.error('Error al enviar email de bienvenida:', error);
            }
            // ✅ Generar tokens JWT después de verificar
            const payload = {
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol,
                nombre: usuario.nombre,
            };
            const tokenAcceso = token_servicio_1.TokenServicio.generarTokenAcceso(payload);
            const tokenRefresco = token_servicio_1.TokenServicio.generarTokenRefresco(payload);
            return respuesta_util_1.RespuestaUtil.exito(res, 'Email verificado exitosamente. Ya puedes usar la aplicación.', {
                emailVerificado: true,
                tokens: {
                    acceso: tokenAcceso,
                    refresco: tokenRefresco,
                },
                usuario: usuario.toJSON()
            });
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado || error instanceof errores_util_1.ErrorValidacion) {
                return respuesta_util_1.RespuestaUtil.error(res, error.message, 400);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al verificar email', error);
        }
    }
    /**
     * Reenviar email de verificación
     * POST /api/v1/auth/reenviar-verificacion
     */
    static async reenviarVerificacion(req, res) {
        try {
            const { email } = req.body;
            const usuario = await usuario_modelo_1.default.findOne({ where: { email } });
            if (!usuario) {
                // Por seguridad, no revelar si el email existe
                return respuesta_util_1.RespuestaUtil.exito(res, 'Si el email existe, recibirás un correo de verificación');
            }
            if (usuario.emailVerificado) {
                return respuesta_util_1.RespuestaUtil.exito(res, 'El email ya está verificado');
            }
            // Generar nuevo token
            const tokenVerificacion = encriptacion_servicio_1.EncriptacionServicio.generarToken();
            usuario.tokenVerificacion = tokenVerificacion;
            await usuario.save();
            // Enviar email
            await email_servicio_1.default.enviarEmailVerificacion(usuario.email, usuario.nombre, tokenVerificacion);
            return respuesta_util_1.RespuestaUtil.exito(res, 'Email de verificación enviado');
        }
        catch (error) {
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al reenviar verificación', error);
        }
    }
    /**
     * Solicitar recuperación de contraseña
     * POST /api/v1/auth/recuperar-password
     */
    static async recuperarPassword(req, res) {
        try {
            const { email } = req.body;
            const usuario = await usuario_modelo_1.default.findOne({ where: { email } });
            if (!usuario) {
                // Por seguridad, no revelar si el email existe
                return respuesta_util_1.RespuestaUtil.exito(res, 'Si el email existe, recibirás instrucciones para recuperar tu contraseña');
            }
            // Generar token de recuperación (válido por 1 hora)
            const tokenRecuperacion = encriptacion_servicio_1.EncriptacionServicio.generarToken();
            const tokenExpiracion = new Date();
            tokenExpiracion.setHours(tokenExpiracion.getHours() + 1);
            usuario.tokenRecuperacion = tokenRecuperacion;
            usuario.tokenExpiracion = tokenExpiracion;
            await usuario.save();
            // Enviar email
            await email_servicio_1.default.enviarEmailRecuperacion(usuario.email, usuario.nombre, tokenRecuperacion);
            return respuesta_util_1.RespuestaUtil.exito(res, 'Si el email existe, recibirás instrucciones para recuperar tu contraseña');
        }
        catch (error) {
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al solicitar recuperación', error);
        }
    }
    /**
     * Restablecer contraseña con token
     * POST /api/v1/auth/restablecer-password
     */
    static async restablecerPassword(req, res) {
        try {
            const { token, password } = req.body;
            // Buscar usuario por token
            const usuario = await usuario_modelo_1.default.findOne({ where: { tokenRecuperacion: token } });
            if (!usuario) {
                throw new errores_util_1.ErrorNoEncontrado('Token inválido o expirado');
            }
            // Verificar expiración del token
            if (usuario.tokenExpiracion && new Date() > usuario.tokenExpiracion) {
                throw new errores_util_1.ErrorValidacion('El token ha expirado');
            }
            // Hashear nueva contraseña
            const passwordHash = await encriptacion_servicio_1.EncriptacionServicio.hashPassword(password);
            // Actualizar usuario
            usuario.password = passwordHash;
            usuario.tokenRecuperacion = null;
            usuario.tokenExpiracion = null;
            await usuario.save();
            return respuesta_util_1.RespuestaUtil.exito(res, 'Contraseña restablecida exitosamente');
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado || error instanceof errores_util_1.ErrorValidacion) {
                return respuesta_util_1.RespuestaUtil.error(res, error.message, 400);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al restablecer contraseña', error);
        }
    }
    /**
     * Cambiar contraseña (usuario autenticado)
     * POST /api/v1/auth/cambiar-password
     */
    static async cambiarPassword(req, res) {
        try {
            if (!req.usuario) {
                throw new errores_util_1.ErrorAutenticacion('Usuario no autenticado');
            }
            const { passwordActual, passwordNueva } = req.body;
            const usuario = await usuario_modelo_1.default.findByPk(req.usuario.id);
            if (!usuario) {
                throw new errores_util_1.ErrorNoEncontrado('Usuario no encontrado');
            }
            // Verificar contraseña actual
            const passwordValida = await encriptacion_servicio_1.EncriptacionServicio.compararPassword(passwordActual, usuario.password);
            if (!passwordValida) {
                throw new errores_util_1.ErrorAutenticacion('La contraseña actual es incorrecta');
            }
            // Hashear nueva contraseña
            const passwordHash = await encriptacion_servicio_1.EncriptacionServicio.hashPassword(passwordNueva);
            // Actualizar
            usuario.password = passwordHash;
            await usuario.save();
            return respuesta_util_1.RespuestaUtil.exito(res, 'Contraseña cambiada exitosamente');
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorAutenticacion) {
                return respuesta_util_1.RespuestaUtil.noAutorizado(res, error.message);
            }
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al cambiar contraseña', error);
        }
    }
    /**
     * Refrescar token de acceso
     * POST /api/v1/auth/refresh-token
     */
    static async refrescarToken(req, res) {
        try {
            const { tokenRefresco } = req.body;
            if (!tokenRefresco) {
                throw new errores_util_1.ErrorValidacion('Token de refresco no proporcionado');
            }
            // Verificar token de refresco
            const payload = token_servicio_1.TokenServicio.verificarToken(tokenRefresco);
            // Verificar que el usuario existe y está activo
            const usuario = await usuario_modelo_1.default.findByPk(payload.id);
            if (!usuario || !usuario.activo) {
                throw new errores_util_1.ErrorAutenticacion('Usuario no válido');
            }
            // Generar nuevo token de acceso
            const nuevoPayload = {
                id: usuario.id,
                email: usuario.email,
                rol: usuario.rol,
                nombre: usuario.nombre,
            };
            const nuevoTokenAcceso = token_servicio_1.TokenServicio.generarTokenAcceso(nuevoPayload);
            return respuesta_util_1.RespuestaUtil.exito(res, 'Token refrescado exitosamente', {
                acceso: nuevoTokenAcceso,
            });
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorValidacion || error instanceof errores_util_1.ErrorAutenticacion) {
                return respuesta_util_1.RespuestaUtil.noAutorizado(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al refrescar token', error);
        }
    }
}
exports.AutenticacionControlador = AutenticacionControlador;
//# sourceMappingURL=autenticacion.controlador.js.map