import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/db';
import { HttpError } from '../utils/errors';
import * as v from '../utils/validar';
import * as ops from '../services/operaciones.service';

const desc = (b: any) => (b?.descripcion ? v.texto(b.descripcion, 'descripción', 1, 160) : null);

export async function deposito(req: Request, res: Response) {
  const r = await ops.depositar(v.idNum(req.body?.cuenta_id, 'cuenta_id'), v.monto(req.body?.monto), desc(req.body), req.usuario!.id);
  res.status(201).json({ ok: true, mensaje: 'Depósito registrado.', datos: r });
}

export async function retiro(req: Request, res: Response) {
  const r = await ops.retirar(v.idNum(req.body?.cuenta_id, 'cuenta_id'), v.monto(req.body?.monto), desc(req.body), req.usuario!.id);
  res.status(201).json({ ok: true, mensaje: 'Retiro registrado.', datos: r });
}

export async function transferencia(req: Request, res: Response) {
  const o = v.idNum(req.body?.cuenta_origen_id, 'cuenta_origen_id');
  const d = v.idNum(req.body?.cuenta_destino_id, 'cuenta_destino_id');
  const r = await ops.transferir(o, d, v.monto(req.body?.monto), desc(req.body), req.usuario!.id);
  res.status(201).json({ ok: true, mensaje: 'Transferencia realizada.', datos: r });
}

export async function listarTransferencias(_req: Request, res: Response) {
  const [rows] = await pool.query<RowDataPacket[]>(
    `SELECT t.*, o.numero AS cuenta_origen, d.numero AS cuenta_destino
     FROM transferencia t JOIN cuenta o ON o.id = t.cuenta_origen_id JOIN cuenta d ON d.id = t.cuenta_destino_id
     ORDER BY t.id DESC LIMIT 200`);
  res.json({ ok: true, datos: rows });
}

// POST /movimientos: punto de entrada genérico que delega en la operación adecuada.
export async function crearMovimiento(req: Request, res: Response) {
  const tipo = String(req.body?.tipo ?? '').toUpperCase();
  if (tipo === 'DEPOSITO') return deposito(req, res);
  if (tipo === 'RETIRO') return retiro(req, res);
  if (tipo === 'TRANSFERENCIA') return transferencia(req, res);
  throw new HttpError(400, 'Tipo inválido. Usa DEPOSITO, RETIRO o TRANSFERENCIA.');
}
