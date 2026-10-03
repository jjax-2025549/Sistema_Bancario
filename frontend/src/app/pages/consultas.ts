import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Cliente, Cuenta, Movimiento, mensajeError } from '../core/models';
import { TipoMovPipe, esEntrada } from '../shared/tipo.pipe';

@Component({
  selector: 'app-consultas',
  imports: [FormsModule, CurrencyPipe, DatePipe, TipoMovPipe],
  templateUrl: './consultas.html',
})
export class Consultas {
  private api = inject(ApiService);
  q = '';
  clientes = signal<Cliente[]>([]);
  cuentas = signal<Cuenta[]>([]);
  buscado = signal(false);
  error = signal('');
  detalle = signal<{ numero: string; saldo: number; estado: string; movimientos: Movimiento[] } | null>(null);
  entrada = esEntrada;

  buscar() {
    const q = this.q.trim();
    if (!q) return;
    this.detalle.set(null);
    forkJoin({ c: this.api.clientes(q), a: this.api.cuentas(q) }).subscribe({
      next: ({ c, a }) => { this.clientes.set(c.datos); this.cuentas.set(a.datos); this.buscado.set(true); this.error.set(''); },
      error: (e) => this.error.set(mensajeError(e)),
    });
  }

  verCuenta(id: number) {
    this.api.movimientosCuenta(id).subscribe({
      next: (r) => this.detalle.set({ numero: r.cuenta.numero, saldo: r.cuenta.saldo, estado: r.cuenta.estado, movimientos: r.datos }),
      error: (e) => this.error.set(mensajeError(e)),
    });
  }
}
