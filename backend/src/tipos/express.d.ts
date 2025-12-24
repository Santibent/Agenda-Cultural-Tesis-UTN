import { RolUsuario } from './enums';

declare global {
  namespace Express {
    interface Request {
      usuario?: {
        id: number;
        email: string;
        rol: RolUsuario;
        nombre: string;
      };
      archivo?: Express.Multer.File;
    }
  }
}

export {};