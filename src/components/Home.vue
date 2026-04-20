<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '../assets/main.css'
import { STATION_STREAMS, AI_SUMMARIES } from '../Services/radio.js'

// --- LÓGICA DE NAVEGACIÓN Y SESIÓN (Tu código actual) ---
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

  if (inputLimpio.length < 3 || passLimpia.length < 8) {
    errorMsg.value = 'Revisa tus credenciales.'
    return
  }

  cargando.value = true
  try {
    await new Promise(r => setTimeout(r, 800))
    // Aquí podrías redirigir a otra página o cambiar un estado de "logueado"
    console.log("Sesión iniciada");
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
    setTimeout(() => { bloqueado.value = false; intentos.value = 0; }, BLOQUEO_MS)
  }
}

// --- LÓGICA DE LA RADIO (Mudada de script.js) ---
const isPlaying = ref(false)
const audioPlayer = new Audio()

// Ejemplo con uno de tus streams de STATION_STREAMS
const streamUrl = "https://s2.mexside.net/8016/stream" 

const togglePlay = () => {
  if (!isPlaying.value) {
    audioPlayer.src = streamUrl
    audioPlayer.play().catch(err => console.error("Error al reproducir:", err))
    isPlaying.value = true
  } else {
    audioPlayer.pause()
    isPlaying.value = false
  }
}
</script>

<template>
  <div class="login-bg">
    <div class="login-card">
      <div class="login-logo">
        
      </div>
      <h1 class="login-title">OndasMX</h1>
      
      <form @submit.prevent="iniciarSesion">
        <div class="campo">
          <label>Usuario o Email</label>
          <input type="text" v-model="email" :disabled="bloqueado" />
        </div>

        <div class="campo">
          <label>Contraseña</label>
          <input :type="mostrarPassword ? 'text' : 'password'" v-model="password" />
        </div>

        <button type="submit" class="btn-submit" :disabled="cargando">
          {{ cargando ? 'Entrando...' : 'Iniciar Sesión' }}
        </button>
      </form>

      <hr />

      <div class="radio-section" style="margin-top: 20px; text-align: center;">
        <p>Escuchar ahora:</p>
        <button @click="togglePlay" class="btn-radio">
          <span v-if="!isPlaying">▶ Reproducir Radio</span>
          <span v-else>⏸ Detener Radio</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.btn-radio {
  background: #6200ee;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
}
.btn-radio:hover {
  background: #3700b3;
}
</style>