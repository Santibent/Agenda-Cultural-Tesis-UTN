import Evento from '../modelos/evento.modelo';
import Categoria from '../modelos/categoria.modelo';
import Usuario from '../modelos/usuario.modelo';
import { Op } from 'sequelize';
import { generarSlug } from '../utils/slug.util';

export interface FiltrosEventos {
  pagina?: number;
  limite?: number;
  categoriaId?: number;
  destacado?: boolean;
  ciudad?: string;
  fechaDesde?: Date;
  fechaHasta?: Date;
  busqueda?: string;
  ordenarPor?: string;
  orden?: 'ASC' | 'DESC';
}

export interface PaginacionRespuesta<T> {
  datos: T[];
  meta: {
    paginaActual: number;
    limitePorPagina: number;
    totalRegistros: number;
    totalPaginas: number;
    tienePaginaAnterior: boolean;
    tienePaginaSiguiente: boolean;
  };
}

class EventosServicio {
  
  async listar(filtros: FiltrosEventos): Promise<PaginacionRespuesta<Evento>> {
    const {
      pagina = 1,
      limite = 10,
      categoriaId,
      destacado,
      ciudad,
      fechaDesde,
      fechaHasta,
      busqueda,
      ordenarPor = 'fecha_inicio',
      orden = 'ASC',
    } = filtros;

    const offset = (pagina - 1) * limite;

    const whereConditions: any = {

    };

    if (categoriaId) {
      whereConditions.categoriaId = categoriaId;
    }

    if (destacado !== undefined) {
      whereConditions.destacado = destacado;
    }

    if (ciudad) {
      whereConditions.ciudad = {
        [Op.like]: `%${ciudad}%`,
      };
    }

    if (fechaDesde) {
      whereConditions.fechaInicio = {
        [Op.gte]: fechaDesde,
      };
    }

    if (fechaHasta) {
      whereConditions.fechaInicio = {
        ...whereConditions.fechaInicio,
        [Op.lte]: fechaHasta,
      };
    }

    if (busqueda) {
      whereConditions[Op.or] = [
        { titulo: { [Op.like]: `%${busqueda}%` } },
        { descripcion: { [Op.like]: `%${busqueda}%` } },
        { ubicacion: { [Op.like]: `%${busqueda}%` } },
      ];
    }

    const { count, rows } = await Evento.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nombre', 'slug', 'color', 'icono'],
        },
        {
          model: Usuario,
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

  async obtenerPorIdOSlug(idOSlug: string | number): Promise<Evento | null> {
    const whereCondition = isNaN(Number(idOSlug))
      ? { slug: idOSlug }
      : { id: Number(idOSlug) };

    return await Evento.findOne({
      where: whereCondition,
      include: [
        {
          model: Categoria,
          as: 'categoria',
        },
        {
          model: Usuario,
          as: 'usuarioCreador',
          attributes: ['id', 'nombre', 'email'],
        },
      ],
    });
  }

  async obtenerDestacados(limite: number = 6): Promise<Evento[]> {
    return await Evento.findAll({
      where: {
        destacado: true,
        activo: true,
        fechaInicio: {
          [Op.gte]: new Date(),
        },
      },
      include: [
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nombre', 'slug', 'color', 'icono'],
        },
      ],
      limit: limite,
      order: [['fechaInicio', 'ASC']],
    });
  }

  async obtenerProximos(limite: number = 10): Promise<Evento[]> {
    return await Evento.findAll({
      where: {
        activo: true,
        fechaInicio: {
          [Op.gte]: new Date(),
        },
      },
      include: [
        {
          model: Categoria,
          as: 'categoria',
          attributes: ['id', 'nombre', 'slug', 'color', 'icono'],
        },
      ],
      limit: limite,
      order: [['fechaInicio', 'ASC']],
    });
  }

  async crear(datosEvento: any): Promise<Evento> {
    
    if (!datosEvento.slug) {
      datosEvento.slug = generarSlug(datosEvento.titulo);
    }

    if (datosEvento.activo === undefined) {
      datosEvento.activo = true;
    }

    return await Evento.create(datosEvento);
  }

  async actualizar(id: number, datosEvento: any): Promise<Evento | null> {
    const evento = await Evento.findByPk(id);

    if (!evento) {
      return null;
    }

    if (datosEvento.titulo && datosEvento.titulo !== evento.titulo) {
      datosEvento.slug = generarSlug(datosEvento.titulo);
    }

    await evento.update(datosEvento);
    return evento;
  }

  async eliminar(id: number): Promise<boolean> {
    const evento = await Evento.findByPk(id);

    if (!evento) {
      return false;
    }

    await evento.update({ activo: false });
    return true;
  }

  async incrementarVistas(id: number): Promise<void> {
    const evento = await Evento.findByPk(id);

    if (evento) {
      await evento.increment('vistas', { by: 1 });
    }
  }
}

export default new EventosServicio();