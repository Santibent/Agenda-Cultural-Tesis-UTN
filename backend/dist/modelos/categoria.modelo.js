"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const base_datos_config_1 = __importDefault(require("../config/base-datos.config"));
/**
 * Modelo de Categoría
 */
class Categoria extends sequelize_1.Model {
}
/**
 * Definición del modelo Categoría
 */
Categoria.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: false,
        unique: true,
    },
    descripcion: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    color: {
        type: sequelize_1.DataTypes.STRING(7),
        allowNull: false,
        defaultValue: '#FF0000',
        validate: {
            is: /^#[0-9A-F]{6}$/i,
        },
    },
    icono: {
        type: sequelize_1.DataTypes.STRING(50),
        allowNull: true,
    },
    activo: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    orden: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
}, {
    sequelize: base_datos_config_1.default,
    tableName: 'categorias',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            name: 'idx_slug',
            fields: ['slug'],
        },
        {
            name: 'idx_activo',
            fields: ['activo'],
        },
    ],
});
exports.default = Categoria;
//# sourceMappingURL=categoria.modelo.js.map