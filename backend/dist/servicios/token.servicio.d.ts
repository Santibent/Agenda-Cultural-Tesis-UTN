import { RolUsuario } from '../tipos/enums';
/**
 * Payload del token JWT
 */
export interface TokenPayload {
    id: number;
    email: string;
    rol: RolUsuario;
    nombre: string;
}
/**
 * Servicio para manejo de tokens JWT
 */
export declare class TokenServicio {
    /**
     * Generar token de acceso
     */
    static generarTokenAcceso(payload: TokenPayload): string;
    /**
     * Generar token de refresco
     */
    static generarTokenRefresco(payload: TokenPayload): string;
    /**
     * Verificar y decodificar token
     */
    static verificarToken(token: string): TokenPayload;
    /**
     * Decodificar token sin verificar (útil para debug)
     */
    static decodificarToken(token: string): any;
    /**
     * Extraer token del header Authorization
     */
    static extraerTokenDeHeader(authHeader: string | undefined): string | null;
}
//# sourceMappingURL=token.servicio.d.ts.map