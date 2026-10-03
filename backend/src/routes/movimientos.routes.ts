import { Router } from 'express';
import * as m from '../controllers/movimientos.controller';
import { crearMovimiento } from '../controllers/operaciones.controller';

const r = Router();
r.get('/movimientos', m.listar);
r.get('/movimientos/cuenta/:id', m.porCuenta);
r.post('/movimientos', crearMovimiento);
export default r;
