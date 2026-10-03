import { Router } from 'express';
import { autenticar } from '../middleware/auth';
import * as auth from '../controllers/auth.controller';

const r = Router();
r.post('/auth/login', auth.login);
r.post('/auth/logout', autenticar, auth.logout);
r.get('/auth/me', autenticar, auth.me);
export default r;
