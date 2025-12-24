import { Request, Response, NextFunction } from 'express';
/**
 * Middleware global para manejo de errores
 */
export declare const manejarErrores: (error: Error, req: Request, res: Response, _next: NextFunction) => Response;
/**
 * Middleware para rutas no encontradas (404)
 */
export declare const rutaNoEncontrada: (req: Request, res: Response, _next: NextFunction) => Response;
/**
 * Wrapper para async/await en controladores
 * Captura errores y los pasa al middleware de manejo de errores
 */
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=error.middleware.d.ts.map