import { Routes } from '@angular/router';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'eventos',
    loadComponent: () => import('./gestion-eventos/gestion-eventos').then(m => m.GestionEventos)
  },
  {
    path: 'solicitudes',
    loadComponent: () => import('./gestion-solicitudes/gestion-solicitudes').then(m => m.GestionSolicitudes)
  },
  {
    path: 'flyers',
    loadComponent: () => import('./gestion-flyers/gestion-flyers').then(m => m.GestionFlyers)
  },
  {
    path: 'usuarios',
    loadComponent: () => import('./usuarios/usuarios.component').then(m => m.UsuariosComponent)
  }
];