"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventosControlador = void 0;
const sequelize_1 = require("sequelize");
const path_1 = __importDefault(require("path"));
const respuesta_util_1 = require("../utilidades/respuesta.util");
const paginacion_util_1 = require("../utilidades/paginacion.util");
const errores_util_1 = require("../utilidades/errores.util");
const evento_modelo_1 = __importDefault(require("../modelos/evento.modelo"));
const categoria_modelo_1 = __importDefault(require("../modelos/categoria.modelo"));
const usuario_modelo_1 = __importDefault(require("../modelos/usuario.modelo"));
const enums_1 = require("../tipos/enums");
const imagen_servicio_1 = require("../servicios/imagen.servicio");
const servidor_config_1 = require("../config/servidor.config");
/**
 * Controlador de Eventos
 */
class EventosControlador {
    /**
     * Generar slug único para evento
     */
    static async generarSlug(titulo, id) {
        let slug = titulo
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remover acentos
            .replace(/[^a-z0-9\s-]/g, '') // Remover caracteres especiales
            .replace(/\s+/g, '-') // Espacios a guiones
            .replace(/-+/g, '-') // Múltiples guiones a uno
            .trim();
        // Verificar si existe
        const whereClause = { slug };
        if (id) {
            whereClause.id = { [sequelize_1.Op.ne]: id };
        }
        const existente = await evento_modelo_1.default.findOne({ where: whereClause });
        if (existente) {
            // Agregar timestamp al slug
            slug = `${slug}-${Date.now()}`;
        }
        return slug;
    }
    /**
     * Listar eventos con filtros y paginación
     * GET /api/v1/eventos
     */
    static async listar(req, res) {
        try {
            const { pagina, limite, categoriaId, destacado, ciudad, fechaDesde, fechaHasta, busqueda, ordenarPor = 'fechaInicio', orden = 'ASC', } = req.query;
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
            const where = {
                activo: true // ✅ FILTRAR SOLO EVENTOS ACTIVOS
            };
            if (categoriaId) {
                where.categoriaId = parseInt(categoriaId);
            }
            if (destacado !== undefined) {
                where.destacado = destacado === 'true';
            }
            if (ciudad) {
                where.ciudad = { [sequelize_1.Op.like]: `%${ciudad}%` };
            }
            if (fechaDesde) {
                where.fechaInicio = { [sequelize_1.Op.gte]: new Date(fechaDesde) };
            }
            if (fechaHasta) {
                where.fechaInicio = {
                    ...where.fechaInicio,
                    [sequelize_1.Op.lte]: new Date(fechaHasta),
                };
            }
            if (busqueda) {
                where[sequelize_1.Op.or] = [
                    { titulo: { [sequelize_1.Op.like]: `%${busqueda}%` } },
                    { descripcion: { [sequelize_1.Op.like]: `%${busqueda}%` } },
                    { ubicacion: { [sequelize_1.Op.like]: `%${busqueda}%` } },
                ];
            }
            // Obtener offset y limit
            const { offset, limit } = paginacion_util_1.PaginacionUtil.obtenerOffsetLimit(opciones);
            // Consultar eventos
            const { count, rows } = await evento_modelo_1.default.findAndCountAll({
                where,
                include: [
                    {
                        model: categoria_modelo_1.default,
                        as: 'categoria',
                        attributes: ['id', 'nombre', 'slug', 'color', 'icono'],
                    },
                    {
                        model: usuario_modelo_1.default,
                        as: 'usuarioCreador',
                        attributes: ['id', 'nombre'],
                    },
                ],
                offset,
                limit,
                order: [[opciones.ordenarPor, opciones.orden]],
            });
            // Formatear resultado con paginación
            const resultado = paginacion_util_1.PaginacionUtil.formatearResultado(rows, count, opciones);
            return respuesta_util_1.RespuestaUtil.exito(res, 'Eventos obtenidos exitosamente', resultado.datos, 200, resultado.paginacion);
        }
        catch (error) {
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al obtener eventos', error);
        }
    }
    /**
     * Obtener evento por ID o slug
     * GET /api/v1/eventos/:idOSlug
     */
    static async obtenerPorId(req, res) {
        try {
            const { idOSlug } = req.params;
            // Buscar por ID o slug (sin filtrar por activo para que admins puedan ver todos)
            const where = isNaN(Number(idOSlug))
                ? { slug: idOSlug }
                : { id: parseInt(idOSlug) };
            const evento = await evento_modelo_1.default.findOne({
                where,
                include: [
                    {
                        model: categoria_modelo_1.default,
                        as: 'categoria',
                        attributes: ['id', 'nombre', 'slug', 'color', 'icono'],
                    },
                    {
                        model: usuario_modelo_1.default,
                        as: 'usuarioCreador',
                        attributes: ['id', 'nombre'],
                    },
                ],
            });
            if (!evento) {
                throw new errores_util_1.ErrorNoEncontrado('Evento no encontrado');
            }
            // Incrementar vistas
            evento.vistas += 1;
            await evento.save();
            return respuesta_util_1.RespuestaUtil.exito(res, 'Evento obtenido exitosamente', evento);
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al obtener evento', error);
        }
    }
    /**
     * Crear nuevo evento
     * POST /api/v1/eventos
     */
    static async crear(req, res) {
        try {
            if (!req.usuario) {
                throw new errores_util_1.ErrorAutorizacion('Usuario no autenticado');
            }
            const datosEvento = req.body;
            let imagenPrincipal = null;
            // Procesar imagen si fue subida
            if (req.file) {
                try {
                    const nombreBase = `evento-${Date.now()}`;
                    const carpetaDestino = path_1.default.join(servidor_config_1.configuracionServidor.almacenamiento.rutaSubida, 'eventos');
                    // Generar versiones de la imagen
                    await imagen_servicio_1.ImagenServicio.generarVersiones(req.file.path, nombreBase, carpetaDestino, 'evento');
                    // Obtener URLs públicas
                    const urlsPublicas = imagen_servicio_1.ImagenServicio.obtenerUrlsPublicas(nombreBase, carpetaDestino);
                    // Guardar la URL de la imagen principal (mediana)
                    imagenPrincipal = urlsPublicas.mediano;
                    // Guardar las URLs en el campo imagenUrl (formato JSON string)
                    datosEvento.imagenUrl = JSON.stringify(urlsPublicas);
                }
                catch (error) {
                    console.error('Error al procesar imagen:', error);
                    // Continuar sin imagen
                }
            }
            // Si no hay imagen procesada pero hay imagenUrl en body, usar esa
            if (!imagenPrincipal && datosEvento.imagenUrl) {
                imagenPrincipal = datosEvento.imagenUrl;
            }
            // Generar slug único
            const slug = await EventosControlador.generarSlug(datosEvento.titulo);
            // Asegurar que activo sea true por defecto
            const activo = datosEvento.activo !== undefined ? datosEvento.activo : true;
            // Crear evento
            const nuevoEvento = await evento_modelo_1.default.create({
                ...datosEvento,
                slug,
                activo,
                usuarioCreadorId: req.usuario.id,
            });
            // Cargar relaciones
            const eventoCompleto = await evento_modelo_1.default.findByPk(nuevoEvento.id, {
                include: [
                    {
                        model: categoria_modelo_1.default,
                        as: 'categoria',
                    },
                ],
            });
            return respuesta_util_1.RespuestaUtil.creado(res, 'Evento creado exitosamente', eventoCompleto);
        }
        catch (error) {
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al crear evento', error);
        }
    }
    /**
     * Actualizar evento
     * PUT /api/v1/eventos/:id
     */
    static async actualizar(req, res) {
        try {
            if (!req.usuario) {
                throw new errores_util_1.ErrorAutorizacion('Usuario no autenticado');
            }
            const { id } = req.params;
            const datosActualizacion = req.body;
            const evento = await evento_modelo_1.default.findByPk(parseInt(id));
            if (!evento) {
                throw new errores_util_1.ErrorNoEncontrado('Evento no encontrado');
            }
            // Verificar permisos: solo el creador o admin puede actualizar
            if (req.usuario.rol !== enums_1.RolUsuario.ADMIN &&
                evento.usuarioCreadorId !== req.usuario.id) {
                throw new errores_util_1.ErrorAutorizacion('No tienes permisos para actualizar este evento');
            }
            // Procesar nueva imagen si fue subida
            if (req.file) {
                try {
                    // Eliminar imágenes antiguas si existen
                    if (evento.imagenUrl) {
                        try {
                            const urlsAntiguas = JSON.parse(evento.imagenUrl);
                            if (urlsAntiguas.original) {
                                const nombreBaseAntiguo = path_1.default.basename(urlsAntiguas.original, '.webp').replace('-original', '');
                                const carpetaAntigua = path_1.default.join(servidor_config_1.configuracionServidor.almacenamiento.rutaSubida, 'eventos');
                                imagen_servicio_1.ImagenServicio.eliminarVersiones(nombreBaseAntiguo, carpetaAntigua);
                            }
                        }
                        catch (e) {
                            console.error('Error al eliminar imágenes antiguas:', e);
                        }
                    }
                    const nombreBase = `evento-${Date.now()}`;
                    const carpetaDestino = path_1.default.join(servidor_config_1.configuracionServidor.almacenamiento.rutaSubida, 'eventos');
                    // Generar versiones de la nueva imagen
                    await imagen_servicio_1.ImagenServicio.generarVersiones(req.file.path, nombreBase, carpetaDestino, 'evento');
                    // Obtener URLs públicas
                    const urlsPublicas = imagen_servicio_1.ImagenServicio.obtenerUrlsPublicas(nombreBase, carpetaDestino);
                    // Actualizar URLs de imagen
                    datosActualizacion.imagenUrl = JSON.stringify(urlsPublicas);
                }
                catch (error) {
                    console.error('Error al procesar nueva imagen:', error);
                    // Continuar con la actualización sin cambiar la imagen
                }
            }
            // Si se actualiza el título, regenerar slug
            if (datosActualizacion.titulo && datosActualizacion.titulo !== evento.titulo) {
                datosActualizacion.slug = await EventosControlador.generarSlug(datosActualizacion.titulo, evento.id);
            }
            // Actualizar
            await evento.update(datosActualizacion);
            // Recargar con relaciones
            await evento.reload({
                include: [
                    {
                        model: categoria_modelo_1.default,
                        as: 'categoria',
                    },
                ],
            });
            return respuesta_util_1.RespuestaUtil.exito(res, 'Evento actualizado exitosamente', evento);
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            if (error instanceof errores_util_1.ErrorAutorizacion) {
                return respuesta_util_1.RespuestaUtil.prohibido(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al actualizar evento', error);
        }
    }
    /**
     * Eliminar evento (soft delete)
     * DELETE /api/v1/eventos/:id
     */
    static async eliminar(req, res) {
        try {
            if (!req.usuario) {
                throw new errores_util_1.ErrorAutorizacion('Usuario no autenticado');
            }
            const { id } = req.params;
            const evento = await evento_modelo_1.default.findByPk(parseInt(id));
            if (!evento) {
                throw new errores_util_1.ErrorNoEncontrado('Evento no encontrado');
            }
            // Verificar permisos
            if (req.usuario.rol !== enums_1.RolUsuario.ADMIN &&
                evento.usuarioCreadorId !== req.usuario.id) {
                throw new errores_util_1.ErrorAutorizacion('No tienes permisos para eliminar este evento');
            }
            // Soft delete
            evento.activo = false;
            await evento.save();
            return respuesta_util_1.RespuestaUtil.exito(res, 'Evento eliminado exitosamente');
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            if (error instanceof errores_util_1.ErrorAutorizacion) {
                return respuesta_util_1.RespuestaUtil.prohibido(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al eliminar evento', error);
        }
    }
    /**
     * Obtener eventos destacados
     * GET /api/v1/eventos/destacados
     */
    static async obtenerDestacados(req, res) {
        try {
            const { limite = '6' } = req.query;
            const eventos = await evento_modelo_1.default.findAll({
                where: {
                    activo: true,
                    destacado: true,
                    fechaInicio: { [sequelize_1.Op.gte]: new Date() }, // Solo eventos futuros
                },
                include: [
                    {
                        model: categoria_modelo_1.default,
                        as: 'categoria',
                        attributes: ['id', 'nombre', 'slug', 'color', 'icono'],
                    },
                ],
                limit: parseInt(limite),
                order: [['fechaInicio', 'ASC']],
            });
            return respuesta_util_1.RespuestaUtil.exito(res, 'Eventos destacados obtenidos exitosamente', eventos);
        }
        catch (error) {
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al obtener eventos destacados', error);
        }
    }
    /**
     * Obtener próximos eventos
     * GET /api/v1/eventos/proximos
     */
    static async obtenerProximos(req, res) {
        try {
            const { limite = '10' } = req.query;
            const eventos = await evento_modelo_1.default.findAll({
                where: {
                    activo: true,
                    fechaInicio: { [sequelize_1.Op.gte]: new Date() },
                },
                include: [
                    {
                        model: categoria_modelo_1.default,
                        as: 'categoria',
                        attributes: ['id', 'nombre', 'slug', 'color', 'icono'],
                    },
                ],
                limit: parseInt(limite),
                order: [['fechaInicio', 'ASC']],
            });
            return respuesta_util_1.RespuestaUtil.exito(res, 'Próximos eventos obtenidos exitosamente', eventos);
        }
        catch (error) {
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al obtener próximos eventos', error);
        }
    }
}
exports.EventosControlador = EventosControlador;
//# sourceMappingURL=eventos.controlador.js.map