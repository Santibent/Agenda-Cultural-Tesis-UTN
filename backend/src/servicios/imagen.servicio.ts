import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { configuracionServidor } from '../config/servidor.config';

export const TAMANIOS_IMAGEN = {
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

interface OpcionesProcesamiento {
  ancho?: number;
  alto?: number;
  calidad?: number;
  formato?: 'jpeg' | 'png' | 'webp';
  mantenerAspecto?: boolean;
}

export class ImagenServicio {
  
  static async procesarImagen(
    rutaOriginal: string,
    rutaDestino: string,
    opciones: OpcionesProcesamiento = {}
  ): Promise<void> {
    const {
      ancho,
      alto,
      calidad = 85,
      formato = 'webp',
      mantenerAspecto = true,
    } = opciones;

    try {
      let procesador = sharp(rutaOriginal);

      if (ancho || alto) {
        procesador = procesador.resize(ancho, alto, {
          fit: mantenerAspecto ? 'inside' : 'cover',
          withoutEnlargement: true,
        });
      }

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

      await procesador.toFile(rutaDestino);

      console.log(`Imagen procesada: ${rutaDestino}`);
    } catch (error) {
      console.error(' Error al procesar imagen:', error);
      throw new Error('Error al procesar imagen');
    }
  }

  static async generarVersiones(
    rutaOriginal: string,
    nombreBase: string,
    carpetaDestino: string,
    tipo: 'evento' | 'flyer' | 'avatar' = 'evento'
  ): Promise<{
    original: string;
    grande: string;
    mediano: string;
    pequeño?: string;
    thumbnail: string;
  }> {
    try {
      
      if (!fs.existsSync(carpetaDestino)) {
        fs.mkdirSync(carpetaDestino, { recursive: true });
      }

      const tamaños = TAMANIOS_IMAGEN[tipo];
      const extension = '.webp';

      const rutas = {
        original: path.join(carpetaDestino, `${nombreBase}-original${extension}`),
        grande: path.join(carpetaDestino, `${nombreBase}-grande${extension}`),
        mediano: path.join(carpetaDestino, `${nombreBase}-mediano${extension}`),
        thumbnail: path.join(carpetaDestino, `${nombreBase}-thumbnail${extension}`),
        ...(tipo === 'evento' && {
          pequeño: path.join(carpetaDestino, `${nombreBase}-pequeno${extension}`),
        }),
      };

      await this.procesarImagen(rutaOriginal, rutas.original, {
        formato: 'webp',
        calidad: 90,
      });

      await this.procesarImagen(rutaOriginal, rutas.grande, {
        ancho: tamaños.grande.width,
        alto: tamaños.grande.height,
        formato: 'webp',
        calidad: 85,
      });

      if ('mediano' in tamaños) {
        await this.procesarImagen(rutaOriginal, rutas.mediano, {
          ancho: tamaños.mediano.width,
          alto: tamaños.mediano.height,
          formato: 'webp',
          calidad: 80,
        });
      }

      if (tipo === 'evento' && 'pequeño' in tamaños) {
        await this.procesarImagen(rutaOriginal, rutas.pequeño!, {
          ancho: tamaños.pequeño.width,
          alto: tamaños.pequeño.height,
          formato: 'webp',
          calidad: 75,
        });
      }

      if ('thumbnail' in tamaños) {
        await this.procesarImagen(rutaOriginal, rutas.thumbnail, {
          ancho: tamaños.thumbnail.width,
          alto: tamaños.thumbnail.height,
          formato: 'webp',
          calidad: 70,
        });
      }

      if (fs.existsSync(rutaOriginal)) {
        let intentos = 0;
        const maxIntentos = 3;
        while (intentos < maxIntentos) {
          try {
            fs.unlinkSync(rutaOriginal);
            break;
          } catch (error: any) {
            if (error.code === 'EBUSY' && intentos < maxIntentos - 1) {
              
              await new Promise(resolve => setTimeout(resolve, 100));
              intentos++;
            } else {

              console.warn('⚠️  No se pudo eliminar el archivo temporal:', error.message);
              break;
            }
          }
        }
      }

      return rutas as any;
    } catch (error) {
      console.error('❌ Error al generar versiones de imagen:', error);
      throw error;
    }
  }

  static eliminarVersiones(nombreBase: string, carpeta: string): void {
    const sufijos = ['original', 'grande', 'mediano', 'pequeno', 'thumbnail'];

    sufijos.forEach((sufijo) => {
      const ruta = path.join(carpeta, `${nombreBase}-${sufijo}.webp`);
      if (fs.existsSync(ruta)) {
        fs.unlinkSync(ruta);
        console.log(`🗑️  Eliminado: ${ruta}`);
      }
    });
  }

  static obtenerUrlsPublicas(
    nombreBase: string,
    carpeta: string
  ): {
    original: string;
    grande: string;
    mediano: string;
    pequeño?: string;
    thumbnail: string;
  } {
    const baseUrl = configuracionServidor.urlBackend;

    let rutaRelativa = carpeta
      .replace(configuracionServidor.almacenamiento.rutaSubida, '')
      .replace(/\\/g, '/') 
      .replace(/^\/+/, ''); 

    if (rutaRelativa.startsWith('uploads/')) {
      rutaRelativa = rutaRelativa.substring(8); 
    }

    if (rutaRelativa && !rutaRelativa.startsWith('/')) {
      rutaRelativa = '/' + rutaRelativa;
    }

    return {
      original: `${baseUrl}/uploads${rutaRelativa}/${nombreBase}-original.webp`,
      grande: `${baseUrl}/uploads${rutaRelativa}/${nombreBase}-grande.webp`,
      mediano: `${baseUrl}/uploads${rutaRelativa}/${nombreBase}-mediano.webp`,
      pequeño: `${baseUrl}/uploads${rutaRelativa}/${nombreBase}-pequeno.webp`,
      thumbnail: `${baseUrl}/uploads${rutaRelativa}/${nombreBase}-thumbnail.webp`,
    };
  }

  static async validarImagen(rutaArchivo: string): Promise<boolean> {
    try {
      const metadata = await sharp(rutaArchivo).metadata();
      return !!(metadata.width && metadata.height);
    } catch {
      return false;
    }
  }

  static async obtenerMetadata(rutaArchivo: string): Promise<sharp.Metadata> {
    return await sharp(rutaArchivo).metadata();
  }
}

export default ImagenServicio;
