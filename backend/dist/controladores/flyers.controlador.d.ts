import { Request, Response } from 'express';
/**
 * Controlador de Flyers
 */
export declare class FlyersControlador {
    /**
     * Listar flyers con filtros y paginación
     * GET /api/v1/flyers
     */
    static listar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Obtener flyer por ID
     * GET /api/v1/flyers/:id
     */
    static obtenerPorId(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Crear nuevo flyer (admin)
     * POST /api/v1/flyers
     */
    static crear(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Actualizar flyer (admin)
     * PUT /api/v1/flyers/:id
     */
    static actualizar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Eliminar flyer (admin)
     * DELETE /api/v1/flyers/:id
     */
    static eliminar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Obtener flyers destacados
     * GET /api/v1/flyers/destacados
     */
    static obtenerDestacados(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Obtener galería completa de flyers (público)
     * GET /api/v1/flyers/galeria
     */
    static obtenerGaleria(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=flyers.controlador.d.ts.map