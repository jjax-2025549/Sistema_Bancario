import { Router } from 'express';
import { autenticar } from '../middleware/auth';
import authRoutes from './auth.routes';
import clientesRoutes from './clientes.routes';
import cuentasRoutes from './cuentas.routes';
import operacionesRoutes from './operaciones.routes';
import movimientosRoutes from './movimientos.routes';
import reportesRoutes from './reportes.routes';

const r = Router();

r.get('/health', (_req, res) => res.json({ ok: true, servicio: 'Sistema Bancario API', hora: new Date().toISOString() }));
r.use(authRoutes);

// Todo lo que sigue requiere sesion iniciada (token JWT)
r.use(autenticar);
r.use(clientesRoutes);
r.use(cuentasRoutes);
r.use(operacionesRoutes);
r.use(movimientosRoutes);
r.use(reportesRoutes);

export default r;
