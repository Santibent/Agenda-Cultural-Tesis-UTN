import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getApiUrl } from '../constants';
import { ApiResponse } from '../../shared/interfaces';
import { Flyer } from '../../shared/models';

@Injectable({
  providedIn: 'root'
})
export class FlyersService {
  constructor(private http: HttpClient) {}

  listar(): Observable<ApiResponse<Flyer[]>> {
    return this.http.get<ApiResponse<Flyer[]>>(getApiUrl('/flyers'));
  }

  obtenerDestacados(): Observable<ApiResponse<Flyer[]>> {
    return this.http.get<ApiResponse<Flyer[]>>(getApiUrl('/flyers/destacados'));
  }

  obtenerGaleria(): Observable<ApiResponse<Flyer[]>> {
    return this.http.get<ApiResponse<Flyer[]>>(getApiUrl('/flyers/galeria'));
  }

  obtenerPorId(id: number): Observable<ApiResponse<Flyer>> {
    return this.http.get<ApiResponse<Flyer>>(getApiUrl(`/flyers/${id}`));
  }

  crear(formData: FormData): Observable<ApiResponse<Flyer>> {
    return this.http.post<ApiResponse<Flyer>>(getApiUrl('/flyers'), formData);
  }

  actualizar(id: number, formData: FormData): Observable<ApiResponse<Flyer>> {
    return this.http.put<ApiResponse<Flyer>>(getApiUrl(`/flyers/${id}`), formData);
  }

  eliminar(id: number): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(getApiUrl(`/flyers/${id}`));
  }
}