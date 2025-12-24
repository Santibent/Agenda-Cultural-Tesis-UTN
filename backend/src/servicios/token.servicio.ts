import jwt, { SignOptions } from 'jsonwebtoken';
import { configuracionServidor } from '../config/servidor.config';
import { RolUsuario } from '../tipos/enums';

export interface TokenPayload {
  id: number;
  email: string;
  rol: RolUsuario;
  nombre: string;
}

export class TokenServicio {
  
  static generarTokenAcceso(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: configuracionServidor.jwt.expiracion,
    };

    return jwt.sign(
      payload,
      configuracionServidor.jwt.secreto,
      options
    );
  }

  static generarTokenRefresco(payload: TokenPayload): string {
    const options: SignOptions = {
      expiresIn: configuracionServidor.jwt.expiracionRefresh,
    };

    return jwt.sign(
      { id: payload.id, email: payload.email },
      configuracionServidor.jwt.secreto,
      options
    );
  }

  static verificarToken(token: string): TokenPayload {
    try {
      return jwt.verify(token, configuracionServidor.jwt.secreto) as TokenPayload;
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  static decodificarToken(token: string): any {
    return jwt.decode(token);
  }

  static extraerTokenDeHeader(authHeader: string | undefined): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    return authHeader.substring(7);
  }
}