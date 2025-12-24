import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { SolicitudesService } from '../../core/services';
import { SolicitudFlyer, EstadoSolicitud } from '../../shared/models';

@Component({
  selector: 'app-mis-solicitudes',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './mis-solicitudes.component.html',
  styleUrl: './mis-solicitudes.component.scss'
})
export class MisSolicitudesComponent implements OnInit {
  solicitudes = signal<SolicitudFlyer[]>([]);
  cargando = signal<boolean>(true);
  filtroEstado = signal<EstadoSolicitud | 'todas'>('todas');

  solicitudesFiltradas = computed(() => {
    const filtro = this.filtroEstado();
    if (filtro === 'todas') {
      return this.solicitudes();
    }
    return this.solicitudes().filter(s => s.estado === filtro);
  });

  estadisticas = computed(() => {
    const todas = this.solicitudes();
    return {
      total: todas.length,
      pendientes: todas.filter(s => s.estado === 'pendiente').length,
      enProceso: todas.filter(s => s.estado === 'en_proceso').length,
      completadas: todas.filter(s => s.estado === 'completado').length,
      canceladas: todas.filter(s => s.estado === 'cancelado').length,
    };
  });

  constructor(private solicitudesService: SolicitudesService) {}

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  private cargarSolicitudes(): void {
    this.cargando.set(true);

    this.solicitudesService.listarMisSolicitudes().subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.solicitudes.set(response.datos);
        }
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar solicitudes:', error);
        this.cargando.set(false);
      }
    });
  }

  cambiarFiltro(estado: EstadoSolicitud | 'todas'): void {
    this.filtroEstado.set(estado);
  }

  obtenerClaseEstado(estado: EstadoSolicitud): string {
    const clases: Record<EstadoSolicitud, string> = {
      'pendiente': 'bg-warning',
      'revisando': 'bg-info',
      'en_proceso': 'bg-primary',
      'completado': 'bg-success',
      'rechazado': 'bg-danger',
      'cancelado': 'bg-secondary'
    };
    return clases[estado] || 'bg-secondary';
  }

  obtenerTextoEstado(estado: EstadoSolicitud): string {
    const textos: Record<EstadoSolicitud, string> = {
      'pendiente': 'Pendiente',
      'revisando': 'Revisando',
      'en_proceso': 'En Proceso',
      'completado': 'Completado',
      'rechazado': 'Rechazado',
      'cancelado': 'Cancelado'
    };
    return textos[estado] || estado;
  }

  obtenerIconoEstado(estado: EstadoSolicitud): string {
    const iconos: Record<EstadoSolicitud, string> = {
      'pendiente': 'bi-clock-history',
      'revisando': 'bi-eye',
      'en_proceso': 'bi-gear',
      'completado': 'bi-check-circle',
      'rechazado': 'bi-x-circle',
      'cancelado': 'bi-dash-circle'
    };
    return iconos[estado] || 'bi-circle';
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  cancelarSolicitud(id: number): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta solicitud?')) {
      this.solicitudesService.cancelar(id).subscribe({
        next: (response) => {
          if (response.exito) {
            this.cargarSolicitudes();
          }
        },
        error: (error) => {
          console.error('Error al cancelar solicitud:', error);
          alert('Error al cancelar la solicitud');
        }
      });
    }
  }
}