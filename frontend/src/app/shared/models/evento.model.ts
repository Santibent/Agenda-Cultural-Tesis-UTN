export interface Evento {
  id: number;
  titulo: string;
  slug: string;
  descripcion: string;
  descripcionCorta: string | null;
  categoriaId: number;
  categoria?: Categoria;
  fechaInicio: string;
  fechaFin: string | null;
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
  imagenUrl?: string | null;
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
  createdAt: string;
  updatedAt: string;
}

export interface EventoCrear {
  titulo: string;
  descripcion: string;
  descripcionCorta?: string;
  categoriaId: number;
  fechaInicio: string;
  fechaFin?: string;
  horaInicio?: string;
  horaFin?: string;
  ubicacion: string;
  direccion?: string;
  ciudad?: string;
  provincia?: string;
  pais?: string;
  precio?: number;
  capacidad?: number;
  linkExterno?: string;
  linkTickets?: string;
  organizador?: string;
  contactoEmail?: string;
  contactoTelefono?: string;
  destacado?: boolean;
  activo?: boolean;
}

export interface Categoria {
  id: number;
  nombre: string;
  slug: string;
  descripcion: string | null;
  color: string;
  icono: string | null;
  activo: boolean;
  orden: number;
}