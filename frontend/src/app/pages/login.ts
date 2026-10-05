import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../core/auth.service';
import { mensajeError } from '../core/models';
import { ThemeSelector } from '../shared/theme-selector';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ThemeSelector],
  templateUrl: './login.html',
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  username = '';
  password = '';
  error = signal('');
  cargando = signal(false);
  mostrar = signal(false);

  constructor() {
    if (this.auth.autenticado) this.router.navigate(['/resumen']);
  }

  entrar() {
    this.error.set('');
    this.cargando.set(true);
    this.auth.login(this.username.trim(), this.password).subscribe({
      next: () => this.router.navigate(['/resumen']),
      error: (e) => { this.error.set(mensajeError(e)); this.cargando.set(false); },
    });
  }
}
