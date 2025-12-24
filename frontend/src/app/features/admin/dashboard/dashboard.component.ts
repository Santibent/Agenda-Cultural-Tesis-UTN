import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EventosService, SolicitudesService, AuthService } from '../../../core/services';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  cargando = signal<boolean>(true);
  estadisticas = signal<any>({
    totalEventos: 0,
    eventosActivos: 0,
    solicitudesPendientes: 0,
    solicitudesEnProceso: 0
  });

  usuario: any;

  constructor(
    private eventosService: EventosService,
    private solicitudesService: SolicitudesService,
    private authService: AuthService
  ) {
    this.usuario = this.authService.usuario;
  }

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  private cargarEstadisticas(): void {
    this.cargando.set(true);

    this.eventosService.listar({ limite: 1000 }).subscribe({
      next: (response) => {
        if (response.exito && response.meta) {
          this.estadisticas.update(stats => ({
            ...stats,
            totalEventos: response.meta!.totalRegistros,
            eventosActivos: response.datos?.filter((e: any) => e.activo).length || 0
          }));
        }
      }
    });

    this.solicitudesService.listarTodas().subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.estadisticas.update(stats => ({
            ...stats,
            solicitudesPendientes: response.datos!.filter((s: any) => s.estado === 'pendiente').length,
            solicitudesEnProceso: response.datos!.filter((s: any) => s.estado === 'en_proceso').length
          }));
        }
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false)
    });
  }
}