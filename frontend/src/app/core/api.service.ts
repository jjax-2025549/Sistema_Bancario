import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Cliente, Cuenta, Movimiento, Resp, ResumenData, TipoCuenta } from './models';

const API = '/api';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);

  private params(obj: Record<string, string | number | null | undefined>) {
    let p = new HttpParams();
    for (const [k, v] of Object.entries(obj)) if (v !== null && v !== undefined && v !== '') p = p.set(k, String(v));
    return p;
  }

  // Clientes
  clientes(q = '', activo = ''): Observable<Resp<Cliente[]>> { return this.http.get<Resp<Cliente[]>>(`${API}/clientes`, { params: this.params({ q, activo }) }); }
  crearCliente(c: Partial<Cliente>) { return this.http.post<Resp<Cliente>>(`${API}/clientes`, c); }
  actualizarCliente(id: number, c: Partial<Cliente>) { return this.http.put<Resp<null>>(`${API}/clientes/${id}`, c); }
  desactivarCliente(id: number) { return this.http.delete<Resp<null>>(`${API}/clientes/${id}`); }
  activarCliente(id: number) { return this.http.patch<Resp<null>>(`${API}/clientes/${id}/activar`, {}); }

  // Cuentas
  tiposCuenta() { return this.http.get<Resp<TipoCuenta[]>>(`${API}/tipos-cuenta`); }
  cuentas(q = ''): Observable<Resp<Cuenta[]>> { return this.http.get<Resp<Cuenta[]>>(`${API}/cuentas`, { params: this.params({ q }) }); }
  crearCuenta(c: { cliente_id: number; tipo_cuenta_id: number; saldo_inicial: number }) { return this.http.post<Resp<{ id: number; numero: string }>>(`${API}/cuentas`, c); }
  estadoCuenta(id: number, estado: 'ACTIVA' | 'INACTIVA') { return this.http.patch<Resp<null>>(`${API}/cuentas/${id}`, { estado }); }

  // Operaciones
  deposito(b: { cuenta_id: number; monto: number; descripcion?: string }) { return this.http.post<Resp<{ saldo: number }>>(`${API}/depositos`, b); }
  retiro(b: { cuenta_id: number; monto: number; descripcion?: string }) { return this.http.post<Resp<{ saldo: number }>>(`${API}/retiros`, b); }
  transferencia(b: { cuenta_origen_id: number; cuenta_destino_id: number; monto: number; descripcion?: string }) {
    return this.http.post<Resp<{ saldoOrigen: number; saldoDestino: number }>>(`${API}/transferencias`, b);
  }

  // Movimientos, consultas y reportes
  movimientos(f: { cuentaId?: number | null; tipo?: string; desde?: string; hasta?: string }) {
    return this.http.get<Resp<Movimiento[]>>(`${API}/movimientos`, { params: this.params(f) });
  }
  movimientosCuenta(id: number) { return this.http.get<Resp<Movimiento[]> & { cuenta: { numero: string; saldo: number; estado: string } }>(`${API}/movimientos/cuenta/${id}`); }
  resumen() { return this.http.get<Resp<ResumenData>>(`${API}/reportes/resumen`); }
}
