import { createApp } from 'vue'
import Options from './Options.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

const app = createApp(Options)

app.use(ElementPlus)
app.mount('#app')