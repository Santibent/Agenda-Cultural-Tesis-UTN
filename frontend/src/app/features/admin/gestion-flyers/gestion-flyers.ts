import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlyersService, EventosService } from '../../../core/services';
import { Flyer, Evento } from '../../../shared/models';

@Component({
  selector: 'app-gestion-flyers',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-flyers.html',
  styleUrl: './gestion-flyers.scss'
})
export class GestionFlyers implements OnInit {
  flyers = signal<Flyer[]>([]);
  eventos = signal<Evento[]>([]);
  cargando = signal<boolean>(false);
  mostrarFormulario = signal<boolean>(false);
  modoEdicion = signal<boolean>(false);
  flyerSeleccionado = signal<Flyer | null>(null);

  formulario: FormGroup;
  imagenPreview = signal<string | null>(null);
  archivoImagen: File | null = null;

  constructor(
    private fb: FormBuilder,
    private flyersService: FlyersService,
    private eventosService: EventosService
  ) {
    this.formulario = this.crearFormulario();
  }

  ngOnInit(): void {
    this.cargarFlyers();
    this.cargarEventos();
  }

  private crearFormulario(): FormGroup {
    return this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(200)]],
      descripcion: [''],
      eventoRelacionadoId: [null],
      etiquetas: [''],
      orden: [0],
      visible: [true],
      destacado: [false]
    });
  }

  cargarFlyers(): void {
    this.cargando.set(true);
    this.flyersService.listar().subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.flyers.set(response.datos);
        }
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  cargarEventos(): void {
    this.eventosService.listar({ limite: 1000 }).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.eventos.set(response.datos);
        }
      }
    });
  }

  mostrarNuevoFormulario(): void {
    this.modoEdicion.set(false);
    this.flyerSeleccionado.set(null);
    this.formulario.reset({
      visible: true,
      destacado: false,
      orden: 0
    });
    this.imagenPreview.set(null);
    this.archivoImagen = null;
    this.mostrarFormulario.set(true);
  }

  editarFlyer(flyer: Flyer): void {
    this.modoEdicion.set(true);
    this.flyerSeleccionado.set(flyer);

    this.formulario.patchValue({
      titulo: flyer.titulo,
      descripcion: flyer.descripcion,
      eventoRelacionadoId: flyer.eventoRelacionadoId,
      etiquetas: flyer.etiquetas ? flyer.etiquetas.join(', ') : '',
      orden: flyer.orden,
      visible: flyer.visible,
      destacado: flyer.destacado
    });

    if (flyer.imagenUrl) {
      try {
        const urls = typeof flyer.imagenUrl === 'string' ? JSON.parse(flyer.imagenUrl) : flyer.imagenUrl;
        this.imagenPreview.set(urls.mediano || urls.original);
      } catch {
        this.imagenPreview.set(flyer.imagenUrl as any);
      }
    }

    this.mostrarFormulario.set(true);
  }

  onImagenSeleccionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const archivo = input.files[0];

      if (!archivo.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }

      if (archivo.size > 5 * 1024 * 1024) {
        alert('La imagen no puede superar 5MB');
        return;
      }

      this.archivoImagen = archivo;

      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagenPreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(archivo);
    }
  }

  guardarFlyer(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    if (!this.modoEdicion() && !this.archivoImagen) {
      alert('Debes seleccionar una imagen');
      return;
    }

    this.cargando.set(true);
    const formData = new FormData();

    Object.keys(this.formulario.value).forEach(key => {
      const value = this.formulario.value[key];
      if (value !== null && value !== undefined && value !== '') {
        if (key === 'etiquetas' && typeof value === 'string') {
          const etiquetasArray = value.split(',').map((t: string) => t.trim()).filter((t: string) => t);
          formData.append(key, JSON.stringify(etiquetasArray));
        } else {
          formData.append(key, value);
        }
      }
    });

    if (this.archivoImagen) {
      formData.append('imagen', this.archivoImagen);
    }

    const peticion = this.modoEdicion() && this.flyerSeleccionado()
      ? this.flyersService.actualizar(this.flyerSeleccionado()!.id, formData)
      : this.flyersService.crear(formData);

    peticion.subscribe({
      next: (response) => {
        if (response.exito) {
          alert(this.modoEdicion() ? 'Flyer actualizado exitosamente' : 'Flyer creado exitosamente');
          this.cancelarFormulario();
          this.cargarFlyers();
        }
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al guardar flyer:', error);
        alert('Error al guardar el flyer');
        this.cargando.set(false);
      }
    });
  }

  eliminarFlyer(flyer: Flyer): void {
    if (!confirm(`¿Estás seguro de que quieres eliminar el flyer "${flyer.titulo}"?`)) {
      return;
    }

    this.cargando.set(true);
    this.flyersService.eliminar(flyer.id).subscribe({
      next: (response) => {
        if (response.exito) {
          alert('Flyer eliminado exitosamente');
          this.cargarFlyers();
        }
        this.cargando.set(false);
      },
      error: () => {
        alert('Error al eliminar el flyer');
        this.cargando.set(false);
      }
    });
  }

  toggleDestacado(flyer: Flyer): void {
    const formData = new FormData();
    formData.append('destacado', (!flyer.destacado).toString());

    this.flyersService.actualizar(flyer.id, formData).subscribe({
      next: (response) => {
        if (response.exito) {
          this.cargarFlyers();
        }
      }
    });
  }

  toggleVisible(flyer: Flyer): void {
    const formData = new FormData();
    formData.append('visible', (!flyer.visible).toString());

    this.flyersService.actualizar(flyer.id, formData).subscribe({
      next: (response) => {
        if (response.exito) {
          this.cargarFlyers();
        }
      }
    });
  }

  cancelarFormulario(): void {
    this.mostrarFormulario.set(false);
    this.formulario.reset();
    this.imagenPreview.set(null);
    this.archivoImagen = null;
  }

  obtenerImagenFlyer(flyer: Flyer): string {
    if (!flyer.imagenUrl) return '/assets/placeholder-flyer.jpg';

    try {
      const urls = typeof flyer.imagenUrl === 'string' ? JSON.parse(flyer.imagenUrl) : flyer.imagenUrl;
      return urls.thumbnail || urls.pequeño || urls.mediano || '/assets/placeholder-flyer.jpg';
    } catch {
      return flyer.imagenUrl as any || '/assets/placeholder-flyer.jpg';
    }
  }
}
