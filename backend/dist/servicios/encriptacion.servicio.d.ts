/**
 * Servicio para encriptación y hashing
 */
export declare class EncriptacionServicio {
    private static readonly SALT_ROUNDS;
    /**
     * Hash de contraseña con bcrypt
     */
    static hashPassword(password: string): Promise<string>;
    /**
     * Comparar contraseña con hash
     */
    static compararPassword(password: string, hash: string): Promise<boolean>;
    /**
     * Generar token aleatorio
     */
    static generarToken(longitud?: number): string;
    /**
     * Generar código numérico aleatorio
     */
    static generarCodigoNumerico(longitud?: number): string;
    /**
     * Hash SHA256
     */
    static hashSHA256(texto: string): string;
}
//# sourceMappingURL=encriptacion.servicio.d.ts.map