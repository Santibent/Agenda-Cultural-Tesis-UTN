
export interface ApiResponse<T = any> {
  exito: boolean;
  mensaje?: string;
  datos?: T;
  errores?: string[];
  meta?: {
    totalRegistros: number;
    paginaActual: number;
    totalPaginas: number;
    registrosPorPagina: number;
  };
}
