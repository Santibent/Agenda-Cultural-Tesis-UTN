"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlyersControlador = void 0;
const path_1 = __importDefault(require("path"));
const respuesta_util_1 = require("../utilidades/respuesta.util");
const paginacion_util_1 = require("../utilidades/paginacion.util");
const errores_util_1 = require("../utilidades/errores.util");
const flyer_modelo_1 = __importDefault(require("../modelos/flyer.modelo"));
const evento_modelo_1 = __importDefault(require("../modelos/evento.modelo"));
const enums_1 = require("../tipos/enums");
const imagen_servicio_1 = require("../servicios/imagen.servicio");
const servidor_config_1 = require("../config/servidor.config");
/**
 * Controlador de Flyers
 */
class FlyersControlador {
    /**
     * Listar flyers con filtros y paginación
     * GET /api/v1/flyers
     */
    static async listar(req, res) {
        try {
            const { pagina, limite, visible, destacado, eventoRelacionadoId, ordenarPor = 'orden', orden = 'ASC', } = req.query;
            // Opciones de paginación
            const opciones = {
                pagina: pagina ? parseInt(pagina) : 1,
                limite: limite ? parseInt(limite) : 12,
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
            // Por defecto, solo mostrar visibles a usuarios no admin
            if (!req.usuario || req.usuario.rol !== enums_1.RolUsuario.ADMIN) {
                where.visible = true;
            }
            else if (visible !== undefined) {
                where.visible = visible === 'true';
            }
            if (destacado !== undefined) {
                where.destacado = destacado === 'true';
            }
            if (eventoRelacionadoId) {
                where.eventoRelacionadoId = parseInt(eventoRelacionadoId);
            }
            // Obtener offset y limit
            const { offset, limit } = paginacion_util_1.PaginacionUtil.obtenerOffsetLimit(opciones);
            // Consultar flyers
            const { count, rows } = await flyer_modelo_1.default.findAndCountAll({
                where,
                include: [
                    {
                        model: evento_modelo_1.default,
                        as: 'eventoRelacionado',
                        attributes: ['id', 'titulo', 'slug'],
                    },
                ],
                offset,
                limit,
                order: [[opciones.ordenarPor, opciones.orden]],
            });
            // Formatear resultado con paginación
            const resultado = paginacion_util_1.PaginacionUtil.formatearResultado(rows, count, opciones);
            return respuesta_util_1.RespuestaUtil.exito(res, 'Flyers obtenidos exitosamente', resultado.datos, 200, resultado.paginacion);
        }
        catch (error) {
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al obtener flyers', error);
        }
    }
    /**
     * Obtener flyer por ID
     * GET /api/v1/flyers/:id
     */
    static async obtenerPorId(req, res) {
        try {
            const { id } = req.params;
            const flyer = await flyer_modelo_1.default.findByPk(parseInt(id), {
                include: [
                    {
                        model: evento_modelo_1.default,
                        as: 'eventoRelacionado',
                        attributes: ['id', 'titulo', 'slug', 'fechaInicio'],
                    },
                ],
            });
            if (!flyer) {
                throw new errores_util_1.ErrorNoEncontrado('Flyer no encontrado');
            }
            // Verificar visibilidad
            if (!flyer.visible && (!req.usuario || req.usuario.rol !== enums_1.RolUsuario.ADMIN)) {
                throw new errores_util_1.ErrorNoEncontrado('Flyer no encontrado');
            }
            // Incrementar vistas
            flyer.vistas += 1;
            await flyer.save();
            return respuesta_util_1.RespuestaUtil.exito(res, 'Flyer obtenido exitosamente', flyer);
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al obtener flyer', error);
        }
    }
    /**
     * Crear nuevo flyer (admin)
     * POST /api/v1/flyers
     */
    static async crear(req, res) {
        try {
            if (!req.usuario || req.usuario.rol !== enums_1.RolUsuario.ADMIN) {
                throw new errores_util_1.ErrorAutorizacion('No tienes permisos para crear flyers');
            }
            const datosFlyer = req.body;
            // Procesar etiquetas si vienen como JSON string desde FormData
            if (datosFlyer.etiquetas && typeof datosFlyer.etiquetas === 'string') {
                try {
                    datosFlyer.etiquetas = JSON.parse(datosFlyer.etiquetas);
                }
                catch (e) {
                    console.error('Error al parsear etiquetas:', e);
                    datosFlyer.etiquetas = [];
                }
            }
            // Procesar imagen si fue subida
            if (req.file) {
                try {
                    const nombreBase = `flyer-${Date.now()}`;
                    const carpetaDestino = path_1.default.join(servidor_config_1.configuracionServidor.almacenamiento.rutaSubida, 'flyers');
                    // Generar versiones de la imagen
                    await imagen_servicio_1.ImagenServicio.generarVersiones(req.file.path, nombreBase, carpetaDestino, 'flyer');
                    // Obtener URLs públicas
                    const urlsPublicas = imagen_servicio_1.ImagenServicio.obtenerUrlsPublicas(nombreBase, carpetaDestino);
                    // Guardar URLs
                    datosFlyer.imagenUrl = JSON.stringify(urlsPublicas);
                    datosFlyer.imagenThumbnail = urlsPublicas.thumbnail;
                }
                catch (error) {
                    console.error('Error al procesar imagen:', error);
                    // Continuar sin imagen
                }
            }
            // Crear flyer
            const nuevoFlyer = await flyer_modelo_1.default.create(datosFlyer);
            // Cargar relaciones
            await nuevoFlyer.reload({
                include: [
                    {
                        model: evento_modelo_1.default,
                        as: 'eventoRelacionado',
                    },
                ],
            });
            return respuesta_util_1.RespuestaUtil.creado(res, 'Flyer creado exitosamente', nuevoFlyer);
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorAutorizacion) {
                return respuesta_util_1.RespuestaUtil.prohibido(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al crear flyer', error);
        }
    }
    /**
     * Actualizar flyer (admin)
     * PUT /api/v1/flyers/:id
     */
    static async actualizar(req, res) {
        try {
            if (!req.usuario || req.usuario.rol !== enums_1.RolUsuario.ADMIN) {
                throw new errores_util_1.ErrorAutorizacion('No tienes permisos para actualizar flyers');
            }
            const { id } = req.params;
            const datosActualizacion = req.body;
            // Procesar etiquetas si vienen como JSON string desde FormData
            if (datosActualizacion.etiquetas && typeof datosActualizacion.etiquetas === 'string') {
                try {
                    datosActualizacion.etiquetas = JSON.parse(datosActualizacion.etiquetas);
                }
                catch (e) {
                    console.error('Error al parsear etiquetas:', e);
                    datosActualizacion.etiquetas = [];
                }
            }
            const flyer = await flyer_modelo_1.default.findByPk(parseInt(id));
            if (!flyer) {
                throw new errores_util_1.ErrorNoEncontrado('Flyer no encontrado');
            }
            // Procesar nueva imagen si fue subida
            if (req.file) {
                try {
                    // Eliminar imágenes antiguas si existen
                    if (flyer.imagenUrl) {
                        try {
                            const urlsAntiguas = JSON.parse(flyer.imagenUrl);
                            if (urlsAntiguas.original) {
                                const nombreBaseAntiguo = path_1.default.basename(urlsAntiguas.original, '.webp').replace('-original', '');
                                const carpetaAntigua = path_1.default.join(servidor_config_1.configuracionServidor.almacenamiento.rutaSubida, 'flyers');
                                imagen_servicio_1.ImagenServicio.eliminarVersiones(nombreBaseAntiguo, carpetaAntigua);
                            }
                        }
                        catch (e) {
                            console.error('Error al eliminar imágenes antiguas:', e);
                        }
                    }
                    const nombreBase = `flyer-${Date.now()}`;
                    const carpetaDestino = path_1.default.join(servidor_config_1.configuracionServidor.almacenamiento.rutaSubida, 'flyers');
                    // Generar versiones de la nueva imagen
                    await imagen_servicio_1.ImagenServicio.generarVersiones(req.file.path, nombreBase, carpetaDestino, 'flyer');
                    // Obtener URLs públicas
                    const urlsPublicas = imagen_servicio_1.ImagenServicio.obtenerUrlsPublicas(nombreBase, carpetaDestino);
                    // Actualizar URLs de imagen
                    datosActualizacion.imagenUrl = JSON.stringify(urlsPublicas);
                    datosActualizacion.imagenThumbnail = urlsPublicas.thumbnail;
                }
                catch (error) {
                    console.error('Error al procesar nueva imagen:', error);
                    // Continuar con la actualización sin cambiar la imagen
                }
            }
            // Actualizar
            await flyer.update(datosActualizacion);
            // Recargar con relaciones
            await flyer.reload({
                include: [
                    {
                        model: evento_modelo_1.default,
                        as: 'eventoRelacionado',
                    },
                ],
            });
            return respuesta_util_1.RespuestaUtil.exito(res, 'Flyer actualizado exitosamente', flyer);
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            if (error instanceof errores_util_1.ErrorAutorizacion) {
                return respuesta_util_1.RespuestaUtil.prohibido(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al actualizar flyer', error);
        }
    }
    /**
     * Eliminar flyer (admin)
     * DELETE /api/v1/flyers/:id
     */
    static async eliminar(req, res) {
        try {
            if (!req.usuario || req.usuario.rol !== enums_1.RolUsuario.ADMIN) {
                throw new errores_util_1.ErrorAutorizacion('No tienes permisos para eliminar flyers');
            }
            const { id } = req.params;
            const flyer = await flyer_modelo_1.default.findByPk(parseInt(id));
            if (!flyer) {
                throw new errores_util_1.ErrorNoEncontrado('Flyer no encontrado');
            }
            await flyer.destroy();
            return respuesta_util_1.RespuestaUtil.exito(res, 'Flyer eliminado exitosamente');
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            if (error instanceof errores_util_1.ErrorAutorizacion) {
                return respuesta_util_1.RespuestaUtil.prohibido(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al eliminar flyer', error);
        }
    }
    /**
     * Obtener flyers destacados
     * GET /api/v1/flyers/destacados
     */
    static async obtenerDestacados(req, res) {
        try {
            const { limite = '6' } = req.query;
            const flyers = await flyer_modelo_1.default.findAll({
                where: {
                    visible: true,
                    destacado: true,
                },
                include: [
                    {
                        model: evento_modelo_1.default,
                        as: 'eventoRelacionado',
                        attributes: ['id', 'titulo', 'slug'],
                    },
                ],
                limit: parseInt(limite),
                order: [['orden', 'ASC'], ['createdAt', 'DESC']],
            });
            return respuesta_util_1.RespuestaUtil.exito(res, 'Flyers destacados obtenidos exitosamente', flyers);
        }
        catch (error) {
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al obtener flyers destacados', error);
        }
    }
    /**
     * Obtener galería completa de flyers (público)
     * GET /api/v1/flyers/galeria
     */
    static async obtenerGaleria(_req, res) {
        try {
            const flyers = await flyer_modelo_1.default.findAll({
                where: { visible: true },
                order: [['orden', 'ASC'], ['createdAt', 'DESC']],
                attributes: ['id', 'titulo', 'imagenUrl', 'imagenThumbnail', 'etiquetas', 'vistas'],
            });
            return respuesta_util_1.RespuestaUtil.exito(res, 'Galería de flyers obtenida exitosamente', flyers);
        }
        catch (error) {
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al obtener galería', error);
        }
    }
}
exports.FlyersControlador = FlyersControlador;
//# sourceMappingURL=flyers.controlador.js.map