import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/theme.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class App {
  // Se instancia al arrancar para aplicar el tema (claro/oscuro/automático) en toda la app.
  private theme = inject(ThemeService);
}
