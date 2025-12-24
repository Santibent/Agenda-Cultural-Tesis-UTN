import rateLimit from 'express-rate-limit';
import { configuracionServidor } from '../config/servidor.config';
import { RespuestaUtil } from '../utilidades/respuesta.util';
import { Request, Response } from 'express';

const configuracionBase = {
  windowMs: configuracionServidor.rateLimiting.ventanaTiempo * 60 * 1000, 
  standardHeaders: true, 
  legacyHeaders: false, 
  handler: (_req: Request, res: Response) => {
    return RespuestaUtil.error(
      res,
      'Demasiadas peticiones desde esta IP, por favor intenta más tarde',
      429,
      undefined,
      'TOO_MANY_REQUESTS'
    );
  },
};

export const limitadorGeneral = rateLimit({
  ...configuracionBase,
  max: configuracionServidor.esDesarrollo() ? 10000 : configuracionServidor.rateLimiting.maxPeticiones,
  message: 'Demasiadas peticiones, intenta nuevamente en 15 minutos',
});

export const limitadorAutenticacion = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: configuracionServidor.esDesarrollo() ? 1000 : 5, 
  skipSuccessfulRequests: true, 
  message: 'Demasiados intentos de inicio de sesión, intenta nuevamente en 15 minutos',
  handler: (_req: Request, res: Response) => {
    return RespuestaUtil.error(
      res,
      'Demasiados intentos fallidos. Por seguridad, tu IP ha sido bloqueada temporalmente',
      429,
      undefined,
      'TOO_MANY_LOGIN_ATTEMPTS'
    );
  },
});

export const limitadorCreacion = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: configuracionServidor.esDesarrollo() ? 1000 : 20, 
  message: 'Límite de creación alcanzado, intenta nuevamente en una hora',
});

export const limitadorRegistro = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: configuracionServidor.esDesarrollo() ? 1000 : 5, 
  message: 'Demasiados registros desde esta IP, intenta nuevamente en una hora',
  handler: (_req: Request, res: Response) => {
    return RespuestaUtil.error(
      res,
      'Has alcanzado el límite de registros por hora',
      429,
      undefined,
      'TOO_MANY_REGISTRATIONS'
    );
  },
});

export const limitadorRecuperacion = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: configuracionServidor.esDesarrollo() ? 1000 : 3, 
  message: 'Demasiadas solicitudes de recuperación, intenta nuevamente en una hora',
});

export const limitadorEmails = rateLimit({
  windowMs: 60 * 60 * 1000, 
  max: configuracionServidor.esDesarrollo() ? 1000 : 5, 
  message: 'Límite de envío de emails alcanzado, intenta nuevamente en una hora',
});