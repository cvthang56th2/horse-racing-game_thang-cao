import { createApp } from 'vue'
import App from './App.vue'
import router from '../router'
import store from '../store'
import uiPlugin from '../plugins/ui'
import './app.css'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(uiPlugin)

app.mount('#app')
