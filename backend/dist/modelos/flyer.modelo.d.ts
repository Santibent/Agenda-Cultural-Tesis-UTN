import { Model, Optional } from 'sequelize';
import Evento from './evento.modelo';
/**
 * Interfaz de atributos del Flyer
 */
interface FlyerAtributos {
    id: number;
    titulo: string;
    descripcion: string | null;
    imagenUrl: string;
    imagenThumbnail: string | null;
    eventoRelacionadoId: number | null;
    etiquetas: string[] | null;
    orden: number;
    visible: boolean;
    destacado: boolean;
    vistas: number;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Atributos opcionales al crear un flyer
 */
interface FlyerCreacionAtributos extends Optional<FlyerAtributos, 'id' | 'descripcion' | 'imagenThumbnail' | 'eventoRelacionadoId' | 'etiquetas' | 'orden' | 'visible' | 'destacado' | 'vistas'> {
}
/**
 * Modelo de Flyer
 */
declare class Flyer extends Model<FlyerAtributos, FlyerCreacionAtributos> implements FlyerAtributos {
    id: number;
    titulo: string;
    descripcion: string | null;
    imagenUrl: string;
    imagenThumbnail: string | null;
    eventoRelacionadoId: number | null;
    etiquetas: string[] | null;
    orden: number;
    visible: boolean;
    destacado: boolean;
    vistas: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly eventoRelacionado?: Evento;
}
export default Flyer;
//# sourceMappingURL=flyer.modelo.d.ts.map