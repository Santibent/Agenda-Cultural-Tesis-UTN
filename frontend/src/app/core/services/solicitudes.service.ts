import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiUrl } from '../constants';
import { ApiResponse } from '../../shared/interfaces';
import { SolicitudFlyer, SolicitudFlyerCrear } from '../../shared/models';

export interface FiltrosSolicitudes {
  estado?: string;
  prioridad?: string;
  pagina?: number;
  limite?: number;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudesService {
  constructor(private http: HttpClient) {}

  listarMisSolicitudes(): Observable<ApiResponse<SolicitudFlyer[]>> {
    return this.http.get<ApiResponse<SolicitudFlyer[]>>(getApiUrl('/solicitudes'));
  }

  listarTodas(filtros?: FiltrosSolicitudes): Observable<ApiResponse<SolicitudFlyer[]>> {
    let params = new HttpParams();

    if (filtros) {
      Object.keys(filtros).forEach(key => {
        const valor = (filtros as any)[key];
        if (valor !== undefined && valor !== null) {
          params = params.set(key, valor.toString());
        }
      });
    }

    return this.http.get<ApiResponse<SolicitudFlyer[]>>(getApiUrl('/solicitudes'), { params });
  }

  obtenerPorId(id: number): Observable<ApiResponse<SolicitudFlyer>> {
    return this.http.get<ApiResponse<SolicitudFlyer>>(getApiUrl(`/solicitudes/${id}`));
  }

  crear(solicitud: SolicitudFlyerCrear): Observable<ApiResponse<SolicitudFlyer>> {
    return this.http.post<ApiResponse<SolicitudFlyer>>(getApiUrl('/solicitudes'), solicitud);
  }

  actualizar(id: number, solicitud: Partial<SolicitudFlyerCrear>): Observable<ApiResponse<SolicitudFlyer>> {
    return this.http.put<ApiResponse<SolicitudFlyer>>(getApiUrl(`/solicitudes/${id}`), solicitud);
  }

  cancelar(id: number): Observable<ApiResponse> {
    return this.http.patch<ApiResponse>(getApiUrl(`/solicitudes/${id}/cancelar`), {});
  }

  calificar(id: number, calificacion: number, comentario: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(getApiUrl(`/solicitudes/${id}/calificar`), {
      calificacion,
      comentarioUsuario: comentario
    });
  }

  obtenerEstadisticas(): Observable<ApiResponse<any>> {
    return this.http.get<ApiResponse<any>>(getApiUrl('/solicitudes/estadisticas'));
  }

  actualizarEstado(id: number, estado: string, prioridad?: string, notasAdmin?: string): Observable<ApiResponse<SolicitudFlyer>> {
    return this.http.patch<ApiResponse<SolicitudFlyer>>(getApiUrl(`/solicitudes/${id}/estado`), {
      estado,
      prioridad,
      notasAdmin
    });
  }

  eliminar(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(getApiUrl(`/solicitudes/${id}`));
  }
}