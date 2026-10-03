# Problemática, alcance y objetivos

## Problemática
Los procesos bancarios básicos (registrar clientes, abrir cuentas y mover dinero) requieren control estricto de reglas de negocio: no retirar más del saldo, no operar cuentas inactivas y dejar registro de cada operación. Cuando se llevan manualmente o en hojas sueltas aparecen errores de saldo, operaciones duplicadas y falta de trazabilidad.

## Solución propuesta
Un **sistema bancario académico** con frontend (Angular), API REST (Node.js + TypeScript) y base de datos (MySQL) que gestiona clientes, cuentas y operaciones **simuladas**, aplicando validaciones y dejando cada movimiento registrado.

> El sistema es exclusivamente educativo: usa **datos ficticios**. No se usan cuentas, contraseñas, tarjetas ni información financiera reales.

## Alcance
Incluye: autenticación, clientes, cuentas, depósitos, retiros, transferencias, movimientos, consultas, reportes y validaciones.
No incluye: pagos reales, integración con bancos, tarjetas, intereses ni préstamos.

## Objetivo general
Desarrollar un sistema bancario funcional que integre frontend, backend y base de datos aplicando el ciclo de desarrollo de software.

## Objetivos específicos
1. Analizar el problema y documentar requerimientos e historias de usuario.
2. Diseñar la arquitectura y el modelo de datos (ERD, modelo lógico y script SQL).
3. Implementar una API REST con CRUD, autenticación y transacciones bancarias.
4. Construir una interfaz web conectada a la API, con selector de tema claro/oscuro/automático.
5. Verificar el sistema con pruebas (P001–P010) y Postman, y registrar errores y correcciones.
6. Administrar el trabajo con Git y GitHub mediante commits frecuentes y descriptivos.
