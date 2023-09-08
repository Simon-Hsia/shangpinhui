export default [
  {
    // 重定向
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: () => import('@/views/Home'),
    meta: { footerShow: true, sortShow: true }
  },
  {
    path: '/login',
    component: () => import('@/views/Login'),
    meta: { footerShow: false }
  },
  {
    path: '/register',
    component: () => import('@/views/Register'),
    meta: { footerShow: false }
  },
  {
    /**
     * 问题1：不靠name能传递params参数吗？
     * 答：不能，你会发现跳过去params空空如也
     * 问题2：怎么样设计让一个params参数可传可不传？
     * 答：首先明白一点，如果路由中需要传递params参数，例如/search/:key。然而在跳转时不给key值，那么跳过去会发现路径完全错误，search都会不见。那怎么兼容这个问题呢？可以在设计路由时在参数后加?号 -> /search/:key?
     * 问题3：如果像上面那样了，但传递的key是个''怎么办？
     * 答：可以通过给key赋初值解决 -> key: this.key || undefined    不过注意哈，这个params参数就必须有上上题条件，可穿可不穿，即加?号，否则undefined也是么用的
     * 问题4：路由组件能不能传prop数据？
     * 答：有三种写法：
     * 一种是在下面写个属性props:true，然后在那边用props接收路由的params参数，即props:['keyword']，这样就不用写this.$route.keyword了，直接keyword
     * 第二种是对象写法：
     * 还是在下面写个属性props:{a:1,b:2}，然后那边用props接收，同样可以用，不过不常用
     * //函数写法:可以params参数、query参数，通过props传递给路由组件
     *  props: ($route)=>({keyword: $route.params.keyword,k:$route.query.k})
     */
    path: '/search/:keyword?',
    component: () => import('@/views/Search'),
    name: 'search',
    meta: { footerShow: true, sortShow: false }
  },
  {
    path: '/detail/:skuid?',
    component: () => import('@/views/Detail'),
    meta: { footerShow: true }
  },
  {
    path: '/addcartsuccess',
    name: 'addcartsuccess',
    component: () => import('@/views/AddCartSuccess'),
    meta: { footerShow: true }
  },
  {
    path: '/shopcart',
    name: 'shopcart',
    component: () => import('@/views/ShopCart'),
    meta: { footerShow: true }
  },
  {
    path: '/trade',
    name: 'trade',
    component: () => import('@/views/Trade'),
    meta: { footerShow: true }
    // 路由独享守卫
    /* beforeEnter: (to, from, next) => {
      // 为什么是验证这三个呢？只有从购物车跳过来才放行，'/'是防本地刷新from.path为'/'，'/login'是因为有游客没登录体验购物车，点击跳转购物车才发现自己没登录，这时候再登录才从'/login'跳过来，所以也放行
      if (['/shopcart', '/', '/login'].includes(from.path)) {
        next()
      } else next(false)
    } */
  },
  {
    path: '/pay',
    name: 'pay',
    component: () => import('@/views/Pay'),
    meta: { footerShow: true }
    /* beforeEnter: (to, from, next) => {
      // 从trade跳到pay就没必要验证login了，没有登录进不了pay，全局那里写的逻辑
      if (['/trade', '/'].includes(from.path)) {
        next()
      } else next(false)
    } */
  },
  {
    path: '/paysuccess',
    name: 'paysuccess',
    component: () => import('@/views/PaySuccess'),
    meta: { footerShow: true }
  },
  {
    path: '/center',
    redirect: '/center/myorder',
    name: 'center',
    component: () => import('@/views/Center'),
    // 引入二级路由
    children: [
      {
        path: 'myorder',
        component: () => import('@/views/Center/MyOrder')
      },
      {
        path: 'grouporder',
        component: () => import('@/views/Center/GroupOrder')
      }
    ],
    meta: { footerShow: true }
  }
]
