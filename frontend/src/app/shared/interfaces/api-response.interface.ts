export interface ApiResponse<T = any> {
  exito: boolean;
  mensaje: string;
  datos?: T;
  meta?: PaginacionMeta;
  errores?: ErrorValidacion[];
  codigo?: string;
}

export interface PaginacionMeta {
  paginaActual: number;
  limitePorPagina: number;
  totalRegistros: number;
  totalPaginas: number;
  tienePaginaAnterior: boolean;
  tienePaginaSiguiente: boolean;
}

export interface ErrorValidacion {
  campo: string;
  mensaje: string;
  valor?: any;
}

export interface TokensResponse {
  acceso: string;
  refresco: string;
}

export interface LoginResponse {
  usuario: any;
  tokens: TokensResponse;
  emailVerificado: boolean;
}