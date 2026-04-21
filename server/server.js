const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');
const nodemailer = require('nodemailer');
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

// Configuración de nodemailer con Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Almacén temporal de códigos de verificación
// { email: { codigo, expira } }
const codigosPendientes = {};

// Endpoint para enviar el código de verificación al correo
app.post('/api/enviar-codigo', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'El email es requerido' });
  }

  try {
    // Verificar si el email ya está registrado
    const usuarioExistente = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (usuarioExistente.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Generar código de 6 dígitos
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();

    // Guardar el código con expiración de 10 minutos
    codigosPendientes[email] = {
      codigo,
      expira: Date.now() + 10 * 60 * 1000,
    };

    // Mandar el correo
    await transporter.sendMail({
      from: `"OndasMX" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Código de verificación - OndasMX',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 400px; margin: auto;">
          <h2 style="color: #333;">Verificación de cuenta</h2>
          <p>Usa el siguiente código para completar tu registro en OndasMX:</p>
          <div style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #4f46e5; margin: 24px 0;">
            ${codigo}
          </div>
          <p style="color: #888; font-size: 0.9em;">Este código expira en 10 minutos. Si no solicitaste esto, ignora este correo.</p>
        </div>
      `,
    });

    res.json({ message: 'Código enviado al correo' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'No se pudo enviar el correo' });
  }
});

// Endpoint para registrar nuevos usuarios (ahora requiere el código)
app.post('/api/register', async (req, res) => {
  const { email, password, codigo } = req.body;

  // Verificar que el código existe y no ha expirado
  const registro = codigosPendientes[email];
  if (!registro) {
    return res.status(400).json({ error: 'Primero solicita un código de verificación' });
  }
  if (Date.now() > registro.expira) {
    delete codigosPendientes[email];
    return res.status(400).json({ error: 'El código ha expirado, solicita uno nuevo' });
  }
  if (registro.codigo !== codigo) {
    return res.status(400).json({ error: 'El código es incorrecto' });
  }

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

    // Eliminar el código ya usado
    delete codigosPendientes[email];

    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
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

// Endpoint para probar la conexión a la base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'Conexión exitosa',
      dbTime: result.rows[0].now,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Error al conectar a la base de datos' });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en http://localhost:${PORT}`));