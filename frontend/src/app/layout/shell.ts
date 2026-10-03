import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { ThemeSelector } from '../shared/theme-selector';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeSelector],
  templateUrl: './shell.html',
})
export class Shell {
  auth = inject(AuthService);
  enlaces = [
    { ruta: '/resumen', texto: 'Resumen' },
    { ruta: '/clientes', texto: 'Clientes' },
    { ruta: '/cuentas', texto: 'Cuentas' },
    { ruta: '/operaciones', texto: 'Operaciones' },
    { ruta: '/movimientos', texto: 'Movimientos' },
    { ruta: '/consultas', texto: 'Consultas' },
  ];
}
