"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controladores_1 = require("../controladores");
const validaciones_1 = require("../validaciones");
const middlewares_1 = require("../middlewares");
const router = (0, express_1.Router)();
/**
 * @route   GET /api/v1/solicitudes/estadisticas
 * @desc    Obtener estadísticas de solicitudes
 * @access  Privado (Admin)
 */
router.get('/estadisticas', middlewares_1.verificarAutenticacion, middlewares_1.esAdmin, (0, middlewares_1.asyncHandler)(controladores_1.SolicitudesControlador.obtenerEstadisticas));
/**
 * @route   GET /api/v1/solicitudes
 * @desc    Listar solicitudes
 * @access  Privado (Usuario ve las suyas, Admin ve todas)
 */
router.get('/', middlewares_1.verificarAutenticacion, validaciones_1.validacionFiltrosSolicitudes, middlewares_1.manejarErroresValidacion, (0, middlewares_1.asyncHandler)(controladores_1.SolicitudesControlador.listar));
/**
 * @route   GET /api/v1/solicitudes/:id
 * @desc    Obtener solicitud por ID
 * @access  Privado (Propietario o Admin)
 */
router.get('/:id', middlewares_1.verificarAutenticacion, (0, middlewares_1.validarIdParametro)('id'), (0, middlewares_1.asyncHandler)(controladores_1.SolicitudesControlador.obtenerPorId));
/**
 * @route   POST /api/v1/solicitudes
 * @desc    Crear nueva solicitud
 * @access  Privado
 */
router.post('/', middlewares_1.verificarAutenticacion, middlewares_1.limitadorCreacion, validaciones_1.validacionCrearSolicitud, middlewares_1.manejarErroresValidacion, (0, middlewares_1.asyncHandler)(controladores_1.SolicitudesControlador.crear));
/**
 * @route   PUT /api/v1/solicitudes/:id
 * @desc    Actualizar solicitud (usuario)
 * @access  Privado (Propietario)
 */
router.put('/:id', middlewares_1.verificarAutenticacion, (0, middlewares_1.validarIdParametro)('id'), validaciones_1.validacionActualizarSolicitud, middlewares_1.manejarErroresValidacion, (0, middlewares_1.asyncHandler)(controladores_1.SolicitudesControlador.actualizar));
/**
 * @route   PATCH /api/v1/solicitudes/:id/estado
 * @desc    Actualizar estado de solicitud
 * @access  Privado (Admin)
 */
router.patch('/:id/estado', middlewares_1.verificarAutenticacion, middlewares_1.esAdmin, (0, middlewares_1.validarIdParametro)('id'), validaciones_1.validacionActualizarEstadoSolicitud, middlewares_1.manejarErroresValidacion, (0, middlewares_1.asyncHandler)(controladores_1.SolicitudesControlador.actualizarEstado));
/**
 * @route   PATCH /api/v1/solicitudes/:id/cancelar
 * @desc    Cancelar solicitud
 * @access  Privado (Propietario)
 */
router.patch('/:id/cancelar', middlewares_1.verificarAutenticacion, (0, middlewares_1.validarIdParametro)('id'), (0, middlewares_1.asyncHandler)(controladores_1.SolicitudesControlador.cancelar));
/**
 * @route   POST /api/v1/solicitudes/:id/calificar
 * @desc    Calificar solicitud completada
 * @access  Privado (Propietario)
 */
router.post('/:id/calificar', middlewares_1.verificarAutenticacion, (0, middlewares_1.validarIdParametro)('id'), validaciones_1.validacionCalificarSolicitud, middlewares_1.manejarErroresValidacion, (0, middlewares_1.asyncHandler)(controladores_1.SolicitudesControlador.calificar));
/**
 * @route   DELETE /api/v1/solicitudes/:id
 * @desc    Eliminar solicitud
 * @access  Privado (Propietario o Admin)
 */
router.delete('/:id', middlewares_1.verificarAutenticacion, (0, middlewares_1.validarIdParametro)('id'), (0, middlewares_1.asyncHandler)(controladores_1.SolicitudesControlador.eliminar));
exports.default = router;
//# sourceMappingURL=solicitudes.rutas.js.map