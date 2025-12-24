import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/base-datos.config';

interface CategoriaAtributos {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  color: string;
  icono: string | null;
  activo: boolean;
  orden: number;
  createdAt?: Date;
  updatedAt?: Date;
}

interface CategoriaCreacionAtributos extends Optional<CategoriaAtributos, 'id' | 'descripcion' | 'icono' | 'activo' | 'orden'> {}

class Categoria extends Model<CategoriaAtributos, CategoriaCreacionAtributos> implements CategoriaAtributos {
  declare id: number;
  declare nombre: string;
  declare slug: string;
  declare descripcion: string | null;
  declare color: string;
  declare icono: string | null;
  declare activo: boolean;
  declare orden: number;

  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

Categoria.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: false,
      defaultValue: '#FF0000',
      validate: {
        is: /^#[0-9A-F]{6}$/i,
      },
    },
    icono: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    orden: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    sequelize,
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
  }
);

export default Categoria;