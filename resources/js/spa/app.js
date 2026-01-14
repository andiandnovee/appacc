import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import { createPinia } from 'pinia'

import notify from '@/utils/notify'
import showConfirm from '@/utils/confirm'




// 🧩 Muat Tailwind utama dan Laravel global CSS (biar aman dulu)
import '../../css/app.css'    // bawaan Laravel (ada Tailwind)
import '@/app.css'
import '@/assets/theme.css'
// resources/js/spa/assets/theme.css

// opsional, style tambahan SPA

//console.log('🚀 SPA aktif di', import.meta.url)
window.$notify = notify
window.$confirm = showConfirm
const app = createApp(App)
app.use(router)
app.use(createPinia())
app.mount('#app')
