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

      <!-- Paso 1: formulario de registro -->
      <template v-if="!codigoEnviado">
        <h2>Registro</h2>
        <p class="login-subtitle">Crea tu cuenta nueva</p>
        <form @submit.prevent="enviarCodigo" novalidate>
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
            {{ cargando ? 'Enviando código...' : 'Enviar código de verificación' }}
          </button>
          <button type="button" class="btn-register" @click="router.push('/')">
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </form>
      </template>

      <!-- Paso 2: ingresar el código recibido por correo -->
      <template v-else>
        <h2>Verifica tu correo</h2>
        <p class="login-subtitle">
          Enviamos un código de 6 dígitos a <strong>{{ email }}</strong>. Revisa tu bandeja de entrada.
        </p>
        <form @submit.prevent="registrar" novalidate>
          <div class="campo">
            <label for="codigo">Código de verificación</label>
            <div class="input-wrap">
              <input
                id="codigo"
                type="text"
                v-model="codigo"
                required
                placeholder="123456"
                maxlength="6"
                inputmode="numeric"
                :disabled="cargando"
                style="letter-spacing: 8px; font-size: 1.4em; text-align: center;"
              />
            </div>
          </div>
          <p v-if="errorMsg" class="error" role="alert">{{ errorMsg }}</p>
          <button type="submit" class="btn-submit" :disabled="cargando">
            {{ cargando ? 'Verificando...' : 'Verificar y crear cuenta' }}
          </button>
          <button type="button" class="btn-register" @click="volverAlFormulario">
            Volver y cambiar email
          </button>
        </form>
      </template>

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
const codigo = ref('')
const errorMsg = ref('')
const cargando = ref(false)
const codigoEnviado = ref(false)

// Paso 1: validar el formulario y pedir al servidor que mande el código
const enviarCodigo = async () => {
  errorMsg.value = ''

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
    const respuesta = await fetch('http://localhost:3000/api/enviar-codigo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.value }),
    })
    const datos = await respuesta.json()
    if (respuesta.ok) {
      codigoEnviado.value = true
    } else {
      errorMsg.value = datos.error || 'Error al enviar el código'
    }
  } catch (e) {
    errorMsg.value = 'No se pudo conectar con el servidor'
  } finally {
    cargando.value = false
  }
}

// Paso 2: verificar el código y completar el registro
const registrar = async () => {
  errorMsg.value = ''

  if (codigo.value.length !== 6) {
    errorMsg.value = 'El código debe tener 6 dígitos.'
    return
  }

  cargando.value = true
  try {
    const respuesta = await fetch('http://localhost:3000/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        codigo: codigo.value,
      }),
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

const volverAlFormulario = () => {
  codigoEnviado.value = false
  codigo.value = ''
  errorMsg.value = ''
}
</script>

<style scoped>
/* Los estilos se heredan de main.css */
</style>