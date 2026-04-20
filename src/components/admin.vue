<script setup>
import { ref } from 'vue'

const passInput = ref('')
const isAuthenticated = ref(false)
const error = ref('')

// Campos para la nueva noticia
const nuevaNoticia = ref({
  titulo: '',
  contenido: '',
  categoria: 'Noticias'
})

const validarAcceso = () => {
  if (passInput.value === 'ondasmx2026') {
    isAuthenticated.value = true
    error.value = ''
  } else {
    error.value = 'Contraseña incorrecta'
  }
}

const publicarNoticia = () => {
  // Aquí es donde antes usabas localStorage
  const noticiasActuales = JSON.parse(localStorage.getItem('noticias') || '[]')
  noticiasActuales.push({ ...nuevaNoticia.value, fecha: new Date().toLocaleDateString() })
  localStorage.setItem('noticias', JSON.stringify(noticiasActuales))
  
  alert('¡Noticia publicada con éxito!')
  // Limpiar formulario
  nuevaNoticia.value = { titulo: '', contenido: '', categoria: 'Noticias' }
}
</script>

<template>
  <div class="admin-container">
    <div v-if="!isAuthenticated" class="login-admin">
      <h3>Panel de Control OndasMX</h3>
      <input type="password" v-model="passInput" placeholder="Contraseña de Admin" />
      <button @click="validarAcceso">Entrar</button>
      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <div v-else class="panel-editor">
      <h3>Publicar Nueva Noticia</h3>
      <input v-model="nuevaNoticia.titulo" placeholder="Título de la noticia" />
      <textarea v-model="nuevaNoticia.contenido" placeholder="Contenido..."></textarea>
      <select v-model="nuevaNoticia.categoria">
        <option>Noticias</option>
        <option>Eventos</option>
        <option>Concursos</option>
      </select>
      <button @click="publicarNoticia">Publicar en la Web</button>
    </div>
  </div>
</template>

<style scoped>
/* Aquí puedes poner tus estilos de admin.css */
.admin-container { padding: 20px; border: 1px solid #ccc; border-radius: 8px; margin-top: 20px; }
input, textarea { display: block; width: 100%; margin-bottom: 10px; }
</style>