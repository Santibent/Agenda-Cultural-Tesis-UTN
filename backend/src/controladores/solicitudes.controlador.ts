import { Request, Response } from 'express';
import { RespuestaUtil } from '../utilidades/respuesta.util';
import { PaginacionUtil, OpcionePaginacion } from '../utilidades/paginacion.util';
import { ErrorNoEncontrado, ErrorAutorizacion } from '../utilidades/errores.util';
import SolicitudFlyer from '../modelos/solicitud-flyer.modelo';
import Usuario from '../modelos/usuario.modelo';
import EmailServicio from '../servicios/email.servicio';
import { RolUsuario, EstadoSolicitudFlyer } from '../tipos/enums';

export class SolicitudesControlador {
  
  static async listar(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        throw new ErrorAutorizacion('Usuario no autenticado');
      }

      const {
        pagina,
        limite,
        estado,
        prioridad,
        ordenarPor = 'createdAt',
        orden = 'DESC',
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

      const where: any = {};

      if (req.usuario.rol !== RolUsuario.ADMIN) {
        where.usuarioId = req.usuario.id;
      }

      if (estado) {
        where.estado = estado;
      }

      if (prioridad) {
        where.prioridad = prioridad;
      }

      const { offset, limit } = PaginacionUtil.obtenerOffsetLimit(opciones);

      const { count, rows } = await SolicitudFlyer.findAndCountAll({
        where,
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email'],
          },
        ],
        offset,
        limit,
        order: [[opciones.ordenarPor!, opciones.orden!]],
      });

      const resultado = PaginacionUtil.formatearResultado(rows, count, opciones);

      return RespuestaUtil.exito(
        res,
        'Solicitudes obtenidas exitosamente',
        resultado.datos,
        200,
        resultado.paginacion
      );
    } catch (error: any) {
      if (error instanceof ErrorAutorizacion) {
        return RespuestaUtil.noAutorizado(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al obtener solicitudes', error);
    }
  }

  static async obtenerPorId(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        throw new ErrorAutorizacion('Usuario no autenticado');
      }

      const { id } = req.params;

      const solicitud = await SolicitudFlyer.findByPk(parseInt(id), {
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email'],
          },
        ],
      });

      if (!solicitud) {
        throw new ErrorNoEncontrado('Solicitud no encontrada');
      }

      if (
        req.usuario.rol !== RolUsuario.ADMIN &&
        solicitud.usuarioId !== req.usuario.id
      ) {
        throw new ErrorAutorizacion('No tienes permisos para ver esta solicitud');
      }

      return RespuestaUtil.exito(res, 'Solicitud obtenida exitosamente', solicitud);
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      if (error instanceof ErrorAutorizacion) {
        return RespuestaUtil.prohibido(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al obtener solicitud', error);
    }
  }

  static async crear(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        throw new ErrorAutorizacion('Usuario no autenticado');
      }

      const datosSolicitud = req.body;

      const nuevaSolicitud = await SolicitudFlyer.create({
        ...datosSolicitud,
        usuarioId: req.usuario.id,
        estado: EstadoSolicitudFlyer.PENDIENTE,
      });

      await nuevaSolicitud.reload({
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email'],
          },
        ],
      });

      try {
        await EmailServicio.enviarNotificacionNuevaSolicitud(
          req.usuario.nombre,
          datosSolicitud.nombreEvento,
          nuevaSolicitud.id
        );
      } catch (error) {
        console.error('Error al enviar notificación al admin:', error);
      }

      return RespuestaUtil.creado(res, 'Solicitud creada exitosamente', nuevaSolicitud);
    } catch (error: any) {
      if (error instanceof ErrorAutorizacion) {
        return RespuestaUtil.noAutorizado(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al crear solicitud', error);
    }
  }

  static async actualizar(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        throw new ErrorAutorizacion('Usuario no autenticado');
      }

      const { id } = req.params;
      const datosActualizacion = req.body;

      const solicitud = await SolicitudFlyer.findByPk(parseInt(id));

      if (!solicitud) {
        throw new ErrorNoEncontrado('Solicitud no encontrada');
      }

      if (solicitud.usuarioId !== req.usuario.id) {
        throw new ErrorAutorizacion('No tienes permisos para actualizar esta solicitud');
      }

      if (
        solicitud.estado !== EstadoSolicitudFlyer.PENDIENTE &&
        solicitud.estado !== EstadoSolicitudFlyer.REVISANDO
      ) {
        throw new ErrorAutorizacion(
          'No puedes actualizar una solicitud en este estado'
        );
      }

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

      const datosPermitidos: any = {};
      camposPermitidos.forEach(campo => {
        if (datosActualizacion[campo] !== undefined) {
          datosPermitidos[campo] = datosActualizacion[campo];
        }
      });

      await solicitud.update(datosPermitidos);

      return RespuestaUtil.exito(res, 'Solicitud actualizada exitosamente', solicitud);
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      if (error instanceof ErrorAutorizacion) {
        return RespuestaUtil.prohibido(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al actualizar solicitud', error);
    }
  }

  static async actualizarEstado(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        throw new ErrorAutorizacion('Usuario no autenticado');
      }

      if (req.usuario.rol !== RolUsuario.ADMIN) {
        throw new ErrorAutorizacion('No tienes permisos para realizar esta acción');
      }

      const { id } = req.params;
      const { estado, prioridad, notasAdmin } = req.body;

      const solicitud = await SolicitudFlyer.findByPk(parseInt(id), {
        include: [
          {
            model: Usuario,
            as: 'usuario',
            attributes: ['id', 'nombre', 'email'],
          },
        ],
      });

      if (!solicitud) {
        throw new ErrorNoEncontrado('Solicitud no encontrada');
      }

      solicitud.estado = estado;
      if (prioridad) solicitud.prioridad = prioridad;
      if (notasAdmin !== undefined) solicitud.notasAdmin = notasAdmin;

      if (estado === EstadoSolicitudFlyer.COMPLETADO) {
        solicitud.fechaCompletado = new Date();
      }

      await solicitud.save();

      try {
        await EmailServicio.enviarNotificacionCambioEstado(
          solicitud.usuario!.email,
          solicitud.usuario!.nombre,
          solicitud.nombreEvento,
          estado,
          solicitud.id
        );
      } catch (error) {
        console.error('Error al enviar notificación al usuario:', error);
      }

      return RespuestaUtil.exito(res, 'Estado actualizado exitosamente', solicitud);
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      if (error instanceof ErrorAutorizacion) {
        return RespuestaUtil.prohibido(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al actualizar estado', error);
    }
  }

  static async cancelar(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        throw new ErrorAutorizacion('Usuario no autenticado');
      }

      const { id } = req.params;

      const solicitud = await SolicitudFlyer.findByPk(parseInt(id));

      if (!solicitud) {
        throw new ErrorNoEncontrado('Solicitud no encontrada');
      }

      if (solicitud.usuarioId !== req.usuario.id) {
        throw new ErrorAutorizacion('No tienes permisos para cancelar esta solicitud');
      }

      if (
        solicitud.estado === EstadoSolicitudFlyer.COMPLETADO ||
        solicitud.estado === EstadoSolicitudFlyer.RECHAZADO
      ) {
        throw new ErrorAutorizacion('No puedes cancelar una solicitud en este estado');
      }

      solicitud.estado = EstadoSolicitudFlyer.CANCELADO;
      await solicitud.save();

      return RespuestaUtil.exito(res, 'Solicitud cancelada exitosamente');
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      if (error instanceof ErrorAutorizacion) {
        return RespuestaUtil.prohibido(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al cancelar solicitud', error);
    }
  }

  static async calificar(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        throw new ErrorAutorizacion('Usuario no autenticado');
      }

      const { id } = req.params;
      const { calificacion, comentarioUsuario } = req.body;

      const solicitud = await SolicitudFlyer.findByPk(parseInt(id));

      if (!solicitud) {
        throw new ErrorNoEncontrado('Solicitud no encontrada');
      }

      if (solicitud.usuarioId !== req.usuario.id) {
        throw new ErrorAutorizacion('No tienes permisos para calificar esta solicitud');
      }

      if (solicitud.estado !== EstadoSolicitudFlyer.COMPLETADO) {
        throw new ErrorAutorizacion('Solo puedes calificar solicitudes completadas');
      }

      if (solicitud.calificacion !== null) {
        throw new ErrorAutorizacion('Esta solicitud ya fue calificada');
      }

      solicitud.calificacion = calificacion;
      solicitud.comentarioUsuario = comentarioUsuario;
      await solicitud.save();

      return RespuestaUtil.exito(res, 'Calificación registrada exitosamente');
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      if (error instanceof ErrorAutorizacion) {
        return RespuestaUtil.prohibido(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al calificar solicitud', error);
    }
  }

  static async eliminar(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        throw new ErrorAutorizacion('Usuario no autenticado');
      }

      const { id } = req.params;

      const solicitud = await SolicitudFlyer.findByPk(parseInt(id));

      if (!solicitud) {
        throw new ErrorNoEncontrado('Solicitud no encontrada');
      }

      if (
        req.usuario.rol !== RolUsuario.ADMIN &&
        solicitud.usuarioId !== req.usuario.id
      ) {
        throw new ErrorAutorizacion('No tienes permisos para eliminar esta solicitud');
      }

      if (
        solicitud.estado === EstadoSolicitudFlyer.EN_PROCESO ||
        solicitud.estado === EstadoSolicitudFlyer.COMPLETADO
      ) {
        throw new ErrorAutorizacion('No puedes eliminar una solicitud en este estado');
      }

      await solicitud.destroy();

      return RespuestaUtil.exito(res, 'Solicitud eliminada exitosamente');
    } catch (error: any) {
      if (error instanceof ErrorNoEncontrado) {
        return RespuestaUtil.noEncontrado(res, error.message);
      }
      if (error instanceof ErrorAutorizacion) {
        return RespuestaUtil.prohibido(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al eliminar solicitud', error);
    }
  }

  static async obtenerEstadisticas(req: Request, res: Response) {
    try {
      if (!req.usuario) {
        throw new ErrorAutorizacion('Usuario no autenticado');
      }

      if (req.usuario.rol !== RolUsuario.ADMIN) {
        throw new ErrorAutorizacion('No tienes permisos para ver estadísticas');
      }

      const estadisticas = {
        total: await SolicitudFlyer.count(),
        pendientes: await SolicitudFlyer.count({
          where: { estado: EstadoSolicitudFlyer.PENDIENTE },
        }),
        revisando: await SolicitudFlyer.count({
          where: { estado: EstadoSolicitudFlyer.REVISANDO },
        }),
        enProceso: await SolicitudFlyer.count({
          where: { estado: EstadoSolicitudFlyer.EN_PROCESO },
        }),
        completadas: await SolicitudFlyer.count({
          where: { estado: EstadoSolicitudFlyer.COMPLETADO },
        }),
        rechazadas: await SolicitudFlyer.count({
          where: { estado: EstadoSolicitudFlyer.RECHAZADO },
        }),
        canceladas: await SolicitudFlyer.count({
          where: { estado: EstadoSolicitudFlyer.CANCELADO },
        }),
      };

      return RespuestaUtil.exito(res, 'Estadísticas obtenidas exitosamente', estadisticas);
    } catch (error: any) {
      if (error instanceof ErrorAutorizacion) {
        return RespuestaUtil.prohibido(res, error.message);
      }
      return RespuestaUtil.errorServidor(res, 'Error al obtener estadísticas', error);
    }
  }
}
