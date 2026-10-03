import { Request, Response } from 'express';
import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/db';
import { HttpError } from '../utils/errors';
import * as v from '../utils/validar';

function datos(b: any) {
  return {
    nombre: v.texto(b?.nombre, 'nombre', 2, 80),
    apellido: v.texto(b?.apellido, 'apellido', 2, 80),
    dpi: v.dpi(b?.dpi),
    email: v.email(b?.email),
    telefono: v.telefono(b?.telefono),
    direccion: b?.direccion ? v.texto(b.direccion, 'dirección', 3, 160) : null,
  };
}

export async function listar(req: Request, res: Response) {
  const q = String(req.query.q ?? '').trim();
  const params: any[] = [];
  let sql = 'SELECT * FROM cliente WHERE 1=1';
  if (q) {
    sql += ' AND (nombre LIKE ? OR apellido LIKE ? OR dpi LIKE ? OR email LIKE ?)';
    params.push(...Array(4).fill(`%${q}%`));
  }
  if (req.query.activo === '1' || req.query.activo === '0') {
    sql += ' AND activo = ?';
    params.push(Number(req.query.activo));
  }
  const [rows] = await pool.query<RowDataPacket[]>(sql + ' ORDER BY id DESC', params);
  res.json({ ok: true, datos: rows });
}

export async function obtener(req: Request, res: Response) {
  const id = v.idNum(req.params.id);
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM cliente WHERE id = ?', [id]);
  if (!rows.length) throw new HttpError(404, 'Cliente no encontrado.');
  const [cuentas] = await pool.query<RowDataPacket[]>(
    'SELECT c.*, t.nombre AS tipo FROM cuenta c JOIN tipo_cuenta t ON t.id = c.tipo_cuenta_id WHERE c.cliente_id = ?', [id]);
  res.json({ ok: true, datos: { ...rows[0], cuentas } });
}

export async function crear(req: Request, res: Response) {
  const d = datos(req.body);
  const [r] = await pool.query<ResultSetHeader>(
    'INSERT INTO cliente (nombre, apellido, dpi, email, telefono, direccion) VALUES (?, ?, ?, ?, ?, ?)',
    [d.nombre, d.apellido, d.dpi, d.email, d.telefono, d.direccion]);
  res.status(201).json({ ok: true, mensaje: 'Cliente registrado.', datos: { id: r.insertId, ...d, activo: 1 } });
}

export async function actualizar(req: Request, res: Response) {
  const id = v.idNum(req.params.id);
  const d = datos(req.body);
  const [r] = await pool.query<ResultSetHeader>(
    'UPDATE cliente SET nombre=?, apellido=?, dpi=?, email=?, telefono=?, direccion=? WHERE id=?',
    [d.nombre, d.apellido, d.dpi, d.email, d.telefono, d.direccion, id]);
  if (!r.affectedRows) throw new HttpError(404, 'Cliente no encontrado.');
  res.json({ ok: true, mensaje: 'Cliente actualizado.' });
}

// DELETE lógico: desactiva al cliente y sus cuentas (regla 9).
export async function desactivar(req: Request, res: Response) {
  const id = v.idNum(req.params.id);
  const [r] = await pool.query<ResultSetHeader>('UPDATE cliente SET activo = 0 WHERE id = ?', [id]);
  if (!r.affectedRows) throw new HttpError(404, 'Cliente no encontrado.');
  await pool.query("UPDATE cuenta SET estado = 'INACTIVA' WHERE cliente_id = ?", [id]);
  res.json({ ok: true, mensaje: 'Cliente y sus cuentas fueron desactivados.' });
}

export async function activar(req: Request, res: Response) {
  const id = v.idNum(req.params.id);
  const [r] = await pool.query<ResultSetHeader>('UPDATE cliente SET activo = 1 WHERE id = ?', [id]);
  if (!r.affectedRows) throw new HttpError(404, 'Cliente no encontrado.');
  res.json({ ok: true, mensaje: 'Cliente reactivado. Reactiva sus cuentas manualmente si corresponde.' });
}
