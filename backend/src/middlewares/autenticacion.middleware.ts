import { Request, Response, NextFunction } from 'express';
import { TokenServicio } from '../servicios/token.servicio';
import { RespuestaUtil } from '../utilidades/respuesta.util';
import { ErrorAutenticacion } from '../utilidades/errores.util';
import Usuario from '../modelos/usuario.modelo';

export const verificarAutenticacion = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    
    const authHeader = req.headers.authorization;
    const token = TokenServicio.extraerTokenDeHeader(authHeader);

    if (!token) {
      throw new ErrorAutenticacion('Token no proporcionado');
    }

    const payload = TokenServicio.verificarToken(token);

    const usuario = await Usuario.findByPk(payload.id);

    if (!usuario || !usuario.activo) {
      throw new ErrorAutenticacion('Usuario no válido o inactivo');
    }

    req.usuario = {
      id: payload.id,
      email: payload.email,
      rol: payload.rol,
      nombre: payload.nombre,
    };

    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      RespuestaUtil.noAutorizado(res, 'Token inválido');
      return;
    }
    
    if (error.name === 'TokenExpiredError') {
      RespuestaUtil.noAutorizado(res, 'Token expirado');
      return;
    }

    if (error instanceof ErrorAutenticacion) {
      RespuestaUtil.noAutorizado(res, error.message);
      return;
    }

    RespuestaUtil.errorServidor(res, 'Error en autenticación', error);
    return;
  }
};

export const autenticacionOpcional = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = TokenServicio.extraerTokenDeHeader(authHeader);

    if (token) {
      const payload = TokenServicio.verificarToken(token);
      const usuario = await Usuario.findByPk(payload.id);

      if (usuario && usuario.activo) {
        req.usuario = {
          id: payload.id,
          email: payload.email,
          rol: payload.rol,
          nombre: payload.nombre,
        };
      }
    }

    next();
  } catch (error) {
    
    next();
  }
};