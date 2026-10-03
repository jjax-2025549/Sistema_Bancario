import fs from 'fs';
import path from 'path';
import mysql from 'mysql2/promise';
import { env } from './env';

// Ejecuta database/01_estructura.sql y database/02_datos_ficticios.sql (tablas + datos ficticios).
async function main() {
  const dir = path.resolve(__dirname, '../../../database');
  const archivos = ['01_estructura.sql', '02_datos_ficticios.sql'];
  const script = archivos
    .map((f) => fs.readFileSync(path.join(dir, f), 'utf8'))
    .join('\n')
    .replace(/^CREATE DATABASE .*;$/gm, '')
    .replace(/^USE .*;$/gm, '');

  const base = {
    host: env.db.host,
    port: env.db.port,
    user: env.db.user,
    password: env.db.password,
    ssl: env.db.ssl ? { rejectUnauthorized: false } : undefined,
  };

  try {
    const c0 = await mysql.createConnection(base);
    await c0.query(`CREATE DATABASE IF NOT EXISTS \`${env.db.database}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    await c0.end();
  } catch {
    console.log('Aviso: no se pudo crear la base (puede que ya exista o falten permisos). Se continúa...');
  }

  const conn = await mysql.createConnection({ ...base, database: env.db.database, multipleStatements: true });
  await conn.query(script);
  await conn.end();
  console.log(`Base de datos "${env.db.database}" inicializada con datos ficticios.`);
}

main().catch((e) => {
  console.error('Error inicializando la base de datos:', e.message);
  process.exit(1);
});
