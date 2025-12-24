"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const base_datos_config_1 = __importDefault(require("../config/base-datos.config"));
const categoria_modelo_1 = __importDefault(require("./categoria.modelo"));
const usuario_modelo_1 = __importDefault(require("./usuario.modelo"));
/**
 * Modelo de Evento
 */
class Evento extends sequelize_1.Model {
}
/**
 * Definición del modelo Evento
 */
Evento.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    titulo: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
    slug: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
        unique: true,
    },
    descripcion: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    descripcionCorta: {
        type: sequelize_1.DataTypes.STRING(300),
        allowNull: true,
        field: 'descripcion_corta',
    },
    categoriaId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'categoria_id',
        references: {
            model: 'categorias',
            key: 'id',
        },
    },
    fechaInicio: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: false,
        field: 'fecha_inicio',
    },
    fechaFin: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'fecha_fin',
    },
    horaInicio: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: true,
        field: 'hora_inicio',
    },
    horaFin: {
        type: sequelize_1.DataTypes.TIME,
        allowNull: true,
        field: 'hora_fin',
    },
    ubicacion: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
    },
    direccion: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    ciudad: {
        type: sequelize_1.DataTypes.STRING(100),
        defaultValue: 'Venado Tuerto',
    },
    provincia: {
        type: sequelize_1.DataTypes.STRING(100),
        defaultValue: 'Santa Fe',
    },
    pais: {
        type: sequelize_1.DataTypes.STRING(100),
        defaultValue: 'Argentina',
    },
    latitud: {
        type: sequelize_1.DataTypes.DECIMAL(10, 8),
        allowNull: true,
    },
    longitud: {
        type: sequelize_1.DataTypes.DECIMAL(11, 8),
        allowNull: true,
    },
    imagenPrincipal: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        field: 'imagen_principal',
    },
    imagenBanner: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        field: 'imagen_banner',
    },
    imagenUrl: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: 'imagen_url',
    },
    precio: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        defaultValue: 0,
    },
    moneda: {
        type: sequelize_1.DataTypes.STRING(3),
        defaultValue: 'ARS',
    },
    capacidad: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
    },
    linkExterno: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        field: 'link_externo',
    },
    linkTickets: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        field: 'link_tickets',
    },
    organizador: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: true,
    },
    contactoEmail: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: true,
        field: 'contacto_email',
    },
    contactoTelefono: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        field: 'contacto_telefono',
    },
    destacado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
    },
    activo: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
    vistas: {
        type: sequelize_1.DataTypes.INTEGER,
        defaultValue: 0,
    },
    usuarioCreadorId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'usuario_creador_id',
        references: {
            model: 'usuarios',
            key: 'id',
        },
    },
}, {
    sequelize: base_datos_config_1.default,
    tableName: 'eventos',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            name: 'idx_slug',
            fields: ['slug'],
        },
        {
            name: 'idx_categoria',
            fields: ['categoria_id'],
        },
        {
            name: 'idx_fecha_inicio',
            fields: ['fecha_inicio'],
        },
        {
            name: 'idx_destacado',
            fields: ['destacado'],
        },
        {
            name: 'idx_activo',
            fields: ['activo'],
        },
    ],
});
/**
 * Definir asociaciones
 */
Evento.belongsTo(categoria_modelo_1.default, {
    foreignKey: 'categoriaId',
    as: 'categoria',
});
Evento.belongsTo(usuario_modelo_1.default, {
    foreignKey: 'usuarioCreadorId',
    as: 'usuarioCreador',
});
exports.default = Evento;
//# sourceMappingURL=evento.modelo.js.map