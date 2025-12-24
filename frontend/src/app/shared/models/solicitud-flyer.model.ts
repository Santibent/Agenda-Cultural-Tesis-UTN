export type EstadoSolicitud = 'pendiente' | 'revisando' | 'en_proceso' | 'completado' | 'rechazado' | 'cancelado';
export type PrioridadSolicitud = 'baja' | 'media' | 'alta' | 'urgente';

export interface SolicitudFlyer {
  id: number;
  usuarioId: number;
  usuario?: { id: number; nombre: string; email: string };
  nombreEvento: string;
  tipoEvento: string | null;
  fechaEvento: string | null;
  descripcion: string;
  referencias: string | null;
  coloresPreferidos: string | null;
  estiloPreferido: string | null;
  informacionIncluir: string | null;
  presupuesto: number | null;
  contactoEmail: string;
  contactoTelefono: string | null;
  contactoWhatsapp: string | null;
  fechaLimite: string | null;
  estado: EstadoSolicitud;
  prioridad: PrioridadSolicitud;
  notasAdmin: string | null;
  archivoResultado: string | null;
  fechaCompletado: string | null;
  calificacion: number | null;
  comentarioUsuario: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SolicitudFlyerCrear {
  nombreEvento: string;
  tipoEvento?: string;
  fechaEvento?: string;
  descripcion: string;
  referencias?: string;
  coloresPreferidos?: string;
  estiloPreferido?: string;
  informacionIncluir?: string;
  presupuesto?: number;
  contactoEmail: string;
  contactoTelefono?: string;
  contactoWhatsapp?: string;
  fechaLimite?: string;
}