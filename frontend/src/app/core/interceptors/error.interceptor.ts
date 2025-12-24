import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('Error HTTP:', error);

      if (error.status === 401) {
        authService.cerrarSesion();
        router.navigate(['/auth/login']);
      }

      if (error.status === 403) {
        console.error('Acceso prohibido');
      }

      return throwError(() => error);
    })
  );
};