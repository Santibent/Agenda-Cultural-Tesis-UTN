import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventosService } from '../services';
import { Evento } from '../../shared/models';

@Component({
  selector: 'app-detalle-evento',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-evento.component.html',
  styleUrl: './detalle-evento.component.scss'
})
export class DetalleEventoComponent implements OnInit {
  evento = signal<Evento | null>(null);
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventosService: EventosService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const idOSlug = params['id'];
      this.cargarEvento(idOSlug);
    });
  }

  private cargarEvento(idOSlug: string): void {
    this.cargando.set(true);
    this.error.set(null);

    this.eventosService.obtenerPorId(idOSlug).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.evento.set(response.datos);
        } else {
          this.error.set('No se pudo cargar el evento');
        }
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar evento:', error);
        this.error.set('Error al cargar el evento. Intenta nuevamente.');
        this.cargando.set(false);
      }
    });
  }

  formatearFecha(fecha: string | null): string {
    if (!fecha) return '';
    return new Date(fecha).toLocaleDateString('es-AR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  compartir(): void {
    if (navigator.share) {
      navigator.share({
        title: this.evento()?.titulo,
        text: this.evento()?.descripcionCorta || this.evento()?.descripcion,
        url: window.location.href
      });
    }
  }

  volver(): void {
    this.router.navigate(['/eventos']);
  }

  obtenerImagenEvento(evento: Evento, campo: 'imagenPrincipal' | 'imagenBanner' | 'imagenUrl' = 'imagenPrincipal', tamaño: 'thumbnail' | 'pequeño' | 'mediano' | 'grande' | 'original' = 'grande'): string {
    const imagenData = evento[campo];

    if (!imagenData) return '';

    try {
      
      const urls = typeof imagenData === 'string' ? JSON.parse(imagenData) : imagenData;

      if (typeof urls === 'object' && urls !== null) {
        return urls[tamaño] || urls.grande || urls.mediano || urls.thumbnail || '';
      }

      return urls;
    } catch {
      
      return (imagenData as string) || '';
    }
  }
}