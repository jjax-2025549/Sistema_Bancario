import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ThemeSelector } from '../shared/theme-selector';
import { ToastHost } from '../shared/toast-host';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeSelector, ToastHost],
  templateUrl: './shell.html',
})
export class Shell {
  auth = inject(AuthService);
  iniciales = computed(() => (this.auth.usuario()?.nombre ?? '?').split(' ').slice(0, 2).map((p) => p[0]).join('').toUpperCase());
  enlaces = [
    { ruta: '/resumen', texto: 'Resumen', d: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z' },
    { ruta: '/clientes', texto: 'Clientes', d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8' },
    { ruta: '/cuentas', texto: 'Cuentas', d: 'M2 6h20v13H2zM2 10h20M6 15h4' },
    { ruta: '/operaciones', texto: 'Operaciones', d: 'M7 7h13M16 3l4 4-4 4M17 17H4M8 13l-4 4 4 4' },
    { ruta: '/movimientos', texto: 'Movimientos', d: 'M12 7v5l3 2M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0z' },
    { ruta: '/consultas', texto: 'Consultas', d: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3' },
  ];
}
