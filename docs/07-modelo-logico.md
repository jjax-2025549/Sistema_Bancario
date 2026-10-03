# Modelo lógico

Notación: **PK** clave primaria, *FK* clave foránea, `UK` único.

| Tabla | Columnas |
|---|---|
| `cliente` | **id**, nombre, apellido, dpi `UK`, email `UK`, telefono, direccion, activo, creado_en |
| `usuario` | **id**, username `UK`, password_hash, nombre, rol (ADMIN/CAJERO), activo, creado_en |
| `tipo_cuenta` | **id**, nombre `UK`, descripcion |
| `cuenta` | **id**, numero `UK`, *cliente_id → cliente.id*, *tipo_cuenta_id → tipo_cuenta.id*, saldo (≥ 0), estado (ACTIVA/INACTIVA), creada_en |
| `transferencia` | **id**, *cuenta_origen_id → cuenta.id*, *cuenta_destino_id → cuenta.id*, monto (> 0), descripcion, *usuario_id → usuario.id*, fecha |
| `movimiento` | **id**, *cuenta_id → cuenta.id*, tipo, monto (> 0), saldo_resultante, *cuenta_relacionada_id → cuenta.id*, *transferencia_id → transferencia.id*, descripcion, *usuario_id → usuario.id*, fecha |

## Relaciones
- Un cliente tiene muchas cuentas (1:N). Una cuenta pertenece a un solo cliente (RN1).
- Un tipo de cuenta clasifica muchas cuentas (1:N).
- Una cuenta tiene muchos movimientos (1:N).
- Una transferencia genera dos movimientos: `TRANSFERENCIA_ENVIADA` (cuenta origen) y `TRANSFERENCIA_RECIBIDA` (cuenta destino).
- Un usuario realiza muchas operaciones (1:N).

## Restricciones de integridad
- `CHECK (saldo >= 0)`, `CHECK (monto > 0)`, `CHECK (cuenta_origen_id <> cuenta_destino_id)`.
- Índices: `movimiento(cuenta_id, fecha)` y `cuenta(cliente_id)`.

## Scripts
- `database/01_estructura.sql`: crea la base, las tablas, claves e índices.
- `database/02_datos_ficticios.sql`: usuarios, tipos de cuenta, clientes y cuentas de ejemplo.
