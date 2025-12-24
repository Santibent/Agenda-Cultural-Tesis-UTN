import { Request, Response } from 'express';
/**
 * Controlador de Eventos
 */
export declare class EventosControlador {
    /**
     * Generar slug único para evento
     */
    private static generarSlug;
    /**
     * Listar eventos con filtros y paginación
     * GET /api/v1/eventos
     */
    static listar(req: Request, res: Response): Promise<Response>;
    /**
     * Obtener evento por ID o slug
     * GET /api/v1/eventos/:idOSlug
     */
    static obtenerPorId(req: Request, res: Response): Promise<Response>;
    /**
     * Crear nuevo evento
     * POST /api/v1/eventos
     */
    static crear(req: Request, res: Response): Promise<Response>;
    /**
     * Actualizar evento
     * PUT /api/v1/eventos/:id
     */
    static actualizar(req: Request, res: Response): Promise<Response>;
    /**
     * Eliminar evento (soft delete)
     * DELETE /api/v1/eventos/:id
     */
    static eliminar(req: Request, res: Response): Promise<Response>;
    /**
     * Obtener eventos destacados
     * GET /api/v1/eventos/destacados
     */
    static obtenerDestacados(req: Request, res: Response): Promise<Response>;
    /**
     * Obtener próximos eventos
     * GET /api/v1/eventos/proximos
     */
    static obtenerProximos(req: Request, res: Response): Promise<Response>;
}
//# sourceMappingURL=eventos.controlador.d.ts.map