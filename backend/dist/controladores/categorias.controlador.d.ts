import { Request, Response } from 'express';
/**
 * Controlador de Categorías
 */
export declare class CategoriasControlador {
    /**
     * Listar todas las categorías
     * GET /api/v1/categorias
     */
    static listar(req: Request, res: Response): Promise<Response>;
    /**
     * Obtener categoría por ID o slug
     * GET /api/v1/categorias/:idOSlug
     */
    static obtenerPorId(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Crear nueva categoría (admin)
     * POST /api/v1/categorias
     */
    static crear(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Actualizar categoría (admin)
     * PUT /api/v1/categorias/:id
     */
    static actualizar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Eliminar categoría (admin)
     * DELETE /api/v1/categorias/:id
     */
    static eliminar(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    /**
     * Obtener categorías con contador de eventos
     * GET /api/v1/categorias/con-eventos
     */
    static listarConEventos(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
}
//# sourceMappingURL=categorias.controlador.d.ts.map