# Requerimientos

## Funcionales
| ID | Requerimiento | Módulo |
|---|---|---|
| RF01 | Iniciar y cerrar sesión con credenciales ficticias | Autenticación |
| RF02 | Registrar, consultar, modificar y desactivar clientes | Clientes |
| RF03 | Crear cuentas asociadas a un cliente y de un tipo de cuenta | Cuentas |
| RF04 | Consultar saldo y actualizar el estado de una cuenta (activa/inactiva) | Cuentas |
| RF05 | Registrar depósitos y actualizar el saldo | Depósitos |
| RF06 | Registrar retiros validando el saldo disponible | Retiros |
| RF07 | Transferir entre cuentas y registrar la operación | Transferencias |
| RF08 | Consultar historial de depósitos, retiros y transferencias (con filtros) | Movimientos |
| RF09 | Buscar clientes/cuentas y consultar saldo y movimientos | Consultas |
| RF10 | Mostrar un reporte resumen de operaciones | Reportes |
| RF11 | Validar campos obligatorios, datos válidos, saldos y reglas de negocio | Validaciones |
| RF12 | Cambiar la apariencia: modo claro, oscuro, automático (según la hora) y color de acento | Interfaz |
| RF13 | Control de acceso por rol: solo el administrador desactiva/activa clientes y cuentas | Autenticación |
| RF14 | Exportar el historial de movimientos a CSV e imprimirlo | Movimientos |

## No funcionales
| ID | Requerimiento |
|---|---|
| RNF01 | Solo datos ficticios; contraseñas guardadas con hash (bcrypt) |
| RNF02 | Operaciones de dinero atómicas (transacciones SQL con bloqueo de filas) |
| RNF03 | Rutas protegidas con token JWT |
| RNF04 | Interfaz responsiva (escritorio y móvil) con foco visible y contraste adecuado |
| RNF05 | Separación frontend / backend / base de datos |
| RNF06 | Código versionado en GitHub con commits descriptivos |
| RNF07 | Preferencia de tema persistente en el navegador |

## Reglas de negocio (RN)
1. Una cuenta debe pertenecer a un cliente.
2. No se permite retirar un monto mayor al saldo disponible.
3. Los depósitos deben ser mayores que cero.
4. Los retiros deben ser mayores que cero.
5. Una transferencia debe tener cuenta origen y destino válidas.
6. La cuenta origen debe tener saldo suficiente.
7. No se permite transferir hacia la misma cuenta.
8. Cada operación queda registrada con fecha, tipo, monto y cuentas involucradas.
9. Una cuenta inactiva no puede realizar operaciones.
10. El sistema utiliza únicamente información ficticia.
