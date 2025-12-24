/**
 * Rate limiter general para toda la API
 */
export declare const limitadorGeneral: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Rate limiter estricto para autenticación (evitar fuerza bruta)
 */
export declare const limitadorAutenticacion: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Rate limiter para creación de recursos
 */
export declare const limitadorCreacion: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Rate limiter para registro de usuarios
 */
export declare const limitadorRegistro: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Rate limiter para recuperación de contraseña
 */
export declare const limitadorRecuperacion: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Rate limiter para envío de emails
 */
export declare const limitadorEmails: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=limitar-peticiones.middleware.d.ts.map