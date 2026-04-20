<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const email = ref('')
const password = ref('')

const iniciarSesion = () => {
  // Cuando el usuario haga clic en Entrar, lo mandamos a la ruta /home
  router.push('/home')
}
</script>

<template>
  <div class="login-container">
    <h2>Bienvenido a OndasMX</h2>
    
    <form @submit.prevent="iniciarSesion">
      <div>
        <label>Usuario:</label>
        <input type="text" v-model="email" required>
      </div>
      <div>
        <label>Contraseña:</label>
        <input type="password" v-model="password" required>
      </div>
      <button type="submit">Entrar</button>
    </form>
  </div>
</template>

<style scoped>
.login-container {
  max-width: 300px;
  margin: 100px auto;
  text-align: center;
  color: rgb(13, 13, 13); /* Para que resalte con tu fondo oscuro */
}
input {
  margin: 10px 0;
  padding: 8px;
  width: 100%;
}
button {
  padding: 10px 20px;
  background-color: #FF6B35;
  color: rgb(3, 3, 3);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 15px;
}
</style>