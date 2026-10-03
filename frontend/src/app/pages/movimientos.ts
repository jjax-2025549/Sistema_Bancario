import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  limpiar() { this.cuentaId = null; this.tipo = ''; this.desde = ''; this.hasta = ''; this.buscar(); }
}
