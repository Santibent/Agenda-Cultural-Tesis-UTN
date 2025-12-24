"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const base_datos_config_1 = __importDefault(require("../config/base-datos.config"));
const enums_1 = require("../tipos/enums");
/**
 * Modelo de Usuario
 */
class Usuario extends sequelize_1.Model {
    /**
     * Método para obtener el usuario sin campos sensibles
     */
    toJSON() {
        const values = { ...this.get() };
        delete values.password;
        delete values.tokenVerificacion;
        delete values.tokenRecuperacion;
        delete values.tokenExpiracion;
        return values;
    }
}
/**
 * Definición del modelo Usuario
 */
Usuario.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    nombre: {
        type: sequelize_1.DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: {
            isEmail: {
                msg: 'Debe proporcionar un email válido',
            },
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: false,
    },
    rol: {
        type: sequelize_1.DataTypes.ENUM(...Object.values(enums_1.RolUsuario)),
        defaultValue: enums_1.RolUsuario.USUARIO,
    },
    emailVerificado: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'email_verificado',
    },
    tokenVerificacion: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        field: 'token_verificacion',
    },
    tokenRecuperacion: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
        field: 'token_recuperacion',
    },
    tokenExpiracion: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        field: 'token_expiracion',
    },
    avatarUrl: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: true,
        field: 'avatar_url',
    },
    activo: {
        type: sequelize_1.DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    sequelize: base_datos_config_1.default,
    tableName: 'usuarios',
    timestamps: true,
    underscored: true,
    indexes: [
        {
            name: 'idx_email',
            fields: ['email'],
        },
        {
            name: 'idx_token_verificacion',
            fields: ['token_verificacion'],
        },
    ],
});
exports.default = Usuario;
//# sourceMappingURL=usuario.modelo.js.map