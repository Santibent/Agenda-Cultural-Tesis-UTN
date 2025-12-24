import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'agenda_cultural_db',
  process.env.DB_USER || 'agenda_user',
  process.env.DB_PASSWORD || 'agenda_password_2024',
  {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    dialectOptions: {
      charset: 'utf8mb4',
    },
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    timezone: '-03:00', 
    define: {
      timestamps: true,
      underscored: true, 
      freezeTableName: true, 
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);

export const conectarBaseDatos = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a MySQL establecida correctamente');
    
    if (process.env.NODE_ENV === 'development') {

      console.log('📊 Modelos sincronizados con la base de datos');
    }
  } catch (error) {
    console.error('❌ Error al conectar con MySQL:', error);
    process.exit(1);
  }
};

export default sequelize;