import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../core/api.service';
import { Aviso, Cliente, Cuenta, TipoCuenta, mensajeError } from '../core/models';

@Component({
  selector: 'app-cuentas',
  imports: [FormsModule, CurrencyPipe, RouterLink],
  templateUrl: './cuentas.html',
})
export class Cuentas implements OnInit {
  private api = inject(ApiService);
  lista = signal<Cuenta[]>([]);
  clientes = signal<Cliente[]>([]);
  tipos = signal<TipoCuenta[]>([]);
  aviso = signal<Aviso | null>(null);
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
      error: (e) => this.aviso.set({ tipo: 'error', texto: mensajeError(e) }),
    });
  }

  crear() {
    this.api.crearCuenta({ cliente_id: this.form.cliente_id!, tipo_cuenta_id: this.form.tipo_cuenta_id!, saldo_inicial: this.form.saldo_inicial ?? 0 }).subscribe({
      next: (r) => {
        this.aviso.set({ tipo: 'success', texto: `Cuenta ${r.datos.numero} creada y asociada al cliente.` });
        this.mostrarForm.set(false);
        this.form = { cliente_id: null, tipo_cuenta_id: null, saldo_inicial: 0 };
        this.cargar();
      },
      error: (e) => this.aviso.set({ tipo: 'error', texto: mensajeError(e) }),
    });
  }

  cambiarEstado(c: Cuenta) {
    const nuevo = c.estado === 'ACTIVA' ? 'INACTIVA' : 'ACTIVA';
    this.api.estadoCuenta(c.id, nuevo).subscribe({
      next: () => { this.aviso.set({ tipo: 'success', texto: `Cuenta ${c.numero} ahora está ${nuevo.toLowerCase()}.` }); this.cargar(); },
      error: (e) => this.aviso.set({ tipo: 'error', texto: mensajeError(e) }),
    });
  }
}
