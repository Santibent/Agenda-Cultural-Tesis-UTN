/**
 * Middleware para subir una sola imagen
 */
export declare const subirImagen: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * Middleware para subir múltiples imágenes
 */
export declare const subirVariasImagenes: (maxImagenes?: number) => import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * Middleware para subir múltiples campos de archivos
 */
export declare const subirCamposMultiples: import("express").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>;
/**
 * Función para eliminar archivo
 */
export declare const eliminarArchivo: (rutaArchivo: string) => void;
/**
 * Función para obtener URL pública del archivo
 */
export declare const obtenerUrlPublica: (rutaArchivo: string) => string;
//# sourceMappingURL=subir-archivos.middleware.d.ts.map