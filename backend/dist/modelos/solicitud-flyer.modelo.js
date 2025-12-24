"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const base_datos_config_1 = __importDefault(require("../config/base-datos.config"));
const usuario_modelo_1 = __importDefault(require("./usuario.modelo"));
const enums_1 = require("../tipos/enums");
/**
 * Modelo de SolicitudFlyer
 */
class SolicitudFlyer extends sequelize_1.Model {
}
/**
 * Definición del modelo SolicitudFlyer
 */
SolicitudFlyer.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    usuarioId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
        field: 'usuario_id',
        references: {
            model: 'usuarios',
            key: 'id',
        },
    },
    nombreEvento: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: false,
        field: 'nombre_evento',
    },
    tipoEvento: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: true,
        field: 'tipo_evento',
    },
    fechaEvento: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
        field: 'fecha_evento',
    },
    descripcion: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: false,
    },
    referencias: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
    },
    coloresPreferidos: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: true,
        field: 'colores_preferidos',
    },
    estiloPreferido: {
        type: sequelize_1.DataTypes.STRING(200),
        allowNull: true,
        field: 'estilo_preferido',
    },
    informacionIncluir: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: 'informacion_incluir',
    },
    presupuesto: {
        type: sequelize_1.DataTypes.DECIMAL(10, 2),
        allowNull: true,
    },
    contactoEmail: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false,
        field: 'contacto_email',
        validate: {
            isEmail: true,
        },
    },
    contactoTelefono: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        field: 'contacto_telefono',
    },
    contactoWhatsapp: {
        type: sequelize_1.DataTypes.STRING(20),
        allowNull: true,
        field: 'contacto_whatsapp',
    },
    fechaLimite: {
        type: sequelize_1.DataTypes.DATEONLY,
        allowNull: true,
        field: 'fecha_limite',
    },
    estado: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(enums_1.EstadoSolicitudFlyer)),
        defaultValue: enums_1.EstadoSolicitudFlyer.PENDIENTE,
    },
    prioridad: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(enums_1.PrioridadSolicitud)),
        defaultValue: enums_1.PrioridadSolicitud.MEDIA,
    },
    notasAdmin: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: 'notas_admin',
    },
    archivoResultado: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        field: 'archivo_resultado',
    },
    fechaCompletado: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'fecha_completado',
    },
    calificacion: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: true,
        validate: {
            min: 1,
            max: 5,
        },
    },
    comentarioUsuario: {
        type: sequelize_1.DataTypes.TEXT,
        allowNull: true,
        field: 'comentario_usuario',
    },
}, {
    sequelize: base_datos_config_1.default,
    tableName: 'solicitudes_flyer',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            name: 'idx_usuario',
            fields: ['usuario_id'],
        },
        {
            name: 'idx_estado',
            fields: ['estado'],
        },
        {
            name: 'idx_prioridad',
            fields: ['prioridad'],
        },
        {
            name: 'idx_fecha_evento',
            fields: ['fecha_evento'],
        },
    ],
});
/**
 * Definir asociaciones
 */
SolicitudFlyer.belongsTo(usuario_modelo_1.default, {
    foreignKey: 'usuarioId',
    as: 'usuario',
});
exports.default = SolicitudFlyer;
//# sourceMappingURL=solicitud-flyer.modelo.js.map