"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const base_datos_config_1 = __importDefault(require("../config/base-datos.config"));
const evento_modelo_1 = __importDefault(require("./evento.modelo"));
/**
 * Modelo de Flyer
 */
class Flyer extends sequelize_1.Model {
}
/**
 * Definición del modelo Flyer
 */
Flyer.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    titulo: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
    descripcion: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    imagenUrl: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: false,
        field: 'imagen_url',
    },
    imagenThumbnail: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        field: 'imagen_thumbnail',
    },
    eventoRelacionadoId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        field: 'evento_relacionado_id',
        references: {
            model: 'eventos',
            key: 'id',
        },
    },
    etiquetas: {
        type: sequelize_1.DataTypes.JSON,
        allowNull: true,
    },
    orden: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    visible: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    destacado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    vistas: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    sequelize: base_datos_config_1.default,
    tableName: 'flyers',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            name: 'idx_visible',
            fields: ['visible'],
        },
        {
            name: 'idx_destacado',
            fields: ['destacado'],
        },
        {
            name: 'idx_orden',
            fields: ['orden'],
        },
    ],
});
/**
 * Definir asociaciones
 */
Flyer.belongsTo(evento_modelo_1.default, {
    foreignKey: 'eventoRelacionadoId',
    as: 'eventoRelacionado',
});
exports.default = Flyer;
//# sourceMappingURL=flyer.modelo.js.map