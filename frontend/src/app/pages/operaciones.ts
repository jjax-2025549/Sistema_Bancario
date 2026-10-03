import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { Aviso, Cuenta, mensajeError } from '../core/models';

type Pestana = 'deposito' | 'retiro' | 'transferencia';

@Component({
  selector: 'app-operaciones',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './operaciones.html',
})
export class Operaciones implements OnInit {
  private api = inject(ApiService);
  cuentas = signal<Cuenta[]>([]);
  aviso = signal<Aviso | null>(null);
  pestana = signal<Pestana>('deposito');
  enviando = false;

  cuentaId: number | null = null;
  origenId: number | null = null;
  destinoId: number | null = null;
  monto: number | null = null;
  descripcion = '';

  ngOnInit() { this.cargar(); }

  cargar() { this.api.cuentas().subscribe((r) => this.cuentas.set(r.datos)); }

  cambiar(p: Pestana) { this.pestana.set(p); this.aviso.set(null); }

  etiqueta(c: Cuenta) {
    return `${c.numero} · ${c.cliente}${c.estado !== 'ACTIVA' ? ' (inactiva)' : ''}`;
  }

  ejecutar() {
    this.enviando = true;
    this.aviso.set(null);
    const desc = this.descripcion.trim() || undefined;
    const monto = Number(this.monto);
    const p = this.pestana();

    const exito = (texto: string) => {
      this.aviso.set({ tipo: 'success', texto });
      this.enviando = false;
      this.monto = null;
      this.descripcion = '';
      this.cargar();
    };
    const fallo = (e: unknown) => { this.aviso.set({ tipo: 'error', texto: mensajeError(e) }); this.enviando = false; };
    const q = (n: number) => `Q${n.toFixed(2)}`;

    if (p === 'deposito') {
      this.api.deposito({ cuenta_id: this.cuentaId!, monto, descripcion: desc }).subscribe({ next: (r) => exito(`Depósito registrado. Nuevo saldo: ${q(r.datos.saldo)}.`), error: fallo });
    } else if (p === 'retiro') {
      this.api.retiro({ cuenta_id: this.cuentaId!, monto, descripcion: desc }).subscribe({ next: (r) => exito(`Retiro registrado. Nuevo saldo: ${q(r.datos.saldo)}.`), error: fallo });
    } else {
      this.api.transferencia({ cuenta_origen_id: this.origenId!, cuenta_destino_id: this.destinoId!, monto, descripcion: desc }).subscribe({
        next: (r) => exito(`Transferencia realizada. Saldo origen: ${q(r.datos.saldoOrigen)} · Saldo destino: ${q(r.datos.saldoDestino)}.`),
        error: fallo,
      });
    }
  }
}
