import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/base-datos.config';
import { RolUsuario } from '../tipos/enums';

interface UsuarioAtributos {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: RolUsuario;
  emailVerificado: boolean;
  tokenVerificacion: string | null;
  tokenRecuperacion: string | null;
  tokenExpiracion: Date | null;
  avatarUrl: string | null;
  activo: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UsuarioCreacionAtributos extends Optional<UsuarioAtributos, 'id' | 'rol' | 'emailVerificado' | 'tokenVerificacion' | 'tokenRecuperacion' | 'tokenExpiracion' | 'avatarUrl' | 'activo'> {}

class Usuario extends Model<UsuarioAtributos, UsuarioCreacionAtributos> implements UsuarioAtributos {
  declare id: number;
  declare nombre: string;
  declare email: string;
  declare password: string;
  declare rol: RolUsuario;
  declare emailVerificado: boolean;
  declare tokenVerificacion: string | null;
  declare tokenRecuperacion: string | null;
  declare tokenExpiracion: Date | null;
  declare avatarUrl: string | null;
  declare activo: boolean;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  public toJSON(): Partial<UsuarioAtributos> {
    const values = { ...this.get() } as any;
    delete values.password;
    delete values.tokenVerificacion;
    delete values.tokenRecuperacion;
    delete values.tokenExpiracion;
    return values;
  }
}

Usuario.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: 'Debe proporcionar un email válido',
        },
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    rol: {
      type: DataTypes.ENUM(...Object.values(RolUsuario)),
      defaultValue: RolUsuario.USUARIO,
    },
    emailVerificado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'email_verificado',
    },
    tokenVerificacion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'token_verificacion',
    },
    tokenRecuperacion: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'token_recuperacion',
    },
    tokenExpiracion: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'token_expiracion',
    },
    avatarUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'avatar_url',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
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
  }
);

export default Usuario;