# OndasMX

Plataforma full-stack de streaming de radio y noticias, desarrollada para ofrecer una experiencia en tiempo real con integración de Inteligencia Artificial.

Stack: Vue.js 3 (Vite) + Node.js/Express + PostgreSQL 16 + Docker. Autenticación con JWT y Bcrypt. Servido con Nginx.

---

## Requisitos Previos

Solo necesitas tener instalado Docker Desktop (incluye Docker Compose) y Git. No necesitas instalar Node.js, PostgreSQL ni pgAdmin. Docker se encarga de todo.

---

## Herramientas Recomendadas

Para el editor se recomienda VS Code
con la extensión Vue (Official)
Vetur desactivado.
Para el navegador, si usas Chrome, Edge o Brave instala Vue.js devtools desde la Chrome Web Store y activa el Custom Object Formatter en DevTools. Si usas Firefox, instala Vue.js devtools desde los addons de Mozilla y activa el Custom Object Formatter en Firefox DevTools.

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

Puedes hacerlo de dos formas. 
Con GitHub Desktop: abre la aplicación, ve a File > Clone repository, pega la URL del repositorio y elige dónde guardarlo. Con Git desde la terminal: abre una terminal en la carpeta donde quieras guardar el proyecto, copia la URL desde el botón verde "Code" en GitHub y ejecuta:

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

## Contribuir

Haz un fork del proyecto, crea tu rama con `git checkout -b feature/nombre-de-tu-feature`, haz tus cambios y abre un Pull Request.

Nunca subas `.env` a GitHub ya que contiene tus contraseñas privadas, asegúrate de que `node_modules/` y `.env` estén en `.gitignore`. Si agregas nuevas tablas a la base de datos, actualiza `server/db/init.sql` para que todos los colaboradores tengan el esquema actualizado.