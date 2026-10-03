import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModoTema, ThemeService } from '../core/theme.service';

@Component({
  selector: 'app-theme-selector',
  imports: [FormsModule],
  templateUrl: './theme-selector.html',
})
export class ThemeSelector {
  theme = inject(ThemeService);
  private el = inject(ElementRef<HTMLElement>);
  abierto = signal(false);
  horas = Array.from({ length: 24 }, (_, i) => i);
  modos: { id: ModoTema; label: string }[] = [
    { id: 'claro', label: 'Claro' },
    { id: 'oscuro', label: 'Oscuro' },
    { id: 'auto', label: 'Automático' },
  ];

  hh(h: number) { return `${String(h).padStart(2, '0')}:00`; }

  @HostListener('document:click', ['$event'])
  fuera(e: Event) { if (!this.el.nativeElement.contains(e.target)) this.abierto.set(false); }

  @HostListener('document:keydown.escape')
  cerrar() { this.abierto.set(false); }
}
