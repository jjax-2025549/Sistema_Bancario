import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/db';
import { HttpError } from '../utils/errors';
import * as v from '../utils/validar';

const BASE = `SELECT m.*, c.numero AS cuenta, r.numero AS cuenta_relacionada, u.username AS usuario
              FROM movimiento m JOIN cuenta c ON c.id = m.cuenta_id
              LEFT JOIN cuenta r ON r.id = m.cuenta_relacionada_id JOIN usuario u ON u.id = m.usuario_id`;

export async function listar(req: Request, res: Response) {
  const params: any[] = [];
  let sql = BASE + ' WHERE 1=1';
  if (req.query.cuentaId) { sql += ' AND m.cuenta_id = ?'; params.push(v.idNum(req.query.cuentaId, 'cuentaId')); }
  if (req.query.tipo) { sql += ' AND m.tipo = ?'; params.push(String(req.query.tipo)); }
  if (req.query.desde) { sql += ' AND m.fecha >= ?'; params.push(`${req.query.desde} 00:00:00`); }
  if (req.query.hasta) { sql += ' AND m.fecha <= ?'; params.push(`${req.query.hasta} 23:59:59`); }
  const limite = Math.min(Number(req.query.limit ?? 200) || 200, 1000);
  const [rows] = await pool.query<RowDataPacket[]>(`${sql} ORDER BY m.id DESC LIMIT ${limite}`, params);
  res.json({ ok: true, datos: rows });
}

export async function porCuenta(req: Request, res: Response) {
  const id = v.idNum(req.params.id, 'cuenta');
  const [c] = await pool.query<RowDataPacket[]>('SELECT id, numero, saldo, estado FROM cuenta WHERE id = ?', [id]);
  if (!c.length) throw new HttpError(404, 'Cuenta no encontrada.');
  const [rows] = await pool.query<RowDataPacket[]>(`${BASE} WHERE m.cuenta_id = ? ORDER BY m.id DESC LIMIT 500`, [id]);
  res.json({ ok: true, cuenta: c[0], datos: rows });
}
