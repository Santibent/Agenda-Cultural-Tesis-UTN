import dotenv from 'dotenv';

dotenv.config();

export const configuracionServidor = {
  
  entorno: process.env.NODE_ENV || 'development',
  puerto: Number(process.env.PORT) || 3000,
  versionApi: process.env.API_VERSION || 'v1',

  urlFrontend: process.env.FRONTEND_URL || 'http://localhost:4200',
  urlBackend: process.env.BACKEND_URL || 'http://localhost:3000',

  baseDatos: {
    host: process.env.DB_HOST || 'localhost',
    puerto: Number(process.env.DB_PORT) || 3306,
    nombre: process.env.DB_NAME || 'agenda_cultural_db',
    usuario: process.env.DB_USER || 'agenda_user',
    password: process.env.DB_PASSWORD || '',
  },

  jwt: {
    secreto: process.env.JWT_SECRET || 'santi44179206',
    expiracion: Number(process.env.JWT_EXPIRES_IN) || (7 * 24 * 60 * 60), 
    expiracionRefresh: Number(process.env.JWT_REFRESH_EXPIRES_IN) || (30 * 24 * 60 * 60), 
  },

smtp: {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true' || false,
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.EMAIL_FROM || 'noreply@agendacultural.com',
},

  almacenamiento: {
    rutaSubida: process.env.UPLOAD_PATH || './uploads',
    tamanioMaximo: Number(process.env.MAX_FILE_SIZE) || 5242880, 
  },

  rateLimiting: {
    ventanaTiempo: Number(process.env.RATE_LIMIT_WINDOW) || 15, 
    maxPeticiones: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  },

  esDesarrollo: () => process.env.NODE_ENV === 'development',
  esProduccion: () => process.env.NODE_ENV === 'production',
};

export default configuracionServidor;