# Endpoints de la API

Base: `http://localhost:3000/api`. Todas las rutas (excepto `health` y `auth/login`) requieren el encabezado `Authorization: Bearer <token>`.
Formato de respuesta: `{ ok, mensaje?, datos? }`. Errores: `{ ok: false, mensaje }`.

| Recurso | Método y ruta | Descripción | Códigos |
|---|---|---|---|
| Salud | `GET /health` | Estado de la API | 200 |
| Autenticación | `POST /auth/login` | Inicia sesión y devuelve el token | 200, 400, 401 |
| | `POST /auth/logout` | Cierra la sesión | 200 |
| | `GET /auth/me` | Usuario de la sesión | 200, 401 |
| Clientes | `GET /clientes?q=&activo=` | Lista/busca clientes | 200 |
| | `GET /clientes/:id` | Cliente con sus cuentas | 200, 404 |
| | `POST /clientes` | Registra un cliente | 201, 400, 409 |
| | `PUT/PATCH /clientes/:id` | Modifica un cliente | 200, 400, 404, 409 |
| | `DELETE /clientes/:id` | Desactivación lógica (cliente + cuentas) | 200, 404 |
| | `PATCH /clientes/:id/activar` | Reactiva un cliente | 200, 404 |
| Cuentas | `GET /tipos-cuenta` | Tipos de cuenta | 200 |
| | `GET /cuentas?q=&clienteId=` | Lista/busca cuentas | 200 |
| | `GET /cuentas/:id` | Cuenta con saldo | 200, 404 |
| | `POST /cuentas` | Crea cuenta `{cliente_id, tipo_cuenta_id, saldo_inicial}` | 201, 404, 409 |
| | `PUT/PATCH /cuentas/:id` | Actualiza `estado` o `tipo_cuenta_id` | 200, 400, 404 |
| Depósitos | `POST /depositos` | `{cuenta_id, monto, descripcion?}` | 201, 400, 404, 409 |
| Retiros | `POST /retiros` | `{cuenta_id, monto, descripcion?}` | 201, 400, 404, 409, 422 |
| Transferencias | `POST /transferencias` | `{cuenta_origen_id, cuenta_destino_id, monto, descripcion?}` | 201, 400, 404, 409, 422 |
| | `GET /transferencias` | Historial de transferencias | 200 |
| Movimientos | `GET /movimientos?cuentaId=&tipo=&desde=&hasta=&limit=` | Historial con filtros | 200 |
| | `GET /movimientos/cuenta/:id` | Movimientos de una cuenta | 200, 404 |
| | `POST /movimientos` | Genérico: `{tipo: DEPOSITO\|RETIRO\|TRANSFERENCIA, ...}` | 201, 400 |
| Reportes | `GET /reportes/resumen` | Totales, monto por tipo, actividad 7 días, últimos movimientos | 200 |

## Códigos de error usados
- **400** dato inválido o campo obligatorio faltante.
- **401** sin sesión o credenciales inválidas.
- **404** recurso inexistente.
- **409** conflicto (cuenta inactiva, DPI/correo duplicado).
- **422** regla de negocio incumplida (saldo insuficiente, misma cuenta).

## Ejemplos
```http
POST /api/auth/login
{ "username": "admin", "password": "Admin123" }

POST /api/transferencias
Authorization: Bearer <token>
{ "cuenta_origen_id": 1, "cuenta_destino_id": 2, "monto": 25.50, "descripcion": "Pago ficticio" }
```

La colección lista para importar está en `postman/Sistema_Bancario.postman_collection.json`.

## Permisos por rol
| Acción | ADMIN | CAJERO |
|---|---|---|
| Consultar clientes, cuentas, movimientos y reportes | Sí | Sí |
| Registrar y modificar clientes | Sí | Sí |
| Crear cuentas | Sí | Sí |
| Depósitos, retiros y transferencias | Sí | Sí |
| Desactivar o activar clientes (`DELETE /clientes/:id`, `PATCH /clientes/:id/activar`) | Sí | No (403) |
| Cambiar estado o tipo de una cuenta (`PUT/PATCH /cuentas/:id`) | Sí | No (403) |
