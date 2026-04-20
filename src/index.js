import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Registro from './components/Registro.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'login', component: Login },
    { path: '/registro', name: 'registro', component: Registro },
    { 
      path: '/home', 
      name: 'home', 
      component: Home,
      meta: { requiresAuth: true } // 1. Marcamos que esta ruta es privada
    }
  ]
})

// 2. Definimos el guardián de navegación
router.beforeEach((to, from, next) => {
  // Por ahora, verificamos si existe un indicador en localStorage
  const isAuthenticated = localStorage.getItem('user_logged_in') === 'true'

  if (to.meta.requiresAuth && !isAuthenticated) {
    // Si la ruta requiere auth y no estamos logueados, al login
    next('/')
  } else {
    // Si no requiere auth o ya estamos logueados, adelante
    next()
  }
})

export default router