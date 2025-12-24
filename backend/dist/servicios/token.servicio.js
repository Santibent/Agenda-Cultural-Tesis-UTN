"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenServicio = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const servidor_config_1 = require("../config/servidor.config");
/**
 * Servicio para manejo de tokens JWT
 */
class TokenServicio {
    /**
     * Generar token de acceso
     */
    static generarTokenAcceso(payload) {
        const options = {
            expiresIn: servidor_config_1.configuracionServidor.jwt.expiracion,
        };
        return jsonwebtoken_1.default.sign(payload, servidor_config_1.configuracionServidor.jwt.secreto, options);
    }
    /**
     * Generar token de refresco
     */
    static generarTokenRefresco(payload) {
        const options = {
            expiresIn: servidor_config_1.configuracionServidor.jwt.expiracionRefresh,
        };
        return jsonwebtoken_1.default.sign({ id: payload.id, email: payload.email }, servidor_config_1.configuracionServidor.jwt.secreto, options);
    }
    /**
     * Verificar y decodificar token
     */
    static verificarToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, servidor_config_1.configuracionServidor.jwt.secreto);
        }
        catch (error) {
            throw new Error('Token inválido o expirado');
        }
    }
    /**
     * Decodificar token sin verificar (útil para debug)
     */
    static decodificarToken(token) {
        return jsonwebtoken_1.default.decode(token);
    }
    /**
     * Extraer token del header Authorization
     */
    static extraerTokenDeHeader(authHeader) {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return null;
        }
        return authHeader.substring(7);
    }
}
exports.TokenServicio = TokenServicio;
//# sourceMappingURL=token.servicio.js.map