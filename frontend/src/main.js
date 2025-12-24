import { createApp } from 'vue'
import App from './App.vue'
import router from './router/index'
import ElementPlus from 'element-plus'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'
import './assets/styles/variables.css'

const app = createApp(App)
app.use(router)
app.use(ElementPlus);
app.use(createPinia())
app.mount('#app')

const auth = useAuthStore()
auth.checkSession()