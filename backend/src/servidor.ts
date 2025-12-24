import app from './app';
import { configuracionServidor } from './config/servidor.config';
import { conectarBaseDatos } from './config/base-datos.config';

class Servidor {
  private puerto: number;

  constructor() {
    this.puerto = configuracionServidor.puerto;
  }

  private async inicializarServicios(): Promise<void> {
    try {
      
      await conectarBaseDatos();

      console.log('Servicios inicializados correctamente');
    } catch (error) {
      console.error('Error al inicializar servicios:', error);
      throw error;
    }
  }

  public async iniciar(): Promise<void> {
    try {
      
      await this.inicializarServicios();

      return new Promise<void>((_resolve, _reject) => {
        app.listen(this.puerto, () => {
          console.log('\n');
          console.log(`   SERVIDOR INICIADO `);
          console.log('  ');
          console.log(`   Entorno: ${configuracionServidor.entorno}`);
          console.log(`   URL: ${configuracionServidor.urlBackend}`);
          console.log(`   Puerto: ${this.puerto}`);
          console.log(`   API Version: ${configuracionServidor.versionApi}`);
          console.log(`   Uploads: ${configuracionServidor.almacenamiento.rutaSubida}`);
          console.log('   ========================================\n');

          if (configuracionServidor.esDesarrollo()) {
            console.log(' Endpoints disponibles:');
            console.log(`   - Health: ${configuracionServidor.urlBackend}/health`);
            console.log(`   - API: ${configuracionServidor.urlBackend}/api/${configuracionServidor.versionApi}`);
            console.log(`   - Uploads: ${configuracionServidor.urlBackend}/uploads\n`);
          }

        });
      });
    } catch (error) {
      console.error('Error al iniciar el servidor:', error);
      process.exit(1);
    }
  }

  private manejarCierre(): void {
    process.on('SIGTERM', () => {
      console.log('\n Cerrando servidor...');
      process.exit(0);
    });

    process.on('SIGINT', () => {
      console.log('\nCerrando servidor...');
      process.exit(0);
    });

    process.on('unhandledRejection', (error: Error) => {
      console.error('Promesa rechazada no manejada:', error);
      process.exit(1);
    });

    process.on('uncaughtException', (error: Error) => {
      console.error('Excepción no capturada:', error);
      process.exit(1);
    });
  }
}

const servidor = new Servidor();

servidor['manejarCierre']();

(async () => {
  try {
    await servidor.iniciar();
  } catch (error) {
    console.error('Error al iniciar:', error);
    process.exit(1);
  }
})();