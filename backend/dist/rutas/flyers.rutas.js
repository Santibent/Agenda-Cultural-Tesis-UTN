"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controladores_1 = require("../controladores");
const validaciones_1 = require("../validaciones");
const middlewares_1 = require("../middlewares");
const subir_archivos_middleware_1 = require("../middlewares/subir-archivos.middleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/v1/flyers/destacados
 * @desc    Obtener flyers destacados
 * @access  Público
 */
router.get('/destacados', (0, middlewares_1.asyncHandler)(controladores_1.FlyersControlador.obtenerDestacados));
/**
 * @route   GET /api/v1/flyers/galeria
 * @desc    Obtener galería completa de flyers
 * @access  Público
 */
router.get('/galeria', (0, middlewares_1.asyncHandler)(controladores_1.FlyersControlador.obtenerGaleria));
/**
 * @route   GET /api/v1/flyers
 * @desc    Listar flyers con filtros
 * @access  Público (con autenticación opcional para admin)
 */
router.get('/', middlewares_1.autenticacionOpcional, validaciones_1.validacionFiltrosFlyers, middlewares_1.manejarErroresValidacion, (0, middlewares_1.asyncHandler)(controladores_1.FlyersControlador.listar));
/**
 * @route   GET /api/v1/flyers/:id
 * @desc    Obtener flyer por ID
 * @access  Público (con autenticación opcional para admin)
 */
router.get('/:id', middlewares_1.autenticacionOpcional, (0, middlewares_1.validarIdParametro)('id'), (0, middlewares_1.asyncHandler)(controladores_1.FlyersControlador.obtenerPorId));
/**
 * @route   POST /api/v1/flyers
 * @desc    Crear nuevo flyer
 * @access  Privado (Admin)
 */
router.post('/', middlewares_1.verificarAutenticacion, middlewares_1.esAdmin, subir_archivos_middleware_1.subirImagen, validaciones_1.validacionCrearFlyer, middlewares_1.manejarErroresValidacion, (0, middlewares_1.asyncHandler)(controladores_1.FlyersControlador.crear));
/**
 * @route   PUT /api/v1/flyers/:id
 * @desc    Actualizar flyer
 * @access  Privado (Admin)
 */
router.put('/:id', middlewares_1.verificarAutenticacion, middlewares_1.esAdmin, (0, middlewares_1.validarIdParametro)('id'), subir_archivos_middleware_1.subirImagen, validaciones_1.validacionActualizarFlyer, middlewares_1.manejarErroresValidacion, (0, middlewares_1.asyncHandler)(controladores_1.FlyersControlador.actualizar));
/**
 * @route   DELETE /api/v1/flyers/:id
 * @desc    Eliminar flyer
 * @access  Privado (Admin)
 */
router.delete('/:id', middlewares_1.verificarAutenticacion, middlewares_1.esAdmin, (0, middlewares_1.validarIdParametro)('id'), (0, middlewares_1.asyncHandler)(controladores_1.FlyersControlador.eliminar));
exports.default = router;
//# sourceMappingURL=flyers.rutas.js.map