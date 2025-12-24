/**
 * Clase base para errores personalizados
 */
export declare class ErrorPersonalizado extends Error {
    codigoEstado: number;
    codigo: string;
    detalles?: any;
    constructor(mensaje: string, codigoEstado: number, codigo: string, detalles?: any);
}
/**
 * Error de validación
 */
export declare class ErrorValidacion extends ErrorPersonalizado {
    constructor(mensaje?: string, detalles?: any);
}
/**
 * Error de autenticación
 */
export declare class ErrorAutenticacion extends ErrorPersonalizado {
    constructor(mensaje?: string);
}
/**
 * Error de autorización
 */
export declare class ErrorAutorizacion extends ErrorPersonalizado {
    constructor(mensaje?: string);
}
/**
 * Error de recurso no encontrado
 */
export declare class ErrorNoEncontrado extends ErrorPersonalizado {
    constructor(mensaje?: string);
}
/**
 * Error de conflicto
 */
export declare class ErrorConflicto extends ErrorPersonalizado {
    constructor(mensaje?: string);
}
/**
 * Error del servidor
 */
export declare class ErrorServidor extends ErrorPersonalizado {
    constructor(mensaje?: string, detalles?: any);
}
//# sourceMappingURL=errores.util.d.ts.map