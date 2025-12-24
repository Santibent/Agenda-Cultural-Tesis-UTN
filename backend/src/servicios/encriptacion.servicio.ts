import bcrypt from 'bcrypt';
import crypto from 'crypto';

export class EncriptacionServicio {
  private static readonly SALT_ROUNDS = 10;

  static async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async compararPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  static generarToken(longitud: number = 32): string {
    return crypto.randomBytes(longitud).toString('hex');
  }

  static generarCodigoNumerico(longitud: number = 6): string {
    const min = Math.pow(10, longitud - 1);
    const max = Math.pow(10, longitud) - 1;
    return Math.floor(Math.random() * (max - min + 1) + min).toString();
  }

  static hashSHA256(texto: string): string {
    return crypto.createHash('sha256').update(texto).digest('hex');
  }
}