# OndasMX 📻

Plataforma full-stack de streaming de radio y noticias, desarrollada para ofrecer una experiencia en tiempo real con integración de Inteligencia Artificial.

---

## 🛠 Tecnologías Utilizadas

* **Frontend:** Vue.js 3 (Vite).
* **Backend:** Node.js + Express.
* **Base de Datos:** PostgreSQL.
* **Autenticación:** JWT/LocalSession & Bcrypt para hashing de contraseñas.
* **Extras:** Axios/Fetch, CSS (Custom).

---

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

* Node.js (v16 o superior).
* PostgreSQL y pgAdmin.
* Git.

---

## Configuración del IDE Recomendada

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (y desactiva Vetur).

## Configuración del Navegador Recomendada

- Navegadores basados en Chromium (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Activar Custom Object Formatter en Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Activar Custom Object Formatter en Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Soporte de Tipos para Importaciones `.vue` en TypeScript

TypeScript no puede manejar la información de tipos para importaciones `.vue` por defecto, por lo que reemplazamos el CLI `tsc` con `vue-tsc` para la verificación de tipos. En los editores, necesitamos [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) para que el servicio de lenguaje TypeScript reconozca los tipos `.vue`.

## Personalizar la Configuración

Consulta la [Referencia de Configuración de Vite](https://vite.dev/config/).

---

## 🚀 Instalación

**1. Clonar el repositorio:**

```bash
git clone https://github.com/tu-usuario/nombre-de-tu-repo.git
cd nombre-de-tu-repo
```

**2. Instalar dependencias del Frontend:**

```bash
cd client
npm install
```

**3. Instalar dependencias del Backend:**

```bash
cd ../server
npm install
```

---

## Configuración del Proyecto

```sh
npm install
```

### Compilar y Recargar en Caliente para Desarrollo

```sh
npm run dev
```

### Verificación de Tipos, Compilar y Minificar para Producción

```sh
npm run build
```

---

## 🗄 Configuración de Base de Datos

1. Abre pgAdmin y crea una nueva base de datos llamada `login_radio_db`.
2. En el "Query Tool", ejecuta el siguiente script para crear la tabla de usuarios:

```sql
CREATE TABLE IF NOT EXISTS usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    intentos_fallidos INTEGER DEFAULT 0,
    bloqueado_hasta TIMESTAMP WITH TIME ZONE,
    creado_en TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

> **Nota:** Si en el futuro agregas más tablas, no olvides agregarlas a este script SQL para que tus colaboradores siempre tengan el esquema actualizado.

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` dentro de la carpeta `/server` con la siguiente estructura:

```env
DB_USER=postgres
DB_HOST=localhost
DB_PASSWORD=tu_contraseña_de_postgres
DB_PORT=5432
```

---

## ▶️ Ejecución del Proyecto

Para correr la aplicación, necesitarás dos terminales:

**Terminal 1 — Backend:**

```bash
cd server
node server.js
```

**Terminal 2 — Frontend:**

```bash
cd client
npm run dev
```

---

## 🤝 Colaboración

1. Haz un fork del proyecto.
2. Crea una rama para tu funcionalidad: `git checkout -b feature/nueva-funcionalidad`.
3. Haz tus cambios y sube tus commits.
4. Crea un Pull Request.

**Tips importantes:**

* **`.gitignore`:** Asegúrate de tener un archivo `.gitignore` en la raíz que contenga `node_modules/` y `.env`. Nunca subas tu archivo `.env` real a GitHub, ya que contiene tus contraseñas privadas de la base de datos.
* **Base de datos:** Si agregas más tablas en el futuro, actualiza el script SQL de este README para que tus colaboradores siempre tengan el esquema al día.
