import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/db';
import { HttpError } from '../utils/errors';
import * as v from '../utils/validar';

const BASE = `SELECT c.*, t.nombre AS tipo, CONCAT(cl.nombre, ' ', cl.apellido) AS cliente
              FROM cuenta c JOIN tipo_cuenta t ON t.id = c.tipo_cuenta_id JOIN cliente cl ON cl.id = c.cliente_id`;

export async function listar(req: Request, res: Response) {
  const q = String(req.query.q ?? '').trim();
  const params: any[] = [];
  let sql = BASE + ' WHERE 1=1';
  if (q) {
    sql += ' AND (c.numero LIKE ? OR cl.nombre LIKE ? OR cl.apellido LIKE ? OR cl.dpi LIKE ?)';
    params.push(...Array(4).fill(`%${q}%`));
  }
  if (req.query.clienteId) {
    sql += ' AND c.cliente_id = ?';
    params.push(v.idNum(req.query.clienteId, 'clienteId'));
  }
  const [rows] = await pool.query<RowDataPacket[]>(sql + ' ORDER BY c.id DESC', params);
  res.json({ ok: true, datos: rows });
}

export async function obtener(req: Request, res: Response) {
  const [rows] = await pool.query<RowDataPacket[]>(BASE + ' WHERE c.id = ?', [v.idNum(req.params.id)]);
  if (!rows.length) throw new HttpError(404, 'Cuenta no encontrada.');
  res.json({ ok: true, datos: rows[0] });
}

export async function crear(req: Request, res: Response) {
  const clienteId = v.idNum(req.body?.cliente_id, 'cliente_id');
  const tipoId = v.idNum(req.body?.tipo_cuenta_id, 'tipo_cuenta_id');
  const inicial = req.body?.saldo_inicial === undefined || req.body?.saldo_inicial === '' ? 0 : Number(req.body.saldo_inicial);
  if (!Number.isFinite(inicial) || inicial < 0) throw new HttpError(400, 'El saldo inicial no puede ser negativo.');

  const [cl] = await pool.query<RowDataPacket[]>('SELECT activo FROM cliente WHERE id = ?', [clienteId]);
  if (!cl.length) throw new HttpError(404, 'El cliente no existe (una cuenta debe pertenecer a un cliente).');
  if (!cl[0].activo) throw new HttpError(409, 'El cliente está inactivo.');
  const [tp] = await pool.query<RowDataPacket[]>('SELECT id FROM tipo_cuenta WHERE id = ?', [tipoId]);
  if (!tp.length) throw new HttpError(404, 'El tipo de cuenta no existe.');

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const numero = `100-${String(Date.now()).slice(-7)}${Math.floor(Math.random() * 10)}`;
    const [r] = await conn.query<ResultSetHeader>(
      'INSERT INTO cuenta (numero, cliente_id, tipo_cuenta_id, saldo) VALUES (?, ?, ?, ?)', [numero, clienteId, tipoId, inicial]);
    if (inicial > 0) {
      await conn.query(
        `INSERT INTO movimiento (cuenta_id, tipo, monto, saldo_resultante, descripcion, usuario_id)
         VALUES (?, 'DEPOSITO', ?, ?, 'Depósito de apertura', ?)`, [r.insertId, inicial, inicial, req.usuario!.id]);
    }
    await conn.commit();
    res.status(201).json({ ok: true, mensaje: 'Cuenta creada.', datos: { id: r.insertId, numero, saldo: inicial } });
  } catch (e) {
    await conn.rollback();
    throw e;
  } finally {
    conn.release();
  }
}

export async function actualizar(req: Request, res: Response) {
  const id = v.idNum(req.params.id);
  const { estado, tipo_cuenta_id } = req.body ?? {};
  if (estado !== undefined && !['ACTIVA', 'INACTIVA'].includes(estado)) throw new HttpError(400, 'Estado inválido (ACTIVA | INACTIVA).');
  if (estado === undefined && tipo_cuenta_id === undefined) throw new HttpError(400, 'Nada que actualizar.');
  if (estado === 'ACTIVA') {
    const [c] = await pool.query<RowDataPacket[]>('SELECT cl.activo FROM cuenta c JOIN cliente cl ON cl.id = c.cliente_id WHERE c.id = ?', [id]);
    if (c.length && !c[0].activo) throw new HttpError(409, 'No se puede activar una cuenta de un cliente inactivo.');
  }
  const sets: string[] = [];
  const params: any[] = [];
  if (estado !== undefined) { sets.push('estado = ?'); params.push(estado); }
  if (tipo_cuenta_id !== undefined) { sets.push('tipo_cuenta_id = ?'); params.push(v.idNum(tipo_cuenta_id, 'tipo_cuenta_id')); }
  const [r] = await pool.query<ResultSetHeader>(`UPDATE cuenta SET ${sets.join(', ')} WHERE id = ?`, [...params, id]);
  if (!r.affectedRows) throw new HttpError(404, 'Cuenta no encontrada.');
  res.json({ ok: true, mensaje: 'Cuenta actualizada.' });
}

export async function tipos(_req: Request, res: Response) {
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM tipo_cuenta ORDER BY id');
  res.json({ ok: true, datos: rows });
}
