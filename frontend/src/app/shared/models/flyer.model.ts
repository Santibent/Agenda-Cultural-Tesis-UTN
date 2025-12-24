export interface Flyer {
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
  createdAt: string;
  updatedAt: string;
}