import sharp from 'sharp';
/**
 * Configuración de tamaños de imagen
 */
export declare const TAMANIOS_IMAGEN: {
    evento: {
        grande: {
            width: number;
            height: number;
        };
        mediano: {
            width: number;
            height: number;
        };
        pequeño: {
            width: number;
            height: number;
        };
        thumbnail: {
            width: number;
            height: number;
        };
    };
    flyer: {
        grande: {
            width: number;
            height: number;
        };
        mediano: {
            width: number;
            height: number;
        };
        thumbnail: {
            width: number;
            height: number;
        };
    };
    avatar: {
        grande: {
            width: number;
            height: number;
        };
        pequeño: {
            width: number;
            height: number;
        };
    };
};
/**
 * Opciones de procesamiento de imagen
 */
interface OpcionesProcesamiento {
    ancho?: number;
    alto?: number;
    calidad?: number;
    formato?: 'jpeg' | 'png' | 'webp';
    mantenerAspecto?: boolean;
}
/**
 * Servicio para procesamiento de imágenes
 */
export declare class ImagenServicio {
    /**
     * Procesar y redimensionar imagen
     */
    static procesarImagen(rutaOriginal: string, rutaDestino: string, opciones?: OpcionesProcesamiento): Promise<void>;
    /**
     * Generar múltiples versiones de una imagen
     */
    static generarVersiones(rutaOriginal: string, nombreBase: string, carpetaDestino: string, tipo?: 'evento' | 'flyer' | 'avatar'): Promise<{
        original: string;
        grande: string;
        mediano: string;
        pequeño?: string;
        thumbnail: string;
    }>;
    /**
     * Eliminar todas las versiones de una imagen
     */
    static eliminarVersiones(nombreBase: string, carpeta: string): void;
    /**
     * Obtener URLs públicas de las versiones de imagen
     */
    static obtenerUrlsPublicas(nombreBase: string, carpeta: string): {
        original: string;
        grande: string;
        mediano: string;
        pequeño?: string;
        thumbnail: string;
    };
    /**
     * Validar que el archivo es una imagen válida
     */
    static validarImagen(rutaArchivo: string): Promise<boolean>;
    /**
     * Obtener información de la imagen
     */
    static obtenerMetadata(rutaArchivo: string): Promise<sharp.Metadata>;
}
export default ImagenServicio;
//# sourceMappingURL=imagen.servicio.d.ts.map