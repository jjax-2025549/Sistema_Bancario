export interface Usuario { id: number; username: string; nombre: string; rol: 'ADMIN' | 'CAJERO'; }
export interface LoginRes { ok: boolean; token: string; usuario: Usuario; }

export interface Cliente {
  id: number; nombre: string; apellido: string; dpi: string; email: string;
  telefono: string; direccion: string | null; activo: number;
}
export interface TipoCuenta { id: number; nombre: string; descripcion: string | null; }
export interface Cuenta {
  id: number; numero: string; cliente_id: number; tipo_cuenta_id: number;
  saldo: number; estado: 'ACTIVA' | 'INACTIVA'; tipo: string; cliente: string;
}
export type TipoMov = 'DEPOSITO' | 'RETIRO' | 'TRANSFERENCIA_ENVIADA' | 'TRANSFERENCIA_RECIBIDA';
export interface Movimiento {
  id: number; cuenta_id: number; cuenta: string; tipo: TipoMov; monto: number; saldo_resultante: number;
  cuenta_relacionada: string | null; descripcion: string | null; usuario: string; fecha: string;
}
export interface ResumenData {
  totales: { clientes_activos: number; cuentas_activas: number; saldo_total: number; total_movimientos: number };
  porTipo: { tipo: TipoMov; cantidad: number; monto_total: number }[];
  porDia: { dia: string; operaciones: number; monto: number }[];
  ultimos: { id: number; tipo: TipoMov; monto: number; fecha: string; cuenta: string }[];
}
export interface Resp<T> { ok: boolean; mensaje?: string; datos: T; }
export interface Aviso { tipo: 'success' | 'error' | 'warn'; texto: string; }

export function mensajeError(e: any): string {
  return e?.error?.mensaje ?? 'No se pudo conectar con el servidor. Verifica que la API esté en ejecución.';
}
