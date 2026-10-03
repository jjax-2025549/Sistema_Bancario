import { PoolConnection, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/db';
import { HttpError } from '../utils/errors';

async function conTransaccion<T>(fn: (c: PoolConnection) => Promise<T>): Promise<T> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const r = await fn(conn);
    await conn.commit();
    return r;
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

// Bloquea la cuenta (FOR UPDATE) y valida reglas: existe y está ACTIVA (regla 9).
async function cuentaActiva(c: PoolConnection, id: number, etiqueta = 'La cuenta'): Promise<RowDataPacket> {
  const [rows] = await c.query<RowDataPacket[]>('SELECT * FROM cuenta WHERE id = ? FOR UPDATE', [id]);
  if (!rows.length) throw new HttpError(404, `${etiqueta} no existe.`);
  if (rows[0].estado !== 'ACTIVA') throw new HttpError(409, `${etiqueta} está inactiva y no puede realizar operaciones.`);
  return rows[0];
}

export async function depositar(cuentaId: number, monto: number, descripcion: string | null, usuarioId: number) {
  return conTransaccion(async (c) => {
    const cuenta = await cuentaActiva(c, cuentaId);
    const nuevo = Number(cuenta.saldo) + monto;
    await c.query('UPDATE cuenta SET saldo = ? WHERE id = ?', [nuevo, cuentaId]);
    const [r] = await c.query<ResultSetHeader>(
      `INSERT INTO movimiento (cuenta_id, tipo, monto, saldo_resultante, descripcion, usuario_id)
       VALUES (?, 'DEPOSITO', ?, ?, ?, ?)`,
      [cuentaId, monto, nuevo, descripcion ?? 'Depósito', usuarioId],
    );
    return { movimientoId: r.insertId, cuentaId, tipo: 'DEPOSITO', monto, saldo: nuevo };
  });
}

export async function retirar(cuentaId: number, monto: number, descripcion: string | null, usuarioId: number) {
  return conTransaccion(async (c) => {
    const cuenta = await cuentaActiva(c, cuentaId);
    if (monto > Number(cuenta.saldo)) throw new HttpError(422, 'Saldo insuficiente: el retiro supera el saldo disponible.');
    const nuevo = Number((Number(cuenta.saldo) - monto).toFixed(2));
    await c.query('UPDATE cuenta SET saldo = ? WHERE id = ?', [nuevo, cuentaId]);
    const [r] = await c.query<ResultSetHeader>(
      `INSERT INTO movimiento (cuenta_id, tipo, monto, saldo_resultante, descripcion, usuario_id)
       VALUES (?, 'RETIRO', ?, ?, ?, ?)`,
      [cuentaId, monto, nuevo, descripcion ?? 'Retiro', usuarioId],
    );
    return { movimientoId: r.insertId, cuentaId, tipo: 'RETIRO', monto, saldo: nuevo };
  });
}

export async function transferir(origenId: number, destinoId: number, monto: number, descripcion: string | null, usuarioId: number) {
  if (origenId === destinoId) throw new HttpError(422, 'No se permite transferir hacia la misma cuenta.');
  return conTransaccion(async (c) => {
    // Bloqueo en orden ascendente para evitar deadlocks
    const [primero, segundo] = origenId < destinoId ? [origenId, destinoId] : [destinoId, origenId];
    const a = await cuentaActiva(c, primero, primero === origenId ? 'La cuenta origen' : 'La cuenta destino');
    const b = await cuentaActiva(c, segundo, segundo === origenId ? 'La cuenta origen' : 'La cuenta destino');
    const origen = a.id === origenId ? a : b;
    const destino = a.id === destinoId ? a : b;

    if (monto > Number(origen.saldo)) throw new HttpError(422, 'Saldo insuficiente en la cuenta origen.');
    const saldoO = Number((Number(origen.saldo) - monto).toFixed(2));
    const saldoD = Number((Number(destino.saldo) + monto).toFixed(2));

    const [t] = await c.query<ResultSetHeader>(
      'INSERT INTO transferencia (cuenta_origen_id, cuenta_destino_id, monto, descripcion, usuario_id) VALUES (?, ?, ?, ?, ?)',
      [origenId, destinoId, monto, descripcion ?? 'Transferencia', usuarioId],
    );
    await c.query('UPDATE cuenta SET saldo = ? WHERE id = ?', [saldoO, origenId]);
    await c.query('UPDATE cuenta SET saldo = ? WHERE id = ?', [saldoD, destinoId]);
    await c.query(
      `INSERT INTO movimiento (cuenta_id, tipo, monto, saldo_resultante, cuenta_relacionada_id, transferencia_id, descripcion, usuario_id)
       VALUES (?, 'TRANSFERENCIA_ENVIADA', ?, ?, ?, ?, ?, ?), (?, 'TRANSFERENCIA_RECIBIDA', ?, ?, ?, ?, ?, ?)`,
      [
        origenId, monto, saldoO, destinoId, t.insertId, descripcion ?? 'Transferencia enviada', usuarioId,
        destinoId, monto, saldoD, origenId, t.insertId, descripcion ?? 'Transferencia recibida', usuarioId,
      ],
    );
    return { transferenciaId: t.insertId, origenId, destinoId, monto, saldoOrigen: saldoO, saldoDestino: saldoD };
  });
}
