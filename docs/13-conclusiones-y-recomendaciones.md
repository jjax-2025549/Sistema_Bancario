# Conclusiones y recomendaciones

## Conclusiones
1. Se integró un frontend Angular, una API REST en Node.js con TypeScript y una base MySQL en un sistema bancario académico funcional.
2. Las reglas de negocio se aplican en el backend (fuente de verdad) y se reflejan en la interfaz con mensajes claros.
3. Las transacciones SQL con bloqueo de filas garantizan que los saldos permanezcan consistentes.
4. Las 10 pruebas obligatorias se automatizaron y también se dejaron en una colección de Postman.
5. El selector de apariencia (claro, oscuro, automático por hora y color de acento) mejora la comodidad de uso sin afectar la lógica del sistema.

## Recomendaciones
- Agregar roles con permisos diferenciados (por ejemplo, que solo el administrador desactive clientes).
- Añadir pruebas automáticas del frontend y paginación en los listados.
- Usar migraciones de base de datos en lugar de scripts sueltos.
- Configurar `JWT_SECRET` y credenciales de base de datos únicas por entorno.
