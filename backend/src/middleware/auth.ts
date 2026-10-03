import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { HttpError } from '../utils/errors';

export interface UsuarioToken {
  id: number;
  username: string;
  nombre: string;
  rol: 'ADMIN' | 'CAJERO';
}

declare global {
  namespace Express {
    interface Request {
      usuario?: UsuarioToken;
    }
  }
}

export function autenticar(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers.authorization ?? '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) throw new HttpError(401, 'Acceso denegado: falta el token de sesión.');
  try {
    req.usuario = jwt.verify(token, env.jwtSecret) as UsuarioToken;
    next();
  } catch {
    throw new HttpError(401, 'Sesión inválida o expirada. Inicia sesión nuevamente.');
  }
}

export function soloRol(...roles: UsuarioToken['rol'][]) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.usuario || !roles.includes(req.usuario.rol)) {
      throw new HttpError(403, 'No tienes permisos para realizar esta acción.');
    }
    next();
  };
}
