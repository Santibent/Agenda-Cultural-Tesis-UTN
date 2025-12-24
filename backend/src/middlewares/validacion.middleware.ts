import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { RespuestaUtil } from '../utilidades/respuesta.util';

export const manejarErroresValidacion = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errores = validationResult(req);

  if (!errores.isEmpty()) {
    const erroresFormateados = errores.array().map((error: any) => ({
      campo: error.path || error.param,
      mensaje: error.msg,
      valor: error.value,
    }));

    RespuestaUtil.errorValidacion(res, erroresFormateados);
    return;
  }

  next();
};

export const validar = (validaciones: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    
    for (const validacion of validaciones) {
      await validacion.run(req);
    }

    manejarErroresValidacion(req, res, next);
  };
};

export const validarIdParametro = (nombreParametro: string = 'id') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const id = parseInt(req.params[nombreParametro]);

    if (isNaN(id) || id <= 0) {
      RespuestaUtil.error(
        res,
        `El parámetro ${nombreParametro} debe ser un número válido mayor a 0`,
        400
      );
      return;
    }

    next();
  };
};

export const sanitizarBusqueda = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  if (req.query.busqueda) {
    
    req.query.busqueda = String(req.query.busqueda)
      .trim()
      .replace(/[<>]/g, '');
  }

  next();
};

export const validarActualizacionUsuario = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { nombre, email, password } = req.body;

  if (!nombre && !email && !password && !req.body.rol && req.body.activo === undefined) {
    RespuestaUtil.errorValidacion(res, [
      { mensaje: 'Debe proporcionar al menos un campo para actualizar' },
    ]);
    return;
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      RespuestaUtil.errorValidacion(res, [{ campo: 'email', mensaje: 'Email inválido' }]);
      return;
    }
  }

  if (nombre !== undefined && (typeof nombre !== 'string' || nombre.trim().length < 3)) {
    RespuestaUtil.errorValidacion(res, [
      { campo: 'nombre', mensaje: 'El nombre debe tener al menos 3 caracteres' },
    ]);
    return;
  }

  if (password !== undefined && (typeof password !== 'string' || password.length < 8)) {
    RespuestaUtil.errorValidacion(res, [
      { campo: 'password', mensaje: 'La contraseña debe tener al menos 8 caracteres' },
    ]);
    return;
  }

  next();
};