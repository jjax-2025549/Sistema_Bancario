import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../utils/errors';

export function noEncontrado(_req: Request, res: Response) {
  res.status(404).json({ ok: false, mensaje: 'Ruta no encontrada.' });
}

export function manejarErrores(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) return res.status(err.status).json({ ok: false, mensaje: err.message });
  if (err?.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({ ok: false, mensaje: 'Ya existe un registro con esos datos únicos (DPI, email o número).' });
  }
  console.error(err);
  res.status(500).json({ ok: false, mensaje: 'Error interno del servidor.' });
}
