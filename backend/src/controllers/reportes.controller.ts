import { Request, Response } from 'express';
import { RowDataPacket } from 'mysql2/promise';
import { pool } from '../config/db';

export async function resumen(_req: Request, res: Response) {
  const [[tot]] = await pool.query<RowDataPacket[][]>(
    `SELECT (SELECT COUNT(*) FROM cliente WHERE activo = 1) AS clientes_activos,
            (SELECT COUNT(*) FROM cuenta WHERE estado = 'ACTIVA') AS cuentas_activas,
            (SELECT COALESCE(SUM(saldo),0) FROM cuenta WHERE estado = 'ACTIVA') AS saldo_total,
            (SELECT COUNT(*) FROM movimiento) AS total_movimientos`);
  const [porTipo] = await pool.query<RowDataPacket[]>(
    `SELECT tipo, COUNT(*) AS cantidad, COALESCE(SUM(monto),0) AS monto_total FROM movimiento GROUP BY tipo`);
  const [porDia] = await pool.query<RowDataPacket[]>(
    `SELECT DATE_FORMAT(fecha, '%Y-%m-%d') AS dia, COUNT(*) AS operaciones, COALESCE(SUM(monto),0) AS monto
     FROM movimiento WHERE fecha >= (NOW() - INTERVAL 7 DAY) GROUP BY dia ORDER BY dia`);
  const [ultimos] = await pool.query<RowDataPacket[]>(
    `SELECT m.id, m.tipo, m.monto, m.fecha, c.numero AS cuenta FROM movimiento m JOIN cuenta c ON c.id = m.cuenta_id ORDER BY m.id DESC LIMIT 5`);
  res.json({ ok: true, datos: { totales: tot, porTipo, porDia, ultimos } });
}
