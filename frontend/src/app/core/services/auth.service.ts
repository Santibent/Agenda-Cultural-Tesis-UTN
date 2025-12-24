import { Injectable, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap, catchError, of } from 'rxjs';
import { getApiUrl } from '../constants';
import { Usuario, ApiResponse } from '../../shared/models';

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  nombre: string;
  email: string;
  password: string;
  confirmarPassword: string;
}

interface AuthResponse {
  usuario: Usuario;
  tokens: {
    acceso: string;
    refresco: string;
  };
  emailVerificado?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = getApiUrl('/auth');

  usuario = signal<Usuario | null>(null);
  estaAutenticado = computed(() => this.usuario() !== null);
  esAdmin = computed(() => this.usuario()?.rol === 'admin');

  private usuarioSubject = new BehaviorSubject<Usuario | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    this.cargarUsuarioDesdeLocalStorage();

    effect(() => {
      this.usuarioSubject.next(this.usuario());
    });
  }

  private cargarUsuarioDesdeLocalStorage(): void {
    const token = localStorage.getItem('token');
    const usuarioGuardado = localStorage.getItem('usuario');
    
    if (token && usuarioGuardado) {
      try {
        const usuario = JSON.parse(usuarioGuardado);
        this.usuario.set(usuario);
      } catch (error) {
        console.error('Error al cargar usuario:', error);
        this.cerrarSesion();
      }
    }
  }

  registro(data: RegisterData): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/registro`, data);
  }

  login(credentials: LoginCredentials): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response.exito && response.datos) {
            this.guardarSesion(response.datos);
          }
        })
      );
  }

  verificarEmail(token: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(`${this.apiUrl}/verificar-email`, { token })
      .pipe(
        tap(response => {
          if (response.exito && response.datos && response.datos.tokens) {
            this.guardarSesion(response.datos);
          }
        })
      );
  }

  reenviarVerificacion(email: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/reenviar-verificacion`, { email });
  }

  recuperarPassword(email: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/recuperar-password`, { email });
  }

  restablecerPassword(token: string, password: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/restablecer-password`, { 
      token, 
      password 
    });
  }

  cambiarPassword(passwordActual: string, passwordNueva: string): Observable<ApiResponse<any>> {
    return this.http.post<ApiResponse<any>>(`${this.apiUrl}/cambiar-password`, {
      passwordActual,
      passwordNueva
    });
  }

  obtenerPerfil(): Observable<ApiResponse<Usuario>> {
    return this.http.get<ApiResponse<Usuario>>(`${this.apiUrl}/perfil`)
      .pipe(
        tap(response => {
          if (response.exito && response.datos) {
            this.usuario.set(response.datos);
            localStorage.setItem('usuario', JSON.stringify(response.datos));
          }
        }),
        catchError(error => {
          if (error.status === 401) {
            this.cerrarSesion();
          }
          throw error;
        })
      );
  }

  actualizarPerfil(data: Partial<Usuario>): Observable<ApiResponse<Usuario>> {
    return this.http.put<ApiResponse<Usuario>>(`${this.apiUrl}/perfil`, data)
      .pipe(
        tap(response => {
          if (response.exito && response.datos) {
            this.usuario.set(response.datos);
            localStorage.setItem('usuario', JSON.stringify(response.datos));
          }
        })
      );
  }

  refrescarToken(): Observable<ApiResponse<{ acceso: string }>> {
    const tokenRefresco = localStorage.getItem('refreshToken');
    
    if (!tokenRefresco) {
      return of({ exito: false, mensaje: 'No hay token de refresco' } as any);
    }

    return this.http.post<ApiResponse<{ acceso: string }>>(`${this.apiUrl}/refresh-token`, {
      tokenRefresco
    }).pipe(
      tap(response => {
        if (response.exito && response.datos) {
          localStorage.setItem('token', response.datos.acceso);
        }
      })
    );
  }

  private guardarSesion(data: AuthResponse): void {
    localStorage.setItem('token', data.tokens.acceso);
    localStorage.setItem('refreshToken', data.tokens.refresco);
    localStorage.setItem('usuario', JSON.stringify(data.usuario));
    this.usuario.set(data.usuario);
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('usuario');
    this.usuario.set(null);
    this.router.navigate(['/auth/login']);
  }

  tieneToken(): boolean {
    return !!localStorage.getItem('token');
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }
}