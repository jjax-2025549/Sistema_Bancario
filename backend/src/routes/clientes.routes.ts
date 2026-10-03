import { Router } from 'express';
import * as c from '../controllers/clientes.controller';

const r = Router();
r.get('/clientes', c.listar);
r.get('/clientes/:id', c.obtener);
r.post('/clientes', c.crear);
r.put('/clientes/:id', c.actualizar);
r.patch('/clientes/:id', c.actualizar);
r.patch('/clientes/:id/activar', c.activar);
r.delete('/clientes/:id', c.desactivar); // eliminacion logica (desactivar)
export default r;
