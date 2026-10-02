# Sistema Bancario académico

Proyecto Integrador — **Taller 2** · Fundación Kinal · Informática 5to, sección IN5CM

Sistema bancario **educativo** (solo datos ficticios) que gestiona clientes, cuentas y operaciones simuladas (depósitos, retiros y transferencias), con selector de apariencia **claro / oscuro / automático (según la hora del día)** y color de acento.

| Dato | Información |
|---|---|
| Autor | Julian Eligio Jax Cisneros (carné 2025549) |
| Repositorio | https://github.com/jjax-205549/Sistema_Bancario |
| Rama de trabajo | `ft-jjax-2025549` → `develop` → `main` |
| Docente / equipo | ver [`docs/00-plan-y-roles.md`](docs/00-plan-y-roles.md) |

## Tecnologías
| Capa | Tecnología |
|---|---|
| Frontend | Angular 20 + TypeScript |
| Backend | Node.js + Express 5 + TypeScript (API REST, JWT, bcrypt) |
| Base de datos | MySQL 8 (`mysql2`) |
| Pruebas | Script `pnpm test:api` (P001–P010) + Postman |
| Control de versiones | Git + GitHub · gestor de paquetes **pnpm** |

## Requisitos
- Node.js **20.19 o superior** (recomendado 22 LTS) y **pnpm** (`npm install -g pnpm`)
- MySQL 8 en ejecución (por ejemplo XAMPP/MySQL Workbench)
- VS Code (opcional) y Postman (opcional)

## Instalación y ejecución (VS Code)
```bash
# 1) Clonar y entrar
git clone https://github.com/jjax-205549/Sistema_Bancario.git
cd Sistema_Bancario

# 2) Backend: dependencias y variables de entorno
cd backend
pnpm install
copy .env.example .env        # en Linux/Mac: cp .env.example .env
# Edita .env con tu usuario y contraseña de MySQL

# 3) Crear la base de datos y los datos ficticios
pnpm db:init

# 4) Iniciar la API (http://localhost:3000)
pnpm dev
```
En **otra terminal** de VS Code:
```bash
cd frontend
pnpm install
pnpm start                     # http://localhost:4200 (usa proxy hacia la API)
```

### Alternativa manual para la base de datos
Ejecuta en MySQL Workbench, en este orden: `database/01_estructura.sql` y `database/02_datos_ficticios.sql`.

## Credenciales ficticias de prueba
| Usuario | Contraseña | Rol |
|---|---|---|
| `admin` | `Admin123` | ADMIN |
| `cajero1` | `Cajero123` | CAJERO |

Cuentas de ejemplo: `100-0000001`, `100-0000002` (activas) y `100-0000003` (inactiva, sirve para la prueba P010).

## Variables de entorno (`backend/.env`)
| Variable | Descripción | Ejemplo |
|---|---|---|
| `PORT` | Puerto de la API | `3000` |
| `DB_HOST`, `DB_PORT` | Servidor MySQL | `localhost`, `3306` |
| `DB_USER`, `DB_PASSWORD` | Credenciales de MySQL | `root`, *(vacío)* |
| `DB_NAME` | Nombre de la base | `sistema_bancario` |
| `DB_SSL` | `true` si el proveedor exige SSL | `false` |
| `JWT_SECRET` | Secreto para firmar tokens | cadena larga aleatoria |

## Pruebas
```bash
# Con la API en ejecución y la base inicializada
cd backend
pnpm test:api
```
Ejecuta P001–P010 y muestra el resumen. Además, importa `postman/Sistema_Bancario.postman_collection.json` en Postman y ejecuta la colección en orden. Ver [`docs/09-matriz-de-pruebas.md`](docs/09-matriz-de-pruebas.md).

## Apariencia (claro / oscuro / automático)
Botón **Apariencia** (barra superior y login):
- **Claro** y **Oscuro** fijan el tema.
- **Automático**: oscuro de 19:00 a 06:00 por defecto (configurable) y claro el resto del día; se reevalúa cada 30 s.
- **Color de acento**: azul, verde, violeta, ámbar o grafito.
La preferencia se guarda en `localStorage`.

## Despliegue en Render
1. Crea una base MySQL en un proveedor externo (Render no ofrece MySQL) y ejecuta `pnpm db:init` apuntando a ella (variables en `backend/.env`).
2. En Render: **New → Blueprint** y selecciona el repositorio (usa `render.yaml`, rama `main`), o crea un *Web Service* con:
   - Build: `npm install -g pnpm && pnpm --dir frontend install --prod=false && pnpm --dir frontend build && pnpm --dir backend install --prod=false && pnpm --dir backend build`
   - Start: `pnpm --dir backend start`
3. Configura las variables `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_SSL=true` y `JWT_SECRET`.
4. El backend sirve el frontend compilado, por lo que solo hay un servicio.

## Estructura
```
Sistema_Bancario/
├── backend/            API REST (config, controllers, middleware, routes, services, tests)
├── frontend/           Angular 20 (core, layout, pages, shared)
├── database/           01_estructura.sql · 02_datos_ficticios.sql
├── postman/            Colección de pruebas de API
├── docs/               Documentación del proyecto
└── render.yaml         Configuración de despliegue
```

## Documentación
1. [Plan de trabajo y roles](docs/00-plan-y-roles.md)
2. [Problemática y objetivos](docs/01-problema-y-objetivos.md)
3. [Requerimientos](docs/02-requerimientos.md) · [Historias de usuario](docs/03-historias-de-usuario.md)
4. [Arquitectura](docs/04-arquitectura.md) · [Casos de uso y flujos](docs/05-casos-de-uso-y-flujos.md)
5. [ERD](docs/06-diagrama-entidad-relacion.md) · [Modelo lógico](docs/07-modelo-logico.md)
6. [Endpoints de la API](docs/08-api-endpoints.md)
7. [Matriz de pruebas](docs/09-matriz-de-pruebas.md) · [Registro de errores](docs/10-registro-de-errores.md)
8. [Manual de usuario](docs/11-manual-de-usuario.md)
9. [Registro de uso de IA](docs/12-registro-de-uso-de-ia.md)
10. [Conclusiones y recomendaciones](docs/13-conclusiones-y-recomendaciones.md)

## Solución de problemas
| Síntoma | Causa probable | Solución |
|---|---|---|
| API responde `500 Error interno` | MySQL apagado o `.env` incorrecto | Inicia MySQL y revisa `backend/.env` |
| `Access denied for user` | Usuario/contraseña de MySQL | Corrige `DB_USER` y `DB_PASSWORD` |
| Login falla con "Credenciales inválidas" | Base sin datos | Ejecuta `pnpm db:init` |
| El frontend no llega a la API | API apagada o puerto distinto | Levanta `pnpm dev` en `backend` (puerto 3000) |

> Proyecto educativo: no usar información financiera real.
