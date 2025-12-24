"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const servidor_config_1 = require("./config/servidor.config");
const limitar_peticiones_middleware_1 = require("./middlewares/limitar-peticiones.middleware");
const error_middleware_1 = require("./middlewares/error.middleware");
const rutas_1 = __importDefault(require("./rutas"));
/**
 * Clase principal de la aplicación Express
 */
class App {
    app;
    constructor() {
        this.app = (0, express_1.default)();
        this.configurarMiddlewares();
        this.configurarRutas();
        this.configurarManejadorErrores();
    }
    /**
     * Configurar middlewares globales
     */
    configurarMiddlewares() {
        // Seguridad HTTP headers
        this.app.use((0, helmet_1.default)({
            crossOriginResourcePolicy: { policy: 'cross-origin' },
        }));
        // CORS - Permitir peticiones desde el frontend
        this.app.use((0, cors_1.default)({
            origin: servidor_config_1.configuracionServidor.urlFrontend,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
            allowedHeaders: ['Content-Type', 'Authorization'],
        }));
        // Compresión de respuestas
        this.app.use((0, compression_1.default)());
        // Body parser
        this.app.use(express_1.default.json({ limit: '10mb' }));
        this.app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
        // Logging (solo en desarrollo)
        if (servidor_config_1.configuracionServidor.esDesarrollo()) {
            this.app.use((0, morgan_1.default)('dev'));
        }
        else {
            this.app.use((0, morgan_1.default)('combined'));
        }
        // Rate limiting global
        this.app.use(limitar_peticiones_middleware_1.limitadorGeneral);
        // Servir archivos estáticos (uploads)
        this.app.use('/uploads', express_1.default.static(path_1.default.join(__dirname, '../uploads')));
        // Headers de información
        this.app.use((_req, res, next) => {
            res.setHeader('X-Powered-By', 'Agenda Cultural API');
            res.setHeader('X-API-Version', servidor_config_1.configuracionServidor.versionApi);
            next();
        });
    }
    /**
     * Configurar rutas de la API
     */
    configurarRutas() {
        // Ruta de health check
        this.app.get('/health', (_req, res) => {
            res.status(200).json({
                estado: 'OK',
                mensaje: 'Servidor funcionando correctamente',
                version: servidor_config_1.configuracionServidor.versionApi,
                entorno: servidor_config_1.configuracionServidor.entorno,
                timestamp: new Date().toISOString(),
            });
        });
        // Ruta raíz
        this.app.get('/', (_req, res) => {
            res.status(200).json({
                mensaje: 'API de Agenda Cultural',
                version: servidor_config_1.configuracionServidor.versionApi,
                documentacion: '/api/v1/docs',
                salud: '/health',
            });
        });
        // Rutas de la API
        this.app.use(`/api/${servidor_config_1.configuracionServidor.versionApi}`, rutas_1.default);
        // Ruta no encontrada (404)
        this.app.use(error_middleware_1.rutaNoEncontrada);
    }
    /**
     * Configurar manejador global de errores
     */
    configurarManejadorErrores() {
        this.app.use(error_middleware_1.manejarErrores);
    }
    /**
     * Obtener instancia de Express
     */
    obtenerApp() {
        return this.app;
    }
}
exports.default = new App().obtenerApp();
//# sourceMappingURL=app.js.map