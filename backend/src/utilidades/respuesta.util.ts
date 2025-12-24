import { Response } from 'express';

interface RespuestaExitosa<T = any> {
  exito: true;
  mensaje: string;
  datos?: T;
  meta?: any;
}

interface RespuestaError {
  exito: false;
  mensaje: string;
  errores?: any[];
  datos?: any;
  codigo?: string;
}

export class RespuestaUtil {
  
  static exito<T = any>(
    res: Response,
    mensaje: string,
    datos?: T,
    codigoEstado: number = 200,
    meta?: any
  ): Response {
    const respuesta: RespuestaExitosa<T> = {
      exito: true,
      mensaje,
      datos,
      meta,
    };

    return res.status(codigoEstado).json(respuesta);
  }

  static error(
    res: Response,
    mensaje: string,
    codigoEstado: number = 400,
    errores?: any[],
    datos?: any,
    codigo?: string
  ): Response {
    const respuesta: RespuestaError = {
      exito: false,
      mensaje,
      errores,
      datos,
      codigo,
    };

    return res.status(codigoEstado).json(respuesta);
  }

  static creado<T = any>(
    res: Response,
    mensaje: string,
    datos?: T
  ): Response {
    return this.exito(res, mensaje, datos, 201);
  }

  static sinContenido(res: Response): Response {
    return res.status(204).send();
  }

  static errorValidacion(
    res: Response,
    errores: any[]
  ): Response {
    return this.error(
      res,
      'Error de validación',
      422,
      errores,
      'VALIDATION_ERROR'
    );
  }

  static noAutorizado(
    res: Response,
    mensaje: string = 'No autorizado'
  ): Response {
    return this.error(res, mensaje, 401, undefined, 'UNAUTHORIZED');
  }

  static prohibido(
    res: Response,
    mensaje: string = 'Acceso prohibido'
  ): Response {
    return this.error(res, mensaje, 403, undefined, 'FORBIDDEN');
  }

  static noEncontrado(
    res: Response,
    mensaje: string = 'Recurso no encontrado'
  ): Response {
    return this.error(res, mensaje, 404, undefined, 'NOT_FOUND');
  }

  static conflicto(
    res: Response,
    mensaje: string = 'Conflicto con el estado actual'
  ): Response {
    return this.error(res, mensaje, 409, undefined, 'CONFLICT');
  }

  static errorServidor(
    res: Response,
    mensaje: string = 'Error interno del servidor',
    error?: any
  ): Response {
    console.error('Error del servidor:', error);
    
    return this.error(
      res,
      mensaje,
      500,
      process.env.NODE_ENV === 'development' ? [error] : undefined,
      'INTERNAL_SERVER_ERROR'
    );
  }
}