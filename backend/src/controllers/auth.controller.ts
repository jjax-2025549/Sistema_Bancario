import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/db';
import { env } from '../config/env';
import { HttpError } from '../utils/errors';

export async function login(req: Request, res: Response) {
  const { username, password } = req.body ?? {};
  if (!username || !password) throw new HttpError(400, 'Usuario y contraseña son obligatorios.');
  const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM usuario WHERE username = ? AND activo = 1', [String(username).trim()]);
  const u = rows[0];
  if (!u || !(await bcrypt.compare(String(password), u.password_hash))) {
    throw new HttpError(401, 'Credenciales inválidas.');
  }
  const payload = { id: u.id, username: u.username, nombre: u.nombre, rol: u.rol };
  const token = jwt.sign(payload, env.jwtSecret, { expiresIn: env.jwtExpires as jwt.SignOptions['expiresIn'] });
  res.json({ ok: true, token, usuario: payload });
}

export function logout(_req: Request, res: Response) {
  // JWT sin estado: el cierre real se hace descartando el token en el cliente.
  res.json({ ok: true, mensaje: 'Sesión cerrada correctamente.' });
}

export function me(req: Request, res: Response) {
  res.json({ ok: true, usuario: req.usuario });
}
