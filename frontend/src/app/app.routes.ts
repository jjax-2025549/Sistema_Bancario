import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';
import { Shell } from './layout/shell';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login').then((m) => m.Login) },
  {
    path: '',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'resumen' },
      { path: 'resumen', loadComponent: () => import('./pages/resumen').then((m) => m.Resumen) },
      { path: 'clientes', loadComponent: () => import('./pages/clientes').then((m) => m.Clientes) },
      { path: 'cuentas', loadComponent: () => import('./pages/cuentas').then((m) => m.Cuentas) },
      { path: 'operaciones', loadComponent: () => import('./pages/operaciones').then((m) => m.Operaciones) },
      { path: 'movimientos', loadComponent: () => import('./pages/movimientos').then((m) => m.Movimientos) },
      { path: 'consultas', loadComponent: () => import('./pages/consultas').then((m) => m.Consultas) },
    ],
  },
  { path: '**', redirectTo: '' },
];
