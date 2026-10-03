import { HttpError } from './errors';

export function texto(valor: unknown, campo: string, min = 2, max = 120): string {
  if (typeof valor !== 'string' || valor.trim().length < min) {
    throw new HttpError(400, `El campo "${campo}" es obligatorio (mínimo ${min} caracteres).`);
  }
  if (valor.trim().length > max) throw new HttpError(400, `El campo "${campo}" excede ${max} caracteres.`);
  return valor.trim();
}

export function email(valor: unknown): string {
  const v = texto(valor, 'email', 5, 120);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) throw new HttpError(400, 'El email no tiene un formato válido.');
  return v.toLowerCase();
}

export function dpi(valor: unknown): string {
  const v = String(valor ?? '').trim();
  if (!/^\d{13}$/.test(v)) throw new HttpError(400, 'El DPI ficticio debe tener 13 dígitos numéricos.');
  return v;
}

export function telefono(valor: unknown): string {
  const v = String(valor ?? '').trim();
  if (!/^\d{8,15}$/.test(v)) throw new HttpError(400, 'El teléfono debe tener entre 8 y 15 dígitos.');
  return v;
}

export function monto(valor: unknown, campo = 'monto'): number {
  const s = String(valor ?? '').trim();
  if (!/^\d+(\.\d{1,2})?$/.test(s)) throw new HttpError(400, `El ${campo} debe ser un número válido con máximo 2 decimales.`);
  const n = Number(s);
  if (n <= 0) throw new HttpError(400, `El ${campo} debe ser mayor que cero.`);
  if (n > 1_000_000_000) throw new HttpError(400, `El ${campo} excede el límite permitido.`);
  return n;
}

export function idNum(valor: unknown, campo = 'id'): number {
  const n = Number(valor);
  if (!Number.isInteger(n) || n <= 0) throw new HttpError(400, `El campo "${campo}" no es válido.`);
  return n;
}
