# Comandos Git listos para copiar y pegar

Repositorio: `Sistema_Bancario` · Usuario: `jjax-205549` · Rama de trabajo: `ft-jjax-2025549` · **79 commits** + 2 merges.

Funciona en la terminal de VS Code (PowerShell, CMD o Git Bash): cada commit son dos líneas, sin `&&`.

## 0. Preparación (una sola vez)

```bash
git config --global user.name "Julian Eligio Jax Cisneros"
git config --global user.email "TU_CORREO_DE_GITHUB"

git clone https://github.com/jjax-205549/Sistema_Bancario.git
cd Sistema_Bancario
```

Copia **el contenido** de la carpeta `Sistema_Bancario` del ZIP dentro de la carpeta clonada (que queden `backend/`, `frontend/`, `docs/`, etc. al lado de `.git`). Luego:

**Si el repo en GitHub está vacío** (sin commits) crea `main` primero:

```bash
git checkout -b main
git commit --allow-empty -m "chore: inicializar repositorio"
git push -u origin main
```

Crea `develop` y tu rama de trabajo:

```bash
git checkout -b develop
git push -u origin develop
git checkout -b ft-jjax-2025549
```

> Si `develop` ya existe: `git checkout develop`, `git pull` y luego `git checkout -b ft-jjax-2025549`.

## 1. Commits (estás en `ft-jjax-2025549`)

Pega **un día a la vez** (el plan pide evidencia diaria) y haz `git push` al final de cada bloque. Si prefieres, pega todo de una vez.

### Día 1 — Problemática, alcance, roles y objetivos

```bash
git add .gitignore
git commit -m "chore: agregar .gitignore para node, angular y variables de entorno"
git add docs/00-plan-y-roles.md
git commit -m "docs: definir plan de trabajo de 10 días, integrantes y flujo de ramas"
git add docs/01-problema-y-objetivos.md
git commit -m "docs: describir problemática, alcance y objetivos del sistema bancario"
git add README.md
git commit -m "docs: agregar README inicial con instalación, ejecución y despliegue"
git push -u origin ft-jjax-2025549
```

### Día 2 — Requerimientos e historias de usuario

```bash
git add docs/02-requerimientos.md
git commit -m "docs: documentar requerimientos funcionales, no funcionales y reglas de negocio"
git add docs/03-historias-de-usuario.md
git commit -m "docs: agregar 15 historias de usuario con criterios de aceptación"
git push
```

### Día 3 — Arquitectura, casos de uso y flujos

```bash
git add docs/04-arquitectura.md
git commit -m "docs: documentar arquitectura en capas y decisiones técnicas"
git add docs/05-casos-de-uso-y-flujos.md
git commit -m "docs: agregar diagramas de casos de uso y flujos (transferencia, retiro, tema automático)"
git push
```

### Día 4 — Diseño de base de datos

```bash
git add docs/06-diagrama-entidad-relacion.md
git commit -m "docs: agregar diagrama entidad-relación en Mermaid"
git add docs/07-modelo-logico.md
git commit -m "docs: documentar modelo lógico, relaciones y restricciones"
git add database/01_estructura.sql
git commit -m "feat(db): crear script de estructura con tablas, claves e índices"
git add database/02_datos_ficticios.sql
git commit -m "feat(db): agregar datos ficticios de usuarios, clientes y cuentas"
git push
```

### Día 5 — Backend: estructura, conexión a BD y CRUD inicial

```bash
git add backend/package.json backend/pnpm-lock.yaml
git commit -m "chore(backend): inicializar proyecto Node con pnpm y dependencias"
git add backend/tsconfig.json
git commit -m "chore(backend): configurar TypeScript"
git add backend/.env.example
git commit -m "chore(backend): agregar plantilla de variables de entorno"
git add backend/src/config/env.ts
git commit -m "feat(backend): cargar variables de entorno en config/env"
git add backend/src/config/db.ts
git commit -m "feat(backend): crear pool de conexión MySQL"
git add backend/src/config/initDb.ts
git commit -m "feat(backend): agregar comando db:init para crear la base y los datos ficticios"
git add backend/src/utils/errors.ts
git commit -m "feat(backend): crear clase HttpError para errores controlados"
git add backend/src/utils/validar.ts
git commit -m "feat(backend): agregar validaciones de texto, DPI, correo, teléfono y montos"
git add backend/src/middleware/error.ts
git commit -m "feat(backend): agregar middleware de manejo de errores y ruta no encontrada"
git add backend/src/controllers/clientes.controller.ts
git commit -m "feat(backend): implementar CRUD de clientes con desactivación lógica"
git add backend/src/routes/clientes.routes.ts
git commit -m "feat(backend): definir rutas REST de clientes"
git add backend/src/controllers/cuentas.controller.ts
git commit -m "feat(backend): implementar crear, consultar y actualizar cuentas"
git add backend/src/routes/cuentas.routes.ts
git commit -m "feat(backend): definir rutas REST de cuentas y tipos de cuenta"
git push
```

### Día 6 — Backend: autenticación y operaciones bancarias

```bash
git add backend/src/middleware/auth.ts
git commit -m "feat(backend): agregar middleware de autenticación JWT y control de roles"
git add backend/src/controllers/auth.controller.ts
git commit -m "feat(backend): implementar login, logout y sesión actual con bcrypt y JWT"
git add backend/src/routes/auth.routes.ts
git commit -m "feat(backend): definir rutas de autenticación"
git add backend/src/services/operaciones.service.ts
git commit -m "feat(backend): implementar depósito, retiro y transferencia con transacciones SQL"
git add backend/src/controllers/operaciones.controller.ts
git commit -m "feat(backend): agregar controlador de depósitos, retiros y transferencias"
git add backend/src/routes/operaciones.routes.ts
git commit -m "feat(backend): definir rutas de depósitos, retiros y transferencias"
git push
```

### Día 7 — Transferencias, movimientos y pruebas de API

```bash
git add backend/src/controllers/movimientos.controller.ts
git commit -m "feat(backend): consultar historial de movimientos con filtros y por cuenta"
git add backend/src/routes/movimientos.routes.ts
git commit -m "feat(backend): definir rutas de movimientos"
git add backend/src/controllers/reportes.controller.ts
git commit -m "feat(backend): agregar reporte resumen de operaciones"
git add backend/src/routes/reportes.routes.ts
git commit -m "feat(backend): definir ruta del reporte resumen"
git add backend/src/routes/index.ts
git commit -m "feat(backend): centralizar rutas protegidas con JWT en routes/index"
git add backend/src/server.ts
git commit -m "feat(backend): crear servidor Express con CORS, API y servicio del frontend"
git add backend/tests/pruebas.ts
git commit -m "test(backend): automatizar pruebas obligatorias P001 a P010"
git add postman/Sistema_Bancario.postman_collection.json
git commit -m "test: agregar colección de Postman con 29 peticiones"
git add docs/08-api-endpoints.md
git commit -m "docs: documentar endpoints de la API y códigos de respuesta"
git add docs/evidencias/pruebas-api-P001-P010.txt
git commit -m "test: guardar evidencia de ejecución de pruebas P001-P010 (10/10 aprobadas)"
git push
```

### Día 8 — Frontend: login, clientes, cuentas y formularios

```bash
git add frontend/package.json frontend/pnpm-lock.yaml
git commit -m "chore(frontend): crear proyecto Angular 20 con pnpm"
git add frontend/angular.json frontend/proxy.conf.json
git commit -m "chore(frontend): configurar angular.json y proxy hacia la API"
git add frontend/tsconfig.json frontend/tsconfig.app.json
git commit -m "chore(frontend): configurar TypeScript estricto"
git add frontend/.editorconfig frontend/.gitignore frontend/public/favicon.ico
git commit -m "chore(frontend): agregar editorconfig, gitignore y favicon"
git add frontend/src/index.html
git commit -m "feat(frontend): crear index.html con aplicación temprana del tema guardado"
git add frontend/src/main.ts
git commit -m "chore(frontend): agregar punto de entrada main.ts"
git add frontend/src/styles.css
git commit -m "style(frontend): definir tokens de diseño para modo claro, oscuro y colores de acento"
git add frontend/src/app/core/models.ts
git commit -m "feat(frontend): definir modelos e interfaces de la API"
git add frontend/src/app/core/api.service.ts
git commit -m "feat(frontend): crear servicio ApiService para consumir la API REST"
git add frontend/src/app/core/auth.service.ts
git commit -m "feat(frontend): crear AuthService con manejo de sesión"
git add frontend/src/app/core/auth.interceptor.ts
git commit -m "feat(frontend): agregar interceptor que adjunta el token y cierra sesión en 401"
git add frontend/src/app/core/auth.guard.ts
git commit -m "feat(frontend): proteger rutas con authGuard"
git add frontend/src/app/core/theme.service.ts
git commit -m "feat(frontend): crear ThemeService con modo claro, oscuro y automático por hora"
git add frontend/src/app/shared/tipo.pipe.ts
git commit -m "feat(frontend): agregar pipe para etiquetas de tipos de movimiento"
git add frontend/src/app/shared/theme-selector.ts frontend/src/app/shared/theme-selector.html
git commit -m "feat(frontend): crear selector de apariencia (modo, rango horario y color de acento)"
git add frontend/src/app/layout/shell.ts frontend/src/app/layout/shell.html
git commit -m "feat(frontend): crear layout principal con navegación y barra superior"
git add frontend/src/app/pages/login.ts frontend/src/app/pages/login.html
git commit -m "feat(frontend): crear pantalla de login con mensajes de error"
git add frontend/src/app/pages/resumen.ts frontend/src/app/pages/resumen.html
git commit -m "feat(frontend): crear pantalla de resumen con indicadores y reporte"
git add frontend/src/app/pages/clientes.ts frontend/src/app/pages/clientes.html
git commit -m "feat(frontend): crear gestión de clientes con formulario y validaciones"
git add frontend/src/app/pages/cuentas.ts frontend/src/app/pages/cuentas.html
git commit -m "feat(frontend): crear gestión de cuentas con creación y cambio de estado"
git push
```

### Día 9 — Integración completa, pruebas, correcciones y documentación

```bash
git add frontend/src/app/pages/operaciones.ts frontend/src/app/pages/operaciones.html
git commit -m "feat(frontend): crear pantalla de operaciones (depósito, retiro y transferencia)"
git add frontend/src/app/pages/movimientos.ts frontend/src/app/pages/movimientos.html
git commit -m "feat(frontend): crear historial de movimientos con filtros"
git add frontend/src/app/pages/consultas.ts frontend/src/app/pages/consultas.html
git commit -m "feat(frontend): crear pantalla de consultas de clientes, cuentas y saldo"
git add frontend/src/app/app.config.ts frontend/src/app/app.ts
git commit -m "feat(frontend): configurar app (HttpClient, interceptor) y componente raíz"
git add frontend/src/app/app.routes.ts
git commit -m "feat(frontend): definir rutas con carga diferida y guardia de sesión"
git add package.json
git commit -m "chore: agregar scripts raíz para instalar, iniciar y probar"
git add docs/09-matriz-de-pruebas.md
git commit -m "docs: agregar matriz de pruebas P001-P010 y pruebas de interfaz"
git add docs/10-registro-de-errores.md
git commit -m "docs: iniciar registro de errores y correcciones"
git add docs/evidencias/U08-login-modo-automatico-23h.png
git commit -m "test: agregar evidencia visual del modo automático en el login"
git add docs/evidencias/U07-resumen-modo-claro.png
git commit -m "test: agregar evidencia visual del resumen en modo claro"
git add docs/evidencias/U07-resumen-modo-oscuro-selector.png
git commit -m "test: agregar evidencia visual del modo oscuro y el selector de apariencia"
git add docs/evidencias/U04-operaciones-retiro-rechazado.png
git commit -m "test: agregar evidencia de operación rechazada por saldo insuficiente"
git add docs/evidencias/U06-consultas.png
git commit -m "test: agregar evidencia de la pantalla de consultas"
git push
```

### Día 10 — Mantenimiento final, README, manual, presentación y defensa

```bash
git add render.yaml
git commit -m "chore: agregar render.yaml para desplegar en Render"
git add docs/11-manual-de-usuario.md
git commit -m "docs: agregar manual de usuario"
git add docs/12-registro-de-uso-de-ia.md
git commit -m "docs: agregar registro de uso responsable de IA"
git add docs/13-conclusiones-y-recomendaciones.md
git commit -m "docs: agregar conclusiones y recomendaciones"
git add COMANDOS_GIT.md
git commit -m "docs: agregar guía de comandos Git para commits y merges"
git push origin ft-jjax-2025549
```
## 2. Merge a `develop`

```bash
git checkout develop
git pull origin develop
git merge --no-ff ft-jjax-2025549 -m "merge: integrar rama ft-jjax-2025549 en develop"
git push origin develop
```

## 3. Merge a `main`

```bash
git checkout main
git pull origin main
git merge --no-ff develop -m "merge: version final del sistema bancario (develop a main)"
git push origin main
git tag -a v1.0.0 -m "Entrega final Taller 2 - Sistema Bancario"
git push origin v1.0.0
```

> Alternativa con Pull Requests en GitHub: `ft-jjax-2025549 → develop` y luego `develop → main` (se ve más profesional en la evaluación). Después de mergear, actualiza tu copia local con `git checkout main` y `git pull`.

## 4. Verificación rápida

```bash
git log --oneline --graph --all
git branch -a
```
