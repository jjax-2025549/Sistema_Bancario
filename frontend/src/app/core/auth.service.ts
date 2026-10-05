import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, of, tap } from 'rxjs';
import { LoginRes, Usuario } from './models';

const K_TOKEN = 'sb_token';
const K_USER = 'sb_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  usuario = signal<Usuario | null>(this.leerUsuario());

  esAdmin = computed(() => this.usuario()?.rol === 'ADMIN');

  private leerUsuario(): Usuario | null {
    try { return JSON.parse(localStorage.getItem(K_USER) ?? 'null'); } catch { return null; }
  }
  get token(): string | null { return localStorage.getItem(K_TOKEN); }
  get autenticado(): boolean { return !!this.token; }

  login(username: string, password: string) {
    return this.http.post<LoginRes>('/api/auth/login', { username, password }).pipe(
      tap((r) => {
        localStorage.setItem(K_TOKEN, r.token);
        localStorage.setItem(K_USER, JSON.stringify(r.usuario));
        this.usuario.set(r.usuario);
      }),
    );
  }

  limpiar() {
    localStorage.removeItem(K_TOKEN);
    localStorage.removeItem(K_USER);
    this.usuario.set(null);
  }

  logout() {
    this.http.post('/api/auth/logout', {}).pipe(catchError(() => of(null))).subscribe(() => {
      this.limpiar();
      this.router.navigate(['/login']);
    });
  }
}
