import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { env } from './config/env';
import routes from './routes';
import { manejarErrores, noEncontrado } from './middleware/error';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api', routes);
app.use('/api', noEncontrado);

// En producción (Render) el backend también sirve el frontend Angular compilado.
const front = path.resolve(__dirname, '../../frontend/dist/frontend/browser');
if (fs.existsSync(front)) {
  app.use(express.static(front));
  app.use((req, res, next) => {
    if (req.method !== 'GET') return next();
    res.sendFile(path.join(front, 'index.html'));
  });
}

app.use(manejarErrores);

app.listen(env.port, () => console.log(`API Sistema Bancario escuchando en http://localhost:${env.port}`));
