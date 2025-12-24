import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EventosService, CategoriasService } from '../../../core/services';
import { Evento, Categoria } from '../../../shared/models';

@Component({
  selector: 'app-gestion-eventos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-eventos.html',
  styleUrl: './gestion-eventos.scss'
})
export class GestionEventos implements OnInit {
  eventos = signal<Evento[]>([]);
  categorias = signal<Categoria[]>([]);
  cargando = signal<boolean>(false);
  mostrarFormulario = signal<boolean>(false);
  modoEdicion = signal<boolean>(false);
  eventoSeleccionado = signal<Evento | null>(null);

  formulario: FormGroup;
  imagenPreview = signal<string | null>(null);
  archivoImagen: File | null = null;

  constructor(
    private fb: FormBuilder,
    private eventosService: EventosService,
    private categoriasService: CategoriasService
  ) {
    this.formulario = this.crearFormulario();
  }

  ngOnInit(): void {
    this.cargarEventos();
    this.cargarCategorias();
  }

  private crearFormulario(): FormGroup {
    return this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      descripcionCorta: ['', [Validators.maxLength(300)]],
      categoriaId: ['', Validators.required],
      fechaInicio: ['', Validators.required],
      fechaFin: [''],
      horaInicio: [''],
      horaFin: [''],
      ubicacion: ['', [Validators.required, Validators.maxLength(200)]],
      direccion: ['', Validators.maxLength(255)],
      ciudad: ['', Validators.maxLength(100)],
      provincia: ['', Validators.maxLength(100)],
      pais: ['ARS'],
      precio: [0, [Validators.min(0)]],
      moneda: ['ARS'],
      capacidad: [null],
      linkExterno: [''],
      linkTickets: [''],
      organizador: ['', Validators.maxLength(200)],
      contactoEmail: ['', Validators.email],
      contactoTelefono: [''],
      destacado: [false],
      activo: [true]
    });
  }

  cargarEventos(): void {
    this.cargando.set(true);
    this.eventosService.listar({ limite: 1000 }).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.eventos.set(response.datos);
        }
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  cargarCategorias(): void {
    this.categoriasService.listar().subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.categorias.set(response.datos);
        }
      }
    });
  }

  mostrarNuevoFormulario(): void {
    this.modoEdicion.set(false);
    this.eventoSeleccionado.set(null);
    this.formulario.reset({
      activo: true,
      destacado: false,
      precio: 0,
      moneda: 'ARS',
      pais: 'Argentina'
    });
    this.imagenPreview.set(null);
    this.archivoImagen = null;
    this.mostrarFormulario.set(true);
  }

  editarEvento(evento: Evento): void {
    this.modoEdicion.set(true);
    this.eventoSeleccionado.set(evento);

    const fechaInicio = evento.fechaInicio ? new Date(evento.fechaInicio).toISOString().split('T')[0] : '';
    const fechaFin = evento.fechaFin ? new Date(evento.fechaFin).toISOString().split('T')[0] : '';

    this.formulario.patchValue({
      titulo: evento.titulo,
      descripcion: evento.descripcion,
      descripcionCorta: evento.descripcionCorta,
      categoriaId: evento.categoriaId,
      fechaInicio,
      fechaFin,
      horaInicio: evento.horaInicio,
      horaFin: evento.horaFin,
      ubicacion: evento.ubicacion,
      direccion: evento.direccion,
      ciudad: evento.ciudad,
      provincia: evento.provincia,
      pais: evento.pais,
      precio: evento.precio,
      moneda: evento.moneda,
      capacidad: evento.capacidad,
      linkExterno: evento.linkExterno,
      linkTickets: evento.linkTickets,
      organizador: evento.organizador,
      contactoEmail: evento.contactoEmail,
      contactoTelefono: evento.contactoTelefono,
      destacado: evento.destacado,
      activo: evento.activo
    });

    if (evento.imagenUrl) {
      try {
        const urls = typeof evento.imagenUrl === 'string' ? JSON.parse(evento.imagenUrl) : evento.imagenUrl;
        this.imagenPreview.set(urls.mediano || urls.original);
      } catch {
        this.imagenPreview.set(evento.imagenUrl as string);
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

  guardarEvento(): void {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    this.cargando.set(true);
    const formData = new FormData();

    Object.keys(this.formulario.value).forEach(key => {
      const value = this.formulario.value[key];
      if (value !== null && value !== undefined && value !== '') {
        formData.append(key, value);
      }
    });

    if (this.archivoImagen) {
      formData.append('imagen', this.archivoImagen);
    }

    const peticion = this.modoEdicion() && this.eventoSeleccionado()
      ? this.eventosService.actualizar(this.eventoSeleccionado()!.id, formData)
      : this.eventosService.crear(formData);

    peticion.subscribe({
      next: (response) => {
        if (response.exito) {
          alert(this.modoEdicion() ? 'Evento actualizado exitosamente' : 'Evento creado exitosamente');
          this.cancelarFormulario();
          this.cargarEventos();
        }
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al guardar evento:', error);
        alert('Error al guardar el evento');
        this.cargando.set(false);
      }
    });
  }

  eliminarEvento(evento: Evento): void {
    if (!confirm(`¿Estás seguro de que quieres eliminar el evento "${evento.titulo}"?`)) {
      return;
    }

    this.cargando.set(true);
    this.eventosService.eliminar(evento.id).subscribe({
      next: (response) => {
        if (response.exito) {
          alert('Evento eliminado exitosamente');
          this.cargarEventos();
        }
        this.cargando.set(false);
      },
      error: () => {
        alert('Error al eliminar el evento');
        this.cargando.set(false);
      }
    });
  }

  toggleDestacado(evento: Evento): void {
    this.eventosService.actualizar(evento.id, { destacado: !evento.destacado }).subscribe({
      next: (response) => {
        if (response.exito) {
          this.cargarEventos();
        }
      }
    });
  }

  toggleActivo(evento: Evento): void {
    this.eventosService.actualizar(evento.id, { activo: !evento.activo }).subscribe({
      next: (response) => {
        if (response.exito) {
          this.cargarEventos();
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

  obtenerNombreCategoria(categoriaId: number): string {
    const categoria = this.categorias().find(c => c.id === categoriaId);
    return categoria?.nombre || 'Sin categoría';
  }

  formatearFecha(fecha: string | Date): string {
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  obtenerImagenEvento(evento: Evento): string {
    if (!evento.imagenUrl) return '/assets/placeholder-evento.jpg';

    try {
      const urls = typeof evento.imagenUrl === 'string' ? JSON.parse(evento.imagenUrl) : evento.imagenUrl;
      return urls.thumbnail || urls.pequeño || urls.mediano || '/assets/placeholder-evento.jpg';
    } catch {
      return evento.imagenUrl as string || '/assets/placeholder-evento.jpg';
    }
  }
}
