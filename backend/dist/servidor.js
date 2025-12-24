"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const servidor_config_1 = require("./config/servidor.config");
const base_datos_config_1 = require("./config/base-datos.config");
/**
 * Clase para gestionar el servidor
 */
class Servidor {
    puerto;
    constructor() {
        this.puerto = servidor_config_1.configuracionServidor.puerto;
    }
    /**
     * Inicializar servicios necesarios
     */
    async inicializarServicios() {
        try {
            // Conectar a la base de datos
            await (0, base_datos_config_1.conectarBaseDatos)();
            // Verificar servicio de email
            // await EmailServicio.verificarConexion(); // Método privado, se llama en el constructor
            console.log('✅ Servicios inicializados correctamente');
        }
        catch (error) {
            console.error('❌ Error al inicializar servicios:', error);
            throw error;
        }
    }
    /**
     * Iniciar servidor
     */
    async iniciar() {
        try {
            // Inicializar servicios
            await this.inicializarServicios();
            // Iniciar servidor HTTP
            app_1.default.listen(this.puerto, () => {
                console.log('\n🚀 ========================================');
                console.log(`   SERVIDOR INICIADO EXITOSAMENTE`);
                console.log('   ========================================');
                console.log(`   📍 Entorno: ${servidor_config_1.configuracionServidor.entorno}`);
                console.log(`   🌐 URL: ${servidor_config_1.configuracionServidor.urlBackend}`);
                console.log(`   🔌 Puerto: ${this.puerto}`);
                console.log(`   📡 API Version: ${servidor_config_1.configuracionServidor.versionApi}`);
                console.log(`   📁 Uploads: ${servidor_config_1.configuracionServidor.almacenamiento.rutaSubida}`);
                console.log('   ========================================\n');
                if (servidor_config_1.configuracionServidor.esDesarrollo()) {
                    console.log('📝 Endpoints disponibles:');
                    console.log(`   - Health: ${servidor_config_1.configuracionServidor.urlBackend}/health`);
                    console.log(`   - API: ${servidor_config_1.configuracionServidor.urlBackend}/api/${servidor_config_1.configuracionServidor.versionApi}`);
                    console.log(`   - Uploads: ${servidor_config_1.configuracionServidor.urlBackend}/uploads\n`);
                }
            });
        }
        catch (error) {
            console.error('❌ Error al iniciar el servidor:', error);
            process.exit(1);
        }
    }
    /**
     * Manejar cierre graceful del servidor
     */
    manejarCierre() {
        process.on('SIGTERM', () => {
            console.log('\n⚠️  SIGTERM recibido. Cerrando servidor...');
            process.exit(0);
        });
        process.on('SIGINT', () => {
            console.log('\n⚠️  SIGINT recibido. Cerrando servidor...');
            process.exit(0);
        });
        process.on('unhandledRejection', (error) => {
            console.error('❌ Promesa rechazada no manejada:', error);
            process.exit(1);
        });
        process.on('uncaughtException', (error) => {
            console.error('❌ Excepción no capturada:', error);
            process.exit(1);
        });
    }
}
// Crear instancia del servidor
const servidor = new Servidor();
// Configurar manejadores de cierre
servidor['manejarCierre']();
// Iniciar servidor
servidor.iniciar();
//# sourceMappingURL=servidor.js.map