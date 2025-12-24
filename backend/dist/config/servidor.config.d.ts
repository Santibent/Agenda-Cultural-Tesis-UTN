/**
 * Configuración centralizada del servidor
 */
export declare const configuracionServidor: {
    entorno: string;
    puerto: number;
    versionApi: string;
    urlFrontend: string;
    urlBackend: string;
    baseDatos: {
        host: string;
        puerto: number;
        nombre: string;
        usuario: string;
        password: string;
    };
    jwt: {
        secreto: string;
        expiracion: number;
        expiracionRefresh: number;
    };
    smtp: {
        host: string;
        port: number;
        secure: boolean;
        user: string;
        pass: string;
        from: string;
    };
    almacenamiento: {
        rutaSubida: string;
        tamanioMaximo: number;
    };
    rateLimiting: {
        ventanaTiempo: number;
        maxPeticiones: number;
    };
    esDesarrollo: () => boolean;
    esProduccion: () => boolean;
};
export default configuracionServidor;
//# sourceMappingURL=servidor.config.d.ts.map