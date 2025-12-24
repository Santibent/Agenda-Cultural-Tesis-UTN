"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CategoriasControlador = void 0;
const respuesta_util_1 = require("../utilidades/respuesta.util");
const errores_util_1 = require("../utilidades/errores.util");
const categoria_modelo_1 = __importDefault(require("../modelos/categoria.modelo"));
const evento_modelo_1 = __importDefault(require("../modelos/evento.modelo"));
const sequelize_1 = require("sequelize");
/**
 * Controlador de Categorías
 */
class CategoriasControlador {
    /**
     * Listar todas las categorías
     * GET /api/v1/categorias
     */
    static async listar(req, res) {
        try {
            const { activo } = req.query;
            const where = {};
            if (activo !== undefined) {
                where.activo = activo === 'true';
            }
            const categorias = await categoria_modelo_1.default.findAll({
                where,
                order: [['orden', 'ASC'], ['nombre', 'ASC']],
            });
            return respuesta_util_1.RespuestaUtil.exito(res, 'Categorías obtenidas exitosamente', categorias);
        }
        catch (error) {
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al obtener categorías', error);
        }
    }
    /**
     * Obtener categoría por ID o slug
     * GET /api/v1/categorias/:idOSlug
     */
    static async obtenerPorId(req, res) {
        try {
            const { idOSlug } = req.params;
            // Buscar por ID o slug
            const where = isNaN(Number(idOSlug))
                ? { slug: idOSlug }
                : { id: parseInt(idOSlug) };
            const categoria = await categoria_modelo_1.default.findOne({ where });
            if (!categoria) {
                throw new errores_util_1.ErrorNoEncontrado('Categoría no encontrada');
            }
            // Contar eventos de esta categoría
            const totalEventos = await evento_modelo_1.default.count({
                where: {
                    categoriaId: categoria.id,
                    activo: true,
                },
            });
            const categoriaConEventos = {
                ...categoria.toJSON(),
                totalEventos,
            };
            return respuesta_util_1.RespuestaUtil.exito(res, 'Categoría obtenida exitosamente', categoriaConEventos);
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al obtener categoría', error);
        }
    }
    /**
     * Crear nueva categoría (admin)
     * POST /api/v1/categorias
     */
    static async crear(req, res) {
        try {
            const datosCategoria = req.body;
            // Verificar si el slug ya existe
            const categoriaExistente = await categoria_modelo_1.default.findOne({
                where: { slug: datosCategoria.slug },
            });
            if (categoriaExistente) {
                throw new errores_util_1.ErrorConflicto('Ya existe una categoría con ese slug');
            }
            // Crear categoría
            const nuevaCategoria = await categoria_modelo_1.default.create(datosCategoria);
            return respuesta_util_1.RespuestaUtil.creado(res, 'Categoría creada exitosamente', nuevaCategoria);
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorConflicto) {
                return respuesta_util_1.RespuestaUtil.conflicto(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al crear categoría', error);
        }
    }
    /**
     * Actualizar categoría (admin)
     * PUT /api/v1/categorias/:id
     */
    static async actualizar(req, res) {
        try {
            const { id } = req.params;
            const datosActualizacion = req.body;
            const categoria = await categoria_modelo_1.default.findByPk(parseInt(id));
            if (!categoria) {
                throw new errores_util_1.ErrorNoEncontrado('Categoría no encontrada');
            }
            // Si se actualiza el slug, verificar que no exista
            if (datosActualizacion.slug && datosActualizacion.slug !== categoria.slug) {
                const categoriaConSlug = await categoria_modelo_1.default.findOne({
                    where: {
                        slug: datosActualizacion.slug,
                        id: { [sequelize_1.Op.ne]: categoria.id },
                    },
                });
                if (categoriaConSlug) {
                    throw new errores_util_1.ErrorConflicto('Ya existe una categoría con ese slug');
                }
            }
            // Actualizar
            await categoria.update(datosActualizacion);
            return respuesta_util_1.RespuestaUtil.exito(res, 'Categoría actualizada exitosamente', categoria);
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            if (error instanceof errores_util_1.ErrorConflicto) {
                return respuesta_util_1.RespuestaUtil.conflicto(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al actualizar categoría', error);
        }
    }
    /**
     * Eliminar categoría (admin)
     * DELETE /api/v1/categorias/:id
     */
    static async eliminar(req, res) {
        try {
            const { id } = req.params;
            const categoria = await categoria_modelo_1.default.findByPk(parseInt(id));
            if (!categoria) {
                throw new errores_util_1.ErrorNoEncontrado('Categoría no encontrada');
            }
            // Verificar si tiene eventos asociados
            const eventosAsociados = await evento_modelo_1.default.count({
                where: { categoriaId: categoria.id },
            });
            if (eventosAsociados > 0) {
                throw new errores_util_1.ErrorConflicto(`No se puede eliminar la categoría porque tiene ${eventosAsociados} evento(s) asociado(s)`);
            }
            await categoria.destroy();
            return respuesta_util_1.RespuestaUtil.exito(res, 'Categoría eliminada exitosamente');
        }
        catch (error) {
            if (error instanceof errores_util_1.ErrorNoEncontrado) {
                return respuesta_util_1.RespuestaUtil.noEncontrado(res, error.message);
            }
            if (error instanceof errores_util_1.ErrorConflicto) {
                return respuesta_util_1.RespuestaUtil.conflicto(res, error.message);
            }
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al eliminar categoría', error);
        }
    }
    /**
     * Obtener categorías con contador de eventos
     * GET /api/v1/categorias/con-eventos
     */
    static async listarConEventos(_req, res) {
        try {
            const categorias = await categoria_modelo_1.default.findAll({
                where: { activo: true },
                order: [['orden', 'ASC'], ['nombre', 'ASC']],
                attributes: {
                    include: [
                        [
                            // Subconsulta para contar eventos activos
                            categoria_modelo_1.default.sequelize.literal(`(
                SELECT COUNT(*)
                FROM eventos
                WHERE eventos.categoria_id = Categoria.id
                AND eventos.activo = true
              )`),
                            'totalEventos',
                        ],
                    ],
                },
            });
            return respuesta_util_1.RespuestaUtil.exito(res, 'Categorías con eventos obtenidas exitosamente', categorias);
        }
        catch (error) {
            return respuesta_util_1.RespuestaUtil.errorServidor(res, 'Error al obtener categorías con eventos', error);
        }
    }
}
exports.CategoriasControlador = CategoriasControlador;
//# sourceMappingURL=categorias.controlador.js.map