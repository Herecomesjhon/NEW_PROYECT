# OndasMX

Plataforma full-stack de streaming de radio y noticias, desarrollada para ofrecer una experiencia en tiempo real con integracion de Inteligencia Artificial.

---

## Tecnologias Utilizadas

- Frontend: Vue.js 3 (Vite) servido con Nginx.
- Backend: Node.js + Express.
- Base de Datos: PostgreSQL 16.
- Autenticacion: JWT/LocalSession & Bcrypt para hashing de contrasenas.
- Extras: Axios/Fetch, CSS (Custom).
- Infraestructura: Docker + Docker Compose.

---

## Requisitos Previos

Solo necesitas tener instalado:

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (incluye Docker Compose).
- Git.

No necesitas instalar Node.js, PostgreSQL ni pgAdmin. Docker se encarga de todo.

---

## Configuracion del IDE Recomendada

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (y desactiva Vetur).

## Configuracion del Navegador Recomendada

- Navegadores basados en Chromium (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Activar Custom Object Formatter en Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Activar Custom Object Formatter en Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Soporte de Tipos para Importaciones `.vue` en TypeScript

TypeScript no puede manejar la informacion de tipos para importaciones `.vue` por defecto, por lo que reemplazamos el CLI `tsc` con `vue-tsc` para la verificacion de tipos. En los editores, necesitamos [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) para que el servicio de lenguaje TypeScript reconozca los tipos `.vue`.

## Personalizar la Configuracion

Consulta la [Referencia de Configuracion de Vite](https://vite.dev/config/).

---

## Estructura del Proyecto

```
NEW_PROYECT/
├── docker-compose.yml
├── README.md
├── .gitignore
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── package.json
├── package-lock.json
├── Dockerfile
├── nginx.conf
├── public/
└── src/
│   ├── assets/
│   ├── components/
│   ├── img/
│   ├── Services/
│   │   └── radio.js
│   ├── App.vue
│   ├── index.js
│   └── main.js
└── server/
    ├── server.js
    ├── package.json
    ├── Dockerfile
    ├── .env
    ├── .env.example
    └── db/
        └── init.sql
```

---

## Inicio Rapido (con Docker)

**1. Clonar el repositorio:**

```bash
git clone https://github.com/tu-usuario/nombre-de-tu-repo.git
cd nombre-de-tu-repo
```

**2. Configurar variables de entorno:**

```bash
cp server/.env.example server/.env
```

Abre `server/.env` y cambia la contrasena y el JWT secret.

**3. Levantar todo:**

```bash
docker compose up --build
```

Listo. La aplicacion estara disponible en:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Base de datos: localhost:5432

La base de datos se crea y configura sola la primera vez. No necesitas hacer nada en pgAdmin.

---

## Instalacion Manual (sin Docker)

Si prefieres correr el proyecto sin Docker, necesitaras tener instalado Node.js (v16 o superior), PostgreSQL y pgAdmin, y Git.

**1. Instalar dependencias del Frontend:**

```bash
npm install
```

**2. Instalar dependencias del Backend:**

```bash
cd server
npm install
```

---

## Compilar y Recargar en Caliente para Desarrollo

```sh
npm run dev
```

## Verificacion de Tipos, Compilar y Minificar para Produccion

```sh
npm run build
```

---

## Configuracion de Base de Datos

Con Docker la base de datos se crea automaticamente. El script `server/db/init.sql` se ejecuta solo la primera vez que se levanta el contenedor.

Si usas instalacion manual, abre pgAdmin, crea una base de datos llamada `login_radio_db` y ejecuta este script en el Query Tool:

```sql
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    intentos_fallidos INTEGER DEFAULT 0,
    bloqueado_hasta TIMESTAMP WITH TIME ZONE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

> Si en el futuro agregas mas tablas, no olvides agregarlas a este script SQL y a `server/db/init.sql` para que tus colaboradores siempre tengan el esquema actualizado.

---

## Variables de Entorno

Crea o edita el archivo `server/.env` con la siguiente estructura:

```env
DB_USER=postgres
DB_HOST=localhost
DB_PASSWORD=tu_contrasena_de_postgres
DB_PORT=5432
DB_NAME=login_radio_db
JWT_SECRET=cambia_este_secreto_por_uno_seguro
```

> Cuando uses Docker, `DB_HOST` debe ser `db` (nombre del contenedor). Para instalacion manual usa `localhost`.

---

## Ejecucion Manual del Proyecto

Para correr la aplicacion sin Docker necesitaras dos terminales:

Terminal 1 - Backend:

```bash
cd server
node server.js
```

Terminal 2 - Frontend:

```bash
npm run dev
```

---

## Comandos Utiles de Docker

Levantar el proyecto:

```bash
docker compose up --build
```

Detener el proyecto:

```bash
docker compose down
```

Detener y eliminar la base de datos (para empezar desde cero):

```bash
docker compose down -v
```

Ver logs en tiempo real:

```bash
docker compose logs -f
```

Ver logs de un servicio especifico:

```bash
docker compose logs -f server
docker compose logs -f db
docker compose logs -f client
```

---

## Colaboracion

1. Haz un fork del proyecto.
2. Crea una rama para tu funcionalidad: `git checkout -b feature/nueva-funcionalidad`.
3. Haz tus cambios y sube tus commits.
4. Crea un Pull Request.

**Tips importantes:**

- `.gitignore`: Asegurate de incluir `node_modules/` y `.env` para no subir datos sensibles. Nunca subas tu archivo `.env` real a GitHub, ya que contiene tus contrasenas privadas.
- Base de datos: Si agregas mas tablas en el futuro, actualiza `server/db/init.sql` y el script SQL de este README para que todos los colaboradores tengan el esquema al dia.
- Docker: Nunca cambies `DB_HOST=db` en el `.env` cuando uses Docker. Ese valor es el nombre interno del contenedor de PostgreSQL.