import { createApp } from 'vue'
import { useEventBus } from '@vueuse/core'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import registPlugins from '@/plugins'
import registRouterGuards from '@/router/guards'
import router, { registRouter } from '@/router'
import { registStore } from '@/store'
import '@/assets/style/app.scss'
import 'normalize.css/normalize.css'
import 'element-plus/dist/index.css'
import locale from 'element-plus/es/locale/lang/zh-cn'
import 'remixicon/fonts/remixicon.css'
import App from '@/App.vue'
import addPermissionRoutesMiddleWare from '@/middleware/addPermissionRoutesMiddleWare'
import mountCacheDataMiddleWare from '@/middleware/mountCacheDataMiddleWare'

const app = createApp(App)

// 注册 Element Plus
app.use(ElementPlus, { locale })
Object.entries(ElementPlusIconsVue).forEach(([key, component]) => {
  app.component(key, component)
})

// 注册 pinia Store
registStore(app)

// 注册插件
registPlugins(app)

// 注册事件总线
const ntVisitedTagsBus = useEventBus('ntVisitedTags')
const ntVisitedTagsSwitchBus = useEventBus('ntVisitedTagsSwitch')

// 全局事件总线配置
window.ntVisitedTagsSwitchBus = ntVisitedTagsSwitchBus
window.ntVisitedTagsBus = ntVisitedTagsBus
app.config.globalProperties.$bus = {
  ntVisitedTagsBus,
  ntVisitedTagsSwitchBus,
}

// 初始化应用
Promise.all([mountCacheDataMiddleWare(app), addPermissionRoutesMiddleWare()])
  .then(() => {
    // 注册路由
    registRouter(app)
    registRouterGuards(router)

    // 挂载应用
    app.mount('#app')
  })
  .catch((error) => {
    console.error('应用初始化失败:', error)
  })
