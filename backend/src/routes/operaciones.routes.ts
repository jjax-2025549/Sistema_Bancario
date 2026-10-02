import { Router } from 'express';
import * as o from '../controllers/operaciones.controller';

const r = Router();
r.post('/depositos', o.deposito);
r.post('/retiros', o.retiro);
r.post('/transferencias', o.transferencia);
r.get('/transferencias', o.listarTransferencias);
export default r;
