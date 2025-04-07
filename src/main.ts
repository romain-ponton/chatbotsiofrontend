import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import "highlight.js/styles/tokyo-night-dark.css"
import App from './App.vue'
import {router} from "./router.ts";

const pinia = createPinia()

createApp(App)
    .use(pinia)
    .use(router)
    .mount('#app')
