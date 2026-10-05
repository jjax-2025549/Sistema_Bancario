import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { ToastService } from '../core/toast.service';
import { Cliente, Cuenta, TipoCuenta, mensajeError } from '../core/models';

@Component({
  selector: 'app-cuentas',
  imports: [FormsModule, CurrencyPipe, RouterLink],
  templateUrl: './cuentas.html',
})
export class Cuentas implements OnInit {
  private api = inject(ApiService);
  private toast = inject(ToastService);
  lista = signal<Cuenta[]>([]);
  clientes = signal<Cliente[]>([]);
  tipos = signal<TipoCuenta[]>([]);
  q = '';
  mostrarForm = signal(false);
  form: { cliente_id: number | null; tipo_cuenta_id: number | null; saldo_inicial: number } = { cliente_id: null, tipo_cuenta_id: null, saldo_inicial: 0 };

  ngOnInit() {
    this.cargar();
    this.api.clientes('', '1').subscribe((r) => this.clientes.set(r.datos));
    this.api.tiposCuenta().subscribe((r) => this.tipos.set(r.datos));
  }

  cargar() {
    this.api.cuentas(this.q).subscribe({
      next: (r) => this.lista.set(r.datos),
      error: (e) => this.toast.show('error', mensajeError(e)),
    });
  }

  crear() {
    this.api.crearCuenta({ cliente_id: this.form.cliente_id!, tipo_cuenta_id: this.form.tipo_cuenta_id!, saldo_inicial: this.form.saldo_inicial ?? 0 }).subscribe({
      next: (r) => {
        this.toast.show('success', `Cuenta ${r.datos.numero} creada y asociada al cliente.`);
        this.mostrarForm.set(false);
        this.form = { cliente_id: null, tipo_cuenta_id: null, saldo_inicial: 0 };
        this.cargar();
      },
      error: (e) => this.toast.show('error', mensajeError(e)),
    });
  }

  cambiarEstado(c: Cuenta) {
    const nuevo = c.estado === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA';
    this.api.estadoCuenta(c.id, nuevo).subscribe({
      next: () => { this.toast.show('success', `Cuenta ${c.numero} ahora está ${nuevo.toLowerCase()}.`); this.cargar(); },
      error: (e) => this.toast.show('error', mensajeError(e)),
    });
  }
}
