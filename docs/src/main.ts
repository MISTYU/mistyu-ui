import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'
// import { CIcon } from '@lch/componets/icon'
// import '@lch/theme-chalk/src/index.scss'

const app = createApp(App)

app.use(router)
// app.use(CIcon)

app.mount('#app')
