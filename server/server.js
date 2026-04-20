const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();
// hay que implimetarle helmnet para seguridad, y morgan para logueo de peticiones, pero por ahora esto es lo básico para el backend
const app = express();
app.use(express.json());
app.use(cors());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: 'login_radio_db',
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Endpoint para el login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = result.rows[0];
    const esValida = await bcrypt.compare(password, usuario.password_hash);

    if (!esValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    res.json({ message: 'Login exitoso', userId: usuario.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Endpoint para registrar nuevos usuarios
app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;

  try {
    const usuarioExistente = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await pool.query(
      'INSERT INTO usuarios (email, password_hash) VALUES ($1, $2)',
      [email, passwordHash]
    );

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// Endpoint para probar la conexión a la base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      success: true, 
      message: 'Conexión exitosa', 
      dbTime: result.rows[0].now 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al conectar a la base de datos' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));