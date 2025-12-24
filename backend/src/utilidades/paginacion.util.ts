
export interface OpcionePaginacion {
  pagina?: number;
  limite?: number;
  ordenarPor?: string;
  orden?: 'ASC' | 'DESC';
}

export interface ResultadoPaginacion<T> {
  datos: T[];
  paginacion: {
    paginaActual: number;
    limitePorPagina: number;
    totalRegistros: number;
    totalPaginas: number;
    tienePaginaAnterior: boolean;
    tienePaginaSiguiente: boolean;
  };
}

export class PaginacionUtil {
  
  private static readonly PAGINA_DEFAULT = 1;
  private static readonly LIMITE_DEFAULT = 10;
  private static readonly LIMITE_MAXIMO = 10000;

  static obtenerOffsetLimit(opciones: OpcionePaginacion): { offset: number; limit: number } {
    const pagina = Math.max(opciones.pagina || this.PAGINA_DEFAULT, 1);
    const limite = Math.min(
      Math.max(opciones.limite || this.LIMITE_DEFAULT, 1),
      this.LIMITE_MAXIMO
    );
    const offset = (pagina - 1) * limite;

    return { offset, limit: limite };
  }

  static formatearResultado<T>(
    datos: T[],
    total: number,
    opciones: OpcionePaginacion
  ): ResultadoPaginacion<T> {
    const pagina = opciones.pagina || this.PAGINA_DEFAULT;
    const limite = Math.min(
      opciones.limite || this.LIMITE_DEFAULT,
      this.LIMITE_MAXIMO
    );
    const totalPaginas = Math.ceil(total / limite);

    return {
      datos,
      paginacion: {
        paginaActual: pagina,
        limitePorPagina: limite,
        totalRegistros: total,
        totalPaginas,
        tienePaginaAnterior: pagina > 1,
        tienePaginaSiguiente: pagina < totalPaginas,
      },
    };
  }

  static validarOpciones(opciones: OpcionePaginacion): string[] {
    const errores: string[] = [];

    if (opciones.pagina && opciones.pagina < 1) {
      errores.push('La página debe ser mayor o igual a 1');
    }

    if (opciones.limite && opciones.limite < 1) {
      errores.push('El límite debe ser mayor o igual a 1');
    }

    if (opciones.limite && opciones.limite > this.LIMITE_MAXIMO) {
      errores.push(`El límite no puede ser mayor a ${this.LIMITE_MAXIMO}`);
    }

    if (opciones.orden && !['ASC', 'DESC'].includes(opciones.orden)) {
      errores.push('El orden debe ser ASC o DESC');
    }

    return errores;
  }
}