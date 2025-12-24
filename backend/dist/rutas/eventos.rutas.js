"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controladores_1 = require("../controladores");
const validaciones_1 = require("../validaciones");
const middlewares_1 = require("../middlewares");
const subir_archivos_middleware_1 = require("../middlewares/subir-archivos.middleware");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/v1/eventos/destacados
 * @desc    Obtener eventos destacados
 * @access  Público
 */
router.get('/destacados', (0, middlewares_1.asyncHandler)(controladores_1.EventosControlador.obtenerDestacados));
/**
 * @route   GET /api/v1/eventos/proximos
 * @desc    Obtener próximos eventos
 * @access  Público
 */
router.get('/proximos', (0, middlewares_1.asyncHandler)(controladores_1.EventosControlador.obtenerProximos));
/**
 * @route   GET /api/v1/eventos
 * @desc    Listar eventos con filtros
 * @access  Público
 */
router.get('/', validaciones_1.validacionFiltrosEventos, middlewares_1.manejarErroresValidacion, middlewares_1.sanitizarBusqueda, (0, middlewares_1.asyncHandler)(controladores_1.EventosControlador.listar));
/**
 * @route   GET /api/v1/eventos/:idOSlug
 * @desc    Obtener evento por ID o slug
 * @access  Público
 */
router.get('/:idOSlug', (0, middlewares_1.asyncHandler)(controladores_1.EventosControlador.obtenerPorId));
/**
 * @route   POST /api/v1/eventos
 * @desc    Crear nuevo evento
 * @access  Privado (Usuario autenticado)
 */
router.post('/', middlewares_1.verificarAutenticacion, middlewares_1.limitadorCreacion, subir_archivos_middleware_1.subirImagen, validaciones_1.validacionCrearEvento, middlewares_1.manejarErroresValidacion, (0, middlewares_1.asyncHandler)(controladores_1.EventosControlador.crear));
/**
 * @route   PUT /api/v1/eventos/:id
 * @desc    Actualizar evento
 * @access  Privado (Creador o Admin)
 */
router.put('/:id', middlewares_1.verificarAutenticacion, (0, middlewares_1.validarIdParametro)('id'), subir_archivos_middleware_1.subirImagen, validaciones_1.validacionActualizarEvento, middlewares_1.manejarErroresValidacion, (0, middlewares_1.asyncHandler)(controladores_1.EventosControlador.actualizar));
/**
 * @route   DELETE /api/v1/eventos/:id
 * @desc    Eliminar evento
 * @access  Privado (Creador o Admin)
 */
router.delete('/:id', middlewares_1.verificarAutenticacion, (0, middlewares_1.validarIdParametro)('id'), (0, middlewares_1.asyncHandler)(controladores_1.EventosControlador.eliminar));
exports.default = router;
//# sourceMappingURL=eventos.rutas.js.map