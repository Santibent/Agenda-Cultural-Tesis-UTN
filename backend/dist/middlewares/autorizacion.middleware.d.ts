import { Request, Response, NextFunction } from 'express';
import { RolUsuario } from '../tipos/enums';
/**
 * Middleware para verificar que el usuario tiene el rol necesario
 */
export declare const verificarRol: (...rolesPermitidos: RolUsuario[]) => (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware específico para verificar rol de administrador
 */
export declare const esAdmin: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware para verificar que el usuario es dueño del recurso o es admin
 */
export declare const esPropietarioOAdmin: (obtenerIdPropietario: (req: Request) => number) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=autorizacion.middleware.d.ts.map