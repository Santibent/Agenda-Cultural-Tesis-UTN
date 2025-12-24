import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/base-datos.config';
import Categoria from './categoria.modelo';
import Usuario from './usuario.modelo';

interface EventoAtributos {
  id: number;
  titulo: string;
  slug: string;
  descripcion: string;
  descripcionCorta: string | null;
  categoriaId: number;
  fechaInicio: Date;
  fechaFin: Date | null;
  horaInicio: string | null;
  horaFin: string | null;
  ubicacion: string;
  direccion: string | null;
  ciudad: string;
  provincia: string;
  pais: string;
  latitud: number | null;
  longitud: number | null;
  imagenPrincipal: string | null;
  imagenBanner: string | null;
  imagenUrl: string | null;
  precio: number;
  moneda: string;
  capacidad: number | null;
  linkExterno: string | null;
  linkTickets: string | null;
  organizador: string | null;
  contactoEmail: string | null;
  contactoTelefono: string | null;
  destacado: boolean;
  activo: boolean;
  vistas: number;
  usuarioCreadorId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface EventoCreacionAtributos extends Optional<EventoAtributos,
  'id' | 'slug' | 'descripcionCorta' | 'fechaFin' | 'horaInicio' | 'horaFin' |
  'direccion' | 'latitud' | 'longitud' | 'imagenPrincipal' | 'imagenBanner' | 'imagenUrl' |
  'capacidad' | 'linkExterno' | 'linkTickets' | 'organizador' |
  'contactoEmail' | 'contactoTelefono' | 'destacado' | 'activo' | 'vistas'> {}

class Evento extends Model<EventoAtributos, EventoCreacionAtributos> implements EventoAtributos {
  declare id: number;
  declare titulo: string;
  declare slug: string;
  declare descripcion: string;
  declare descripcionCorta: string | null;
  declare categoriaId: number;
  declare fechaInicio: Date;
  declare fechaFin: Date | null;
  declare horaInicio: string | null;
  declare horaFin: string | null;
  declare ubicacion: string;
  declare direccion: string | null;
  declare ciudad: string;
  declare provincia: string;
  declare pais: string;
  declare latitud: number | null;
  declare longitud: number | null;
  declare imagenPrincipal: string | null;
  declare imagenBanner: string | null;
  declare imagenUrl: string | null;
  declare precio: number;
  declare moneda: string;
  declare capacidad: number | null;
  declare linkExterno: string | null;
  declare linkTickets: string | null;
  declare organizador: string | null;
  declare contactoEmail: string | null;
  declare contactoTelefono: string | null;
  declare destacado: boolean;
  declare activo: boolean;
  declare vistas: number;
  declare usuarioCreadorId: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;

  declare readonly categoria?: Categoria;
  declare readonly usuarioCreador?: Usuario;
}

Evento.init(
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
    slug: {
      type: DataTypes.STRING(200),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    descripcionCorta: {
      type: DataTypes.STRING(300),
      allowNull: true,
      field: 'descripcion_corta',
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'categoria_id',
      references: {
        model: 'categorias',
        key: 'id',
      },
    },
    fechaInicio: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'fecha_inicio',
    },
    fechaFin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'fecha_fin',
    },
    horaInicio: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'hora_inicio',
    },
    horaFin: {
      type: DataTypes.TIME,
      allowNull: true,
      field: 'hora_fin',
    },
    ubicacion: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    ciudad: {
      type: DataTypes.STRING(100),
      defaultValue: 'Venado Tuerto',
    },
    provincia: {
      type: DataTypes.STRING(100),
      defaultValue: 'Santa Fe',
    },
    pais: {
      type: DataTypes.STRING(100),
      defaultValue: 'Argentina',
    },
    latitud: {
      type: DataTypes.DECIMAL(10, 8),
      allowNull: true,
    },
    longitud: {
      type: DataTypes.DECIMAL(11, 8),
      allowNull: true,
    },
    imagenPrincipal: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'imagen_principal',
    },
    imagenBanner: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'imagen_banner',
    },
    imagenUrl: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: 'imagen_url',
    },
    precio: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    moneda: {
      type: DataTypes.STRING(3),
      defaultValue: 'ARS',
    },
    capacidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    linkExterno: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'link_externo',
    },
    linkTickets: {
      type: DataTypes.STRING(500),
      allowNull: true,
      field: 'link_tickets',
    },
    organizador: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    contactoEmail: {
      type: DataTypes.STRING(150),
      allowNull: true,
      field: 'contacto_email',
    },
    contactoTelefono: {
      type: DataTypes.STRING(20),
      allowNull: true,
      field: 'contacto_telefono',
    },
    destacado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    vistas: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    usuarioCreadorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'usuario_creador_id',
      references: {
        model: 'usuarios',
        key: 'id',
      },
    },
  },
  {
    sequelize,
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
  }
);

Evento.belongsTo(Categoria, {
  foreignKey: 'categoriaId',
  as: 'categoria',
});

Evento.belongsTo(Usuario, {
  foreignKey: 'usuarioCreadorId',
  as: 'usuarioCreador',
});

export default Evento;