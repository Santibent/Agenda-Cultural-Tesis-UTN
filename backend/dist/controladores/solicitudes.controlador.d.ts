import { Request, Response } from 'express';
/**
 * Controlador de Solicitudes de Flyer
 */
export declare class SolicitudesControlador {
    /**
     * Listar solicitudes con filtros y paginación
     * GET /api/v1/solicitudes
     */
    static listar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Obtener solicitud por ID
     * GET /api/v1/solicitudes/:id
     */
    static obtenerPorId(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Crear nueva solicitud
     * POST /api/v1/solicitudes
     */
    static crear(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Actualizar solicitud (usuario)
     * PUT /api/v1/solicitudes/:id
     */
    static actualizar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Actualizar estado de solicitud (admin)
     * PATCH /api/v1/solicitudes/:id/estado
     */
    static actualizarEstado(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Cancelar solicitud (usuario)
     * PATCH /api/v1/solicitudes/:id/cancelar
     */
    static cancelar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Calificar solicitud (usuario)
     * POST /api/v1/solicitudes/:id/calificar
     */
    static calificar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Eliminar solicitud
     * DELETE /api/v1/solicitudes/:id
     */
    static eliminar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Obtener estadísticas de solicitudes (admin)
     * GET /api/v1/solicitudes/estadisticas
     */
    static obtenerEstadisticas(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=solicitudes.controlador.d.ts.map