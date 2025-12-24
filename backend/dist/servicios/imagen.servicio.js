"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImagenServicio = exports.TAMANIOS_IMAGEN = void 0;
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const servidor_config_1 = require("../config/servidor.config");
/**
 * Configuración de tamaños de imagen
 */
exports.TAMANIOS_IMAGEN = {
    evento: {
        grande: { width: 1200, height: 800 },
        mediano: { width: 800, height: 600 },
        pequeño: { width: 400, height: 300 },
        thumbnail: { width: 200, height: 150 },
    },
    flyer: {
        grande: { width: 1080, height: 1350 },
        mediano: { width: 600, height: 750 },
        thumbnail: { width: 300, height: 375 },
    },
    avatar: {
        grande: { width: 400, height: 400 },
        pequeño: { width: 150, height: 150 },
    },
};
/**
 * Servicio para procesamiento de imágenes
 */
class ImagenServicio {
    /**
     * Procesar y redimensionar imagen
     */
    static async procesarImagen(rutaOriginal, rutaDestino, opciones = {}) {
        const { ancho, alto, calidad = 85, formato = 'webp', mantenerAspecto = true, } = opciones;
        try {
            let procesador = (0, sharp_1.default)(rutaOriginal);
            // Redimensionar si se especifican dimensiones
            if (ancho || alto) {
                procesador = procesador.resize(ancho, alto, {
                    fit: mantenerAspecto ? 'inside' : 'cover',
                    withoutEnlargement: true,
                });
            }
            // Aplicar formato y calidad
            switch (formato) {
                case 'jpeg':
                    procesador = procesador.jpeg({ quality: calidad, progressive: true });
                    break;
                case 'png':
                    procesador = procesador.png({ quality: calidad, compressionLevel: 9 });
                    break;
                case 'webp':
                    procesador = procesador.webp({ quality: calidad });
                    break;
            }
            // Guardar imagen procesada
            await procesador.toFile(rutaDestino);
            console.log(`✅ Imagen procesada: ${rutaDestino}`);
        }
        catch (error) {
            console.error('❌ Error al procesar imagen:', error);
            throw new Error('Error al procesar imagen');
        }
    }
    /**
     * Generar múltiples versiones de una imagen
     */
    static async generarVersiones(rutaOriginal, nombreBase, carpetaDestino, tipo = 'evento') {
        try {
            // Asegurar que existe el directorio
            if (!fs_1.default.existsSync(carpetaDestino)) {
                fs_1.default.mkdirSync(carpetaDestino, { recursive: true });
            }
            const tamaños = exports.TAMANIOS_IMAGEN[tipo];
            const extension = '.webp';
            // Generar rutas
            const rutas = {
                original: path_1.default.join(carpetaDestino, `${nombreBase}-original${extension}`),
                grande: path_1.default.join(carpetaDestino, `${nombreBase}-grande${extension}`),
                mediano: path_1.default.join(carpetaDestino, `${nombreBase}-mediano${extension}`),
                thumbnail: path_1.default.join(carpetaDestino, `${nombreBase}-thumbnail${extension}`),
                ...(tipo === 'evento' && {
                    pequeño: path_1.default.join(carpetaDestino, `${nombreBase}-pequeno${extension}`),
                }),
            };
            // Procesar imagen original (optimizada)
            await this.procesarImagen(rutaOriginal, rutas.original, {
                formato: 'webp',
                calidad: 90,
            });
            // Procesar versión grande
            await this.procesarImagen(rutaOriginal, rutas.grande, {
                ancho: tamaños.grande.width,
                alto: tamaños.grande.height,
                formato: 'webp',
                calidad: 85,
            });
            // Procesar versión mediana
            if ('mediano' in tamaños) {
                await this.procesarImagen(rutaOriginal, rutas.mediano, {
                    ancho: tamaños.mediano.width,
                    alto: tamaños.mediano.height,
                    formato: 'webp',
                    calidad: 80,
                });
            }
            // Procesar versión pequeña (solo para eventos)
            if (tipo === 'evento' && 'pequeño' in tamaños) {
                await this.procesarImagen(rutaOriginal, rutas.pequeño, {
                    ancho: tamaños.pequeño.width,
                    alto: tamaños.pequeño.height,
                    formato: 'webp',
                    calidad: 75,
                });
            }
            // Procesar thumbnail
            if ('thumbnail' in tamaños) {
                await this.procesarImagen(rutaOriginal, rutas.thumbnail, {
                    ancho: tamaños.thumbnail.width,
                    alto: tamaños.thumbnail.height,
                    formato: 'webp',
                    calidad: 70,
                });
            }
            // Eliminar archivo original temporal
            if (fs_1.default.existsSync(rutaOriginal)) {
                fs_1.default.unlinkSync(rutaOriginal);
            }
            return rutas;
        }
        catch (error) {
            console.error('❌ Error al generar versiones de imagen:', error);
            throw error;
        }
    }
    /**
     * Eliminar todas las versiones de una imagen
     */
    static eliminarVersiones(nombreBase, carpeta) {
        const sufijos = ['original', 'grande', 'mediano', 'pequeno', 'thumbnail'];
        sufijos.forEach((sufijo) => {
            const ruta = path_1.default.join(carpeta, `${nombreBase}-${sufijo}.webp`);
            if (fs_1.default.existsSync(ruta)) {
                fs_1.default.unlinkSync(ruta);
                console.log(`🗑️  Eliminado: ${ruta}`);
            }
        });
    }
    /**
     * Obtener URLs públicas de las versiones de imagen
     */
    static obtenerUrlsPublicas(nombreBase, carpeta) {
        const baseUrl = servidor_config_1.configuracionServidor.urlBackend;
        const rutaRelativa = carpeta.replace(servidor_config_1.configuracionServidor.almacenamiento.rutaSubida, '');
        return {
            original: `${baseUrl}/uploads${rutaRelativa}/${nombreBase}-original.webp`,
            grande: `${baseUrl}/uploads${rutaRelativa}/${nombreBase}-grande.webp`,
            mediano: `${baseUrl}/uploads${rutaRelativa}/${nombreBase}-mediano.webp`,
            pequeño: `${baseUrl}/uploads${rutaRelativa}/${nombreBase}-pequeno.webp`,
            thumbnail: `${baseUrl}/uploads${rutaRelativa}/${nombreBase}-thumbnail.webp`,
        };
    }
    /**
     * Validar que el archivo es una imagen válida
     */
    static async validarImagen(rutaArchivo) {
        try {
            const metadata = await (0, sharp_1.default)(rutaArchivo).metadata();
            return !!(metadata.width && metadata.height);
        }
        catch {
            return false;
        }
    }
    /**
     * Obtener información de la imagen
     */
    static async obtenerMetadata(rutaArchivo) {
        return await (0, sharp_1.default)(rutaArchivo).metadata();
    }
}
exports.ImagenServicio = ImagenServicio;
exports.default = ImagenServicio;
//# sourceMappingURL=imagen.servicio.js.map