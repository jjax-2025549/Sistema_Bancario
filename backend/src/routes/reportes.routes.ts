import { Router } from 'express';
import * as r0 from '../controllers/reportes.controller';

const r = Router();
r.get('/reportes/resumen', r0.resumen);
export default r;
