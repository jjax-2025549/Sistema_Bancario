# Matriz de pruebas

## Pruebas obligatorias (API)
Ejecutadas con `pnpm test:api` (backend) el 29/09/2026. Evidencia completa: [`evidencias/pruebas-api-P001-P010.txt`](evidencias/pruebas-api-P001-P010.txt). También están en la colección de Postman.

| ID | Prueba | Resultado esperado | Resultado obtenido | Estado |
|---|---|---|---|---|
| P001 | Login válido | Permite acceso | HTTP 200 con token | Aprobada |
| P002 | Login inválido | Muestra mensaje de error | HTTP 401 "Credenciales inválidas." | Aprobada |
| P003 | Registrar cliente | Cliente almacenado | HTTP 201, cliente con id | Aprobada |
| P004 | Crear cuenta | Cuenta asociada al cliente | Cuenta con `cliente_id` correcto | Aprobada |
| P005 | Depósito válido | Saldo incrementado | 100 → 150 | Aprobada |
| P006 | Retiro con saldo suficiente | Saldo disminuido | 150 → 120 | Aprobada |
| P007 | Retiro superior al saldo | Operación rechazada | HTTP 422 saldo insuficiente | Aprobada |
| P008 | Transferencia válida | Se actualizan ambas cuentas | Origen 100, destino 20 | Aprobada |
| P009 | Transferencia a misma cuenta | Operación rechazada | HTTP 422 | Aprobada |
| P010 | Cuenta inactiva | No permite operaciones | Depósito, retiro y transferencia: HTTP 409 | Aprobada |

## Pruebas de interfaz (manuales)
Ejecuta cada una en el navegador, marca el estado y adjunta captura en `docs/evidencias/`.

| ID | Prueba | Resultado esperado | Estado |
|---|---|---|---|
| U01 | Iniciar sesión desde la pantalla de login | Entra al resumen | [ ] |
| U02 | Registrar un cliente desde el formulario | Aparece en la tabla | [ ] |
| U03 | Crear una cuenta para ese cliente | Aparece con su saldo inicial | [ ] |
| U04 | Realizar depósito, retiro y transferencia desde Operaciones | Mensajes de éxito y saldos actualizados | [ ] |
| U05 | Intentar retirar más del saldo | Mensaje de error claro | [ ] |
| U06 | Filtrar movimientos por cuenta y tipo | La tabla se filtra | [ ] |
| U07 | Cambiar a modo oscuro y a modo claro | Los colores cambian al instante | [ ] |
| U08 | Activar modo automático y modificar el rango horario | El tema se adapta a la hora actual | [ ] |
| U09 | Cambiar el color de acento y recargar la página | El color se conserva | [ ] |
| U10 | Cerrar sesión e intentar abrir `/clientes` | Redirige al login | [ ] |
