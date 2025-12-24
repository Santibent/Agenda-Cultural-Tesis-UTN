import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EventosService, CategoriasService } from '../../../core/services';
import { Evento, Categoria } from '../../../shared/models';

@Component({
  selector: 'app-listado-eventos',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './listado-eventos.component.html',
  styleUrl: './listado-eventos.component.scss'
})
export class ListadoEventosComponent implements OnInit {
  eventos = signal<Evento[]>([]);
  categorias = signal<Categoria[]>([]);
  cargando = signal<boolean>(true);

  categoriaSeleccionada = signal<number | null>(null);
  textoBusqueda = signal<string>('');
  ordenSeleccionado = signal<string>('fechaInicio');

  paginaActual = signal<number>(1);
  totalPaginas = signal<number>(1);
  totalEventos = signal<number>(0);

  eventosFiltrados = computed(() => {
    let resultado = this.eventos();

    const busqueda = this.textoBusqueda().toLowerCase();
    if (busqueda) {
      resultado = resultado.filter(evento => 
        evento.titulo.toLowerCase().includes(busqueda) ||
        evento.descripcion.toLowerCase().includes(busqueda) ||
        evento.ubicacion.toLowerCase().includes(busqueda)
      );
    }

    return resultado;
  });

  constructor(
    private eventosService: EventosService,
    private categoriasService: CategoriasService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(params => {
      if (params['categoriaId']) {
        this.categoriaSeleccionada.set(+params['categoriaId']);
      }
      this.cargarDatos();
    });

    this.cargarCategorias();
  }

  private cargarDatos(): void {
    this.cargando.set(true);

    const filtros: any = {
      pagina: this.paginaActual(),
      limite: 12,
      ordenarPor: this.ordenSeleccionado(),
      orden: 'ASC'
    };

    if (this.categoriaSeleccionada()) {
      filtros.categoriaId = this.categoriaSeleccionada();
    }

    this.eventosService.listar(filtros).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.eventos.set(response.datos);
          
          if (response.meta) {
            this.totalPaginas.set(response.meta.totalPaginas);
            this.totalEventos.set(response.meta.totalRegistros);
          }
        }
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar eventos:', error);
        this.cargando.set(false);
      }
    });
  }

  private cargarCategorias(): void {
    this.categoriasService.listar(true).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.categorias.set(response.datos);
        }
      },
      error: (error) => console.error('Error al cargar categorías:', error)
    });
  }

  onCategoriaChange(categoriaId: number | null): void {
    this.categoriaSeleccionada.set(categoriaId);
    this.paginaActual.set(1);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: categoriaId ? { categoriaId } : {},
      queryParamsHandling: 'merge'
    });

    this.cargarDatos();
  }

  onOrdenChange(): void {
    this.paginaActual.set(1);
    this.cargarDatos();
  }

  onBuscar(): void {
    this.paginaActual.set(1);
  }

  cambiarPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual.set(pagina);
      this.cargarDatos();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  limpiarFiltros(): void {
    this.categoriaSeleccionada.set(null);
    this.textoBusqueda.set('');
    this.ordenSeleccionado.set('fechaInicio');
    this.paginaActual.set(1);

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {}
    });

    this.cargarDatos();
  }

  formatearFecha(fecha: string): string {
    return new Date(fecha).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  }

  obtenerImagenEvento(evento: Evento, campo: 'imagenPrincipal' | 'imagenBanner' | 'imagenUrl' = 'imagenPrincipal', tamaño: 'thumbnail' | 'pequeño' | 'mediano' | 'grande' | 'original' = 'mediano'): string {
    const imagenData = evento[campo];

    if (!imagenData) return '';

    try {
      
      const urls = typeof imagenData === 'string' ? JSON.parse(imagenData) : imagenData;

      if (typeof urls === 'object' && urls !== null) {
        return urls[tamaño] || urls.mediano || urls.grande || urls.thumbnail || '';
      }

      return urls;
    } catch {
      
      return (imagenData as string) || '';
    }
  }
}