import dotenv from 'dotenv';
dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 3000),
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'sistema_bancario',
    ssl: process.env.DB_SSL === 'true',
  },
  jwtSecret: process.env.JWT_SECRET ?? 'secreto_academico_por_defecto',
  jwtExpires: process.env.JWT_EXPIRES ?? '8h',
};
