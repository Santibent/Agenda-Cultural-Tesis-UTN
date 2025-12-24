import { Request, Response } from 'express';
import path from 'path';
import { RespuestaUtil } from '../utilidades/respuesta.util';
import { PaginacionUtil, OpcionePaginacion } from '../utilidades/paginacion.util';
import { ErrorNoEncontrado, ErrorAutorizacion } from '../utilidades/errores.util';
import Flyer from '../modelos/flyer.modelo';
import Evento from '../modelos/evento.modelo';
import { RolUsuario } from '../tipos/enums';
import { ImagenServicio } from '../servicios/imagen.servicio';
import { configuracionServidor } from '../config/servidor.config';

export class FlyersControlador {
  
  static async listar(req: Request, res: Response) {
    try {
      const {
        pagina,
        limite,
        visible,
        destacado,
        eventoRelacionadoId,
        ordenarPor = 'orden',
        orden = 'ASC',
      } = req.query;

      const opciones: OpcionePaginacion = {
        pagina: pagina ? parseInt(pagina as string) : 1,
        limite: limite ? parseInt(limite as string) : 12,
        ordenarPor: ordenarPor as string,
        orden: orden as 'ASC' | 'DESC',
      };

      const erroresValidacion = PaginacionUtil.validarOpciones(opciones);
      if (erroresValidacion.length > 0) {
        return RespuestaUtil.errorValidacion(res, erroresValidacion.map(e => ({ mensaje: e })));
      }

      const where: any = {};

      if (!req.usuario || req.usuario.rol !== RolUsuario.ADMIN) {
        where.visible = true;
      } else if (visible !== undefined) {
        where.visible = visible === 'true';
      }

      if (destacado !== undefined) {
        where.destacado = destacado === 'true';
      }

      if (eventoRelacionadoId) {
        where.eventoRelacionadoId = parseInt(eventoRelacionadoId as string);
      }

      const { offset, limit } = PaginacionUtil.obtenerOffsetLimit(opciones);

      const { count, rows } = await Flyer.findAndCountAll({
        where,
        include: [
          {
            model: Evento,
            as: 'eventoRelacionado',
            attributes: ['id', 'titulo', 'slug'],
          },
        ],
        offset,
        limit,
        order: [[opciones.ordenarPor!, opciones.orden!]],
      });

      const resultado = PaginacionUtil.formatearResultado(rows, count, opciones);

      return RespuestaUtil.exito(
        res,
        'Flyers obtenidos exitosamente',
        resultado.datos,
        200,
        resultado.paginacion
      );
    } catch (error: any) {
      return RespuestaUtil.errorServidor(res, 'Error al obtener flyers', error);
    }
  }

  static async obtenerPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const flyer = await Flyer.findByPk(parseInt(id), {
        include: [
          {
            model: Evento,
            as: 'eventoRelacionado',
            attributes: ['id', 'titulo', 'slug', 'fechaInicio'],
          },
        ],
      });

      if (!flyer) {
        throw new ErrorNoEncontrado('Flyer no encontrado');
      }

      if (!flyer.visible && (!req.usuario || req.usuario.rol !== RolUsuario.ADMIN)) {
        throw new ErrorNoEncontrado('Flyer no encontrado');
      }

      flyer.vistas += 1;
      await flyer.save();

      return RespuestaUtil.exito(res, 'Flyer obtenido exitosamente', flyer);
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al obtener flyer', error);
    }
  }

  static async crear(req: Request, res: Response) {
    try {
      if (!req.usuario || req.usuario.rol !== RolUsuario.ADMIN) {
        throw new ErrorAutorizacion('No tienes permisos para crear flyers');
      }

      const datosFlyer = req.body;

      if (datosFlyer.etiquetas && typeof datosFlyer.etiquetas === 'string') {
        try {
          datosFlyer.etiquetas = JSON.parse(datosFlyer.etiquetas);
        } catch (e) {
          console.error('Error al parsear etiquetas:', e);
          datosFlyer.etiquetas = [];
        }
      }

      if (datosFlyer.eventoRelacionadoId === '' || datosFlyer.eventoRelacionadoId === 'null') {
        datosFlyer.eventoRelacionadoId = null;
      }

      if (!req.file) {
        return RespuestaUtil.errorValidacion(res, [{ mensaje: 'La imagen es obligatoria' }]);
      }

      if (req.file) {
        try {
          const nombreBase = `flyer-${Date.now()}`;
          const carpetaDestino = path.join(
            configuracionServidor.almacenamiento.rutaSubida,
            'flyers'
          );

          await ImagenServicio.generarVersiones(
            req.file.path,
            nombreBase,
            carpetaDestino,
            'flyer'
          );

          const urlsPublicas = ImagenServicio.obtenerUrlsPublicas(nombreBase, carpetaDestino);

          datosFlyer.imagenUrl = JSON.stringify(urlsPublicas);
          datosFlyer.imagenThumbnail = urlsPublicas.thumbnail;
        } catch (error) {
          console.error('Error al procesar imagen:', error);
          return RespuestaUtil.errorServidor(res, 'Error al procesar la imagen. Por favor intenta de nuevo.', error as any);
        }
      }

      if (!datosFlyer.imagenUrl) {
        return RespuestaUtil.errorValidacion(res, [{ mensaje: 'Error al procesar la imagen' }]);
      }

      const nuevoFlyer = await Flyer.create(datosFlyer);

      await nuevoFlyer.reload({
        include: [
          {
            model: Evento,
            as: 'eventoRelacionado',
          },
        ],
      });

      return RespuestaUtil.creado(res, 'Flyer creado exitosamente', nuevoFlyer);
    } catch (error: any) {
      if (error instanceof ErrorAutorizacion) {
        return RespuestaUtil.prohibido(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al crear flyer', error);
    }
  }

  static async actualizar(req: Request, res: Response) {
    try {
      if (!req.usuario || req.usuario.rol !== RolUsuario.ADMIN) {
        throw new ErrorAutorizacion('No tienes permisos para actualizar flyers');
      }

      const { id } = req.params;
      const datosActualizacion = req.body;

      if (datosActualizacion.etiquetas && typeof datosActualizacion.etiquetas === 'string') {
        try {
          datosActualizacion.etiquetas = JSON.parse(datosActualizacion.etiquetas);
        } catch (e) {
          console.error('Error al parsear etiquetas:', e);
          datosActualizacion.etiquetas = [];
        }
      }

      if (datosActualizacion.eventoRelacionadoId === '' || datosActualizacion.eventoRelacionadoId === 'null') {
        datosActualizacion.eventoRelacionadoId = null;
      }

      const flyer = await Flyer.findByPk(parseInt(id));

      if (!flyer) {
        throw new ErrorNoEncontrado('Flyer no encontrado');
      }

      if (req.file) {
        try {
          
          if (flyer.imagenUrl) {
            try {
              const urlsAntiguas = JSON.parse(flyer.imagenUrl);
              if (urlsAntiguas.original) {
                const nombreBaseAntiguo = path.basename(urlsAntiguas.original, '.webp').replace('-original', '');
                const carpetaAntigua = path.join(
                  configuracionServidor.almacenamiento.rutaSubida,
                  'flyers'
                );
                ImagenServicio.eliminarVersiones(nombreBaseAntiguo, carpetaAntigua);
              }
            } catch (e) {
              console.error('Error al eliminar imágenes antiguas:', e);
            }
          }

          const nombreBase = `flyer-${Date.now()}`;
          const carpetaDestino = path.join(
            configuracionServidor.almacenamiento.rutaSubida,
            'flyers'
          );

          await ImagenServicio.generarVersiones(
            req.file.path,
            nombreBase,
            carpetaDestino,
            'flyer'
          );

          const urlsPublicas = ImagenServicio.obtenerUrlsPublicas(nombreBase, carpetaDestino);

          datosActualizacion.imagenUrl = JSON.stringify(urlsPublicas);
          datosActualizacion.imagenThumbnail = urlsPublicas.thumbnail;
        } catch (error) {
          console.error('Error al procesar nueva imagen:', error);
          
        }
      }

      await flyer.update(datosActualizacion);

      await flyer.reload({
        include: [
          {
            model: Evento,
            as: 'eventoRelacionado',
          },
        ],
      });

      return RespuestaUtil.exito(res, 'Flyer actualizado exitosamente', flyer);
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      if (error instanceof ErrorAutorizacion) {
        return RespuestaUtil.prohibido(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al actualizar flyer', error);
    }
  }

  static async eliminar(req: Request, res: Response) {
    try {
      if (!req.usuario || req.usuario.rol !== RolUsuario.ADMIN) {
        throw new ErrorAutorizacion('No tienes permisos para eliminar flyers');
      }

      const { id } = req.params;

      const flyer = await Flyer.findByPk(parseInt(id));

      if (!flyer) {
        throw new ErrorNoEncontrado('Flyer no encontrado');
      }

      await flyer.destroy();

      return RespuestaUtil.exito(res, 'Flyer eliminado exitosamente');
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      if (error instanceof ErrorAutorizacion) {
        return RespuestaUtil.prohibido(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al eliminar flyer', error);
    }
  }

  static async obtenerDestacados(req: Request, res: Response) {
    try {
      const { limite = '6' } = req.query;

      const flyers = await Flyer.findAll({
        where: {
          visible: true,
          destacado: true,
        },
        include: [
          {
            model: Evento,
            as: 'eventoRelacionado',
            attributes: ['id', 'titulo', 'slug'],
          },
        ],
        limit: parseInt(limite as string),
        order: [['orden', 'ASC'], ['createdAt', 'DESC']],
      });

      return RespuestaUtil.exito(res, 'Flyers destacados obtenidos exitosamente', flyers);
    } catch (error: any) {
      return RespuestaUtil.errorServidor(res, 'Error al obtener flyers destacados', error);
    }
  }

  static async obtenerGaleria(_req: Request, res: Response) {
    try {
      const flyers = await Flyer.findAll({
        where: { visible: true },
        order: [['orden', 'ASC'], ['createdAt', 'DESC']],
        attributes: ['id', 'titulo', 'imagenUrl', 'imagenThumbnail', 'etiquetas', 'vistas'],
      });

      return RespuestaUtil.exito(res, 'Galería de flyers obtenida exitosamente', flyers);
    } catch (error: any) {
      return RespuestaUtil.errorServidor(res, 'Error al obtener galería', error);
    }
  }
}
