import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

import './style.css'

const app = createApp(App)

app.config.globalProperties.$log = console.log
app.use(createPinia())
app.use(router)

app.mount('#app')

const $html = document.getElementsByTagName('html')[0]
window.addEventListener('resize', changeScale)

changeScale()
function changeScale() {
	// @ts-ignore
	$html.style.zoom = Math.min(1, $html.clientWidth / 1536)
}