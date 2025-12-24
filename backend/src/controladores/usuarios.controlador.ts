import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { RespuestaUtil } from '../utilidades/respuesta.util';
import { PaginacionUtil, OpcionePaginacion } from '../utilidades/paginacion.util';
import { ErrorNoEncontrado, ErrorValidacion } from '../utilidades/errores.util';
import Usuario from '../modelos/usuario.modelo';
import { RolUsuario } from '../tipos/enums';
import { Op } from 'sequelize';

export class UsuariosControlador {
  
  static async listar(req: Request, res: Response) {
    try {
      const {
        pagina,
        limite,
        busqueda,
        rol,
        activo,
        emailVerificado,
        ordenarPor = 'createdAt',
        orden = 'DESC',
      } = req.query;

      const opciones: OpcionePaginacion = {
        pagina: pagina ? parseInt(pagina as string) : 1,
        limite: limite ? parseInt(limite as string) : 20,
        ordenarPor: ordenarPor as string,
        orden: orden as 'ASC' | 'DESC',
      };

      const erroresValidacion = PaginacionUtil.validarOpciones(opciones);
      if (erroresValidacion.length > 0) {
        return RespuestaUtil.errorValidacion(
          res,
          erroresValidacion.map((e) => ({ mensaje: e }))
        );
      }

      const where: any = {};

      if (busqueda) {
        where[Op.or] = [
          { nombre: { [Op.like]: `%${busqueda}%` } },
          { email: { [Op.like]: `%${busqueda}%` } },
        ];
      }

      if (rol) {
        where.rol = rol;
      }

      if (activo !== undefined) {
        where.activo = activo === 'true';
      }

      if (emailVerificado !== undefined) {
        where.emailVerificado = emailVerificado === 'true';
      }

      const { offset, limit } = PaginacionUtil.obtenerOffsetLimit(opciones);

      const { count, rows } = await Usuario.findAndCountAll({
        where,
        offset,
        limit,
        order: [[opciones.ordenarPor!, opciones.orden!]],
        attributes: { exclude: ['password', 'tokenVerificacion', 'tokenRecuperacion', 'tokenExpiracion'] },
      });

      const resultado = PaginacionUtil.formatearResultado(rows, count, opciones);

      return RespuestaUtil.exito(
        res,
        'Usuarios obtenidos exitosamente',
        resultado.datos,
        200,
        resultado.paginacion
      );
    } catch (error: any) {
      return RespuestaUtil.errorServidor(res, 'Error al obtener usuarios', error);
    }
  }

  static async obtenerPorId(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(parseInt(id), {
        attributes: { exclude: ['password', 'tokenVerificacion', 'tokenRecuperacion', 'tokenExpiracion'] },
      });

      if (!usuario) {
        throw new ErrorNoEncontrado('Usuario no encontrado');
      }

      if (req.usuario?.rol !== RolUsuario.ADMIN && req.usuario?.id !== usuario.id) {
        return RespuestaUtil.prohibido(res, 'No tienes permisos para ver este usuario');
      }

      return RespuestaUtil.exito(res, 'Usuario obtenido exitosamente', usuario);
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al obtener usuario', error);
    }
  }

  static async actualizar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const datosActualizacion = req.body;

      const usuario = await Usuario.findByPk(parseInt(id));

      if (!usuario) {
        throw new ErrorNoEncontrado('Usuario no encontrado');
      }

      if (req.usuario?.rol !== RolUsuario.ADMIN && req.usuario?.id !== usuario.id) {
        return RespuestaUtil.prohibido(res, 'No tienes permisos para actualizar este usuario');
      }

      if (datosActualizacion.email && datosActualizacion.email !== usuario.email) {
        const emailExiste = await Usuario.findOne({
          where: { email: datosActualizacion.email, id: { [Op.ne]: usuario.id } },
        });

        if (emailExiste) {
          throw new ErrorValidacion('El email ya está en uso');
        }
      }

      if (req.usuario?.rol !== RolUsuario.ADMIN) {
        delete datosActualizacion.rol;
        delete datosActualizacion.activo;
        delete datosActualizacion.emailVerificado;
      }

      if (datosActualizacion.password) {
        if (datosActualizacion.password.length < 8) {
          throw new ErrorValidacion('La contraseña debe tener al menos 8 caracteres');
        }
        datosActualizacion.password = await bcrypt.hash(datosActualizacion.password, 10);
      }

      await usuario.update(datosActualizacion);

      await usuario.reload({
        attributes: { exclude: ['password', 'tokenVerificacion', 'tokenRecuperacion', 'tokenExpiracion'] },
      });

      return RespuestaUtil.exito(res, 'Usuario actualizado exitosamente', usuario);
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      if (error instanceof ErrorValidacion) {
        return RespuestaUtil.errorValidacion(res, [{ mensaje: error.message }]);
      }
      return RespuestaUtil.errorServidor(res, 'Error al actualizar usuario', error);
    }
  }

  static async eliminar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(parseInt(id));

      if (!usuario) {
        throw new ErrorNoEncontrado('Usuario no encontrado');
      }

      if (req.usuario?.id === usuario.id) {
        return RespuestaUtil.errorValidacion(res, [{ mensaje: 'No puedes eliminarte a ti mismo' }]);
      }

      await usuario.update({ activo: false });

      return RespuestaUtil.exito(res, 'Usuario desactivado exitosamente', null);
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al eliminar usuario', error);
    }
  }

  static async reactivar(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const usuario = await Usuario.findByPk(parseInt(id));

      if (!usuario) {
        throw new ErrorNoEncontrado('Usuario no encontrado');
      }

      await usuario.update({ activo: true });

      return RespuestaUtil.exito(res, 'Usuario reactivado exitosamente', usuario.toJSON());
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al reactivar usuario', error);
    }
  }

  static async cambiarRol(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { rol } = req.body;

      if (!rol || !Object.values(RolUsuario).includes(rol)) {
        return RespuestaUtil.errorValidacion(res, [{ mensaje: 'Rol inválido' }]);
      }

      const usuario = await Usuario.findByPk(parseInt(id));

      if (!usuario) {
        throw new ErrorNoEncontrado('Usuario no encontrado');
      }

      if (req.usuario?.id === usuario.id) {
        return RespuestaUtil.errorValidacion(res, [{ mensaje: 'No puedes cambiar tu propio rol' }]);
      }

      await usuario.update({ rol });

      return RespuestaUtil.exito(res, 'Rol actualizado exitosamente', usuario.toJSON());
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al cambiar rol', error);
    }
  }

  static async obtenerEstadisticas(_req: Request, res: Response) {
    try {
      const total = await Usuario.count();
      const activos = await Usuario.count({ where: { activo: true } });
      const inactivos = await Usuario.count({ where: { activo: false } });
      const verificados = await Usuario.count({ where: { emailVerificado: true } });
      const admins = await Usuario.count({ where: { rol: RolUsuario.ADMIN } });
      const usuarios = await Usuario.count({ where: { rol: RolUsuario.USUARIO } });

      const estadisticas = {
        total,
        activos,
        inactivos,
        verificados,
        noVerificados: total - verificados,
        porRol: {
          admins,
          usuarios,
        },
      };

      return RespuestaUtil.exito(res, 'Estadísticas obtenidas exitosamente', estadisticas);
    } catch (error: any) {
      return RespuestaUtil.errorServidor(res, 'Error al obtener estadísticas', error);
    }
  }
}

export default UsuariosControlador;
