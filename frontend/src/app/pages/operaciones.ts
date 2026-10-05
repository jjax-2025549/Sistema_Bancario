import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../core/api.service';
import { ToastService } from '../core/toast.service';
import { Cuenta, mensajeError } from '../core/models';

type Pestana = 'deposito' | 'retiro' | 'transferencia';

@Component({
  selector: 'app-operaciones',
  imports: [FormsModule, CurrencyPipe],
  templateUrl: './operaciones.html',
})
export class Operaciones implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  cuentas = signal<Cuenta[]>([]);
  pestana = signal<Pestana>('deposito');
  enviando = false;

  cuentaId: number | null = null;
  origenId: number | null = null;
  destinoId: number | null = null;
  monto: number | null = null;
  descripcion = '';

  ngOnInit() { this.cargar(); }

  cargar() { this.api.cuentas().subscribe((r) => this.cuentas.set(r.datos)); }

  rapidos = [50, 100, 500, 1000];

  cta(id: number | null) { return this.cuentas().find((c) => c.id === id) ?? null; }
  get cuentaPrincipal() { return this.cta(this.pestana() === 'transferencia' ? this.origenId : this.cuentaId); }
  get estimado(): number | null {
    const c = this.cuentaPrincipal, m = Number(this.monto);
    if (!c || !m || m <= 0) return null;
    return Number((this.pestana() === 'deposito' ? c.saldo + m : c.saldo - m).toFixed(2));
  }
  get excede() { return this.pestana() !== 'deposito' && this.estimado !== null && this.estimado < 0; }
  sumar(n: number) { this.monto = Number((Number(this.monto || 0) + n).toFixed(2)); }

  cambiar(p: Pestana) { this.pestana.set(p); }

  etiqueta(c: Cuenta) {
    return `${c.numero} · ${c.cliente}${c.estado !== 'ACTIVA' ? ' (inactiva)' : ''}`;
  }

  ejecutar() {
    this.enviando = true;
    const desc = this.descripcion.trim() || undefined;
    const monto = Number(this.monto);
    const p = this.pestana();

    const exito = (texto: string) => {
      this.toast.show('success', texto);
      this.enviando = false;
      this.monto = null;
      this.descripcion = '';
      this.cargar();
    };
    const fallo = (e: unknown) => { this.toast.show('error', mensajeError(e)); this.enviando = false; };
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
