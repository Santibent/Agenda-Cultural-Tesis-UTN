import { Component, OnInit, OnDestroy, signal, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';
import { EventosService, CategoriasService } from '../../core/services';
import { Evento, Categoria } from '../../shared/models';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent implements OnInit, OnDestroy {
  eventosDestacados = signal<Evento[]>([]);
  categorias = signal<Categoria[]>([]);
  cargando = signal<boolean>(true);

  todosLosGifs = [
    '/gifs/gif1.gif',
    '/gifs/gif2.gif',
    '/gifs/gif3.gif',
    '/gifs/gif4.gif',
    '/gifs/gif5.gif',
    '/gifs/gif6.gif',
    '/gifs/gif7.gif',
    '/gifs/gif8.gif',
    '/gifs/gif9.gif'
  ];

  gifsCapaUno = signal<string[]>([]);
  gifsCapaDos = signal<string[]>([]);
  capaActiva = signal<number>(1); 

  private intervalId: any;

  constructor(
    private eventosService: EventosService,
    private categoriasService: CategoriasService,
    private viewportScroller: ViewportScroller,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.inicializarGifs();
    this.iniciarRotacionGifs();
    this.monitorearScroll();
    this.inicializarFiguras();
  }

  private monitorearScroll(): void {
    if (isPlatformBrowser(this.platformId)) {
      let ultimaPosicion = 0;
      let ultimoTimestamp = Date.now();

      window.addEventListener('scroll', () => {
        const posicionActual = window.scrollY;
        const timestampActual = Date.now();
        const tiempoTranscurrido = timestampActual - ultimoTimestamp;
        const diferencia = Math.abs(posicionActual - ultimaPosicion);

        if (diferencia > 100 && tiempoTranscurrido < 100) {
          console.error('', {
            de: ultimaPosicion,
            a: posicionActual,
            diferencia: diferencia,
            tiempo: tiempoTranscurrido + 'ms'
          });
          console.trace('');
        }

        if (diferencia > 50) {
          console.log('', {
            de: ultimaPosicion,
            a: posicionActual,
            diferencia: diferencia,
            tiempo: tiempoTranscurrido + 'ms'
          });
        }

        ultimaPosicion = posicionActual;
        ultimoTimestamp = timestampActual;
      });
    }
  }

  private inicializarFiguras(): void {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const figuras = document.querySelectorAll('.scroll-reveal');

        

        if (figuras.length === 0) {
          
          return;
        }

        const categoriasSection = document.querySelector('.categorias-section');

        if (!categoriasSection) {
          
          return;
        }

        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              console.log('', {
                isIntersecting: entry.isIntersecting,
                intersectionRatio: entry.intersectionRatio
              });

              if (entry.isIntersecting) {
                
                figuras.forEach((figura, index) => {
                  setTimeout(() => {
                    figura.classList.add('visible');
                    console.log('', figura.className);
                  }, index * 100); 
                });
              } else {
                
                figuras.forEach((figura) => {
                  figura.classList.remove('visible');
                  console.log('', figura.className);
                });
              }
            });
          },
          {
            threshold: 0.2, 
            rootMargin: '0px'
          }
        );

        observer.observe(categoriasSection);
      }, 300);
    }
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private inicializarGifs(): void {
    
    const gifsIniciales = [...this.todosLosGifs];
    this.gifsCapaUno.set(gifsIniciales);

    const gifsAleatorios = [...this.todosLosGifs].sort(() => Math.random() - 0.5);
    this.gifsCapaDos.set(gifsAleatorios);

    this.capaActiva.set(1);
  }

  private iniciarRotacionGifs(): void {
    
    this.intervalId = setInterval(() => {
      this.rotarGifs();
    }, 4000);
  }

  private rotarGifs(): void {
    if (isPlatformBrowser(this.platformId)) {
      

      const capaActual = this.capaActiva();
      const capaSiguiente = capaActual === 1 ? 2 : 1;

      const gifsNuevos = [...this.todosLosGifs].sort(() => Math.random() - 0.5);

      if (capaSiguiente === 1) {
        this.gifsCapaUno.set(gifsNuevos);
      } else {
        this.gifsCapaDos.set(gifsNuevos);
      }

      requestAnimationFrame(() => {
        
        this.capaActiva.set(capaSiguiente);
        console.log('', capaSiguiente);
      });
    }
  }

  private cargarDatos(): void {
    this.cargando.set(true);

    this.eventosService.obtenerDestacados(6).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.eventosDestacados.set(response.datos);
        }
      },
      error: (error) => console.error('Error al cargar eventos destacados:', error)
    });

    this.categoriasService.listar(true).subscribe({
      next: (response) => {
        if (response.exito && response.datos) {
          this.categorias.set(response.datos);
        }
        this.cargando.set(false);
      },
      error: (error) => {
        console.error('Error al cargar categorías:', error);
        this.cargando.set(false);
      }
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