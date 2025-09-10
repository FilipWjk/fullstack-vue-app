import { createApp } from 'vue'
import { createPinia } from 'pinia'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth.ts'

import './assets/main.css'

async function initApp() {
  const app = createApp(App)

  app.use(createPinia())
  app.use(router)
  app.use(Toast, {
    position: 'top-right',
    timeout: 5000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: true,
    draggable: true,
    draggablePercent: 0.6,
    showCloseButtonOnHover: false,
    hideProgressBar: false,
    closeButton: 'button',
    icon: true,
  })

  // ? Apply dark mode by default
  document.documentElement.classList.add('dark')

  const authStore = useAuthStore()
  await authStore.init()

  app.mount('#app')
}

initApp().catch(console.error)
