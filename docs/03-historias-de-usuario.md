# Historias de usuario

| ID | Historia | Criterio de aceptación | Prueba |
|---|---|---|---|
| HU01 | Como cajero, quiero iniciar sesión para acceder al sistema. | Con credenciales válidas entra al resumen; con inválidas ve un mensaje de error. | P001, P002 |
| HU02 | Como cajero, quiero cerrar sesión para proteger el sistema. | El token se descarta y se vuelve al login. | Manual |
| HU03 | Como cajero, quiero registrar un cliente para poder abrirle cuentas. | El cliente queda almacenado; DPI y correo no se repiten. | P003 |
| HU04 | Como cajero, quiero modificar los datos de un cliente para mantenerlos actualizados. | Los cambios se guardan tras validar los campos. | Postman |
| HU05 | Como administrador, quiero desactivar un cliente para impedir que opere. | El cliente y sus cuentas quedan inactivos. | Postman |
| HU06 | Como cajero, quiero crear una cuenta asociada a un cliente para que pueda operar. | La cuenta queda ligada a un cliente activo con un tipo de cuenta. | P004 |
| HU07 | Como cajero, quiero registrar un depósito para actualizar el saldo de una cuenta. | El monto es mayor que cero y el saldo aumenta. | P005 |
| HU08 | Como cajero, quiero registrar un retiro validando el saldo para no dejar cuentas en negativo. | Si el monto supera el saldo, se rechaza; si no, el saldo disminuye. | P006, P007 |
| HU09 | Como cajero, quiero transferir entre cuentas para mover dinero de forma segura. | Se actualizan ambas cuentas y se registra la transferencia. | P008 |
| HU10 | Como cajero, quiero que no se permita transferir a la misma cuenta. | La operación se rechaza con un mensaje claro. | P009 |
| HU11 | Como administrador, quiero que una cuenta inactiva no permita operaciones. | Depósitos, retiros y transferencias son rechazados. | P010 |
| HU12 | Como cajero, quiero consultar el historial de movimientos con filtros para dar seguimiento. | Se filtra por cuenta, tipo y fechas. | Manual |
| HU13 | Como cajero, quiero buscar clientes y cuentas para consultar su saldo rápidamente. | La búsqueda muestra resultados y el detalle con movimientos. | Manual |
| HU14 | Como administrador, quiero ver un reporte resumen para conocer la actividad del banco. | Se muestran totales, montos por tipo y actividad de 7 días. | Manual |
| HU15 | Como usuario, quiero cambiar entre modo claro, oscuro o automático para trabajar cómodo a cualquier hora. | El modo automático cambia según la hora y la preferencia se recuerda. | Manual |
