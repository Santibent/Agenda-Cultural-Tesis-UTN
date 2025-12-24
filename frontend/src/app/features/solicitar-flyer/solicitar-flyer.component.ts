import { Component, signal, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { SolicitudesService, AuthService } from '../../core/services';
import { Usuario } from '../../shared/models';

@Component({
  selector: 'app-solicitar-flyer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './solicitar-flyer.component.html',
  styleUrl: './solicitar-flyer.component.scss'
})
export class SolicitarFlyerComponent {
  solicitudForm: FormGroup;
  cargando = signal<boolean>(false);
  exito = signal<boolean>(false);
  error = signal<string | null>(null);
  pasoActual = signal<number>(1);
  totalPasos = 3;

  usuario: Signal<Usuario | null>;
  estaAutenticado: Signal<boolean>;

  constructor(
    private fb: FormBuilder,
    private solicitudesService: SolicitudesService,
    private authService: AuthService,
    private router: Router
  ) {
    this.usuario = this.authService.usuario;
    this.estaAutenticado = this.authService.estaAutenticado;

    const emailUsuario = this.usuario()?.email || '';

    this.solicitudForm = this.fb.group({
      
      nombreEvento: ['', [Validators.required, Validators.minLength(3)]],
      tipoEvento: ['', Validators.required],
      fechaEvento: ['', Validators.required],

      descripcion: ['', [Validators.required, Validators.minLength(20)]],
      referencias: [''],
      coloresPreferidos: [''],
      estiloPreferido: [''],
      informacionIncluir: ['', Validators.required],

      contactoEmail: [emailUsuario, [Validators.required, Validators.email]],
      contactoTelefono: [''],
      contactoWhatsapp: [''],
      presupuesto: ['', [Validators.min(0)]],
      fechaLimite: ['']
    });
  }

  get nombreEvento() { return this.solicitudForm.get('nombreEvento'); }
  get tipoEvento() { return this.solicitudForm.get('tipoEvento'); }
  get fechaEvento() { return this.solicitudForm.get('fechaEvento'); }
  get descripcion() { return this.solicitudForm.get('descripcion'); }
  get informacionIncluir() { return this.solicitudForm.get('informacionIncluir'); }
  get contactoEmail() { return this.solicitudForm.get('contactoEmail'); }
  get presupuesto() { return this.solicitudForm.get('presupuesto'); }

  siguientePaso(): void {
    
    if (this.pasoActual() === 1) {
      const camposPaso1 = ['nombreEvento', 'tipoEvento', 'fechaEvento'];
      const validos = camposPaso1.every(campo => this.solicitudForm.get(campo)?.valid);
      
      if (!validos) {
        camposPaso1.forEach(campo => this.solicitudForm.get(campo)?.markAsTouched());
        return;
      }
    }

    if (this.pasoActual() === 2) {
      const camposPaso2 = ['descripcion', 'informacionIncluir'];
      const validos = camposPaso2.every(campo => this.solicitudForm.get(campo)?.valid);
      
      if (!validos) {
        camposPaso2.forEach(campo => this.solicitudForm.get(campo)?.markAsTouched());
        return;
      }
    }

    if (this.pasoActual() < this.totalPasos) {
      this.pasoActual.update(paso => paso + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  pasoAnterior(): void {
    if (this.pasoActual() > 1) {
      this.pasoActual.update(paso => paso - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  irAPaso(paso: number): void {
    if (paso <= this.pasoActual()) {
      this.pasoActual.set(paso);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onSubmit(): void {
  if (this.solicitudForm.invalid) {
    this.solicitudForm.markAllAsTouched();
    return;
  }

  this.cargando.set(true);
  this.error.set(null);

  const formData = { ...this.solicitudForm.value };
  Object.keys(formData).forEach(key => {
    if (formData[key] === '' || formData[key] === null) {
      delete formData[key]; 
    }
  });

  console.log('📤 Datos a enviar (limpiados):', formData);

  this.solicitudesService.crear(formData).subscribe({
    next: (response) => {
      console.log('✅ Respuesta exitosa:', response);
      this.cargando.set(false);
      if (response.exito) {
        this.exito.set(true);
        setTimeout(() => {
          this.router.navigate(['/mis-solicitudes']);
        }, 3000);
      }
    },
    error: (error) => {
      console.error('❌ Error completo:', error);
      console.error('❌ Error body:', error.error);
      this.cargando.set(false);

      if (error.error?.errores && error.error.errores.length > 0) {
        const mensajesError = error.error.errores.map((e: any) => e.mensaje).join(', ');
        this.error.set(mensajesError);
      } else {
        this.error.set(
          error.error?.mensaje || 'Error al enviar la solicitud. Intenta nuevamente.'
        );
      }
    }
  });
}
}