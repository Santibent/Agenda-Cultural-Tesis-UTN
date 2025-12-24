import { Model, Optional } from 'sequelize';
import { RolUsuario } from '../tipos/enums';
/**
 * Interfaz de atributos del Usuario
 */
interface UsuarioAtributos {
    id: number;
    nombre: string;
    email: string;
    password: string;
    rol: RolUsuario;
    emailVerificado: boolean;
    tokenVerificacion: string | null;
    tokenRecuperacion: string | null;
    tokenExpiracion: Date | null;
    avatarUrl: string | null;
    activo: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Atributos opcionales al crear un usuario
 */
interface UsuarioCreacionAtributos extends Optional<UsuarioAtributos, 'id' | 'rol' | 'emailVerificado' | 'tokenVerificacion' | 'tokenRecuperacion' | 'tokenExpiracion' | 'avatarUrl' | 'activo'> {
}
/**
 * Modelo de Usuario
 */
declare class Usuario extends Model<UsuarioAtributos, UsuarioCreacionAtributos> implements UsuarioAtributos {
    id: number;
    nombre: string;
    email: string;
    password: string;
    rol: RolUsuario;
    emailVerificado: boolean;
    tokenVerificacion: string | null;
    tokenRecuperacion: string | null;
    tokenExpiracion: Date | null;
    avatarUrl: string | null;
    activo: boolean;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    /**
     * Método para obtener el usuario sin campos sensibles
     */
    toJSON(): Partial<UsuarioAtributos>;
}
export default Usuario;
//# sourceMappingURL=usuario.modelo.d.ts.map