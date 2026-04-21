# OndasMX

Plataforma full-stack de streaming de radio y noticias, desarrollada para ofrecer una experiencia en tiempo real.

Stack: Vue.js 3 (Vite) + Node.js/Express + PostgreSQL 16 + Docker. Autenticación con JWT y Bcrypt. Servido con Nginx.

---

## Requisitos Previos

Solo necesitas tener instalado Docker Desktop (incluye Docker Compose) y Git. No necesitas instalar Node.js, PostgreSQL ni pgAdmin. Docker se encarga de todo.

Igual esta la opcion de ejecutar el proyecto por medio de docker abajo estan las instrucciones.

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

## Estructura del proyecto

```
NEW_PROYECT/
├── docker-compose.yml
├── Dockerfile
├── nginx.conf
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── package.json
├── package-lock.json
├── .gitignore
├── README.md
├── src/                        # Frontend (Vue.js)
│   ├── assets/
│   ├── components/
│   │   ├── icons/
│   │   ├── admin.vue
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   ├── radio.js
│   │   ├── Registro.vue
│   │   └── WelcomeItem.vue
│   ├── img/
│   ├── Services/
│   │   └── radio.js
│   ├── App.vue
│   ├── index.js
│   └── main.js
└── server/                     # Backend (Node.js + Express)
    ├── server.js
    ├── package.json
    ├── Dockerfile
    ├── .env                    # tus credenciales (no subir a git)
    ├── .env.example
    └── db/
        └── init.sql            # esquema de la base de datos
```

---

## Inicio Rápido con Docker (recomendado)

### 1. Clona el repositorio

**1. Clonar el repositorio:**

```bash
git clone URL_DEL_REPOSITORIO
cd nombre-de-la-carpeta
```

### 2. Configura las variables de entorno

```bash
cp server/.env.example server/.env
```

Abre `server/.env` y edita estos dos valores:

```env
DB_PASSWORD=pon_tu_contraseña_aqui
JWT_SECRET=pon_un_secreto_largo_y_aleatorio_aqui
```

No cambies `DB_HOST=db`. Ese valor es el nombre interno del contenedor de PostgreSQL y debe quedar así siempre que uses Docker.

### 3. Levanta el proyecto

```bash
docker compose up --build
```

La primera vez tarda un poco mientras descarga las imágenes. Cuando veas los logs del servidor corriendo, ya está listo. El frontend queda en http://localhost:5173, el backend en http://localhost:3000 y la base de datos en localhost:5432. La base de datos se crea y configura sola, no necesitas hacer nada en pgAdmin.

---

## Comandos Docker del día a día

```bash
# Levantar el proyecto
docker compose up --build

# Apagar el proyecto
docker compose down

# Borrar todo y empezar desde cero (elimina la base de datos)
docker compose down -v

# Ver logs en tiempo real
docker compose logs -f

# Ver logs de un servicio específico
docker compose logs -f server
docker compose logs -f db
docker compose logs -f client
```

---

## Variables de entorno

El archivo `server/.env` debe verse así:

```env
DB_USER=postgres
DB_HOST=db
DB_PASSWORD=tu_contraseña
DB_PORT=5432
DB_NAME=login_radio_db
JWT_SECRET=un_secreto_muy_largo_y_seguro
```

Cuando uses Docker, `DB_HOST` debe ser `db`. Para instalación manual usa `localhost`. Nunca subas este archivo a GitHub, ya está en `.gitignore`.

---

## Instalación sin Docker (opcional)

Solo si tienes una razón específica para no usar Docker. Requiere instalar Node.js v16+, PostgreSQL, pgAdmin y Git por tu cuenta.

Instala las dependencias del frontend y del backend:

```bash
npm install
cd server && npm install
```

Luego abre pgAdmin, crea una base de datos llamada `login_radio_db` y ejecuta este script en el Query Tool:

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

Si en el futuro agregas más tablas, actualiza este script y también `server/db/init.sql` para que todos los colaboradores tengan el esquema al día.

Después levanta el proyecto en dos terminales separadas:

```bash
# Terminal 1 - Backend
cd server
node server.js

# Terminal 2 - Frontend
npm run dev
```

Recuerda cambiar `DB_HOST=db` a `DB_HOST=localhost` en tu `.env` para la instalación manual.

---

## Compilar para producción

```bash
npm run build
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
