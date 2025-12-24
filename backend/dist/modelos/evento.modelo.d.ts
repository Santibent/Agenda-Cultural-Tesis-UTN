import { Model, Optional } from 'sequelize';
import Categoria from './categoria.modelo';
import Usuario from './usuario.modelo';
/**
 * Interfaz de atributos del Evento
 */
interface EventoAtributos {
    id: number;
    titulo: string;
    slug: string;
    descripcion: string;
    descripcionCorta: string | null;
    categoriaId: number;
    fechaInicio: Date;
    fechaFin: Date | null;
    horaInicio: string | null;
    horaFin: string | null;
    ubicacion: string;
    direccion: string | null;
    ciudad: string;
    provincia: string;
    pais: string;
    latitud: number | null;
    longitud: number | null;
    imagenPrincipal: string | null;
    imagenBanner: string | null;
    imagenUrl: string | null;
    precio: number;
    moneda: string;
    capacidad: number | null;
    linkExterno: string | null;
    linkTickets: string | null;
    organizador: string | null;
    contactoEmail: string | null;
    contactoTelefono: string | null;
    destacado: boolean;
    activo: boolean;
    vistas: number;
    usuarioCreadorId: number;
    createdAt?: Date;
    updatedAt?: Date;
}
/**
 * Atributos opcionales al crear un evento
 */
interface EventoCreacionAtributos extends Optional<EventoAtributos, 'id' | 'slug' | 'descripcionCorta' | 'fechaFin' | 'horaInicio' | 'horaFin' | 'direccion' | 'latitud' | 'longitud' | 'imagenPrincipal' | 'imagenBanner' | 'imagenUrl' | 'capacidad' | 'linkExterno' | 'linkTickets' | 'organizador' | 'contactoEmail' | 'contactoTelefono' | 'destacado' | 'activo' | 'vistas'> {
}
/**
 * Modelo de Evento
 */
declare class Evento extends Model<EventoAtributos, EventoCreacionAtributos> implements EventoAtributos {
    id: number;
    titulo: string;
    slug: string;
    descripcion: string;
    descripcionCorta: string | null;
    categoriaId: number;
    fechaInicio: Date;
    fechaFin: Date | null;
    horaInicio: string | null;
    horaFin: string | null;
    ubicacion: string;
    direccion: string | null;
    ciudad: string;
    provincia: string;
    pais: string;
    latitud: number | null;
    longitud: number | null;
    imagenPrincipal: string | null;
    imagenBanner: string | null;
    imagenUrl: string | null;
    precio: number;
    moneda: string;
    capacidad: number | null;
    linkExterno: string | null;
    linkTickets: string | null;
    organizador: string | null;
    contactoEmail: string | null;
    contactoTelefono: string | null;
    destacado: boolean;
    activo: boolean;
    vistas: number;
    usuarioCreadorId: number;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    readonly categoria?: Categoria;
    readonly usuarioCreador?: Usuario;
}
export default Evento;
//# sourceMappingURL=evento.modelo.d.ts.map