import { createApp } from 'vue'
import { createPinia } from 'pinia'
import forEach from 'lodash-es/forEach'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import listModule from '@/modules'

import App from './App.vue'
import router from './router'

import './assets/style/index.scss'

import 'virtual:svg-icons-register'

const app = createApp(App)
const pinia = createPinia()

forEach(listModule, module => {
  forEach(module.router, value => {
    router.addRoute(value)
  })
})

app.use(ElementPlus)
app.use(pinia)
app.use(router)

app.mount('#app')
