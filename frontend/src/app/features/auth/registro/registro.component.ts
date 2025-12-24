import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {
  registroForm: FormGroup;
  cargando = signal<boolean>(false);
  error = signal<string | null>(null);
  exito = signal<boolean>(false);
  mostrarPassword = signal<boolean>(false);
  mostrarConfirmarPassword = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator
      ]],
      confirmarPassword: ['', [Validators.required]],
      aceptaTerminos: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) return null;

    const tieneNumero = /[0-9]/.test(value);
    const tieneMayuscula = /[A-Z]/.test(value);
    const tieneMinuscula = /[a-z]/.test(value);
    const tieneEspecial = /[@$!%*?&]/.test(value);

    const valido = tieneNumero && tieneMayuscula && tieneMinuscula && tieneEspecial;

    return !valido ? { passwordDebil: true } : null;
  }

  passwordMatchValidator(group: AbstractControl): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmarPassword = group.get('confirmarPassword')?.value;

    return password === confirmarPassword ? null : { passwordMismatch: true };
  }

  get nombre() {
    return this.registroForm.get('nombre');
  }

  get email() {
    return this.registroForm.get('email');
  }

  get password() {
    return this.registroForm.get('password');
  }

  get confirmarPassword() {
    return this.registroForm.get('confirmarPassword');
  }

  get aceptaTerminos() {
    return this.registroForm.get('aceptaTerminos');
  }

  togglePassword(): void {
    this.mostrarPassword.update(valor => !valor);
  }

  toggleConfirmarPassword(): void {
    this.mostrarConfirmarPassword.update(valor => !valor);
  }

  toggleMostrarPassword(): void {
    this.mostrarPassword.update(valor => !valor);
  }

  toggleMostrarConfirmarPassword(): void {
    this.mostrarConfirmarPassword.update(valor => !valor);
  }

  onSubmit(): void {
  if (this.registroForm.invalid) {
    this.registroForm.markAllAsTouched();
    return;
  }

  this.cargando.set(true);
  this.error.set(null);

  this.authService.registro(this.registroForm.value).subscribe({
    next: (response) => {
      this.cargando.set(false);
      
      if (response.exito) {
        this.exito.set(true);
      }
    },
    error: (error) => {
      this.cargando.set(false);
      this.error.set(
        error.error?.mensaje || 'Error al registrarse. Intenta nuevamente.'
      );
    }
  });
}
}