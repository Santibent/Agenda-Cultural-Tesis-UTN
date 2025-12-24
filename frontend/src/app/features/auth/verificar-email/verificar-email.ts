import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-verificar-email',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './verificar-email.component.html',
  styleUrl: './verificar-email.component.scss'
})
export class VerificarEmailComponent implements OnInit {
  verificando = signal<boolean>(true);
  exito = signal<boolean>(false);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.verificando.set(false);
      this.error.set('Token de verificación no válido');
      return;
    }

    this.authService.verificarEmail(token).subscribe({
      next: (response) => {
        this.verificando.set(false);
        
        if (response.exito) {
          this.exito.set(true);

          setTimeout(() => {
            this.router.navigate(['/']);
          }, 3000);
        } else {
          this.error.set(response.mensaje || 'Error al verificar el email');
        }
      },
      error: (error) => {
        this.verificando.set(false);
        this.error.set(
          error.error?.mensaje || 'Error al verificar el email. Por favor intenta nuevamente.'
        );
      }
    });
  }
}
