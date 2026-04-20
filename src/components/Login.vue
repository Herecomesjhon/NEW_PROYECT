<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '../assets/main.css'

const router = useRouter()
const email = ref('')
const password = ref('')
const recuerdame = ref(false)
const errorMsg = ref('')
const intentos = ref(0)
const bloqueado = ref(false)
const cargando = ref(false)
const mostrarPassword = ref(false)

const MAX_INTENTOS = 5
const BLOQUEO_MS = 30000

const sanitizar = (valor) => valor.trim().replace(/[<>"'`]/g, '')

const iniciarSesion = async () => {
  errorMsg.value = ''

  if (bloqueado.value) {
    errorMsg.value = 'Demasiados intentos fallidos. Espera 30 segundos.'
    return
  }

  const inputLimpio = sanitizar(email.value)
  const passLimpia = sanitizar(password.value)

  if (inputLimpio.length < 3) {
    errorMsg.value = 'Ingresa un usuario o correo válido.'
    return
  }

  if (passLimpia.length < 8) {
    errorMsg.value = 'La contraseña debe tener al menos 8 caracteres.'
    return
  }

  cargando.value = true

  try {
    await new Promise(r => setTimeout(r, 800))
    const exito = true

    if (exito) {
      intentos.value = 0
      router.push('/home')
    } else {
      manejarFallo()
    }
  } catch (e) {
    manejarFallo()
  } finally {
    cargando.value = false
  }
}

const manejarFallo = () => {
  intentos.value++
  if (intentos.value >= MAX_INTENTOS) {
    bloqueado.value = true
    errorMsg.value = 'Cuenta bloqueada temporalmente. Espera 30 segundos.'
    setTimeout(() => {
      bloqueado.value = false
      intentos.value = 0
    }, BLOQUEO_MS)
  } else {
    errorMsg.value = `Credenciales incorrectas. Intento ${intentos.value}/${MAX_INTENTOS}.`
  }
}
</script>

<template>
  <div class="login-bg">
    <div class="login-card">

      <!-- Logo + Nombre en fila -->
      <div class="login-header">
        <div class="logo-ondas">
          <div class="onda onda-3"></div>
          <div class="onda onda-2"></div>
          <div class="onda onda-1"></div>
          <div class="logo-centro"></div>
        </div>
        <span class="login-title">OndasMX</span>
      </div>

      <p class="login-subtitle">Inicia sesión en tu cuenta</p>

      <form @submit.prevent="iniciarSesion" novalidate autocomplete="off">

        <div class="campo">
          <label for="email">Usuario o Email</label>
          <div class="input-wrap">
            <span class="input-icon">✉️</span>
            <input
              id="email"
              type="text"
              v-model="email"
              required
              autocomplete="username"
              :disabled="bloqueado || cargando"
              placeholder="Tu usuario o email"
            />
          </div>
        </div>

        <div class="campo">
          <label for="password">Contraseña</label>
          <div class="input-wrap">
            <span class="input-icon">🔒</span>
            <input
              id="password"
              :type="mostrarPassword ? 'text' : 'password'"
              v-model="password"
              required
              autocomplete="current-password"
              :disabled="bloqueado || cargando"
              placeholder="Tu contraseña"
            />
          </div>
        </div>

        <div class="extras">
          <label class="recuerdame">
            <input type="checkbox" v-model="recuerdame" />
            Recuérdame
          </label>
          <a href="#" class="olvide">¿Olvidaste tu contraseña?</a>
        </div>

        <p v-if="errorMsg" class="error" role="alert">{{ errorMsg }}</p>

        <button type="submit" class="btn-submit" :disabled="bloqueado || cargando">
          {{ cargando ? 'Entrando...' : 'Iniciar Sesión' }}
        </button>

      </form>
    </div>
  </div>
</template>