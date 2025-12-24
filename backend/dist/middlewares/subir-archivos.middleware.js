"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.obtenerUrlPublica = exports.eliminarArchivo = exports.subirCamposMultiples = exports.subirVariasImagenes = exports.subirImagen = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const servidor_config_1 = require("../config/servidor.config");
const errores_util_1 = require("../utilidades/errores.util");
/**
 * Tipos de archivo permitidos
 */
const TIPOS_IMAGEN_PERMITIDOS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
const EXTENSIONES_PERMITIDAS = ['.jpg', '.jpeg', '.png', '.webp', '.gif'];
/**
 * Asegurar que existe el directorio de uploads
 */
const asegurarDirectorio = (directorio) => {
    if (!fs_1.default.existsSync(directorio)) {
        fs_1.default.mkdirSync(directorio, { recursive: true });
    }
};
/**
 * Configuración de almacenamiento de Multer
 */
const storage = multer_1.default.diskStorage({
    destination: (req, _file, cb) => {
        // Determinar carpeta según el tipo de archivo
        let carpeta = 'otros';
        if (req.baseUrl.includes('eventos')) {
            carpeta = 'eventos';
        }
        else if (req.baseUrl.includes('flyers')) {
            carpeta = 'flyers';
        }
        else if (req.baseUrl.includes('usuarios')) {
            carpeta = 'avatares';
        }
        const rutaDestino = path_1.default.join(servidor_config_1.configuracionServidor.almacenamiento.rutaSubida, carpeta);
        asegurarDirectorio(rutaDestino);
        cb(null, rutaDestino);
    },
    filename: (_req, file, cb) => {
        // Generar nombre único para el archivo
        const nombreUnico = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = path_1.default.extname(file.originalname);
        cb(null, `${nombreUnico}${extension}`);
    },
});
/**
 * Filtro para validar tipo de archivo
 */
const fileFilter = (_req, file, cb) => {
    // Verificar tipo MIME
    if (!TIPOS_IMAGEN_PERMITIDOS.includes(file.mimetype)) {
        return cb(new errores_util_1.ErrorValidacion('Tipo de archivo no permitido. Solo se aceptan imágenes (JPG, PNG, WEBP, GIF)'));
    }
    // Verificar extensión
    const extension = path_1.default.extname(file.originalname).toLowerCase();
    if (!EXTENSIONES_PERMITIDAS.includes(extension)) {
        return cb(new errores_util_1.ErrorValidacion('Extensión de archivo no válida'));
    }
    cb(null, true);
};
/**
 * Configuración de Multer
 */
const upload = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: servidor_config_1.configuracionServidor.almacenamiento.tamanioMaximo, // 5MB por defecto
    },
});
/**
 * Middleware para subir una sola imagen
 */
exports.subirImagen = upload.single('imagen');
/**
 * Middleware para subir múltiples imágenes
 */
const subirVariasImagenes = (maxImagenes = 5) => {
    return upload.array('imagenes', maxImagenes);
};
exports.subirVariasImagenes = subirVariasImagenes;
/**
 * Middleware para subir múltiples campos de archivos
 */
exports.subirCamposMultiples = upload.fields([
    { name: 'imagenPrincipal', maxCount: 1 },
    { name: 'imagenBanner', maxCount: 1 },
    { name: 'galeria', maxCount: 10 },
]);
/**
 * Función para eliminar archivo
 */
const eliminarArchivo = (rutaArchivo) => {
    try {
        if (fs_1.default.existsSync(rutaArchivo)) {
            fs_1.default.unlinkSync(rutaArchivo);
        }
    }
    catch (error) {
        console.error('Error al eliminar archivo:', error);
    }
};
exports.eliminarArchivo = eliminarArchivo;
/**
 * Función para obtener URL pública del archivo
 */
const obtenerUrlPublica = (rutaArchivo) => {
    const rutaRelativa = rutaArchivo.replace(servidor_config_1.configuracionServidor.almacenamiento.rutaSubida, '');
    return `${servidor_config_1.configuracionServidor.urlBackend}/uploads${rutaRelativa}`;
};
exports.obtenerUrlPublica = obtenerUrlPublica;
//# sourceMappingURL=subir-archivos.middleware.js.map