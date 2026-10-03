import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';
import { Aviso, Cliente, Resp, mensajeError } from '../core/models';

const vacio = () => ({ nombre: '', apellido: '', dpi: '', email: '', telefono: '', direccion: '' });

@Component({
  selector: 'app-clientes',
  imports: [FormsModule],
  templateUrl: './clientes.html',
})
export class Clientes implements OnInit {
  private api = inject(ApiService);
  lista = signal<Cliente[]>([]);
  aviso = signal<Aviso | null>(null);
  q = '';
  filtroActivo = '';
  mostrarForm = signal(false);
  editId: number | null = null;
  form = vacio();
  guardando = false;

  ngOnInit() { this.cargar(); }

  cargar() {
    this.api.clientes(this.q, this.filtroActivo).subscribe({
      next: (r) => this.lista.set(r.datos),
      error: (e) => this.aviso.set({ tipo: 'error', texto: mensajeError(e) }),
    });
  }

  nuevo() { this.editId = null; this.form = vacio(); this.mostrarForm.set(true); this.aviso.set(null); }

  editar(c: Cliente) {
    this.editId = c.id;
    this.form = { nombre: c.nombre, apellido: c.apellido, dpi: c.dpi, email: c.email, telefono: c.telefono, direccion: c.direccion ?? '' };
    this.mostrarForm.set(true);
    this.aviso.set(null);
  }

  cancelar() { this.mostrarForm.set(false); this.editId = null; }

  guardar() {
    this.guardando = true;
    const peticion: Observable<Resp<unknown>> = this.editId ? this.api.actualizarCliente(this.editId, this.form) : this.api.crearCliente(this.form);
    peticion.subscribe({
      next: (r) => {
        this.aviso.set({ tipo: 'success', texto: r.mensaje ?? 'Cliente guardado.' });
        this.guardando = false;
        this.mostrarForm.set(false);
        this.cargar();
      },
      error: (e) => { this.aviso.set({ tipo: 'error', texto: mensajeError(e) }); this.guardando = false; },
    });
  }

  cambiarEstado(c: Cliente) {
    if (c.activo && !confirm(`¿Desactivar a ${c.nombre} ${c.apellido}? Sus cuentas también quedarán inactivas.`)) return;
    const obs = c.activo ? this.api.desactivarCliente(c.id) : this.api.activarCliente(c.id);
    obs.subscribe({
      next: (r) => { this.aviso.set({ tipo: 'success', texto: r.mensaje ?? 'Estado actualizado.' }); this.cargar(); },
      error: (e) => this.aviso.set({ tipo: 'error', texto: mensajeError(e) }),
    });
  }
}
