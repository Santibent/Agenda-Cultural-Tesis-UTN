import { Routes } from '@angular/router';
import { authGuard, adminGuard, guestGuard } from './core/guards';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/inicio/inicio.component').then(m => m.InicioComponent)
  },
  {
    path: 'eventos',
    loadChildren: () => import('./features/eventos/eventos.routes').then(m => m.EVENTOS_ROUTES)
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./features/portfolio/portfolio.component').then(m => m.PortfolioComponent)
  },
  {
    path: 'solicitar-flyer',
    loadComponent: () => import('./features/solicitar-flyer/solicitar-flyer.component').then(m => m.SolicitarFlyerComponent),
    canActivate: [authGuard]
  },
  {
    path: 'mis-solicitudes',
    loadComponent: () => import('./features/mis-solicitudes/mis-solicitudes.component').then(m => m.MisSolicitudesComponent),
    canActivate: [authGuard]
  },
  {
    path: 'auth',
    canActivate: [guestGuard],
    loadChildren: () => import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [authGuard, adminGuard],
    loadChildren: () => import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  {
    path: '**',
    redirectTo: ''
  }
];