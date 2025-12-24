import { Request, Response, NextFunction } from 'express';
import { RespuestaUtil } from '../utilidades/respuesta.util';
import { RolUsuario } from '../tipos/enums';

export const verificarRol = (...rolesPermitidos: RolUsuario[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    
    if (!req.usuario) {
      RespuestaUtil.noAutorizado(res, 'Usuario no autenticado');
      return;
    }

    if (!rolesPermitidos.includes(req.usuario.rol)) {
      RespuestaUtil.prohibido(
        res,
        'No tienes permisos para acceder a este recurso'
      );
      return;
    }

    next();
  };
};

export const esAdmin = verificarRol(RolUsuario.ADMIN);

export const esPropietarioOAdmin = (obtenerIdPropietario: (req: Request) => number) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.usuario) {
      RespuestaUtil.noAutorizado(res, 'Usuario no autenticado');
      return;
    }

    const idPropietario = obtenerIdPropietario(req);

    if (req.usuario.rol === RolUsuario.ADMIN || req.usuario.id === idPropietario) {
      next();
      return;
    }

    RespuestaUtil.prohibido(
      res,
      'No tienes permisos para acceder a este recurso'
    );
  };
};