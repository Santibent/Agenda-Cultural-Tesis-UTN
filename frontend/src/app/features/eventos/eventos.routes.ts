import { Routes } from '@angular/router';

export const EVENTOS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./listado-eventos/listado-eventos.component').then(m => m.ListadoEventosComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('../../core/detalle-evento/detalle-evento.component').then(m => m.DetalleEventoComponent)
  }
];