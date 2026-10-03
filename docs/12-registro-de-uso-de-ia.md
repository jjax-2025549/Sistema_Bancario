# Registro de uso de inteligencia artificial

La IA se usó como herramienta de apoyo. Cada integrante debe completar las columnas **Modificación** y **Comprensión** con sus propias palabras antes de la defensa.

| Herramienta | Prompt | Resultado | Aplicación | Modificación | Comprensión |
|---|---|---|---|---|---|
| Claude (Anthropic) | Guía del proyecto integrador (PDF) + solicitud de dejar el proyecto listo: Angular + Node/TypeScript + MySQL con pnpm, selector de tema claro/oscuro/automático por hora y commits para GitHub | Estructura completa del proyecto: API REST, script SQL, frontend Angular, pruebas P001–P010, colección Postman y documentación | Base de todo el código y documentos del repositorio | [completar: qué cambiaste, agregaste o corregiste tú] | [completar: explica con tus palabras cómo funcionan las transacciones, el JWT y el tema automático] |
| [otra herramienta] | [prompt] | [resultado] | [aplicación] | [modificación] | [comprensión] |

## Puntos que debes poder explicar en la defensa
1. Por qué los depósitos, retiros y transferencias usan **transacciones** (`BEGIN / COMMIT / ROLLBACK`) y `FOR UPDATE`.
2. Cómo se protegen las rutas con **JWT** y cómo el frontend adjunta el token (interceptor).
3. Cómo funciona el **modo automático** del tema (hora local, rango configurable y persistencia).
4. Cómo se relacionan las tablas `cuenta`, `movimiento` y `transferencia`.
5. Qué prueba cubre cada regla de negocio (P001–P010).
