"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolicitudesControlador = void 0;
const respuesta_util_1 = require("../utilidades/respuesta.util");
const paginacion_util_1 = require("../utilidades/paginacion.util");
const errores_util_1 = require("../utilidades/errores.util");
const solicitud_flyer_modelo_1 = __importDefault(require("../modelos/solicitud-flyer.modelo"));
const usuario_modelo_1 = __importDefault(require("../modelos/usuario.modelo"));
const email_servicio_1 = __importDefault(require("../servicios/email.servicio"));
const enums_1 = require("../tipos/enums");
/**
 * Controlador de Solicitudes de Flyer
 */
class SolicitudesControlador {
    /**
     * Listar solicitudes con filtros y paginación
     * GET /api/v1/solicitudes
     */
    static async listar(req, res) {
        try {
            if (!req.usuario) {
                throw new errores_util_1.ErrorAutorizacion('Usuario no autenticado');
            }
            const { pagina, limite, estado, prioridad, ordenarPor = 'createdAt', orden = 'DESC', } = req.query;
            // Opciones de paginación
            const opciones = {
                pagina: pagina ? parseInt(pagina) : 1,
                limite: limite ? parseInt(limite) : 10,
                ordenarPor: ordenarPor,
                orden: orden,
            };
            // Validar opciones
            const erroresValidacion = paginacion_util_1.PaginacionUtil.validarOpciones(opciones);
            if (erroresValidacion.length > 0) {
                return respuesta_util_1.RespuestaUtil.errorValidacion(res, erroresValidacion.map(e => ({ mensaje: e })));
            }
            // Construir filtros
            const where = {};
            // Si no es admin, solo ver sus propias solicitudes
            if (req.usuario.rol !== enums_1.RolUsuario.ADMIN) {
                where.usuarioId = req.usuario.id;
            }
            if (estado) {
                where.estado = estado;
            }
            if (prioridad) {
                where.prioridad = prioridad;
            }
            // Obtener offset y limit
            const { offset, limit } = paginacion_util_1.PaginacionUtil.obtenerOffsetLimit(opciones);
            // Consultar solicitudes
            const { count, rows } = await solicitud_flyer_modelo_1.default.findAndCountAll({
                where,
                include: [
                    {
                        model: usuario_modelo_1.default,
                        as: 'usuario',
                        attributes: ['id', 'nombre', 'email'],
                    },
                ],
                offset,
                limit,
                order: [[opciones.ordenarPor, opciones.orden]],
            });
            // Formatear resultado con paginación
            const resultado = paginacion_util_1.PaginacionUtil.formatearResultado(rows, count, opciones);
            return respuesta_util_1.RespuestaUtil.exito(res, 'Solicitudes obtenidas exitosamente', resultado.datos, 200, resultado.paginacion);
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorAutorizacion) {
                return respuesta_util_1.RespuestaUtil.noAutorizado(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al obtener solicitudes', error);
        }
    }
    /**
     * Obtener solicitud por ID
     * GET /api/v1/solicitudes/:id
     */
    static async obtenerPorId(req, res) {
        try {
            if (!req.usuario) {
                throw new errores_util_1.ErrorAutorizacion('Usuario no autenticado');
            }
            const { id } = req.params;
            const solicitud = await solicitud_flyer_modelo_1.default.findByPk(parseInt(id), {
                include: [
                    {
                        model: usuario_modelo_1.default,
                        as: 'usuario',
                        attributes: ['id', 'nombre', 'email'],
                    },
                ],
            });
            if (!solicitud) {
                throw new errores_util_1.ErrorNoEncontrado('Solicitud no encontrada');
            }
            // Verificar permisos: solo el dueño o admin puede ver
            if (req.usuario.rol !== enums_1.RolUsuario.ADMIN &&
                solicitud.usuarioId !== req.usuario.id) {
                throw new errores_util_1.ErrorAutorizacion('No tienes permisos para ver esta solicitud');
            }
            return respuesta_util_1.RespuestaUtil.exito(res, 'Solicitud obtenida exitosamente', solicitud);
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            if (error instanceof errores_util_1.ErrorAutorizacion) {
                return respuesta_util_1.RespuestaUtil.prohibido(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al obtener solicitud', error);
        }
    }
    /**
     * Crear nueva solicitud
     * POST /api/v1/solicitudes
     */
    static async crear(req, res) {
        try {
            if (!req.usuario) {
                throw new errores_util_1.ErrorAutorizacion('Usuario no autenticado');
            }
            const datosSolicitud = req.body;
            // Crear solicitud
            const nuevaSolicitud = await solicitud_flyer_modelo_1.default.create({
                ...datosSolicitud,
                usuarioId: req.usuario.id,
                estado: enums_1.EstadoSolicitudFlyer.PENDIENTE,
            });
            // Cargar relación con usuario
            await nuevaSolicitud.reload({
                include: [
                    {
                        model: usuario_modelo_1.default,
                        as: 'usuario',
                        attributes: ['id', 'nombre', 'email'],
                    },
                ],
            });
            // Enviar notificación al admin
            try {
                await email_servicio_1.default.enviarNotificacionNuevaSolicitud(req.usuario.nombre, datosSolicitud.nombreEvento, nuevaSolicitud.id);
            }
            catch (error) {
                console.error('Error al enviar notificación al admin:', error);
            }
            return respuesta_util_1.RespuestaUtil.creado(res, 'Solicitud creada exitosamente', nuevaSolicitud);
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorAutorizacion) {
                return respuesta_util_1.RespuestaUtil.noAutorizado(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al crear solicitud', error);
        }
    }
    /**
     * Actualizar solicitud (usuario)
     * PUT /api/v1/solicitudes/:id
     */
    static async actualizar(req, res) {
        try {
            if (!req.usuario) {
                throw new errores_util_1.ErrorAutorizacion('Usuario no autenticado');
            }
            const { id } = req.params;
            const datosActualizacion = req.body;
            const solicitud = await solicitud_flyer_modelo_1.default.findByPk(parseInt(id));
            if (!solicitud) {
                throw new errores_util_1.ErrorNoEncontrado('Solicitud no encontrada');
            }
            // Verificar permisos
            if (solicitud.usuarioId !== req.usuario.id) {
                throw new errores_util_1.ErrorAutorizacion('No tienes permisos para actualizar esta solicitud');
            }
            // Solo se puede actualizar si está pendiente o revisando
            if (solicitud.estado !== enums_1.EstadoSolicitudFlyer.PENDIENTE &&
                solicitud.estado !== enums_1.EstadoSolicitudFlyer.REVISANDO) {
                throw new errores_util_1.ErrorAutorizacion('No puedes actualizar una solicitud en este estado');
            }
            // Actualizar solo campos permitidos para usuario
            const camposPermitidos = [
                'nombreEvento',
                'tipoEvento',
                'fechaEvento',
                'descripcion',
                'referencias',
                'coloresPreferidos',
                'estiloPreferido',
                'informacionIncluir',
                'presupuesto',
                'contactoEmail',
                'contactoTelefono',
                'contactoWhatsapp',
                'fechaLimite',
            ];
            const datosPermitidos = {};
            camposPermitidos.forEach(campo => {
                if (datosActualizacion[campo] !== undefined) {
                    datosPermitidos[campo] = datosActualizacion[campo];
                }
            });
            await solicitud.update(datosPermitidos);
            return respuesta_util_1.RespuestaUtil.exito(res, 'Solicitud actualizada exitosamente', solicitud);
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            if (error instanceof errores_util_1.ErrorAutorizacion) {
                return respuesta_util_1.RespuestaUtil.prohibido(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al actualizar solicitud', error);
        }
    }
    /**
     * Actualizar estado de solicitud (admin)
     * PATCH /api/v1/solicitudes/:id/estado
     */
    static async actualizarEstado(req, res) {
        try {
            if (!req.usuario) {
                throw new errores_util_1.ErrorAutorizacion('Usuario no autenticado');
            }
            // Solo admin puede cambiar estado
            if (req.usuario.rol !== enums_1.RolUsuario.ADMIN) {
                throw new errores_util_1.ErrorAutorizacion('No tienes permisos para realizar esta acción');
            }
            const { id } = req.params;
            const { estado, prioridad, notasAdmin } = req.body;
            const solicitud = await solicitud_flyer_modelo_1.default.findByPk(parseInt(id), {
                include: [
                    {
                        model: usuario_modelo_1.default,
                        as: 'usuario',
                        attributes: ['id', 'nombre', 'email'],
                    },
                ],
            });
            if (!solicitud) {
                throw new errores_util_1.ErrorNoEncontrado('Solicitud no encontrada');
            }
            // Actualizar
            solicitud.estado = estado;
            if (prioridad)
                solicitud.prioridad = prioridad;
            if (notasAdmin !== undefined)
                solicitud.notasAdmin = notasAdmin;
            // Si se completa, registrar fecha
            if (estado === enums_1.EstadoSolicitudFlyer.COMPLETADO) {
                solicitud.fechaCompletado = new Date();
            }
            await solicitud.save();
            // Enviar notificación al usuario
            try {
                await email_servicio_1.default.enviarNotificacionCambioEstado(solicitud.usuario.email, solicitud.usuario.nombre, solicitud.nombreEvento, estado, solicitud.id);
            }
            catch (error) {
                console.error('Error al enviar notificación al usuario:', error);
            }
            return respuesta_util_1.RespuestaUtil.exito(res, 'Estado actualizado exitosamente', solicitud);
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            if (error instanceof errores_util_1.ErrorAutorizacion) {
                return respuesta_util_1.RespuestaUtil.prohibido(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al actualizar estado', error);
        }
    }
    /**
     * Cancelar solicitud (usuario)
     * PATCH /api/v1/solicitudes/:id/cancelar
     */
    static async cancelar(req, res) {
        try {
            if (!req.usuario) {
                throw new errores_util_1.ErrorAutorizacion('Usuario no autenticado');
            }
            const { id } = req.params;
            const solicitud = await solicitud_flyer_modelo_1.default.findByPk(parseInt(id));
            if (!solicitud) {
                throw new errores_util_1.ErrorNoEncontrado('Solicitud no encontrada');
            }
            // Verificar permisos
            if (solicitud.usuarioId !== req.usuario.id) {
                throw new errores_util_1.ErrorAutorizacion('No tienes permisos para cancelar esta solicitud');
            }
            // Solo se puede cancelar si no está completada o rechazada
            if (solicitud.estado === enums_1.EstadoSolicitudFlyer.COMPLETADO ||
                solicitud.estado === enums_1.EstadoSolicitudFlyer.RECHAZADO) {
                throw new errores_util_1.ErrorAutorizacion('No puedes cancelar una solicitud en este estado');
            }
            // Cancelar
            solicitud.estado = enums_1.EstadoSolicitudFlyer.CANCELADO;
            await solicitud.save();
            return respuesta_util_1.RespuestaUtil.exito(res, 'Solicitud cancelada exitosamente');
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            if (error instanceof errores_util_1.ErrorAutorizacion) {
                return respuesta_util_1.RespuestaUtil.prohibido(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al cancelar solicitud', error);
        }
    }
    /**
     * Calificar solicitud (usuario)
     * POST /api/v1/solicitudes/:id/calificar
     */
    static async calificar(req, res) {
        try {
            if (!req.usuario) {
                throw new errores_util_1.ErrorAutorizacion('Usuario no autenticado');
            }
            const { id } = req.params;
            const { calificacion, comentarioUsuario } = req.body;
            const solicitud = await solicitud_flyer_modelo_1.default.findByPk(parseInt(id));
            if (!solicitud) {
                throw new errores_util_1.ErrorNoEncontrado('Solicitud no encontrada');
            }
            // Verificar permisos
            if (solicitud.usuarioId !== req.usuario.id) {
                throw new errores_util_1.ErrorAutorizacion('No tienes permisos para calificar esta solicitud');
            }
            // Solo se puede calificar si está completada
            if (solicitud.estado !== enums_1.EstadoSolicitudFlyer.COMPLETADO) {
                throw new errores_util_1.ErrorAutorizacion('Solo puedes calificar solicitudes completadas');
            }
            // Ya calificada
            if (solicitud.calificacion !== null) {
                throw new errores_util_1.ErrorAutorizacion('Esta solicitud ya fue calificada');
            }
            // Actualizar
            solicitud.calificacion = calificacion;
            solicitud.comentarioUsuario = comentarioUsuario;
            await solicitud.save();
            return respuesta_util_1.RespuestaUtil.exito(res, 'Calificación registrada exitosamente');
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            if (error instanceof errores_util_1.ErrorAutorizacion) {
                return respuesta_util_1.RespuestaUtil.prohibido(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al calificar solicitud', error);
        }
    }
    /**
     * Eliminar solicitud
     * DELETE /api/v1/solicitudes/:id
     */
    static async eliminar(req, res) {
        try {
            if (!req.usuario) {
                throw new errores_util_1.ErrorAutorizacion('Usuario no autenticado');
            }
            const { id } = req.params;
            const solicitud = await solicitud_flyer_modelo_1.default.findByPk(parseInt(id));
            if (!solicitud) {
                throw new errores_util_1.ErrorNoEncontrado('Solicitud no encontrada');
            }
            // Verificar permisos: solo el dueño o admin pueden eliminar
            if (req.usuario.rol !== enums_1.RolUsuario.ADMIN &&
                solicitud.usuarioId !== req.usuario.id) {
                throw new errores_util_1.ErrorAutorizacion('No tienes permisos para eliminar esta solicitud');
            }
            // Solo se puede eliminar si está pendiente, cancelada o rechazada
            if (solicitud.estado === enums_1.EstadoSolicitudFlyer.EN_PROCESO ||
                solicitud.estado === enums_1.EstadoSolicitudFlyer.COMPLETADO) {
                throw new errores_util_1.ErrorAutorizacion('No puedes eliminar una solicitud en este estado');
            }
            await solicitud.destroy();
            return respuesta_util_1.RespuestaUtil.exito(res, 'Solicitud eliminada exitosamente');
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            if (error instanceof errores_util_1.ErrorAutorizacion) {
                return respuesta_util_1.RespuestaUtil.prohibido(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al eliminar solicitud', error);
        }
    }
    /**
     * Obtener estadísticas de solicitudes (admin)
     * GET /api/v1/solicitudes/estadisticas
     */
    static async obtenerEstadisticas(req, res) {
        try {
            if (!req.usuario) {
                throw new errores_util_1.ErrorAutorizacion('Usuario no autenticado');
            }
            if (req.usuario.rol !== enums_1.RolUsuario.ADMIN) {
                throw new errores_util_1.ErrorAutorizacion('No tienes permisos para ver estadísticas');
            }
            const estadisticas = {
                total: await solicitud_flyer_modelo_1.default.count(),
                pendientes: await solicitud_flyer_modelo_1.default.count({
                    where: { estado: enums_1.EstadoSolicitudFlyer.PENDIENTE },
                }),
                revisando: await solicitud_flyer_modelo_1.default.count({
                    where: { estado: enums_1.EstadoSolicitudFlyer.REVISANDO },
                }),
                enProceso: await solicitud_flyer_modelo_1.default.count({
                    where: { estado: enums_1.EstadoSolicitudFlyer.EN_PROCESO },
                }),
                completadas: await solicitud_flyer_modelo_1.default.count({
                    where: { estado: enums_1.EstadoSolicitudFlyer.COMPLETADO },
                }),
                rechazadas: await solicitud_flyer_modelo_1.default.count({
                    where: { estado: enums_1.EstadoSolicitudFlyer.RECHAZADO },
                }),
                canceladas: await solicitud_flyer_modelo_1.default.count({
                    where: { estado: enums_1.EstadoSolicitudFlyer.CANCELADO },
                }),
            };
            return respuesta_util_1.RespuestaUtil.exito(res, 'Estadísticas obtenidas exitosamente', estadisticas);
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorAutorizacion) {
                return respuesta_util_1.RespuestaUtil.prohibido(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al obtener estadísticas', error);
        }
    }
}
exports.SolicitudesControlador = SolicitudesControlador;
//# sourceMappingURL=solicitudes.controlador.js.map