import { Model, Optional } from 'sequelize';
import Usuario from './usuario.modelo';
import { EstadoSolicitudFlyer, PrioridadSolicitud } from '../tipos/enums';
/**
 * Interfaz de atributos de SolicitudFlyer
 */
interface SolicitudFlyerAtributos {
    id: number;
    usuarioId: number;
    nombreEvento: string;
    tipoEvento: string | null;
    fechaEvento: Date | null;
    descripcion: string;
    referencias: string | null;
    coloresPreferidos: string | null;
    estiloPreferido: string | null;
    informacionIncluir: string | null;
    presupuesto: number | null;
    contactoEmail: string;
    contactoTelefono: string | null;
    contactoWhatsapp: string | null;
    fechaLimite: Date | null;
    estado: EstadoSolicitudFlyer;
    prioridad: PrioridadSolicitud;
    notasAdmin: string | null;
    archivoResultado: string | null;
    fechaCompletado: Date | null;
    calificacion: number | null;
    comentarioUsuario: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Atributos opcionales al crear una solicitud
 */
interface SolicitudFlyerCreacionAtributos extends Optional<SolicitudFlyerAtributos, 'id' | 'tipoEvento' | 'fechaEvento' | 'referencias' | 'coloresPreferidos' | 'estiloPreferido' | 'informacionIncluir' | 'presupuesto' | 'contactoTelefono' | 'contactoWhatsapp' | 'fechaLimite' | 'estado' | 'prioridad' | 'notasAdmin' | 'archivoResultado' | 'fechaCompletado' | 'calificacion' | 'comentarioUsuario'> {
}
/**
 * Modelo de SolicitudFlyer
 */
declare class SolicitudFlyer extends Model<SolicitudFlyerAtributos, SolicitudFlyerCreacionAtributos> implements SolicitudFlyerAtributos {
    id: number;
    usuarioId: number;
    nombreEvento: string;
    tipoEvento: string | null;
    fechaEvento: Date | null;
    descripcion: string;
    referencias: string | null;
    coloresPreferidos: string | null;
    estiloPreferido: string | null;
    informacionIncluir: string | null;
    presupuesto: number | null;
    contactoEmail: string;
    contactoTelefono: string | null;
    contactoWhatsapp: string | null;
    fechaLimite: Date | null;
    estado: EstadoSolicitudFlyer;
    prioridad: PrioridadSolicitud;
    notasAdmin: string | null;
    archivoResultado: string | null;
    fechaCompletado: Date | null;
    calificacion: number | null;
    comentarioUsuario: string | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly usuario?: Usuario;
}
export default SolicitudFlyer;
//# sourceMappingURL=solicitud-flyer.modelo.d.ts.map