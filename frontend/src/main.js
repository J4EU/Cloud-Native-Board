import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './style.css' // 전역 스타일 추가

const app = createApp(App)

app.use(router)
app.mount('#app')
