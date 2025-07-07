import './style.css'
import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import 'amfe-flexible'
createApp(App).use(createPinia()).mount('#app')
