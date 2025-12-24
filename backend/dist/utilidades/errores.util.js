"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorServidor = exports.ErrorConflicto = exports.ErrorNoEncontrado = exports.ErrorAutorizacion = exports.ErrorAutenticacion = exports.ErrorValidacion = exports.ErrorPersonalizado = void 0;
/**
 * Clase base para errores personalizados
 */
class ErrorPersonalizado extends Error {
    codigoEstado;
    codigo;
    detalles;
    constructor(mensaje, codigoEstado, codigo, detalles) {
        super(mensaje);
        this.codigoEstado = codigoEstado;
        this.codigo = codigo;
        this.detalles = detalles;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ErrorPersonalizado = ErrorPersonalizado;
/**
 * Error de validación
 */
class ErrorValidacion extends ErrorPersonalizado {
    constructor(mensaje = 'Error de validación', detalles) {
        super(mensaje, 422, 'VALIDATION_ERROR', detalles);
    }
}
exports.ErrorValidacion = ErrorValidacion;
/**
 * Error de autenticación
 */
class ErrorAutenticacion extends ErrorPersonalizado {
    constructor(mensaje = 'No autorizado') {
        super(mensaje, 401, 'UNAUTHORIZED');
    }
}
exports.ErrorAutenticacion = ErrorAutenticacion;
/**
 * Error de autorización
 */
class ErrorAutorizacion extends ErrorPersonalizado {
    constructor(mensaje = 'Acceso prohibido') {
        super(mensaje, 403, 'FORBIDDEN');
    }
}
exports.ErrorAutorizacion = ErrorAutorizacion;
/**
 * Error de recurso no encontrado
 */
class ErrorNoEncontrado extends ErrorPersonalizado {
    constructor(mensaje = 'Recurso no encontrado') {
        super(mensaje, 404, 'NOT_FOUND');
    }
}
exports.ErrorNoEncontrado = ErrorNoEncontrado;
/**
 * Error de conflicto
 */
class ErrorConflicto extends ErrorPersonalizado {
    constructor(mensaje = 'Conflicto con el estado actual') {
        super(mensaje, 409, 'CONFLICT');
    }
}
exports.ErrorConflicto = ErrorConflicto;
/**
 * Error del servidor
 */
class ErrorServidor extends ErrorPersonalizado {
    constructor(mensaje = 'Error interno del servidor', detalles) {
        super(mensaje, 500, 'INTERNAL_SERVER_ERROR', detalles);
    }
}
exports.ErrorServidor = ErrorServidor;
//# sourceMappingURL=errores.util.js.map