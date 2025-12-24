"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controladores_1 = require("../controladores");
const validaciones_1 = require("../validaciones");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
/**
 * @route   POST /api/v1/auth/registro
 * @desc    Registrar nuevo usuario
 * @access  Público
 */
router.post('/registro', middlewares_1.limitadorRegistro, validaciones_1.validacionRegistro, middlewares_1.manejarErroresValidacion, (0, middlewares_1.asyncHandler)(controladores_1.AutenticacionControlador.registro));
/**
 * @route   POST /api/v1/auth/login
 * @desc    Iniciar sesión
 * @access  Público
 */
router.post('/login', middlewares_1.limitadorAutenticacion, validaciones_1.validacionLogin, middlewares_1.manejarErroresValidacion, (0, middlewares_1.asyncHandler)(controladores_1.AutenticacionControlador.login));
/**
 * @route   GET /api/v1/auth/perfil
 * @desc    Obtener perfil del usuario autenticado
 * @access  Privado
 */
router.get('/perfil', middlewares_1.verificarAutenticacion, (0, middlewares_1.asyncHandler)(controladores_1.AutenticacionControlador.obtenerPerfil));
/**
 * @route   PUT /api/v1/auth/perfil
 * @desc    Actualizar perfil del usuario
 * @access  Privado
 */
router.put('/perfil', middlewares_1.verificarAutenticacion, (0, middlewares_1.asyncHandler)(controladores_1.AutenticacionControlador.actualizarPerfil));
/**
 * @route   GET/POST /api/v1/auth/verificar-email
 * @desc    Verificar email con token
 * @access  Público
 */
router.get('/verificar-email', (0, middlewares_1.asyncHandler)(controladores_1.AutenticacionControlador.verificarEmail));
router.post('/verificar-email', (0, middlewares_1.asyncHandler)(controladores_1.AutenticacionControlador.verificarEmail));
/**
 * @route   POST /api/v1/auth/reenviar-verificacion
 * @desc    Reenviar email de verificación
 * @access  Público
 */
router.post('/reenviar-verificacion', middlewares_1.limitadorEmails, (0, middlewares_1.asyncHandler)(controladores_1.AutenticacionControlador.reenviarVerificacion));
/**
 * @route   POST /api/v1/auth/recuperar-password
 * @desc    Solicitar recuperación de contraseña
 * @access  Público
 */
router.post('/recuperar-password', middlewares_1.limitadorRecuperacion, validaciones_1.validacionRecuperacionPassword, middlewares_1.manejarErroresValidacion, (0, middlewares_1.asyncHandler)(controladores_1.AutenticacionControlador.recuperarPassword));
/**
 * @route   POST /api/v1/auth/restablecer-password
 * @desc    Restablecer contraseña con token
 * @access  Público
 */
router.post('/restablecer-password', validaciones_1.validacionRestablecerPassword, middlewares_1.manejarErroresValidacion, (0, middlewares_1.asyncHandler)(controladores_1.AutenticacionControlador.restablecerPassword));
/**
 * @route   POST /api/v1/auth/cambiar-password
 * @desc    Cambiar contraseña (usuario autenticado)
 * @access  Privado
 */
router.post('/cambiar-password', middlewares_1.verificarAutenticacion, validaciones_1.validacionCambiarPassword, middlewares_1.manejarErroresValidacion, (0, middlewares_1.asyncHandler)(controladores_1.AutenticacionControlador.cambiarPassword));
/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refrescar token de acceso
 * @access  Público
 */
router.post('/refresh-token', (0, middlewares_1.asyncHandler)(controladores_1.AutenticacionControlador.refrescarToken));
exports.default = router;
//# sourceMappingURL=autenticacion.rutas.js.map