import { Router } from 'express';
import { soloRol } from '../middleware/auth';
import * as c from '../controllers/clientes.controller';

const r = Router();
r.get('/clientes', c.listar);
r.get('/clientes/:id', c.obtener);
r.post('/clientes', c.crear);
r.put('/clientes/:id', c.actualizar);
r.patch('/clientes/:id', c.actualizar);
r.patch('/clientes/:id/activar', soloRol('ADMIN'), c.activar);
r.delete('/clientes/:id', soloRol('ADMIN'), c.desactivar); // eliminacion logica (desactivar)
export default r;
