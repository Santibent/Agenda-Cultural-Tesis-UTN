"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.configuracionServidor = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Configuración centralizada del servidor
 */
exports.configuracionServidor = {
    // Entorno
    entorno: process.env.NODE_ENV || 'development',
    puerto: Number(process.env.PORT) || 3000,
    versionApi: process.env.API_VERSION || 'v1',
    // URLs
    urlFrontend: process.env.FRONTEND_URL || 'http://localhost:4200',
    urlBackend: process.env.BACKEND_URL || 'http://localhost:3000',
    // Base de datos
    baseDatos: {
        host: process.env.DB_HOST || 'localhost',
        puerto: Number(process.env.DB_PORT) || 3306,
        nombre: process.env.DB_NAME || 'agenda_cultural_db',
        usuario: process.env.DB_USER || 'agenda_user',
        password: process.env.DB_PASSWORD || '',
    },
    // JWT
    jwt: {
        secreto: process.env.JWT_SECRET || 'cambiar_en_produccion',
        expiracion: Number(process.env.JWT_EXPIRES_IN) || (7 * 24 * 60 * 60), // 7 days in seconds
        expiracionRefresh: Number(process.env.JWT_REFRESH_EXPIRES_IN) || (30 * 24 * 60 * 60), // 30 days in seconds
    },
    // Email
    smtp: {
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true' || false,
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
        from: process.env.EMAIL_FROM || 'noreply@agendacultural.com',
    },
    // Almacenamiento
    almacenamiento: {
        rutaSubida: process.env.UPLOAD_PATH || './uploads',
        tamanioMaximo: Number(process.env.MAX_FILE_SIZE) || 5242880, // 5MB
    },
    // Rate limiting
    rateLimiting: {
        ventanaTiempo: Number(process.env.RATE_LIMIT_WINDOW) || 15, // minutos
        maxPeticiones: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    },
    // Desarrollo
    esDesarrollo: () => process.env.NODE_ENV === 'development',
    esProduccion: () => process.env.NODE_ENV === 'production',
};
exports.default = exports.configuracionServidor;
//# sourceMappingURL=servidor.config.js.map