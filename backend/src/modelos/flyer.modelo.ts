import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/base-datos.config';
import Evento from './evento.modelo';

interface FlyerAtributos {
  id: number;
  titulo: string;
  descripcion: string | null;
  imagenUrl: string;
  imagenThumbnail: string | null;
  eventoRelacionadoId: number | null;
  etiquetas: string[] | null;
  orden: number;
  visible: boolean;
  destacado: boolean;
  vistas: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FlyerCreacionAtributos extends Optional<FlyerAtributos, 
  'id' | 'descripcion' | 'imagenThumbnail' | 'eventoRelacionadoId' | 
  'etiquetas' | 'orden' | 'visible' | 'destacado' | 'vistas'> {}

class Flyer extends Model<FlyerAtributos, FlyerCreacionAtributos> implements FlyerAtributos {
  declare id: number;
  declare titulo: string;
  declare descripcion: string | null;
  declare imagenUrl: string;
  declare imagenThumbnail: string | null;
  declare eventoRelacionadoId: number | null;
  declare etiquetas: string[] | null;
  declare orden: number;
  declare visible: boolean;
  declare destacado: boolean;
  declare vistas: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare readonly eventoRelacionado?: Evento;
}

Flyer.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    imagenUrl: {
      type: DataTypes.STRING(500),
      allowNull: false,
      field: 'imagen_url',
    },
    imagenThumbnail: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'imagen_thumbnail',
    },
    eventoRelacionadoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: 'evento_relacionado_id',
      references: {
        model: 'eventos',
        key: 'id',
      },
    },
    etiquetas: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    visible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    destacado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    vistas: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
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
  }
);

Flyer.belongsTo(Evento, {
  foreignKey: 'eventoRelacionadoId',
  as: 'eventoRelacionado',
});

export default Flyer;