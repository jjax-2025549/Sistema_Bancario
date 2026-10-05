import { Injectable, signal } from '@angular/core';

export interface Toast { id: number; tipo: 'success' | 'error' | 'warn'; texto: string; }

/** Notificaciones emergentes (toasts) que desaparecen solas. */
@Injectable({ providedIn: 'root' })
export class ToastService {
  items = signal<Toast[]>([]);
  private n = 0;

  show(tipo: Toast['tipo'], texto: string, ms = 4500) {
    const id = ++this.n;
    this.items.update((l) => [...l, { id, tipo, texto }]);
    setTimeout(() => this.close(id), ms);
  }

  close(id: number) { this.items.update((l) => l.filter((t) => t.id !== id)); }
}
