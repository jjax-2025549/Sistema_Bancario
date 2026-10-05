# Registro de errores y correcciones

| ID | Descripción del error | Causa | Corrección | Estado |
|---|---|---|---|---|
| E01 | Al generar el frontend, Angular CLI mostró que requería una versión de Node más nueva que la instalada | La versión más reciente del CLI exige Node muy reciente | Se fijó Angular 20 (compatible con Node 20.19+ y 22) | Corregido |
| E02 | `TS2349: This expression is not callable` al guardar clientes | Se asignaba a una variable un `Observable` de dos tipos distintos (crear/actualizar) | Se tipó la variable como `Observable<Resp<unknown>>` | Corregido |
| E03 | La API respondía `500 Error interno` en todas las rutas | MySQL no estaba en ejecución (`ECONNREFUSED 127.0.0.1:3306`) | Iniciar el servicio MySQL y ejecutar `pnpm db:init`; se agregó esta guía al README | Corregido |
| E04 | `TS2322: Type 'string' is not assignable to type 'boolean'` al usar la directiva de conteo animado en el resumen | El atributo `dinero` sin enlace llega como texto y la entrada se declaró como booleano | Se enlazó explícitamente: `[dinero]="true"` | Corregido |
| E05 | `TS2393: Duplicate function implementation` en el login | Se agregó un método `usar()` que ya existía para autocompletar credenciales | Se conservó una sola implementación | Corregido |

> Agrega aquí los errores reales que encuentres durante tus pruebas (fecha, causa, solución y commit).
