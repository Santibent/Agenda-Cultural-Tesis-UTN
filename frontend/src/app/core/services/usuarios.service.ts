import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiUrl } from '../constants';
import { Usuario, ApiResponse } from '../../shared/models';

export interface UsuariosListadoParams {
  pagina?: number;
  limite?: number;
  busqueda?: string;
  rol?: 'admin' | 'usuario';
  activo?: boolean;
  emailVerificado?: boolean;
  ordenarPor?: string;
  orden?: 'ASC' | 'DESC';
}

export interface UsuarioActualizacion {
  nombre?: string;
  email?: string;
  password?: string;
  rol?: 'admin' | 'usuario';
  activo?: boolean;
}

export interface EstadisticasUsuarios {
  total: number;
  activos: number;
  inactivos: number;
  verificados: number;
  noVerificados: number;
  porRol: {
    admins: number;
    usuarios: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private readonly apiUrl = getApiUrl('/usuarios');

  constructor(private http: HttpClient) {}

  listar(params: UsuariosListadoParams = {}): Observable<ApiResponse<Usuario[]>> {
    let httpParams = new HttpParams();

    Object.keys(params).forEach(key => {
      const value = (params as any)[key];
      if (value !== undefined && value !== null) {
        httpParams = httpParams.set(key, value.toString());
      }
    });

    return this.http.get<ApiResponse<Usuario[]>>(this.apiUrl, { params: httpParams });
  }

  obtenerPorId(id: number): Observable<ApiResponse<Usuario>> {
    return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`);
  }

  actualizar(id: number, data: UsuarioActualizacion): Observable<ApiResponse<Usuario>> {
    return this.http.put<ApiResponse<Usuario>>(`${this.apiUrl}/${id}`, data);
  }

  eliminar(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.apiUrl}/${id}`);
  }

  reactivar(id: number): Observable<ApiResponse<Usuario>> {
    return this.http.patch<ApiResponse<Usuario>>(`${this.apiUrl}/${id}/reactivar`, {});
  }

  cambiarRol(id: number, rol: 'admin' | 'usuario'): Observable<ApiResponse<Usuario>> {
    return this.http.patch<ApiResponse<Usuario>>(`${this.apiUrl}/${id}/cambiar-rol`, { rol });
  }

  obtenerEstadisticas(): Observable<ApiResponse<EstadisticasUsuarios>> {
    return this.http.get<ApiResponse<EstadisticasUsuarios>>(`${this.apiUrl}/estadisticas`);
  }
}
