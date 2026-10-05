import { Router } from 'express';
import { soloRol } from '../middleware/auth';
import * as c from '../controllers/cuentas.controller';

const r = Router();
r.get('/tipos-cuenta', c.tipos);
r.get('/cuentas', c.listar);
r.get('/cuentas/:id', c.obtener);
r.post('/cuentas', c.crear);
r.put('/cuentas/:id', soloRol('ADMIN'), c.actualizar);
r.patch('/cuentas/:id', soloRol('ADMIN'), c.actualizar);
export default r;
