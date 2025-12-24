import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import path from 'path';
import { configuracionServidor } from './config/servidor.config';
import { limitadorGeneral } from './middlewares/limitar-peticiones.middleware';
import { manejarErrores, rutaNoEncontrada } from './middlewares/error.middleware';
import rutas from './rutas';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configurarMiddlewares();
    this.configurarRutas();
    this.configurarManejadorErrores();
  }

  private configurarMiddlewares(): void {
    
    this.app.use(helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          imgSrc: ["'self'", 'data:', 'blob:', 'http:', 'https:'],
          mediaSrc: ["'self'", 'http:', 'https:'],
          styleSrc: ["'self'", "'unsafe-inline'", 'https:'],
          scriptSrc: ["'self'"],
          objectSrc: ["'none'"],
        },
      },
    }));

    this.app.use(cors({
      origin: configuracionServidor.urlFrontend,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    this.app.use(compression());

    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    if (configuracionServidor.esDesarrollo()) {
      this.app.use(morgan('dev'));
    } else {
      this.app.use(morgan('combined'));
    }

    this.app.use(limitadorGeneral);

    this.app.use(
      '/uploads',
      express.static(path.join(__dirname, '../uploads'))
    );

    this.app.use((_req: Request, res: Response, next) => {
      res.setHeader('X-Powered-By', 'Agenda Cultural API');
      res.setHeader('X-API-Version', configuracionServidor.versionApi);
      next();
    });
  }

  private configurarRutas(): void {
    
    this.app.get('/health', (_req: Request, res: Response) => {
      res.status(200).json({
        estado: 'OK',
        mensaje: 'Servidor funcionando correctamente',
        version: configuracionServidor.versionApi,
        entorno: configuracionServidor.entorno,
        timestamp: new Date().toISOString(),
      });
    });

    this.app.get('/', (_req: Request, res: Response) => {
      res.status(200).json({
        mensaje: 'API de Agenda Cultural',
        version: configuracionServidor.versionApi,
        documentacion: '/api/v1/docs',
        salud: '/health',
      });
    });

    this.app.use(`/api/${configuracionServidor.versionApi}`, rutas);

    this.app.use(rutaNoEncontrada);
  }

  private configurarManejadorErrores(): void {
    this.app.use(manejarErrores);
  }

  public obtenerApp(): Application {
    return this.app;
  }
}

export default new App().obtenerApp();