import { Request, Response, NextFunction } from 'express';
/**
 * Middleware para verificar autenticación JWT
 */
export declare const verificarAutenticacion: (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware opcional: permite acceso con o sin autenticación
 * Si hay token, lo valida y agrega usuario al request
 */
export declare const autenticacionOpcional: (req: Request, _res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=autenticacion.middleware.d.ts.map