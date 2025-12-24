/**
 * Interfaz para opciones de paginación
 */
export interface OpcionePaginacion {
    pagina?: number;
    limite?: number;
    ordenarPor?: string;
    orden?: 'ASC' | 'DESC';
}
/**
 * Interfaz para resultado de paginación
 */
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
/**
 * Clase para manejar paginación
 */
export declare class PaginacionUtil {
    /**
     * Valores por defecto
     */
    private static readonly PAGINA_DEFAULT;
    private static readonly LIMITE_DEFAULT;
    private static readonly LIMITE_MAXIMO;
    /**
     * Obtener offset y limit para consultas
     */
    static obtenerOffsetLimit(opciones: OpcionePaginacion): {
        offset: number;
        limit: number;
    };
    /**
     * Formatear resultado con metadata de paginación
     */
    static formatearResultado<T>(datos: T[], total: number, opciones: OpcionePaginacion): ResultadoPaginacion<T>;
    /**
     * Validar opciones de paginación
     */
    static validarOpciones(opciones: OpcionePaginacion): string[];
}
//# sourceMappingURL=paginacion.util.d.ts.map