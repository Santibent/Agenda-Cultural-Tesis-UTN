import Evento from '../modelos/evento.modelo';
export interface FiltrosEventos {
    pagina?: number;
    limite?: number;
    categoriaId?: number;
    destacado?: boolean;
    ciudad?: string;
    fechaDesde?: Date;
    fechaHasta?: Date;
    busqueda?: string;
    ordenarPor?: string;
    orden?: 'ASC' | 'DESC';
}
export interface PaginacionRespuesta<T> {
    datos: T[];
    meta: {
        paginaActual: number;
        limitePorPagina: number;
        totalRegistros: number;
        totalPaginas: number;
        tienePaginaAnterior: boolean;
        tienePaginaSiguiente: boolean;
    };
}
declare class EventosServicio {
    /**
     * Listar eventos con filtros y paginación
     */
    listar(filtros: FiltrosEventos): Promise<PaginacionRespuesta<Evento>>;
    /**
     * Obtener evento por ID o slug
     */
    obtenerPorIdOSlug(idOSlug: string | number): Promise<Evento | null>;
    /**
     * Obtener eventos destacados
     */
    obtenerDestacados(limite?: number): Promise<Evento[]>;
    /**
     * Obtener próximos eventos
     */
    obtenerProximos(limite?: number): Promise<Evento[]>;
    /**
     * Crear nuevo evento
     */
    crear(datosEvento: any): Promise<Evento>;
    /**
     * Actualizar evento
     */
    actualizar(id: number, datosEvento: any): Promise<Evento | null>;
    /**
     * Eliminar evento (soft delete)
     */
    eliminar(id: number): Promise<boolean>;
    /**
     * Incrementar vistas
     */
    incrementarVistas(id: number): Promise<void>;
}
declare const _default: EventosServicio;
export default _default;
//# sourceMappingURL=eventos.servicio.d.ts.map