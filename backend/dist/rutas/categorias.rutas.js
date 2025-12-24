"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controladores_1 = require("../controladores");
const validaciones_1 = require("../validaciones");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/v1/categorias/con-eventos
 * @desc    Obtener categorías con contador de eventos
 * @access  Público
 */
router.get('/con-eventos', (0, middlewares_1.asyncHandler)(controladores_1.CategoriasControlador.listarConEventos));
/**
 * @route   GET /api/v1/categorias
 * @desc    Listar todas las categorías
 * @access  Público
 */
router.get('/', (0, middlewares_1.asyncHandler)(controladores_1.CategoriasControlador.listar));
/**
 * @route   GET /api/v1/categorias/:idOSlug
 * @desc    Obtener categoría por ID o slug
 * @access  Público
 */
router.get('/:idOSlug', (0, middlewares_1.asyncHandler)(controladores_1.CategoriasControlador.obtenerPorId));
/**
 * @route   POST /api/v1/categorias
 * @desc    Crear nueva categoría
 * @access  Privado (Admin)
 */
router.post('/', middlewares_1.verificarAutenticacion, middlewares_1.esAdmin, validaciones_1.validacionCrearCategoria, middlewares_1.manejarErroresValidacion, (0, middlewares_1.asyncHandler)(controladores_1.CategoriasControlador.crear));
/**
 * @route   PUT /api/v1/categorias/:id
 * @desc    Actualizar categoría
 * @access  Privado (Admin)
 */
router.put('/:id', middlewares_1.verificarAutenticacion, middlewares_1.esAdmin, (0, middlewares_1.validarIdParametro)('id'), validaciones_1.validacionActualizarCategoria, middlewares_1.manejarErroresValidacion, (0, middlewares_1.asyncHandler)(controladores_1.CategoriasControlador.actualizar));
/**
 * @route   DELETE /api/v1/categorias/:id
 * @desc    Eliminar categoría
 * @access  Privado (Admin)
 */
router.delete('/:id', middlewares_1.verificarAutenticacion, middlewares_1.esAdmin, (0, middlewares_1.validarIdParametro)('id'), (0, middlewares_1.asyncHandler)(controladores_1.CategoriasControlador.eliminar));
exports.default = router;
//# sourceMappingURL=categorias.rutas.js.map