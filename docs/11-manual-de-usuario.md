# Manual de usuario

## 1. Ingresar
1. Abre la aplicación (`http://localhost:4200` en desarrollo o la URL de Render).
2. Escribe un usuario ficticio: `admin` / `Admin123` o `cajero1` / `Cajero123`.
3. Si las credenciales son incorrectas se muestra un mensaje de error.

## 2. Cambiar la apariencia
En la parte superior (y en el login) pulsa **Apariencia**:
- **Claro** / **Oscuro**: fija el tema.
- **Automático**: usa el tema oscuro entre las 19:00 y las 06:00 (puedes cambiar el rango) y claro el resto del día. Se actualiza solo mientras la página está abierta.
- **Color de acento**: azul, verde, violeta, ámbar o grafito.
Tu elección se recuerda en el navegador.

## 3. Clientes
- **Registrar cliente**: pulsa el botón, completa nombre, apellido, DPI ficticio (13 dígitos), correo y teléfono.
- **Editar**: usa el botón Editar de la fila.
- **Desactivar / Activar**: un cliente desactivado y sus cuentas no pueden operar.
- **Buscar**: por nombre, DPI o correo; filtra por estado.

## 4. Cuentas
- **Crear cuenta**: elige un cliente activo, el tipo de cuenta y el saldo inicial.
- **Activar / Desactivar**: una cuenta inactiva no permite operaciones.
- **Movimientos**: abre el historial filtrado de esa cuenta.

## 5. Operaciones
Elige la pestaña **Depósito**, **Retiro** o **Transferencia**, selecciona las cuentas, escribe el monto (mayor que cero) y confirma. El sistema muestra el saldo resultante o el motivo del rechazo.

## 6. Movimientos y consultas
- **Movimientos**: filtra por cuenta, tipo y rango de fechas.
- **Consultas**: busca un cliente o una cuenta y pulsa "Ver saldo y movimientos".

## 7. Resumen
Muestra saldo total, clientes y cuentas activas, monto por tipo de operación, actividad de los últimos 7 días y los últimos movimientos.

## 8. Cerrar sesión
Pulsa **Cerrar sesión** en la barra superior.

## 9. Roles y permisos
- **Administrador (`admin`)**: puede todo, incluido desactivar o activar clientes y cuentas.
- **Cajero (`cajero1`)**: registra clientes, crea cuentas y realiza operaciones, pero no ve los botones de desactivar/activar (el servidor también lo rechaza).

## 10. Exportar e imprimir movimientos
En **Movimientos**, aplica los filtros que necesites y pulsa **Exportar CSV** (se descarga un archivo que abre Excel) o **Imprimir** (genera una vista limpia solo con la tabla).
