import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastService } from '../core/toast.service';
import { ApiService } from '../core/api.service';
import { Cuenta, Movimiento, mensajeError } from '../core/models';
import { TipoMovPipe, esEntrada } from '../shared/tipo.pipe';

@Component({
  selector: 'app-movimientos',
  imports: [FormsModule, CurrencyPipe, DatePipe, TipoMovPipe],
  templateUrl: './movimientos.html',
})
export class Movimientos implements OnInit {
  private api = inject(ApiService);
  private ruta = inject(ActivatedRoute);
  private toast = inject(ToastService);
  lista = signal<Movimiento[]>([]);
  cuentas = signal<Cuenta[]>([]);
  error = signal('');
  cuentaId: number | null = null;
  tipo = '';
  desde = '';
  hasta = '';
  entrada = esEntrada;

  ngOnInit() {
    const c = Number(this.ruta.snapshot.queryParamMap.get('cuenta'));
    if (c) this.cuentaId = c;
    this.api.cuentas().subscribe((r) => this.cuentas.set(r.datos));
    this.buscar();
  }

  buscar() {
    this.api.movimientos({ cuentaId: this.cuentaId, tipo: this.tipo, desde: this.desde, hasta: this.hasta }).subscribe({
      next: (r) => { this.lista.set(r.datos); this.error.set(''); },
      error: (e) => this.error.set(mensajeError(e)),
    });
  }

  exportar() {
    const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const enc = ['Fecha', 'Cuenta', 'Tipo', 'Cuenta relacionada', 'Monto', 'Saldo resultante', 'Usuario', 'Descripción'];
    const filas = this.lista().map((m) => [new Date(m.fecha).toLocaleString('es-GT'), m.cuenta, m.tipo, m.cuenta_relacionada ?? '', m.monto, m.saldo_resultante, m.usuario, m.descripcion ?? ''].map(q).join(','));
    const blob = new Blob(['\ufeff' + [enc.map(q).join(','), ...filas].join('\n')], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `movimientos_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
    this.toast.show('success', `Se exportaron ${filas.length} movimientos a CSV.`);
  }

  imprimir() { window.print(); }

  limpiar() { this.cuentaId = null; this.tipo = ''; this.desde = ''; this.hasta = ''; this.buscar(); }
}
