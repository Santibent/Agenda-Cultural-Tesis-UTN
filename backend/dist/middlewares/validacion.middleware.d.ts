import { Request, Response, NextFunction } from 'express';
import { ValidationChain } from 'express-validator';
/**
 * Middleware para manejar errores de validación de express-validator
 */
export declare const manejarErroresValidacion: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Función helper para ejecutar validaciones
 */
export declare const validar: (validaciones: ValidationChain[]) => (req: Request, res: Response, next: NextFunction) => Promise<void>;
/**
 * Middleware para validar ID en parámetros
 */
export declare const validarIdParametro: (nombreParametro?: string) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware para sanitizar entrada de búsqueda
 */
export declare const sanitizarBusqueda: (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validacion.middleware.d.ts.map