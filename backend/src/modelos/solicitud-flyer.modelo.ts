import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/base-datos.config';
import Usuario from './usuario.modelo';
import { EstadoSolicitudFlyer, PrioridadSolicitud } from '../tipos/enums';

interface SolicitudFlyerAtributos {
  id: number;
  usuarioId: number;
  nombreEvento: string;
  tipoEvento: string | null;
  fechaEvento: Date | null;
  descripcion: string;
  referencias: string | null;
  coloresPreferidos: string | null;
  estiloPreferido: string | null;
  informacionIncluir: string | null;
  presupuesto: number | null;
  contactoEmail: string;
  contactoTelefono: string | null;
  contactoWhatsapp: string | null;
  fechaLimite: Date | null;
  estado: EstadoSolicitudFlyer;
  prioridad: PrioridadSolicitud;
  notasAdmin: string | null;
  archivoResultado: string | null;
  fechaCompletado: Date | null;
  calificacion: number | null;
  comentarioUsuario: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

interface SolicitudFlyerCreacionAtributos extends Optional<SolicitudFlyerAtributos, 
  'id' | 'tipoEvento' | 'fechaEvento' | 'referencias' | 'coloresPreferidos' | 
  'estiloPreferido' | 'informacionIncluir' | 'presupuesto' | 'contactoTelefono' | 
  'contactoWhatsapp' | 'fechaLimite' | 'estado' | 'prioridad' | 'notasAdmin' | 
  'archivoResultado' | 'fechaCompletado' | 'calificacion' | 'comentarioUsuario'> {}

class SolicitudFlyer extends Model<SolicitudFlyerAtributos, SolicitudFlyerCreacionAtributos> implements SolicitudFlyerAtributos {
  declare id: number;
  declare usuarioId: number;
  declare nombreEvento: string;
  declare tipoEvento: string | null;
  declare fechaEvento: Date | null;
  declare descripcion: string;
  declare referencias: string | null;
  declare coloresPreferidos: string | null;
  declare estiloPreferido: string | null;
  declare informacionIncluir: string | null;
  declare presupuesto: number | null;
  declare contactoEmail: string;
  declare contactoTelefono: string | null;
  declare contactoWhatsapp: string | null;
  declare fechaLimite: Date | null;
  declare estado: EstadoSolicitudFlyer;
  declare prioridad: PrioridadSolicitud;
  declare notasAdmin: string | null;
  declare archivoResultado: string | null;
  declare fechaCompletado: Date | null;
  declare calificacion: number | null;
  declare comentarioUsuario: string | null;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare readonly usuario?: Usuario;
}

SolicitudFlyer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'usuario_id',
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
    nombreEvento: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'nombre_evento',
    },
    tipoEvento: {
      type: DataTypes.STRING(100),
      allowNull: true,
      field: 'tipo_evento',
    },
    fechaEvento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'fecha_evento',
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    referencias: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    coloresPreferidos: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'colores_preferidos',
    },
    estiloPreferido: {
      type: DataTypes.STRING(200),
      allowNull: true,
      field: 'estilo_preferido',
    },
    informacionIncluir: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'informacion_incluir',
    },
    presupuesto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    contactoEmail: {
      type: DataTypes.STRING(150),
      allowNull: false,
      field: 'contacto_email',
      validate: {
        isEmail: true,
      },
    },
    contactoTelefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'contacto_telefono',
    },
    contactoWhatsapp: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'contacto_whatsapp',
    },
    fechaLimite: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: 'fecha_limite',
    },
    estado: {
      type: DataTypes.ENUM(...Object.values(EstadoSolicitudFlyer)),
      defaultValue: EstadoSolicitudFlyer.PENDIENTE,
    },
    prioridad: {
      type: DataTypes.ENUM(...Object.values(PrioridadSolicitud)),
      defaultValue: PrioridadSolicitud.MEDIA,
    },
    notasAdmin: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'notas_admin',
    },
    archivoResultado: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'archivo_resultado',
    },
    fechaCompletado: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'fecha_completado',
    },
    calificacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: 1,
        max: 5,
      },
    },
    comentarioUsuario: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'comentario_usuario',
    },
  },
  {
    sequelize,
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
  }
);

SolicitudFlyer.belongsTo(Usuario, {
  foreignKey: 'usuarioId',
  as: 'usuario',
});

export default SolicitudFlyer;