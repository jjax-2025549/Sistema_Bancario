/**
 * Pruebas P001–P010 (obligatorias) y P011–P015 (adicionales: roles y validaciones) contra la API en ejecución.
 * Uso:  (terminal 1) pnpm dev     (terminal 2) pnpm test:api
 * Requiere haber ejecutado antes:  pnpm db:init
 */
const BASE = process.env.API_URL ?? 'http://localhost:3000/api';
let token = '';
const resultados: { id: string; prueba: string; esperado: string; ok: boolean; detalle: string }[] = [];

async function api(metodo: string, ruta: string, body?: unknown, conToken = true) {
  const r = await fetch(BASE + ruta, {
    method: metodo,
    headers: { 'Content-Type': 'application/json', ...(conToken && token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: r.status, data: (await r.json()) as any };
}

function registrar(id: string, prueba: string, esperado: string, ok: boolean, detalle: string) {
  resultados.push({ id, prueba, esperado, ok, detalle });
  console.log(`${ok ? '✅' : '❌'} ${id} ${prueba} -> ${detalle}`);
}

async function main() {
  const sufijo = String(Date.now()).slice(-9);
  const dpiPrueba = `2${sufijo}0000`.slice(0, 13).padEnd(13, '0');

  // P001 / P002 Login
  const bad = await api('POST', '/auth/login', { username: 'admin', password: 'incorrecta' }, false);
  registrar('P002', 'Login inválido', 'Muestra mensaje de error', bad.status === 401 && !!bad.data.mensaje, `HTTP ${bad.status}: ${bad.data.mensaje}`);
  const good = await api('POST', '/auth/login', { username: 'admin', password: 'Admin123' }, false);
  token = good.data.token;
  registrar('P001', 'Login válido', 'Permite acceso', good.status === 200 && !!token, `HTTP ${good.status}`);

  // P003 Registrar cliente
  const cli = await api('POST', '/clientes', {
    nombre: 'Prueba', apellido: 'Automatica', dpi: dpiPrueba,
    email: `prueba${sufijo}@ejemplo.test`, telefono: '50255550000', direccion: 'Zona 1',
  });
  const clienteId = cli.data?.datos?.id;
  registrar('P003', 'Registrar cliente', 'Cliente almacenado', cli.status === 201 && !!clienteId, `HTTP ${cli.status} id=${clienteId}`);

  // P004 Crear cuenta (dos cuentas para probar transferencias)
  const c1 = await api('POST', '/cuentas', { cliente_id: clienteId, tipo_cuenta_id: 1, saldo_inicial: 100 });
  const c2 = await api('POST', '/cuentas', { cliente_id: clienteId, tipo_cuenta_id: 2, saldo_inicial: 0 });
  const a = c1.data?.datos?.id, b = c2.data?.datos?.id;
  const det = await api('GET', `/cuentas/${a}`);
  registrar('P004', 'Crear cuenta', 'Cuenta asociada al cliente', c1.status === 201 && det.data?.datos?.cliente_id === clienteId, `cuenta ${det.data?.datos?.numero} -> cliente ${det.data?.datos?.cliente_id}`);

  // P005 Depósito
  const dep = await api('POST', '/depositos', { cuenta_id: a, monto: 50 });
  registrar('P005', 'Depósito válido', 'Saldo incrementado', dep.status === 201 && dep.data.datos.saldo === 150, `saldo=${dep.data?.datos?.saldo}`);

  // P006 / P007 Retiros
  const ret = await api('POST', '/retiros', { cuenta_id: a, monto: 30 });
  registrar('P006', 'Retiro con saldo suficiente', 'Saldo disminuido', ret.status === 201 && ret.data.datos.saldo === 120, `saldo=${ret.data?.datos?.saldo}`);
  const ret2 = await api('POST', '/retiros', { cuenta_id: a, monto: 99999 });
  registrar('P007', 'Retiro superior al saldo', 'Operación rechazada', ret2.status === 422, `HTTP ${ret2.status}: ${ret2.data.mensaje}`);

  // P008 / P009 Transferencias
  const tr = await api('POST', '/transferencias', { cuenta_origen_id: a, cuenta_destino_id: b, monto: 20 });
  const sa = (await api('GET', `/cuentas/${a}`)).data.datos.saldo, sb = (await api('GET', `/cuentas/${b}`)).data.datos.saldo;
  registrar('P008', 'Transferencia válida', 'Se actualizan ambas cuentas', tr.status === 201 && sa === 100 && sb === 20, `origen=${sa} destino=${sb}`);
  const tr2 = await api('POST', '/transferencias', { cuenta_origen_id: a, cuenta_destino_id: a, monto: 5 });
  registrar('P009', 'Transferencia a misma cuenta', 'Operación rechazada', tr2.status === 422, `HTTP ${tr2.status}: ${tr2.data.mensaje}`);

  // P010 Cuenta inactiva
  await api('PATCH', `/cuentas/${a}`, { estado: 'INACTIVA' });
  const d2 = await api('POST', '/depositos', { cuenta_id: a, monto: 10 });
  const r3 = await api('POST', '/retiros', { cuenta_id: a, monto: 10 });
  const t3 = await api('POST', '/transferencias', { cuenta_origen_id: a, cuenta_destino_id: b, monto: 1 });
  registrar('P010', 'Cuenta inactiva', 'No permite operaciones', [d2, r3, t3].every((x) => x.status === 409), `depósito ${d2.status}, retiro ${r3.status}, transferencia ${t3.status}`);

  // P011-P015: pruebas adicionales (control de acceso por rol y validaciones)
  const tokenAdmin = token;
  const lc = await api('POST', '/auth/login', { username: 'cajero1', password: 'Cajero123' }, false);
  token = lc.data.token;
  const des = await api('DELETE', `/clientes/${clienteId}`);
  registrar('P011', 'Cajero intenta desactivar un cliente', 'Acceso denegado (403)', des.status === 403, `HTTP ${des.status}: ${des.data.mensaje}`);
  const lista = await api('GET', '/clientes');
  registrar('P012', 'Cajero consulta clientes', 'Permite la consulta (200)', lista.status === 200, `HTTP ${lista.status}`);
  token = tokenAdmin;
  const dep0 = await api('POST', '/depositos', { cuenta_id: b, monto: 0 });
  registrar('P013', 'Depósito con monto cero', 'Operación rechazada (400)', dep0.status === 400, `HTTP ${dep0.status}: ${dep0.data.mensaje}`);
  const dup = await api('POST', '/clientes', { nombre: 'Copia', apellido: 'Duplicada', dpi: dpiPrueba, email: `copia${sufijo}@ejemplo.test`, telefono: '50255550001' });
  registrar('P014', 'Registrar cliente con DPI repetido', 'Operación rechazada (409)', dup.status === 409, `HTTP ${dup.status}: ${dup.data.mensaje}`);
  const sin = await api('GET', '/cuentas', undefined, false);
  registrar('P015', 'Consultar cuentas sin sesión', 'Acceso denegado (401)', sin.status === 401, `HTTP ${sin.status}: ${sin.data.mensaje}`);

  const fallos = resultados.filter((r) => !r.ok).length;
  console.log(`\nResumen: ${resultados.length - fallos}/${resultados.length} pruebas aprobadas.`);
  process.exit(fallos ? 1 : 0);
}

main().catch((e) => { console.error('No se pudo conectar con la API. ¿Está corriendo "pnpm dev"?', e.message); process.exit(1); });
