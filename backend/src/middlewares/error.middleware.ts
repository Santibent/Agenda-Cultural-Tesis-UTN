import { Request, Response, NextFunction } from 'express';
import { ErrorPersonalizado } from '../utilidades/errores.util';
import { RespuestaUtil } from '../utilidades/respuesta.util';

export const manejarErrores = (
  error: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  
  if (process.env.NODE_ENV === 'development') {
    console.error('❌ Error capturado:', {
      nombre: error.name,
      mensaje: error.message,
      stack: error.stack,
      ruta: req.path,
      metodo: req.method,
    });
  }

  if (error instanceof ErrorPersonalizado) {
    return RespuestaUtil.error(
      res,
      error.message,
      error.codigoEstado,
      error.detalles ? [error.detalles] : undefined,
      error.codigo
    );
  }

  if (error.name === 'SequelizeValidationError') {
    const errores = (error as any).errors.map((err: any) => ({
      campo: err.path,
      mensaje: err.message,
    }));

    return RespuestaUtil.errorValidacion(res, errores);
  }

  if (error.name === 'SequelizeUniqueConstraintError') {
    return RespuestaUtil.conflicto(
      res,
      'Ya existe un registro con esos datos'
    );
  }

  if (error.name === 'SequelizeForeignKeyConstraintError') {
    return RespuestaUtil.error(
      res,
      'Error de integridad: referencia a un registro inexistente',
      400
    );
  }

  return RespuestaUtil.errorServidor(
    res,
    'Error interno del servidor',
    process.env.NODE_ENV === 'development' ? error : undefined
  );
};

export const rutaNoEncontrada = (
  req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  return RespuestaUtil.noEncontrado(
    res,
    `Ruta ${req.method} ${req.path} no encontrada`
  );
};

export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};