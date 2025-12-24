"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncriptacionServicio = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
/**
 * Servicio para encriptación y hashing
 */
class EncriptacionServicio {
    static SALT_ROUNDS = 10;
    /**
     * Hash de contraseña con bcrypt
     */
    static async hashPassword(password) {
        return await bcrypt_1.default.hash(password, this.SALT_ROUNDS);
    }
    /**
     * Comparar contraseña con hash
     */
    static async compararPassword(password, hash) {
        return await bcrypt_1.default.compare(password, hash);
    }
    /**
     * Generar token aleatorio
     */
    static generarToken(longitud = 32) {
        return crypto_1.default.randomBytes(longitud).toString('hex');
    }
    /**
     * Generar código numérico aleatorio
     */
    static generarCodigoNumerico(longitud = 6) {
        const min = Math.pow(10, longitud - 1);
        const max = Math.pow(10, longitud) - 1;
        return Math.floor(Math.random() * (max - min + 1) + min).toString();
    }
    /**
     * Hash SHA256
     */
    static hashSHA256(texto) {
        return crypto_1.default.createHash('sha256').update(texto).digest('hex');
    }
}
exports.EncriptacionServicio = EncriptacionServicio;
//# sourceMappingURL=encriptacion.servicio.js.map