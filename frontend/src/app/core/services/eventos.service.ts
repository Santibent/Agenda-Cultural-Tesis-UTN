import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiUrl } from '../constants';
import { ApiResponse } from '../../shared/interfaces';
import { Evento, EventoCrear, Categoria } from '../../shared/models';

export interface FiltrosEventos {
  pagina?: number;
  limite?: number;
  categoriaId?: number;
  destacado?: boolean;
  ciudad?: string;
  fechaDesde?: string;
  fechaHasta?: string;
  busqueda?: string;
  ordenarPor?: string;
  orden?: 'ASC' | 'DESC';
}

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  constructor(private http: HttpClient) {}

  listar(filtros?: FiltrosEventos): Observable<ApiResponse<Evento[]>> {
    let params = new HttpParams();

    if (filtros) {
      Object.keys(filtros).forEach(key => {
        const valor = (filtros as any)[key];
        if (valor !== undefined && valor !== null) {
          params = params.set(key, valor.toString());
        }
      });
    }

    return this.http.get<ApiResponse<Evento[]>>(getApiUrl('/eventos'), { params });
  }

  obtenerPorId(idOSlug: string | number): Observable<ApiResponse<Evento>> {
    return this.http.get<ApiResponse<Evento>>(getApiUrl(`/eventos/${idOSlug}`));
  }

  obtenerDestacados(limite: number = 6): Observable<ApiResponse<Evento[]>> {
    const params = new HttpParams().set('limite', limite.toString());
    return this.http.get<ApiResponse<Evento[]>>(getApiUrl('/eventos/destacados'), { params });
  }

  obtenerProximos(limite: number = 10): Observable<ApiResponse<Evento[]>> {
    const params = new HttpParams().set('limite', limite.toString());
    return this.http.get<ApiResponse<Evento[]>>(getApiUrl('/eventos/proximos'), { params });
  }

  crear(evento: EventoCrear | FormData): Observable<ApiResponse<Evento>> {
    return this.http.post<ApiResponse<Evento>>(getApiUrl('/eventos'), evento);
  }

  actualizar(id: number, evento: Partial<EventoCrear> | FormData): Observable<ApiResponse<Evento>> {
    return this.http.put<ApiResponse<Evento>>(getApiUrl(`/eventos/${id}`), evento);
  }

  crearConImagen(formData: FormData): Observable<ApiResponse<Evento>> {
    return this.http.post<ApiResponse<Evento>>(getApiUrl('/eventos'), formData);
  }

  actualizarConImagen(id: number, formData: FormData): Observable<ApiResponse<Evento>> {
    return this.http.put<ApiResponse<Evento>>(getApiUrl(`/eventos/${id}`), formData);
  }

  eliminar(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(getApiUrl(`/eventos/${id}`));
  }
}