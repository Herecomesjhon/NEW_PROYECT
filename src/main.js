import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './index' // <-- Como ya es .ts, lo importamos así de limpio

const app = createApp(App)

app.use(router)
app.mount('#app')