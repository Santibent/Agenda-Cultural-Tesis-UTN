import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FlyersService } from '../../core/services';
import { Flyer } from '../../shared/models';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent implements OnInit {
  flyers = signal<Flyer[]>([]);
  flyersDestacados = signal<Flyer[]>([]);
  cargando = signal<boolean>(true);
  flyerSeleccionado = signal<Flyer | null>(null);

  constructor(private flyersService: FlyersService) {}

  ngOnInit(): void {
    this.cargarFlyers();
  }

  private cargarFlyers(): void {
    this.cargando.set(true);

    this.flyersService.obtenerGaleria().subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.flyers.set(response.datos);
        }
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar flyers:', error);
        this.cargando.set(false);
      }
    });

    this.flyersService.obtenerDestacados().subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.flyersDestacados.set(response.datos);
        }
      },
      error: (error) => console.error('Error al cargar flyers destacados:', error)
    });
  }

  abrirModal(flyer: Flyer): void {
    this.flyerSeleccionado.set(flyer);
  }

  cerrarModal(): void {
    this.flyerSeleccionado.set(null);
  }

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.cerrarModal();
    }
  }

  obtenerImagenFlyer(flyer: Flyer, tamaño: 'thumbnail' | 'pequeño' | 'mediano' | 'grande' | 'original' = 'mediano'): string {
    if (!flyer.imagenUrl) return '';

    try {
      
      const urls = typeof flyer.imagenUrl === 'string' ? JSON.parse(flyer.imagenUrl) : flyer.imagenUrl;

      return urls[tamaño] || urls.mediano || urls.grande || urls.thumbnail || '';
    } catch {
      
      return (flyer.imagenUrl as any) || '';
    }
  }

  obtenerThumbnail(flyer: Flyer): string {
    
    if (flyer.imagenThumbnail && typeof flyer.imagenThumbnail === 'string' && flyer.imagenThumbnail.startsWith('http')) {
      return flyer.imagenThumbnail;
    }

    return this.obtenerImagenFlyer(flyer, 'thumbnail');
  }
}