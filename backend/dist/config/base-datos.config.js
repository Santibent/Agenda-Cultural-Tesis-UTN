"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.conectarBaseDatos = void 0;
const sequelize_1 = require("sequelize");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
/**
 * Configuración de la conexión a la base de datos MySQL
 */
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME || 'agenda_cultural_db', process.env.DB_USER || 'agenda_user', process.env.DB_PASSWORD || 'agenda_password_2024', {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    dialectOptions: {
        charset: 'utf8mb4',
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    timezone: '-03:00', // Argentina (UTC-3)
    define: {
        timestamps: true,
        underscored: true, // Usa snake_case para nombres de columnas
        freezeTableName: true, // No pluraliza nombres de tablas
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci',
    },
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
});
/**
 * Función para verificar la conexión a la base de datos
 */
const conectarBaseDatos = async () => {
    try {
        await sequelize.authenticate();
        console.log('✅ Conexión a MySQL establecida correctamente');
        if (process.env.NODE_ENV === 'development') {
            // En desarrollo, sincroniza los modelos (NO usar en producción)
            // await sequelize.sync({ alter: true });
            console.log('📊 Modelos sincronizados con la base de datos');
        }
    }
    catch (error) {
        console.error('❌ Error al conectar con MySQL:', error);
        process.exit(1);
    }
};
exports.conectarBaseDatos = conectarBaseDatos;
exports.default = sequelize;
//# sourceMappingURL=base-datos.config.js.map