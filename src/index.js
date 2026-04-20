import { createRouter, createWebHistory } from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: '/', 
      name: 'login', 
      component: Login 
    },
    { 
      path: '/home', 
      name: 'home', 
      component: Home 
    }
  ]
})

export default router