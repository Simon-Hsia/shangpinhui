import Vue from 'vue'
import App from './App.vue'
import router from './router'
//  引入仓库
import store from './store'

// 引入自定义的全局组件
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import TypeNav from '@/components/TypeNav'
import Carousel from '@/components/Carousel'
import Pagination from '@/components/Pagination'

//  引入mock模拟数据 mockServe.js
import '@/mock/mockServe'

// 引入轮播图的样式、
import 'swiper/css/swiper.css'

// 引入饿了么UI，按需引入
import { MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入懒加载插件
import VueLazyload from 'vue-lazyload'

// 当没有vuex的时候，可以全局引入api接口，这样就不用每个组件单独引入使用了
import * as API from '@/api'

Vue.component(Header.name, Header)
Vue.component(Footer.name, Footer)
Vue.component(TypeNav.name, TypeNav)
Vue.component(Carousel.name, Carousel)
Vue.component(Pagination.name, Pagination)

// 插入懒加载插件，这个插件的唯一用的地方只有search的商品图，去那里看
const loadimage = require('@/assets/images/头像.jpg')
const errorimage = require('@/assets/images/头像.jpg')
Vue.use(VueLazyload, {
  preLoad: 1.3,
  error: errorimage,
  loading: loadimage,
  attempt: 1
})

// MessageBox独特的挂载方式
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert

Vue.config.productionTip = false

new Vue({
  // 当这里写router的时候，所有的路由组件上就都有$route和$router两个属性了
  // $route: 一般获取路由信息【路径、query、params等等】
  // $router: 一般进行编程式导航进行路由跳转【push| replace】
  router,
  store,
  render: h => h(App),
  // 全局事件总线
  beforeCreate() {
    Vue.prototype.$bus = this
    Vue.prototype.$API = API
  }
}).$mount('#app')
