import { Injectable, computed, effect, signal } from '@angular/core';

export type ModoTema = 'claro' | 'oscuro' | 'auto';
export interface Acento { id: string; label: string; color: string; }

const CLAVE = 'sb_tema';

/**
 * Gestiona la apariencia: modo claro, oscuro o automático (según la hora del día)
 * y el color de acento. Guarda la preferencia en localStorage.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly acentos: Acento[] = [
    { id: 'azul', label: 'Azul', color: '#2f6fdc' },
    { id: 'verde', label: 'Verde', color: '#14a37a' },
    { id: 'violeta', label: 'Violeta', color: '#7c5cd6' },
    { id: 'ambar', label: 'Ámbar', color: '#d98a1c' },
    { id: 'grafito', label: 'Grafito', color: '#5b6b7b' },
  ];

  mode = signal<ModoTema>('auto');
  accent = signal<string>('azul');
  darkFrom = signal(19); // en modo automático: oscuro desde las 19:00
  darkTo = signal(6);    // ... hasta las 06:00
  private hora = signal(new Date().getHours());

  /** true si el tema aplicado en este momento es oscuro. */
  isDark = computed(() => {
    const m = this.mode();
    if (m === 'oscuro') return true;
    if (m === 'claro') return false;
    return ThemeService.esNoche(this.hora(), this.darkFrom(), this.darkTo());
  });

  constructor() {
    this.cargar();
    // Reevalúa la hora cada 30 s para que el modo automático cambie solo.
    setInterval(() => this.hora.set(new Date().getHours()), 30_000);
    effect(() => {
      const root = document.documentElement;
      root.setAttribute('data-theme', this.isDark() ? 'dark' : 'light');
      root.setAttribute('data-accent', this.accent());
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', this.isDark() ? '#0d1520' : '#f3f5f7');
      localStorage.setItem(CLAVE, JSON.stringify({
        mode: this.mode(), accent: this.accent(), darkFrom: this.darkFrom(), darkTo: this.darkTo(),
      }));
    });
  }

  static esNoche(hora: number, desde: number, hasta: number): boolean {
    return desde > hasta ? hora >= desde || hora < hasta : hora >= desde && hora < hasta;
  }

  setMode(m: ModoTema) { this.mode.set(m); }
  setAccent(id: string) { this.accent.set(id); }
  setRango(desde: number, hasta: number) { this.darkFrom.set(desde); this.darkTo.set(hasta); }

  private cargar() {
    try {
      const c = JSON.parse(localStorage.getItem(CLAVE) ?? '{}');
      if (['claro', 'oscuro', 'auto'].includes(c.mode)) this.mode.set(c.mode);
      if (this.acentos.some((a) => a.id === c.accent)) this.accent.set(c.accent);
      if (Number.isInteger(c.darkFrom)) this.darkFrom.set(c.darkFrom);
      if (Number.isInteger(c.darkTo)) this.darkTo.set(c.darkTo);
    } catch { /* preferencia corrupta: se ignora */ }
  }
}
