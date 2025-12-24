import { Request, Response } from 'express';
import { RespuestaUtil } from '../utilidades/respuesta.util';
import { ErrorNoEncontrado, ErrorConflicto } from '../utilidades/errores.util';
import Categoria from '../modelos/categoria.modelo';
import Evento from '../modelos/evento.modelo';
import { Op } from 'sequelize';

export class CategoriasControlador {
  
  static async listar(req: Request, res: Response): Promise<Response> {
    try {
      const { activo } = req.query;

      const where: any = {};

      if (activo !== undefined) {
        where.activo = activo === 'true';
      }

      const categorias = await Categoria.findAll({
        where,
        order: [['orden', 'ASC'], ['nombre', 'ASC']],
      });

      return RespuestaUtil.exito(res, 'Categorías obtenidas exitosamente', categorias);
    } catch (error: any) {
      return RespuestaUtil.errorServidor(res, 'Error al obtener categorías', error);
    }
  }

  static async obtenerPorId(req: Request, res: Response) {
    try {
      const { idOSlug } = req.params;

      const where: any = isNaN(Number(idOSlug))
        ? { slug: idOSlug }
        : { id: parseInt(idOSlug) };

      const categoria = await Categoria.findOne({ where });

      if (!categoria) {
        throw new ErrorNoEncontrado('Categoría no encontrada');
      }

      const totalEventos = await Evento.count({
        where: {
          categoriaId: categoria.id,
          activo: true,
        },
      });

      const categoriaConEventos = {
        ...categoria.toJSON(),
        totalEventos,
      };

      return RespuestaUtil.exito(
        res,
        'Categoría obtenida exitosamente',
        categoriaConEventos
      );
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al obtener categoría', error);
    }
  }

  static async crear(req: Request, res: Response) {
    try {
      const datosCategoria = req.body;

      const categoriaExistente = await Categoria.findOne({
        where: { slug: datosCategoria.slug },
      });

      if (categoriaExistente) {
        throw new ErrorConflicto('Ya existe una categoría con ese slug');
      }

      const nuevaCategoria = await Categoria.create(datosCategoria);

      return RespuestaUtil.creado(res, 'Categoría creada exitosamente', nuevaCategoria);
    } catch (error: any) {
      if (error instanceof ErrorConflicto) {
        return RespuestaUtil.conflicto(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al crear categoría', error);
    }
  }

  static async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const datosActualizacion = req.body;

      const categoria = await Categoria.findByPk(parseInt(id));

      if (!categoria) {
        throw new ErrorNoEncontrado('Categoría no encontrada');
      }

      if (datosActualizacion.slug && datosActualizacion.slug !== categoria.slug) {
        const categoriaConSlug = await Categoria.findOne({
          where: {
            slug: datosActualizacion.slug,
            id: { [Op.ne]: categoria.id },
          },
        });

        if (categoriaConSlug) {
          throw new ErrorConflicto('Ya existe una categoría con ese slug');
        }
      }

      await categoria.update(datosActualizacion);

      return RespuestaUtil.exito(res, 'Categoría actualizada exitosamente', categoria);
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      if (error instanceof ErrorConflicto) {
        return RespuestaUtil.conflicto(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al actualizar categoría', error);
    }
  }

  static async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const categoria = await Categoria.findByPk(parseInt(id));

      if (!categoria) {
        throw new ErrorNoEncontrado('Categoría no encontrada');
      }

      const eventosAsociados = await Evento.count({
        where: { categoriaId: categoria.id },
      });

      if (eventosAsociados > 0) {
        throw new ErrorConflicto(
          `No se puede eliminar la categoría porque tiene ${eventosAsociados} evento(s) asociado(s)`
        );
      }

      await categoria.destroy();

      return RespuestaUtil.exito(res, 'Categoría eliminada exitosamente');
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      if (error instanceof ErrorConflicto) {
        return RespuestaUtil.conflicto(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al eliminar categoría', error);
    }
  }

  static async listarConEventos(_req: Request, res: Response) {
    try {
      const categorias = await Categoria.findAll({
        where: { activo: true },
        order: [['orden', 'ASC'], ['nombre', 'ASC']],
        attributes: {
          include: [
            [
              
              Categoria.sequelize!.literal(`(
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

      return RespuestaUtil.exito(
        res,
        'Categorías con eventos obtenidas exitosamente',
        categorias
      );
    } catch (error: any) {
      return RespuestaUtil.errorServidor(
        res,
        'Error al obtener categorías con eventos',
        error
      );
    }
  }
}
