import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';
import { configuracionServidor } from '../config/servidor.config';
import { ErrorValidacion } from '../utilidades/errores.util';

const TIPOS_IMAGEN_PERMITIDOS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const EXTENSIONES_PERMITIDAS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];

const asegurarDirectorio = (directorio: string): void => {
  if (!fs.existsSync(directorio)) {
    fs.mkdirSync(directorio, { recursive: true });
  }
};

const storage = multer.diskStorage({
  destination: (req: Request, _file: Express.Multer.File, cb) => {
    
    let carpeta = 'otros';
    
    if (req.baseUrl.includes('eventos')) {
      carpeta = 'eventos';
    } else if (req.baseUrl.includes('flyers')) {
      carpeta = 'flyers';
    } else if (req.baseUrl.includes('usuarios')) {
      carpeta = 'avatares';
    }

    const rutaDestino = path.join(configuracionServidor.almacenamiento.rutaSubida, carpeta);
    asegurarDirectorio(rutaDestino);
    
    cb(null, rutaDestino);
  },
  filename: (_req: Request, file: Express.Multer.File, cb) => {
    
    const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const extension = path.extname(file.originalname);
    cb(null, `${nombreUnico}${extension}`);
  },
});

const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  
  if (!TIPOS_IMAGEN_PERMITIDOS.includes(file.mimetype)) {
    return cb(new ErrorValidacion('Tipo de archivo no permitido. Solo se aceptan imágenes (JPG, PNG, WEBP, GIF)'));
  }

  const extension = path.extname(file.originalname).toLowerCase();
  if (!EXTENSIONES_PERMITIDAS.includes(extension)) {
    return cb(new ErrorValidacion('Extensión de archivo no válida'));
  }

  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: configuracionServidor.almacenamiento.tamanioMaximo, 
  },
});

export const subirImagen = upload.single('imagen');

export const subirVariasImagenes = (maxImagenes: number = 5) => {
  return upload.array('imagenes', maxImagenes);
};

export const subirCamposMultiples = upload.fields([
  { name: 'imagenPrincipal', maxCount: 1 },
  { name: 'imagenBanner', maxCount: 1 },
  { name: 'galeria', maxCount: 10 },
]);

export const eliminarArchivo = (rutaArchivo: string): void => {
  try {
    if (fs.existsSync(rutaArchivo)) {
      fs.unlinkSync(rutaArchivo);
    }
  } catch (error) {
    console.error('Error al eliminar archivo:', error);
  }
};

export const obtenerUrlPublica = (rutaArchivo: string): string => {
  const rutaRelativa = rutaArchivo.replace(configuracionServidor.almacenamiento.rutaSubida, '');
  return `${configuracionServidor.urlBackend}/uploads${rutaRelativa}`;
};