import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import * as util from './common/util/util'

//引入适配文件
import 'lib-flexible/flexible.js'
import 'assets/style/reset.css'/*引入公共样式*/

let app = createApp(App)
// 全局挂载公共方法
app.config.globalProperties.$util = util

app.use(store).use(router).mount('#app')

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})
