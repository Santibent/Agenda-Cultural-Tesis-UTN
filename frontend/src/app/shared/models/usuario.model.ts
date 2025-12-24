export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'usuario';
  emailVerificado: boolean;
  avatarUrl: string | null;
  activo: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsuarioRegistro {
  nombre: string;
  email: string;
  password: string;
  confirmarPassword: string;
}

export interface UsuarioLogin {
  email: string;
  password: string;
}