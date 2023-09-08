import Vue from 'vue'
import VueRouter from 'vue-router'

// 引入刚分离出去的路由信息
import routes from '@/router/routes'

import { getToken } from '@/utils/token.js'

import store from '@/store/index.js'
Vue.use(VueRouter)

const router = new VueRouter({
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 始终滚动到顶部
    return { y: 0 }
  }
})

const blackList = ['/trade', '/pay', '/center/myorder']
// 全局守卫——————前置守卫
router.beforeEach((to, from, next) => {
  const token = getToken()
  // 获取用户信息中的nickName，来判断是否真正登录才去购物车搜索页等页面，不直接用userInfo是因为空对象为true
  const nickName = store.state.user.userInfo.nickName

  // 首先，判断本地有没有token，里面的跳转都是有token的情况下跳转的
  if (token) {
    // 有了token还去登录是不是有点猫饼？所以返回首页
    if (to.path === '/login') {
      next('/home')
      // 下面就不是去登录页面，带着token去search去cart啦，所以判断是否有用户名，有时上一次进了购物车然后刷新，本地token还在但仓库的用户信息没了，所以需要判断
    } else if (!nickName) {
      // 没有用户信息又想去购物车，就可以带着token先找后台要到用户信息再跳转
      store
        .dispatch('getUserInfo')
        .then(() => {
          // 要到用户信息了，放行
          next()
        })
        .catch(() => {
          // 带着token去后台要用户信息失败了？那可能是token过期了,清除后去登录吧
          store.dispatch('userLogout').then(() => {
            next('/login')
          })
        })
    } else {
      // 这里是发现本来就有用户信息了，所以直接跳转
      next()
    }
  } else {
    // 连token都没有，那么必然受到限制，不能去交易个人中心那些
    if (blackList.includes(to.path)) {
      // 跳转登录页时记得携带他想去的页面路由信息，方便登录好了马上返回原目的地
      next(`/login?redirect=${to.path}`)
    } else {
      next()
    }
  }
})

export default router
