import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { AuthService } from '../core/auth.service';
import { CountUp } from '../shared/count-up';
import { ApiService } from '../core/api.service';
import { ResumenData, mensajeError } from '../core/models';
import { TipoMovPipe } from '../shared/tipo.pipe';

@Component({
  selector: 'app-resumen',
  imports: [CurrencyPipe, DatePipe, TipoMovPipe, CountUp],
  templateUrl: './resumen.html',
})
export class Resumen implements OnInit {
  private api = inject(ApiService);
  private auth = inject(AuthService);
  nombre = (this.auth.usuario()?.nombre ?? '').split(' ')[0];
  saludo = (() => { const h = new Date().getHours(); return h < 12 ? 'Buenos días' : h < 19 ? 'Buenas tardes' : 'Buenas noches'; })();
  hoy = new Date();
  datos = signal<ResumenData | null>(null);
  error = signal('');

  ngOnInit() {
    this.api.resumen().subscribe({
      next: (r) => this.datos.set(r.datos),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }

  montos(d: ResumenData) { return d.porTipo.map((t) => t.monto_total); }
  ops(d: ResumenData) { return d.porDia.map((x) => x.operaciones); }

  ancho(valor: number, lista: number[]): string {
    const max = Math.max(...lista.map(Number), 1);
    return `${(Number(valor) / max) * 100}%`;
  }
}
