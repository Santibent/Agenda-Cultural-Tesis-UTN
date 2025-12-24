import { Request, Response } from 'express';
import { Op } from 'sequelize';
import path from 'path';
import { RespuestaUtil } from '../utilidades/respuesta.util';
import { PaginacionUtil, OpcionePaginacion } from '../utilidades/paginacion.util';
import { ErrorNoEncontrado, ErrorAutorizacion } from '../utilidades/errores.util';
import Evento from '../modelos/evento.modelo';
import Categoria from '../modelos/categoria.modelo';
import Usuario from '../modelos/usuario.modelo';
import { RolUsuario } from '../tipos/enums';
import { ImagenServicio } from '../servicios/imagen.servicio';
import { configuracionServidor } from '../config/servidor.config';

export class EventosControlador {
  
  private static async generarSlug(titulo: string, id?: number): Promise<string> {
    let slug = titulo
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') 
      .replace(/[^a-z0-9\s-]/g, '') 
      .replace(/\s+/g, '-') 
      .replace(/-+/g, '-') 
      .trim();

    const whereClause: any = { slug };
    if (id) {
      whereClause.id = { [Op.ne]: id };
    }

    const existente = await Evento.findOne({ where: whereClause });

    if (existente) {
      
      slug = `${slug}-${Date.now()}`;
    }

    return slug;
  }

  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const {
        pagina,
        limite,
        categoriaId,
        destacado,
        ciudad,
        fechaDesde,
        fechaHasta,
        busqueda,
        ordenarPor = 'fechaInicio',
        orden = 'ASC',
      } = req.query;

      const opciones: OpcionePaginacion = {
        pagina: pagina ? parseInt(pagina as string) : 1,
        limite: limite ? parseInt(limite as string) : 10,
        ordenarPor: ordenarPor as string,
        orden: orden as 'ASC' | 'DESC',
      };

      const erroresValidacion = PaginacionUtil.validarOpciones(opciones);
      if (erroresValidacion.length > 0) {
        return RespuestaUtil.errorValidacion(res, erroresValidacion.map(e => ({ mensaje: e })));
      }

      const where: any = {
        activo: true 
      };

      if (categoriaId) {
        where.categoriaId = parseInt(categoriaId as string);
      }

      if (destacado !== undefined) {
        where.destacado = destacado === 'true';
      }

      if (ciudad) {
        where.ciudad = { [Op.like]: `%${ciudad}%` };
      }

      if (fechaDesde) {
        where.fechaInicio = { [Op.gte]: new Date(fechaDesde as string) };
      }

      if (fechaHasta) {
        where.fechaInicio = {
          ...where.fechaInicio,
          [Op.lte]: new Date(fechaHasta as string),
        };
      }

      if (busqueda) {
        where[Op.or] = [
          { titulo: { [Op.like]: `%${busqueda}%` } },
          { descripcion: { [Op.like]: `%${busqueda}%` } },
          { ubicacion: { [Op.like]: `%${busqueda}%` } },
        ];
      }

      const { offset, limit } = PaginacionUtil.obtenerOffsetLimit(opciones);

      const { count, rows } = await Evento.findAndCountAll({
        where,
        include: [
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nombre', 'slug', 'color', 'icono'],
          },
          {
            model: Usuario,
            as: 'usuarioCreador',
            attributes: ['id', 'nombre'],
          },
        ],
        offset,
        limit,
        order: [[opciones.ordenarPor!, opciones.orden!]],
      });

      const resultado = PaginacionUtil.formatearResultado(rows, count, opciones);

      return RespuestaUtil.exito(res, 'Eventos obtenidos exitosamente', resultado.datos, 200, resultado.paginacion);
    } catch (error: any) {
      return RespuestaUtil.errorServidor(res, 'Error al obtener eventos', error);
    }
  }

  static async obtenerPorId(req: Request, res: Response): Promise<Response> {
    try {
      const { idOSlug } = req.params;

      const where: any = isNaN(Number(idOSlug))
        ? { slug: idOSlug }
        : { id: parseInt(idOSlug) };

      const evento = await Evento.findOne({
        where,
        include: [
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nombre', 'slug', 'color', 'icono'],
          },
          {
            model: Usuario,
            as: 'usuarioCreador',
            attributes: ['id', 'nombre'],
          },
        ],
      });

      if (!evento) {
        throw new ErrorNoEncontrado('Evento no encontrado');
      }

      evento.vistas += 1;
      await evento.save();

      return RespuestaUtil.exito(res, 'Evento obtenido exitosamente', evento);
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al obtener evento', error);
    }
  }

  static async crear(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.usuario) {
        throw new ErrorAutorizacion('Usuario no autenticado');
      }

      const datosEvento = req.body;
      let imagenPrincipal = null;

      if (req.file) {
        try {
          const nombreBase = `evento-${Date.now()}`;
          const carpetaDestino = path.join(
            configuracionServidor.almacenamiento.rutaSubida,
            'eventos'
          );

          await ImagenServicio.generarVersiones(
            req.file.path,
            nombreBase,
            carpetaDestino,
            'evento'
          );

          const urlsPublicas = ImagenServicio.obtenerUrlsPublicas(nombreBase, carpetaDestino);

          imagenPrincipal = urlsPublicas.mediano;

          datosEvento.imagenUrl = JSON.stringify(urlsPublicas);
        } catch (error) {
          console.error('Error al procesar imagen:', error);
          
        }
      }

      if (!imagenPrincipal && datosEvento.imagenUrl) {
        imagenPrincipal = datosEvento.imagenUrl;
      }

      const slug = await EventosControlador.generarSlug(datosEvento.titulo);

      const activo = datosEvento.activo !== undefined ? datosEvento.activo : true;

      const nuevoEvento = await Evento.create({
        ...datosEvento,
        slug,
        activo,
        usuarioCreadorId: req.usuario.id,
      });

      const eventoCompleto = await Evento.findByPk(nuevoEvento.id, {
        include: [
          {
            model: Categoria,
            as: 'categoria',
          },
        ],
      });

      return RespuestaUtil.creado(res, 'Evento creado exitosamente', eventoCompleto);
    } catch (error: any) {
      return RespuestaUtil.errorServidor(res, 'Error al crear evento', error);
    }
  }

  static async actualizar(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.usuario) {
        throw new ErrorAutorizacion('Usuario no autenticado');
      }

      const { id } = req.params;
      const datosActualizacion = req.body;

      const evento = await Evento.findByPk(parseInt(id));

      if (!evento) {
        throw new ErrorNoEncontrado('Evento no encontrado');
      }

      if (
        req.usuario.rol !== RolUsuario.ADMIN &&
        evento.usuarioCreadorId !== req.usuario.id
      ) {
        throw new ErrorAutorizacion('No tienes permisos para actualizar este evento');
      }

      if (req.file) {
        try {
          
          if (evento.imagenUrl) {
            try {
              const urlsAntiguas = JSON.parse(evento.imagenUrl);
              if (urlsAntiguas.original) {
                const nombreBaseAntiguo = path.basename(urlsAntiguas.original, '.webp').replace('-original', '');
                const carpetaAntigua = path.join(
                  configuracionServidor.almacenamiento.rutaSubida,
                  'eventos'
                );
                ImagenServicio.eliminarVersiones(nombreBaseAntiguo, carpetaAntigua);
              }
            } catch (e) {
              console.error('Error al eliminar imágenes antiguas:', e);
            }
          }

          const nombreBase = `evento-${Date.now()}`;
          const carpetaDestino = path.join(
            configuracionServidor.almacenamiento.rutaSubida,
            'eventos'
          );

          await ImagenServicio.generarVersiones(
            req.file.path,
            nombreBase,
            carpetaDestino,
            'evento'
          );

          const urlsPublicas = ImagenServicio.obtenerUrlsPublicas(nombreBase, carpetaDestino);

          datosActualizacion.imagenUrl = JSON.stringify(urlsPublicas);
        } catch (error) {
          console.error('Error al procesar nueva imagen:', error);
          
        }
      }

      if (datosActualizacion.titulo && datosActualizacion.titulo !== evento.titulo) {
        datosActualizacion.slug = await EventosControlador.generarSlug(
          datosActualizacion.titulo,
          evento.id
        );
      }

      await evento.update(datosActualizacion);

      await evento.reload({
        include: [
          {
            model: Categoria,
            as: 'categoria',
          },
        ],
      });

      return RespuestaUtil.exito(res, 'Evento actualizado exitosamente', evento);
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      if (error instanceof ErrorAutorizacion) {
        return RespuestaUtil.prohibido(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al actualizar evento', error);
    }
  }

  static async eliminar(req: Request, res: Response): Promise<Response> {
    try {
      if (!req.usuario) {
        throw new ErrorAutorizacion('Usuario no autenticado');
      }

      const { id } = req.params;

      const evento = await Evento.findByPk(parseInt(id));

      if (!evento) {
        throw new ErrorNoEncontrado('Evento no encontrado');
      }

      if (
        req.usuario.rol !== RolUsuario.ADMIN &&
        evento.usuarioCreadorId !== req.usuario.id
      ) {
        throw new ErrorAutorizacion('No tienes permisos para eliminar este evento');
      }

      evento.activo = false;
      await evento.save();

      return RespuestaUtil.exito(res, 'Evento eliminado exitosamente');
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      if (error instanceof ErrorAutorizacion) {
        return RespuestaUtil.prohibido(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al eliminar evento', error);
    }
  }

  static async obtenerDestacados(req: Request, res: Response): Promise<Response> {
    try {
      const { limite = '6' } = req.query;

      const eventos = await Evento.findAll({
        where: {
          activo: true,
          destacado: true,
          fechaInicio: { [Op.gte]: new Date() }, 
        },
        include: [
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nombre', 'slug', 'color', 'icono'],
          },
        ],
        limit: parseInt(limite as string),
        order: [['fechaInicio', 'ASC']],
      });

      return RespuestaUtil.exito(res, 'Eventos destacados obtenidos exitosamente', eventos);
    } catch (error: any) {
      return RespuestaUtil.errorServidor(res, 'Error al obtener eventos destacados', error);
    }
  }

  static async obtenerProximos(req: Request, res: Response): Promise<Response> {
    try {
      const { limite = '10' } = req.query;

      const eventos = await Evento.findAll({
        where: {
          activo: true,
          fechaInicio: { [Op.gte]: new Date() },
        },
        include: [
          {
            model: Categoria,
            as: 'categoria',
            attributes: ['id', 'nombre', 'slug', 'color', 'icono'],
          },
        ],
        limit: parseInt(limite as string),
        order: [['fechaInicio', 'ASC']],
      });

      return RespuestaUtil.exito(res, 'Próximos eventos obtenidos exitosamente', eventos);
    } catch (error: any) {
      return RespuestaUtil.errorServidor(res, 'Error al obtener próximos eventos', error);
    }
  }
}