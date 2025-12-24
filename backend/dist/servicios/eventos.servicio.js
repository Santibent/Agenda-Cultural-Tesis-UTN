"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const evento_modelo_1 = __importDefault(require("../modelos/evento.modelo"));
const categoria_modelo_1 = __importDefault(require("../modelos/categoria.modelo"));
const usuario_modelo_1 = __importDefault(require("../modelos/usuario.modelo"));
const sequelize_1 = require("sequelize");
const slug_util_1 = require("../utils/slug.util");
class EventosServicio {
    /**
     * Listar eventos con filtros y paginación
     */
    async listar(filtros) {
        const { pagina = 1, limite = 10, categoriaId, destacado, ciudad, fechaDesde, fechaHasta, busqueda, ordenarPor = 'fecha_inicio', orden = 'ASC', } = filtros;
        const offset = (pagina - 1) * limite;
        // Construir condiciones WHERE
        const whereConditions = {
        // Mostrar todos los eventos (activos e inactivos)
        // Si quieres filtrar solo activos, descomenta la siguiente línea:
        // activo: true,
        };
        if (categoriaId) {
            whereConditions.categoriaId = categoriaId;
        }
        if (destacado !== undefined) {
            whereConditions.destacado = destacado;
        }
        if (ciudad) {
            whereConditions.ciudad = {
                [sequelize_1.Op.like]: `%${ciudad}%`,
            };
        }
        if (fechaDesde) {
            whereConditions.fechaInicio = {
                [sequelize_1.Op.gte]: fechaDesde,
            };
        }
        if (fechaHasta) {
            whereConditions.fechaInicio = {
                ...whereConditions.fechaInicio,
                [sequelize_1.Op.lte]: fechaHasta,
            };
        }
        if (busqueda) {
            whereConditions[sequelize_1.Op.or] = [
                { titulo: { [sequelize_1.Op.like]: `%${busqueda}%` } },
                { descripcion: { [sequelize_1.Op.like]: `%${busqueda}%` } },
                { ubicacion: { [sequelize_1.Op.like]: `%${busqueda}%` } },
            ];
        }
        // Consultar eventos
        const { count, rows } = await evento_modelo_1.default.findAndCountAll({
            where: whereConditions,
            include: [
                {
                    model: categoria_modelo_1.default,
                    as: 'categoria',
                    attributes: ['id', 'nombre', 'slug', 'color', 'icono'],
                },
                {
                    model: usuario_modelo_1.default,
                    as: 'usuarioCreador',
                    attributes: ['id', 'nombre', 'email'],
                },
            ],
            limit: limite,
            offset: offset,
            order: [[ordenarPor, orden]],
        });
        const totalPaginas = Math.ceil(count / limite);
        return {
            datos: rows,
            meta: {
                paginaActual: pagina,
                limitePorPagina: limite,
                totalRegistros: count,
                totalPaginas,
                tienePaginaAnterior: pagina > 1,
                tienePaginaSiguiente: pagina < totalPaginas,
            },
        };
    }
    /**
     * Obtener evento por ID o slug
     */
    async obtenerPorIdOSlug(idOSlug) {
        const whereCondition = isNaN(Number(idOSlug))
            ? { slug: idOSlug }
            : { id: Number(idOSlug) };
        return await evento_modelo_1.default.findOne({
            where: whereCondition,
            include: [
                {
                    model: categoria_modelo_1.default,
                    as: 'categoria',
                },
                {
                    model: usuario_modelo_1.default,
                    as: 'usuarioCreador',
                    attributes: ['id', 'nombre', 'email'],
                },
            ],
        });
    }
    /**
     * Obtener eventos destacados
     */
    async obtenerDestacados(limite = 6) {
        return await evento_modelo_1.default.findAll({
            where: {
                destacado: true,
                activo: true,
                fechaInicio: {
                    [sequelize_1.Op.gte]: new Date(),
                },
            },
            include: [
                {
                    model: categoria_modelo_1.default,
                    as: 'categoria',
                    attributes: ['id', 'nombre', 'slug', 'color', 'icono'],
                },
            ],
            limit: limite,
            order: [['fechaInicio', 'ASC']],
        });
    }
    /**
     * Obtener próximos eventos
     */
    async obtenerProximos(limite = 10) {
        return await evento_modelo_1.default.findAll({
            where: {
                activo: true,
                fechaInicio: {
                    [sequelize_1.Op.gte]: new Date(),
                },
            },
            include: [
                {
                    model: categoria_modelo_1.default,
                    as: 'categoria',
                    attributes: ['id', 'nombre', 'slug', 'color', 'icono'],
                },
            ],
            limit: limite,
            order: [['fechaInicio', 'ASC']],
        });
    }
    /**
     * Crear nuevo evento
     */
    async crear(datosEvento) {
        // Generar slug si no se proporciona
        if (!datosEvento.slug) {
            datosEvento.slug = (0, slug_util_1.generarSlug)(datosEvento.titulo);
        }
        // Asegurar que activo sea true por defecto
        if (datosEvento.activo === undefined) {
            datosEvento.activo = true;
        }
        return await evento_modelo_1.default.create(datosEvento);
    }
    /**
     * Actualizar evento
     */
    async actualizar(id, datosEvento) {
        const evento = await evento_modelo_1.default.findByPk(id);
        if (!evento) {
            return null;
        }
        // Si se actualiza el título, regenerar slug
        if (datosEvento.titulo && datosEvento.titulo !== evento.titulo) {
            datosEvento.slug = (0, slug_util_1.generarSlug)(datosEvento.titulo);
        }
        await evento.update(datosEvento);
        return evento;
    }
    /**
     * Eliminar evento (soft delete)
     */
    async eliminar(id) {
        const evento = await evento_modelo_1.default.findByPk(id);
        if (!evento) {
            return false;
        }
        await evento.update({ activo: false });
        return true;
    }
    /**
     * Incrementar vistas
     */
    async incrementarVistas(id) {
        const evento = await evento_modelo_1.default.findByPk(id);
        if (evento) {
            await evento.increment('vistas', { by: 1 });
        }
    }
}
exports.default = new EventosServicio();
//# sourceMappingURL=eventos.servicio.js.map