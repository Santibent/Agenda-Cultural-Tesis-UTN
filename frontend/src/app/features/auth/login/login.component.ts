import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);
  mostrarPassword = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePassword(): void {
    this.mostrarPassword.update(valor => !valor);
  }

  onSubmit(): void {
  if (this.loginForm.invalid) {
    this.loginForm.markAllAsTouched();
    return;
  }

  this.cargando.set(true);
  this.error.set(null);

  this.authService.login(this.loginForm.value).subscribe({
    next: (response) => {
      this.cargando.set(false);
      if (response.exito) {
        this.router.navigate(['/']);
      }
    },
    error: (error) => {
      this.cargando.set(false);

      if (error.status === 403) {
        this.error.set(
          '⚠️ Debes verificar tu email antes de iniciar sesión. Revisa tu bandeja de entrada.'
        );
      } else {
        this.error.set(
          error.error?.mensaje || 'Error al iniciar sesión. Verifica tus credenciales.'
        );
      }
    }
  });
}}
