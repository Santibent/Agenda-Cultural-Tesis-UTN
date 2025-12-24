import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolicitudesService } from '../../../core/services';
import { SolicitudFlyer } from '../../../shared/models';

@Component({
  selector: 'app-gestion-solicitudes',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './gestion-solicitudes.html',
  styleUrl: './gestion-solicitudes.scss'
})
export class GestionSolicitudes implements OnInit {
  solicitudes = signal<SolicitudFlyer[]>([]);
  cargando = signal<boolean>(false);
  solicitudSeleccionada = signal<SolicitudFlyer | null>(null);
  mostrarModal = signal<boolean>(false);

  filtroEstado = signal<string>('todas');

  formularioEstado: FormGroup;

  estados = [
    { valor: 'todas', label: 'Todas' },
    { valor: 'pendiente', label: 'Pendiente' },
    { valor: 'revisando', label: 'Revisando' },
    { valor: 'en_proceso', label: 'En Proceso' },
    { valor: 'completado', label: 'Completado' },
    { valor: 'rechazado', label: 'Rechazado' },
    { valor: 'cancelado', label: 'Cancelado' }
  ];

  prioridades = [
    { valor: 'baja', label: 'Baja' },
    { valor: 'media', label: 'Media' },
    { valor: 'alta', label: 'Alta' },
    { valor: 'urgente', label: 'Urgente' }
  ];

  constructor(
    private fb: FormBuilder,
    private solicitudesService: SolicitudesService
  ) {
    this.formularioEstado = this.fb.group({
      estado: ['', Validators.required],
      prioridad: [''],
      notasAdmin: ['']
    });
  }

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes(): void {
    this.cargando.set(true);
    const filtro = this.filtroEstado() !== 'todas' ? this.filtroEstado() : undefined;

    this.solicitudesService.listarTodas({ estado: filtro, limite: 1000 }).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.solicitudes.set(response.datos);
        }
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }

  filtrarPorEstado(estado: string): void {
    this.filtroEstado.set(estado);
    this.cargarSolicitudes();
  }

  verDetalle(solicitud: SolicitudFlyer): void {
    this.solicitudSeleccionada.set(solicitud);
    this.formularioEstado.patchValue({
      estado: solicitud.estado,
      prioridad: solicitud.prioridad,
      notasAdmin: solicitud.notasAdmin || ''
    });
    this.mostrarModal.set(true);
  }

  cerrarModal(): void {
    this.mostrarModal.set(false);
    this.solicitudSeleccionada.set(null);
    this.formularioEstado.reset();
  }

  actualizarEstado(): void {
    if (this.formularioEstado.invalid || !this.solicitudSeleccionada()) {
      return;
    }

    this.cargando.set(true);
    const { estado, prioridad, notasAdmin } = this.formularioEstado.value;

    this.solicitudesService.actualizarEstado(
      this.solicitudSeleccionada()!.id,
      estado,
      prioridad,
      notasAdmin
    ).subscribe({
      next: (response) => {
        if (response.exito) {
          alert('Estado actualizado exitosamente');
          this.cerrarModal();
          this.cargarSolicitudes();
        }
        this.cargando.set(false);
      },
      error: () => {
        alert('Error al actualizar el estado');
        this.cargando.set(false);
      }
    });
  }

  aprobar(solicitud: SolicitudFlyer): void {
    if (!confirm(`¿Aprobar solicitud "${solicitud.nombreEvento}"?`)) {
      return;
    }

    this.solicitudesService.actualizarEstado(solicitud.id, 'en_proceso').subscribe({
      next: (response) => {
        if (response.exito) {
          alert('Solicitud aprobada y puesta en proceso');
          this.cargarSolicitudes();
        }
      },
      error: () => alert('Error al aprobar solicitud')
    });
  }

  rechazar(solicitud: SolicitudFlyer): void {
    const motivo = prompt(`Motivo del rechazo para "${solicitud.nombreEvento}":`);
    if (!motivo) return;

    this.solicitudesService.actualizarEstado(solicitud.id, 'rechazado', undefined, motivo).subscribe({
      next: (response) => {
        if (response.exito) {
          alert('Solicitud rechazada');
          this.cargarSolicitudes();
        }
      },
      error: () => alert('Error al rechazar solicitud')
    });
  }

  completar(solicitud: SolicitudFlyer): void {
    if (!confirm(`¿Marcar como completada "${solicitud.nombreEvento}"?`)) {
      return;
    }

    this.solicitudesService.actualizarEstado(solicitud.id, 'completado').subscribe({
      next: (response) => {
        if (response.exito) {
          alert('Solicitud marcada como completada');
          this.cargarSolicitudes();
        }
      },
      error: () => alert('Error al completar solicitud')
    });
  }

  eliminar(solicitud: SolicitudFlyer): void {
    if (!confirm(`¿Eliminar solicitud "${solicitud.nombreEvento}"?`)) {
      return;
    }

    this.solicitudesService.eliminar(solicitud.id).subscribe({
      next: (response) => {
        if (response.exito) {
          alert('Solicitud eliminada');
          this.cargarSolicitudes();
        }
      },
      error: () => alert('Error al eliminar solicitud')
    });
  }

  obtenerClaseBadge(estado: string): string {
    const clases: any = {
      'pendiente': 'bg-warning',
      'revisando': 'bg-info',
      'en_proceso': 'bg-primary',
      'completado': 'bg-success',
      'rechazado': 'bg-danger',
      'cancelado': 'bg-secondary'
    };
    return clases[estado] || 'bg-secondary';
  }

  obtenerClasePrioridad(prioridad: string): string {
    const clases: any = {
      'baja': 'text-success',
      'media': 'text-info',
      'alta': 'text-warning',
      'urgente': 'text-danger'
    };
    return clases[prioridad] || 'text-secondary';
  }

  formatearFecha(fecha: string | Date | null): string {
    if (!fecha) return 'N/A';
    return new Date(fecha).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatearEstado(estado: string): string {
    const estados: any = {
      'pendiente': 'Pendiente',
      'revisando': 'Revisando',
      'en_proceso': 'En Proceso',
      'completado': 'Completado',
      'rechazado': 'Rechazado',
      'cancelado': 'Cancelado'
    };
    return estados[estado] || estado;
  }
}
