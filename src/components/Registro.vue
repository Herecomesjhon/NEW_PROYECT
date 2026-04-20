<template>
  <div class="login-bg">
    <div class="login-card">
      
      <div class="login-header">
        <div class="logo-ondas">
          <div class="onda onda-3"></div>
          <div class="onda onda-2"></div>
          <div class="onda onda-1"></div>
          <div class="logo-centro"></div>
        </div>
        <span class="login-title">OndasMX</span>
      </div>

      <h2>Registro</h2>
      <p class="login-subtitle">Crea tu cuenta nueva</p>

      <form @submit.prevent="registrar" novalidate>

        <div class="campo">
          <label for="email">Email</label>
          <div class="input-wrap">
            <input id="email" type="email" v-model="email" required placeholder="tu@email.com" :disabled="cargando" />
          </div>
        </div>

        <div class="campo">
          <label for="password">Contraseña</label>
          <div class="input-wrap">
            <span class="input-icon">🔒</span>
            <input id="password" type="password" v-model="password" required placeholder="Mínimo 8 caracteres" :disabled="cargando" />
          </div>
        </div>

        <div class="campo">
          <label for="passwordConfirm">Confirmar Contraseña</label>
          <div class="input-wrap">
            <span class="input-icon">🔒</span>
            <input id="passwordConfirm" type="password" v-model="passwordConfirm" required placeholder="Repite tu contraseña" :disabled="cargando" />
          </div>
        </div>

        <div class="extras">
          <label style="display: flex; align-items: center; gap: 8px; font-size: 0.9em; cursor: pointer;">
            <input type="checkbox" v-model="terminosAceptados" required />
            <span>Acepto los términos y condiciones</span>
          </label>
        </div>

        <p v-if="errorMsg" class="error" role="alert">{{ errorMsg }}</p>

        <button type="submit" class="btn-submit" :disabled="cargando">
          {{ cargando ? 'Registrando...' : 'Registrarse' }}
        </button>

        <button type="button" class="btn-register" @click="router.push('/')">
          ¿Ya tienes cuenta? Inicia sesión
        </button>

      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import '../assets/main.css'

const router = useRouter()
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const terminosAceptados = ref(false)
const errorMsg = ref('')
const cargando = ref(false)

const registrar = async () => {
  errorMsg.value = ''
  
  // Validaciones
  if (password.value !== passwordConfirm.value) {
    errorMsg.value = 'Las contraseñas no coinciden.'
    return
  }
  if (!terminosAceptados.value) {
    errorMsg.value = 'Debes aceptar los términos y condiciones.'
    return
  }
  if (email.value.length < 5 || password.value.length < 8) {
    errorMsg.value = 'El email debe ser válido y la contraseña de al menos 8 caracteres.'
    return
  }

  cargando.value = true

  try {
    const respuesta = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const datos = await respuesta.json()

    if (respuesta.ok) {
      alert('Registro exitoso. Ahora puedes iniciar sesión.')
      router.push('/')
    } else {
      errorMsg.value = datos.error || 'Error al registrarse'
    }
  } catch (e) {
    errorMsg.value = 'No se pudo conectar con el servidor'
  } finally {
    cargando.value = false
  }
}
</script>

<style scoped>
/* Los estilos se heredan de main.css */
</style>