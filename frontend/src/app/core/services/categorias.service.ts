import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { getApiUrl } from '../constants';
import { ApiResponse } from '../../shared/interfaces';
import { Categoria } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class CategoriasService {
  
  private categoriasSignal = signal<Categoria[]>([]);
  public categorias = this.categoriasSignal.asReadonly();

  constructor(private http: HttpClient) {}

  listar(activo?: boolean): Observable<ApiResponse<Categoria[]>> {
    const url = activo !== undefined 
      ? getApiUrl(`/categorias?activo=${activo}`)
      : getApiUrl('/categorias');

    return this.http.get<ApiResponse<Categoria[]>>(url).pipe(
      tap(response => {
        if (response.exito && response.datos) {
          this.categoriasSignal.set(response.datos);
        }
      })
    );
  }

  obtenerPorId(idOSlug: string | number): Observable<ApiResponse<Categoria>> {
    return this.http.get<ApiResponse<Categoria>>(getApiUrl(`/categorias/${idOSlug}`));
  }

  listarConEventos(): Observable<ApiResponse<Categoria[]>> {
    return this.http.get<ApiResponse<Categoria[]>>(getApiUrl('/categorias/con-eventos'));
  }

  crear(categoria: Partial<Categoria>): Observable<ApiResponse<Categoria>> {
    return this.http.post<ApiResponse<Categoria>>(getApiUrl('/categorias'), categoria);
  }

  actualizar(id: number, categoria: Partial<Categoria>): Observable<ApiResponse<Categoria>> {
    return this.http.put<ApiResponse<Categoria>>(getApiUrl(`/categorias/${id}`), categoria);
  }

  eliminar(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(getApiUrl(`/categorias/${id}`));
  }
}