[项目演示链接](https://simon-hsia.github.io/shangpinhui/)
注意：getBaseCategoryList接口后台不稳定，如确实有需要可在一次获取数据后存在本地，然后mock数据

尚品汇电商购物平台项目开发流程总结

## 1.项目初始化配置

### 1.创建项目步骤

1. 在要添加项目的路径下管理员打开命令窗口

2. vue create 项目名称

3. Default ([Vue 2]babel,eslint)

4. 必选：Babel、CSS Pre-processors 预处理器。

   可选：Linter / Formatter 就是 Eslint、Router 路由

5. 选 2.x，然后输入 N 不保存路由配置，选择 Less

6. 选择 ESLint + Standard config 标准配置

7. 选择 Lint on save 在每次保存的时候都检查代码规范

8. 选择 In dedicated config files 把配置都放到独立的文件中

9. 是否将刚才的选项存为预设，还是输入 N

### 2.项目主要构成

    1. node_modules:放置项目依赖的地方，有时可以查找是否安装了某个依赖

2. public:一般放置一些共用的静态资源，打包上线的时候，public 文件夹里面资源原封不动打包到 dist 文件夹里面，你看里面就是很纯粹的单页面
3. src：程序员源代码文件夹
   1. api 文件夹存放的是接口
   2. assets 文件夹：经常放置一些静态资源（图片），assets 文件夹里面资源 webpack 会进行打包为一个模块（js 文件夹里面）
   3. components 文件夹:一般放置非路由组件（或者项目共用的组件）
   4. mock 存放模拟数据的相关
   5. router 存放路由相关
   6. store 是 vuex 的仓库
   7. utils 是存放工具类的文件，什么 UUID 啊 request 啊之类的
   8. views 文件夹存放有路由的组件
   9. App.vue 唯一的根组件，最大的组件
   10. main.js 入口文件【程序最先执行的文件】
4. babel.config.js: babel 配置文件，比如把 ES6 翻译成 ES5
5. package.json：记录的项目信息，名称、版本、依赖等
6. README.md:项目说明文件，就是现在在写的

### 3.项目先手小配置

1.  想让项目每次保存都自动打开页面？

    package.json 的 scripts 节点下 serve 属性末尾加上 --open

    ```json
    "scripts": {
           "serve": "vue-cli-service serve --open",
            "build": "vue-cli-service build",
            "lint": "vue-cli-service lint"
    }
    ```

    _不过我不希望这样_

    2.  关闭 eslint 功能

    vue.config.js 对外暴露的属性加上 lintOnSave : false,_我还是开着的_

    3.  src 文件夹的@快捷符怎么设置？

    jsconfig.json 文件里写这个属性

    ```json
    "compilerOptions": {
            "baseUrl": "./",
            "paths": {
                "@/*": [
                    "src/*"
                ]
            }
        },
        "exclude": [
            "node_modules",
            "dist"
        ]
    ```

    很明显 exclude 规定了在"node_modules", "dist"下不能用这个快捷符

    4.  浏览器是不识别 less 的，项目中要安装 less-loader 可以转化为 css

    5.  在 public 中的 index.html 中引入

    ```html
    <!-- 引入清除默认样式的css -->
    <link rel="stylesheet" href="<%= BASE_URL %>reset.css" />
    ```

## 2.基础组件的搭建

### 1.基础静态组件

​ 在 components 下新建 Header 和 Footer 组件

​ 这两个是全局组件，在 main.js 下引入

```js
// 引入自定义的全局组件
import Header from '@/components/Header'
import Footer from '@/components/Footer'
Vue.component(Header.name, Header)
Vue.component(Footer.name, Footer)
```

​ 然后就在 App.vue 下直接用

```html
<template>
  <div class="app-container">
    <header></header>
    <div class="main">...</div>
    <-- 这个v-show后面解释，就是有些路由下不需要这个组件 -->
    <footer v-show="$route.meta.footerShow"></footer>
  </div>
</template>
```

### 2.基础路由组件

​ 搭建路由组件:Home、Search、Login（没有底部的 Footer 组件）、Register（没有底部的 Footer 组件）

直接在 views 文件夹下新建这些组件

​ 然后就要在 router 文件夹下新建 index.js 和 routes.js

​ index.js 这样写

```js
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

export default router
```

​ routes.js 就是路由信息

```js
export default [
  {
    // 重定向
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    // 懒加载
    component: () => import('@/views/Home'),
    meta: { footerShow: true, sortShow: true }
  },
  ...
]

```

​ 然后就需要去 App.vue 写路由出口

```html
<template>
  <div class="app-container">
    <header></header>
    <div class="main">
      <router-view></router-view>
    </div>
    <footer v-show="$route.meta.footerShow"></footer>
  </div>
</template>
```

​ 还有就是 main.js 下也要引入路由

```js
import Vue from 'vue'
import App from './App.vue'
import router from './router'

new Vue({
  // 当这里写router的时候，所有的路由组件上就都有$route和$router两个属性了
  // $route: 一般获取路由信息【路径、query、params等等】
  // $router: 一般进行编程式导航进行路由跳转【push| replace】
  router,
  render: h => h(App)
}).$mount('#app')
```

### 3.路由元信息

​ 首页|搜索等等底部是有 Footer 组件，而登录注册是没有 Footer 组件的，所以在 route.js 里面使用路由元信息可以决定 footer 组件的显示与隐藏

​ routes.js 里这么写

```js
export default [
  ...
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
  ...
]
```

​ App.vue 里面这样用

```html
<template>
  <div class="app-container">
    ...
    <footer v-show="$route.meta.footerShow"></footer>
  </div>
</template>
```

### 4.路由传参

​ params 参数：路由需要占位，程序就崩了，属于 URL 当中一部分

​ query 参数：路由不需要占位，写法类似于 ajax 当中 query 参数

```js
{
    /**
     * 问题1：不靠name能传递params参数吗？
     * 答：不能，你会发现跳过去params空空如也
     * 问题2：怎么样设计让一个params参数可传可不传？
     * 答：首先明白一点，如果路由中需要传递params参数，例如/search/:key。然而在跳转时不给key值，那么跳过去会发现路径完全错误，search都会不见。那怎么兼容这个问题呢？可以在设计路由时在参数后加?号 -> /search/:key?
     * 问题3：如果像上面那样了，但传递的key是个''怎么办？
     * 答：可以通过给key赋初值解决 -> key: this.key || undefined    不过注意哈，这个params参数就必须有上上问条件，可穿可不穿，即加?号，否则undefined也是么用的
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
  }
```

```js
//第一种:字符串形式
this.$router.push(
  '/search/' + this.keyword + '?k=' + this.keyword.toUpperCase()
)
//第二种:模板字符串
this.$router.push(`/search/${this.keyword}?k=${this.keyword.toUpperCase()}`)
//第三种:对象
this.$router.push({
  name: 'search',
  params: {
    keyword: this.keyword
  },
  query: {
    k: this.keywond.toUpperCase()
  }
})
```

## 3.Home 首页组件的拆分

### 1.三级联动组件的全局化

​ 在 main.js 里面写

```js
import TypeNav from '@/components/TypeNav'
Vue.component(TypeNav.name, TypeNav)
```

​ 在 Home. vue 里面写

```html
<template>
  <div class="home-container">
    <TypeNav />
    ...
  </div>
</template>
```

### 2.Home 的子组件搭建

​ 在 Home 文件夹下再多添 List Container、Recommend、Rank、Like、Floor、Brand 几个文件

​ 然后再 index. vue 引入并使用

```html
<template>
  <div class="home-container">
    <TypeNav />
    <ListContainer />
    <Recommend />
    <Rank />
    <Like />
    <Floor v-for="item in floorList" :key="item.id" :list="item" />
    <Brand />
  </div>
</template>
```

```js
import ListContainer from '@/views/Home/ListContainer'
import Recommend from '@/views/Home/Recommend'
import Rank from '@/views/Home/Rank'
import Like from '@/views/Home/Like'
import Floor from '@/views/Home/Floor'
import Brand from '@/views/Home/Brand'

export default {
  name: 'Home',
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand
  },
  ...
}
```

## 4.axios 请求相关编写

### 1.axios 的二次封装

​ 在 utils 下新建 request.js

```js
import axios from 'axios'

const baseURL = 'http://gmall-h5-api.atguigu.cn/api'
const request = axios.create({
  baseURL,	// 基础路径
  timeout: 5000	// 规定超时毫秒数
})

// 请求拦截器
request.interceptors.request.use(config => {
  //  config配置对象，里面一个属性很重要，叫做请求头header
  ...
  return config
})

// 响应拦截器
request.interceptors.response.use(
  res => {
    ...
    return res.data
  }
  // 响应失败的函数
  // error => Promise.reject(new Error('faile'))
)

export default request

```

### 2.API 统一管理

​ 在 api 文件夹的 index.js 这样写，引入刚才的 request.js，然后就统一写请求导出给别的模块用

```js
import request from '@/utils/request.js'

/**
 * 请求TypeNav列表数据
 * @returns 一个Promise对象
 */
export const getBaseCategoryList = () =>
  request.get('/product/getBaseCategoryList')

...
```

### 3.nprogress 插件的使用

​ nprogress 可以在页面的最上方，每次发请求的时候都显示一个进度条，刷的一下那种

​ 首先在 request.js 里面引入这个插件（其实是先下载）,然后请求拦截下来先开启 start 方法，响应后里面调用 done 方法

```js
// 引入进度条
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'

// 请求拦截器
request.interceptors.request.use(config => {
  nprogress.start() // start代表进度条开始，done代表结束
  return config
})

// 响应拦截器
request.interceptors.response.use(res => {
  nprogress.done()
  return res.data
})
```

## 5.vuex

​ vuex 是官方提供一个插件，状态管理库，集中式管理项目中组件共用的数据。

​ 在 Store 文件夹下的 idnex.js 中这样写

```js
import Vue from 'vue'
import Vuex from 'vuex'

// 引入小仓库
import home from './home'
...

Vue.use(Vuex)

// 对外暴露一个Store实例
export default new Vuex.Store({
  //  实现vuex仓库模块化存储
  modules: {
    home,
    ...
  },
  // 仓库存储数据的地方
  state: {},
  //  getters:理解为计算属性，用于简化仓库数据，让组件获取仓库的数据更加方便
  getters: {},
  //  修改state的唯一手段
  mutations: {},
  //  action:处理action,可以书写自己的业务逻辑，也可以处理异步
  actions: {
    // 这里可以写业务逻辑，但是不能修改State，相当于服务员，mutations是后厨
  }
})

```

​ 然后需要在 main.js 中引入

```js
//  引入仓库
import store from './store'

new Vue({
  ...
  store,
  ...
  render: h => h(App),
}).$mount('#app')

```

​ 例如 Search 小仓库中这样写

```js
// 引入接口，action向后台要数据
import { getSearchInfo } from '@/api'

//  home模块的小仓库
const state = {
  searchInfo: {}
}
//  修改state的唯一手段
const mutations = {
  SEARCHINFO(state, searchInfo) {
    state.searchInfo = searchInfo
  }
}
//  action:处理action,可以书写自己的业务逻辑，也可以处理异步
const actions = {
  // 获取Search模块的数据
  async searchInfo({ commit }, params = {}) {
    const res = await getSearchInfo(params)
    if (res.code === 200) commit('SEARCHINFO', res.data)
  }
}

// 计算属性，用于简化数据结构，拉取的时候就方便了
const getters = {
  // 这个state并非大仓库的，而就是当前页的state
  goodsList(state) {
    return state.searchInfo.goodsList || []
  },
  ...
}
 //	向外导出，在大仓库中引入
export default {
  state,
  mutations,
  actions,
  getters
}

```

​ 那怎么在组件中使用仓库呢？比如 Search

```js
// 首先在Search中引入辅助函数，getters的数据用到前者，普通的状态数据用到mapState
import { mapGetters, mapState } from 'vuex'

export default {
  name: 'Search',
  ...
  computed: {
    // 这个用法也与mapState不同，那个是对象方法，这个是直接数组里写数据名
    ...mapGetters(['goodsList']),
    ...mapState({
      total: state => state.search.searchInfo.total
    })
  },
  ...
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
        this.$store.dispatch('searchInfo', this.searchParams)
	},
    ...
  }
}
```

## 6.三级联动

### 1.三级联动的动态数据展示

​ 在 TypeNav 组件下就按上面 Search 的 vuex 那一套搞就是了，约定俗成叫“三连环”(在 API 编写接口，然后在小仓库中写 action、mutations、state，第三步就是在组件中派发 action，这时候仓库中就有数据了)，然后就是 mapState 或者 mapGetters 解构到组件中展示了，没什么好说的

​ 要注意组件向仓库拿这个数据的时候要分割一下，不然首页位置不够，展示不下

```js
...mapState({
      //  注入一个参数state，其实即为大仓库中的数据
      categoryList: state => state.home.categoryList.slice(0, 15)
})
```

### 2.三级联动的路由跳转与参数传递

​ 当点击三级联动的任何一级的任何选项都会跳转到 Search 中，并且 Search 会依据关键词（尽管这样跳没有 keyword）和 category Id 发请求展示不同的数据，但每一级所对应的 category Id 属性都不同，有 category1Id，category2Id，category3Id，所以我们在每一级的 a 标签上都加上 data 数据

```html
<div class="all-sort-list2" @click="goSearch">
  ...
  <a :data-categoryName="item.categoryName" :data-category1Id="item.categoryId">
    {{ item.categoryName }}
  </a>
  ...
  <a
    :data-categoryName="child.categoryName"
    :data-category2Id="child.categoryId"
  >
    {{ child.categoryName }}
  </a>
  ...
  <a
    :data-categoryName="grandson.categoryName"
    :data-category3Id="grandson.categoryId"
  >
    {{ grandson.categoryName }}
  </a>
</div>
```

​ 接着在相应方法中解构出来就能用了

```js
goSearch(e) {
      // 解构出跳转标签的信息并整理，准备跳转
      const { categoryname, category1id, category2id, category3id } = e.target.dataset
      const query = {categoryName: categoryname}	//	判定触发函数的是三级之中的
      if (categoryname) {
        if (category1id) query.category1Id = category1id
        else if (category2id) query.category2Id = category2id
        else if (category3id) query.category3Id = category3id
      }
      const location = { name: 'search', query }
      location.params = this.$route.params	//	合并参数，把keyword也带上
      this.$router.push(location)
    },
    changeShow(flag) {
      if (!this.$route.path.includes('/search')) return
      this.show = flag
    }
  }
```

​

### 3.Search 的三级联动写过渡动画

​ 可以看到 Search 的三级联动是默认隐藏的，移入移出控制展示隐藏，并且有淡入淡出的过渡效果。

​ 所以有个 change Show 方法，是因为主页需要三级联动默认展开，而 Search 页面不需要默认展开（有移入移出效果，html 第 1 行），v-show 来决定的，就在 html 的第 4 行

```html
<div @mouseenter="changeShow(true)" @mouseleave="changeShow(false)">
  <h2 class="all">全部商品分类</h2>
  <transition name="sort">
    <div class="sort" v-show="show">...</div>
  </transition>
</div>
```

```js
	changeShow(flag) {
      if (!this.$route.path.includes('/search')) return
      this.show = flag
    }
```

​ 那过渡动画就是这样写的，和上面的 transition 标签配合用

```less
// 定义过渡的属性和时长的地方，用active
.sort-enter-active,
.sort-leave-active {
  transition: opacity 0.5s;
}

// 定义过度动画开始和离开结束时的透明度为0
.sort-enter,
.sort-leave-to {
  opacity: 0;
}
```

### 4.三级联动数据请求优化

​ 你会发现三级联动在首页和搜索页都有，但切换路由的时候组件就会销毁再创建，这样 dispatch 就会触发多次，仓库多次向后台请求数据，所以可以把这句话放到 App.vue 中，这样就只触发一次了

```js
export default {
  name: 'App',
  mounted() {
    // 本来这个列表请求是放在typenav发送的，但主页和搜索页都会创建销毁一道组件，于是把请求放在这里，就不会请求两边了。当然也可以用缓存组件的方法，但比起来更复杂。还有说放在入口文件的，虽说也是只会执行一次，但那里的this是window，所以不能
    //  通知Vuex发请求，获取数据，存储于仓库当中
    this.$store.dispatch('categoryList')
  }
}
```

## 7.关于 Mock

​ 有时候后台接口没搞好，前台可以通过 Mock 插件模拟接口数据

1. 安装依赖包，并且新建 Mock 文件夹

2. 比如准备了 Banner 页的数据，可以新建 banner .json 写入

   ```json
   [
       {
           "id":"1",
           "imgUrl":"/images/banner1.jpg"
       },
       ...
   ]
   ```

   3. 然后 Mock 文件夹下再建立 MockServe.js 文件，里面这样写

   ```js
   // 先引入mock模块
   import Mock from 'mockjs'

   // 再把json 数据引入，注意json格式数据是默认对外暴露的，直接引入
   import banner from './banner.json'
   ...

   //  mock数据:第一个参数请求地址,第二个参数:请求数据
   Mock.mock('/mock/banner', { code: 200, data: banner })
   ...

   ```

   4. 回到入口文件，引入 MockServe.js,这样才至少执行一次

   5. 再到 utils 下面写 mockRequest.js，可以完全从 request.js 里面复制，但 baseURL 要改成'/mock'

   ```js
   import axios from 'axios'
   ...
   const baseURL = '/mock'
   ...
   export default request
   ```

   6. 最后就是写接口的时候那个 api 下的 index.js 就不止引入工具下的 request 了

   ```js
   // 引入假的"ajax"
   import mockRequest from '@/utils/mockRequest.js'
   ```

   7. 然后就是具体应用，banner 的数据三连环获取并渲染，唯一的不同就是 api 是 mock Request. get...

   8. 后面的 Floor 也用到了 Mock 数据，穿插一个知识点，Floor 在首页是复用的两次，但你在 Floor 组件里发请求就不对了，因为你不知道以后会有多少个 Floor，所以在首页发再 v-for 这个 Floor 更好。

   所以在 Home 发请求，三连环，后面懂得都懂，这个本应该在轮播图后做的，因为 Floor 里面有轮播图，但知识点太少就整合到这了

## 8.轮播图相关

​ 这个项目有很多轮播图，所以可以单独拆个组件出来复用，每次使用都传不同的图片数组进去就是了。

但是轮播图是有插件的----swiper，所以在这个组件中我们需要引入插件(先下载)

​ 首先在 main.js 中引入 swiper 的 css 文件，这样每个组件都能正确显示

```js
// 引入轮播图的样式、
import 'swiper/css/swiper.css'
```

​ 然后 components 文件夹下新建 Carousel 组件，里面的 html 这样写

```html
<template>
  <div class="carousel-container">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="img in list" :key="img.id">
          <img :src="img.imgUrl" />
        </div>
      </div>
      <!-- 如果需要分页器 -->
      <div class="swiper-pagination"></div>

      <!-- 如果需要导航按钮 -->
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  </div>
</template>
```

​ js 这样写,还是先引入插件，这个组件只需要传一个 list，为什么要在 watch 里面写呢？下面有说明，home 的大轮播图是从仓库拿数据，所以在 DOM 结构生成的时候数据可能还没回来，这个时候 new swiper 是不明智的，所以在 list 变化后通过 this.$nextTick()最新 DOM 结构生成后才执行轮播图逻辑，但是其他地方的轮播图是没变化的(floor)，所以要 immediate: true。

​ 讲清楚一点，watch 是为了监听数组从无到有，但有了还不行，还没渲染，this.$nextTick()保证数据已经渲染到 DOM 上了，所以这时候再添加轮播图逻辑

```js
// 引入轮播图插件
import Swiper from 'swiper'

export default {
  name: 'Carousel',
  props: ['list'],
  watch: {
    list: {
      // floor组件中的这个数据是没有变化的(从父组件传的)，但为了封装轮播图组件所以必须用监听(为了和home的轮播图实例结构一样)，因此为了让监听执行就用到了immediate，数据生成之时就执行一次，不过我不懂，这样对于listContainer组件不就会生成两次实例吗，开局一次，收到库中数据变化又一次
      immediate: true,
      handler() {
        // 要先进行判断，不然主页轮播图的小圆点会发生错乱
        if (this.list.length === 0) return
        // 这个时候数据已经更新了，但是最新的DOM结构还没有生成，所以是不能直接newSwiper对象的
        this.$nextTick(() => {
          const mySwiper = new Swiper('.swiper-container', {
            // direction: 'vertical', // 垂直切换选项
            loop: true, // 循环模式选项
            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
              clickable: true
            },
            // 如果需要前进后退按钮
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            },
            // 如果需要滚动条
            scrollbar: {
              el: '.swiper-scrollbar'
            }
          })
          // 这个不应该返回的，但是我用了ESLint，不使用变量就会报错，又不好搞规则，所以只能使用了
          return mySwiper
        })
      }
    }
  }
}
```

## 9.Search 模块相关

### 1.Search 静态搭建与数据请求并分离 Search Selector 组件

​ 分离 Search Selector 组件，接着三连环从后台整到数据，但是这个接口经常崩，所以我第一次请求到数据后就 mock 了

### 2.动态渲染数据

​ 可以注意到数据有点多，数据结构复杂，所以通过 Getters 简化数据结构，分别展示出去，然后 Search 组件捞一个 goods List，子组件捞另外两个，渲染不用说了吧，太简单了，有一点要提一下，数据没回来之前那个地方是 undefined 所以要像下面这样写|| [ ]

```js
// 计算属性，用于简化数据结构，拉取的时候就方便了
const getters = {
  // 这个state并非大仓库的，而就是当前页的state
  goodsList(state) {
    return state.searchInfo.goodsList || []
  },
  attrsList(state) {
    return state.searchInfo.attrsList || []
  },
  trademarkList(state) {
    return state.searchInfo.trademarkList || []
  }
}
```

### 3.根据不同参数展示数据

​ 要知道不止页面才进来需要获取数据，当添加面包屑，改搜索关键词，再点不同的三级联动都需要重新获取数据，所以需要在 data 中依据接口的模样搞一个数据模板实时存储更新发请求

```js
data() {
    return {
      searchParams: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
        categoryName: '', // 分类名称
        keyword: '',
        order: '1:desc', //  排序方式,初始应该是综合降序
        pageNo: 1, //  当前页码
        pageSize: 10, // 每页条数
        props: [], //  平台售卖属性的参数
        trademark: '' //  品牌
      }
    }
  },
```

### 4.不同的地方发起请求

​ 需要发请求的地方太多了，所需要做的兼容操作也太杂了，面包屑啊排序啊脑袋都炸了，这里贴一下 Search 的代码就完了

```js
{
    watch: {
    // 监听路由的数据是否发生变化，如是就重新发起请求
    $route() {
      this.mergeNewParams()
      this.getData()
    }
  },
  beforeMount() {
    // 组件挂载完毕之前先执行一次参数合并
    // 将分类信息和关键词都统合到这个对象中
    this.mergeNewParams()
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 合并参数简化方法
    mergeNewParams() {
      Object.assign(this.searchParams, this.$route.params, this.$route.query)
    },
    // 封装获取数据的语句为方法,传params参数，方便从服务器拉取不同的数据
    getData() {
      this.$store.dispatch('searchInfo', this.searchParams)
    },
    // 点击面包屑删除分类名字
    removeCategoryName() {
      // 把当前组件下的临时分类名，Id置空
      this.searchParams.category1Id = undefined
      // 每次拉取完手机列表数据后，要清空Id。如果这次是请求的3Id，不清空的话下次可能搜索1Id，导致携带了两个Id参数
      this.searchParams.category2Id = undefined
      // 属性值设置为undefined请求就不会携带该参数
      this.searchParams.category3Id = undefined
      this.searchParams.categoryName = undefined
      // 但是这只是把临时的变更了，还有route的这些东西没变，看路径就发现没变，所以需要重定向到search,变相清空query，当然关键词不应该删，所以重定向的时候带着
      this.$router.push({ name: 'search', params: this.$route.params })
    },
    // 点击关键词的面包屑三处删除关键词
    removeKeyword() {
      // 和点击分类面包屑一样的套路，先把searchParams的keyword清空
      this.searchParams.keyword = undefined
      // 然后携带query/params重定向，这时params/query清空了watch就监听到了，自己就发起请求了
      this.$router.push({ name: 'search', query: this.$route.query })
      // 这时route中的和searchParams中的keyword都没了，再通知兄弟组件清空输入框就行了
      this.$bus.$emit('clearKeyword')
    },
    // 自定义事件触发该函数，获取到品牌信息
    getTrademark(trademark) {
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
      this.getData()
    },
    // 点击面包屑删除品牌信息
    removeTrademark() {
      this.searchParams.trademark = undefined
      this.getData()
    },
    // 自定义事件触发该函数，获取到属性信息
    getAttrInfo(attr, val) {
      // 整理参数成props需要的模样
      const prop = `${attr.attrId}:${val}:${attr.attrName}`
      // 判断这个属性是否已经被添加过了
      if (!this.searchParams.props.includes(prop)) {
        this.searchParams.props.push(prop)
        this.getData()
      }
    },
    // 点击属性面包屑
    removeProp(index) {
      // 点击删除此属性，然后重新发送请求
      this.searchParams.props.splice(index, 1)
      this.getData()
    },
    // 下面排序根据order切换类名和箭头用到的函数
    toggleMethod(str) {
      return this.searchParams.order.includes(str)
    },
    // 点击排序方块触发更改排序方式
    order(num) {
      const orderNum = this.searchParams.order.split(':')[0]
      const orderSort = this.searchParams.order.split(':')[1]
      let newOrder
      // 为true说明当前点击的排序方式(综合/价格)和原依据方式相同，是想降序升序切换
      if (orderNum === num) {
        newOrder = `${orderNum}:${orderSort === 'asc' ? 'desc' : 'asc'}`
      } else {
        // 否则说明想从综合切换到价格，反之亦然
        newOrder = `${num}:desc`
        // 切换之后将升序降序修改为默认的降序
      }
      this.searchParams.order = newOrder
      // 更改order参数后，重新发请求获得排序后的数据
      this.getData()
    },
    // 从分页器组件收到当前页码
    getPageNo(pageNo) {
      this.searchParams.pageNo = pageNo
      this.getData()
    }
  }
}
```

## 10.分页器模块

​ 很多地方都需要分页器，所以就单独搞出一个组件，这里把代码贴出来慢慢说

```html
<template>
  <div class="pagination-container">
    <button :disabled="pageNo === 1" @click="postPageNo(pageNo - 1)">
      上一页
    </button>

    <button v-if="continueArr[0] > 1" @click="postPageNo(1)">1</button>

    <button v-if="continueArr[0] > 2">···</button>

    <!-- 中间的continues按钮 -->
    <button
      v-for="num in continueArr"
      :key="num"
      @click="postPageNo(num)"
      :class="{ active: pageNo === num }"
    >
      <!-- 这里给中间的加类就行了，而不需要给两边的1或者totalPage按钮加，因为在点击后他们都会消失，由循环中的按钮替代 -->
      {{ num }}
    </button>

    <button v-if="continueArr[continueArr.length - 1] < totalPage - 1">
      ···
    </button>

    <button
      v-if="continueArr[continueArr.length - 1] < totalPage"
      @click="postPageNo(totalPage)"
    >
      {{ totalPage }}
    </button>

    <button :disabled="pageNo === totalPage" @click="postPageNo(pageNo + 1)">
      下一页
    </button>

    <button style="margin-left: 30px">共 {{ total }} 条</button>
  </div>
</template>
```

```js
export default {
  name: 'Pagination',
  //	1.首先组件接收父级传的几个重要参数，当前页码，每页展示条数，总条数，中间连续的页码数
  props: ['pageNo', 'pageSize', 'total', 'continues'],
  computed: {
    // 计算属性计算出最大的页码
    totalPage() {
      return Math.ceil(this.total / this.pageSize)
    },
    // 计算出中间部分的起始和结尾，并遍历成一个数组供v-for
    continueArr() {
      // 解构赋值，不然写很多this
      const { continues, totalPage, pageNo } = this
      let start = 1
      let end = totalPage
      // 一般情况，如果要求的中间页码数小于实际总页码数，那就
      if (continues < totalPage) {
        // 起始就是当前页-continues的一半
        start = pageNo - parseInt(continues / 2)
        // 结束就是当前页+continues的一半
        end = pageNo + parseInt(continues / 2)
        // 如果这样算开始页是小于1的，那说明当前页码很小
        if (start < 1) {
          start = 1
          end = continues
        }
        // 这个当然是另一例外，算出来结束的位置比总页码大，那也要到头了
        if (end > totalPage) {
          start = totalPage - continues + 1
          end = totalPage
        }
      }
      // 现在搞个数组把start到end的自然数都存进来，上面遍历
      const arr = []
      for (let i = start; i <= end; i++) arr.push(i)
      return arr
    }
  },
  methods: {
    // 向父组件发送将修改的pageNo
    postPageNo(pageNo) {
      this.$emit('getPageNo', pageNo)
    }
  }
}
```

## 11.商品详情页开发

### 1.索然无味的步骤

​ 和以前一样的，搞三连环渲染数据，也就那样，当然跳转到商品详情页的时候需要携带商品的 ID，这个应该弄成 params 参数。

### 2.放大镜部分

​ 这也没什么好说的,动态渲染数据，从传过来的图片展示数组里选一个展示，然后就是核心遮罩层函数

```js
	// 放大镜函数
    handler(e) {
      // 获取DOM元素
      const mask = this.$refs.mask
      const big = this.$refs.big
      // 获取遮罩层的相对距离
      let left = e.offsetX - mask.offsetWidth / 2
      let top = e.offsetY - mask.offsetHeight / 2

      // 判断遮罩层所处位置来给它赋新的值,不在特殊位置就保持初始let left的值
      if (left < 0) {
        left = 0
      } else if (left > mask.offsetWidth) {
        left = mask.offsetWidth
      }

      if (top < 0) {
        top = 0
      } else if (top > mask.offsetHeight) {
        top = mask.offsetHeight
      }

      // 要赋的值已经存在临时变量中，正式赋值
      mask.style.left = left + 'px'
      mask.style.top = top + 'px'

      big.style.left = -2 * left + 'px'
      big.style.top = -2 * top + 'px'
    }
```

### 3.购买产品个数的操作

​ 不多说，数据格式的严格约束，看代码

```html
<div class="controls">
  <input autocomplete="off" class="itxt" v-model.number="skuNum" //
  收取的时候就只收number格式 @change="changeNum" //
  检测到input手动输入变更后触发函数 />
  <a href="javascript:" class="plus" @click="skuNum++">+</a>
  <a href="javascript:" class="mins" @click="skuNum > 1 && skuNum--"> - </a>
</div>
```

```js
changeNum(e) {
  const value = e.target.value
  //	如果收取的值是非数值或者负数就等于1
  if (isNaN(value) || value < 1) {
    this.skuNum = 1
  } else {
  //  否则就调整为当前值得整数部分，这样输入小数的问题也解决了
    this.skuNum = parseInt(value)
  }
},
```

### 4.加入购物车

​ 加入购物车是要做两件事，一是把商品的信息传过去，二是要向后台发请求(参数是 id 和个数)，返回的是成功或者失败的 Promise 对象，这里用的是异步编程，其实应该用 then 和 catch 更好

​ 首先通过派发 action 告诉后台要加入购物车，这个具体的代码贴在前面，看得出来，具体 就是向后台发请求，返回的 Promise 对象只有成功或者失败，然后这个结果又会在组件的 dispatch 上体现出来，他也是返回 Promise 对象。

```js
// 将产品添加到购物车中
  async addOrUpdateShopCart({ commit }, { skuID, skuNum }) {
    // 点击加入购物车后就会发起这个请求把参数带给服务器，服务器写入数据成功，并不会返回其他的数据，只会返回code=200，代表操作成功
    const res = await reqAddOrUpdateShopCart(skuID, skuNum)
    // 于是这里判断返回的code，给整个addOrUpdateShopCart返回一个promise对象
    if (res.code === 200) {
      // 加入购物车成功
      return 'ok'
    } else {
      // 加入购物车失败
      return Promise.reject(new Error('faile'))
    }
  }
```

​ 然后呢，当后台告诉你加入购物车成功后，就要跳转路由到 add cart success 了，但这时候是要把商品信息的整个对象传过去的，我们这里选择通过会话存储来传递，对象得序列化才能存储，然后带着购买数量就跳转了

​ 当然要是加入购物车失败了就直接 alert 错误信息了

```js
 async addGoods() {
      // 向服务器发起加入购物车请求，参数有商品ID和数量
      try {
        await this.$store.dispatch('addOrUpdateShopCart', {
          skuID: this.$route.params.skuid,
          skuNum: this.skuNum
        })
        // 成功了，进行路由跳转,不过先把产品信息给会话存储，对象格式传路由不好,记得JSON序列化，不然接收到的是[Object Object],tip:其实可以直接从仓库拿的...
        sessionStorage.setItem('SKUINFO', JSON.stringify(this.skuInfo))
        this.$router.push({
          name: 'addcartsuccess',
          query: {
            skuNum: this.skuNum
          }
        })
      } catch (error) {
        alert(error.message)
      }
    }
```

​ 这时候我们来看看，add cart success 那边怎么接收的

```js
export default {
  name: 'AddCartSuccess',
  computed: {
    skuInfo() {
      return JSON.parse(sessionStorage.getItem('SKUINFO'))
    }
  }
}
```

​ 从这开始，后面很多请求都是只返回成功或失败状态的，而不返回任何数据，所以上面 action 写法就经常用到

## 12.购物车模块

### 1.搞静态

​ 要用到 UUID

​ 为了从后台拿到好几次加的多个商品，所以需要弄个游客身份。

### 2.UUID

1. 第一步就是下载依赖，然后在工具文件夹下新建 uuid_token.js 模块

```js
// 调用uuid依赖包来生成临时身份，去官网上能看到这个引入方式
import { v4 as uuidv4 } from 'uuid'

// 暴露一个获取身份的函数
export const getUUID = () => {
  // 如果本地没有UUID，那就设置一个，然后再return
  if (!localStorage.getItem('UUID')) localStorage.setItem('UUID', uuidv4())
  return localStorage.getItem('UUID')
}
```

2. 然后在 detail 的仓库中引入这个，存储一个 UUID

```js
// 封装游客身份模块。随机一个字符串，一旦本地有了就不能再变了
import { getUUID } from '@/utils/uuid_token'
//  detail模块的小仓库
const state = {
  detailInfo: {},
  uuid_token: getUUID()
}
```

3. 有了 UUID 怎么用呢，就需要在发送请求的时候带着，这时候就用到请求拦截器了

```js
// 引入仓库，请求拦截器要用到存的临时身份
import store from '@/store'

// 请求拦截器
request.interceptors.request.use(config => {
  //  config配置对象，里面一个属性很重要，叫做请求头header
  // 把生成的临时身份给请求带着传给后台，才能获取到购物车数据
  config.headers.userTempId = store.state.detail.uuid_token
  return config
})
```

### 3.获取到数据后动态展示

​ 这个懂得都懂，还是老样子，但是多了两个要注意的，一个是计算总的金额，一个是计算全选

```js
computed: {
    ...mapGetters(['cartList']),
    // 最终抽离出的购物车数据
    cartInfoList() {
      return this.cartList.cartInfoList || []
    },
    // 计算总价
    tatalPrice() {
      return this.cartInfoList
        .filter(item => item.isChecked)	//	首先过滤出所有选中的，然后再累加
        .reduce((amt, item) => (amt += item.skuNum * item.skuPrice), 0)
    },
    // 总复选框的计算值
    isAllCheck() {	//	every只要有一个为false就直接返回true，same是只要有一个为true就返回true
      return this.cartInfoList.every(item => item.isChecked)
    }
  }
```

### 4.商品数量那些事儿

​ 注意这个商品数量，只要发生了变更，就要向后台同步数据也就是发请求，这就涉及节流的问题，当然主要还有三个地方能更改商品数量，我们应该给其绑定同一个函数，传 type 变量区分，具体如下

​ 值得注意的是，后台反人类，要的不是修改后的值，而是变更的值，也就是新值与旧值的差

​ 按键一直点肯定不行，所以要节流，这里是用的 this.numFlag，第 2 和第 3 端代码一起看

```html
<a href="javascript:void(0)" class="mins" @click="handler('sub', -1, item)">
  -
</a>
<input
  autocomplete="off"
  type="text"
  minnum="1"
  class="itxt"
  :value="item.skuNum"
  @change="handler('change', $event.target.value * 1, item)"
/>
<a href="javascript:void(0)" class="plus" @click="handler('add', 1, item)">
  +
</a>
```

```js
    // 点击或输入更改商品数量
    handler(type, disNum, cart) {
      // type是为了区分是基于三处的哪处做的改动，disNum是变更的数量，cart是为了拿到当前商品的id和上一次修改后的数量
      // 改变了数量，向后台更新数据，但注意这个接口要把更新的个数传过去，所以是-1,+1,5-3
      if (this.numFlag) return
      this.numFlag = true
      switch (type) {
        case 'add':
          disNum = 1
          break
        case 'sub':
          // 判断当前购物车中的数量是否已经为最小值1了，不是的话可以减一，否则为0，用cart.skuNum判断是因为肯定是最新的并且还没经过这次改动的
          disNum = cart.skuNum > 1 ? -1 : 0
          break
        case 'change':
          // 用户输入奇怪的东西，要限制,不过输入的是小数也可以，这里取整了
          disNum =
            isNaN(disNum) || disNum < 1 ? 0 : parseInt(disNum) - cart.skuNum
          break
        default:
          disNum = 0
      }

      // 前台验证好数据后，可以通过派发actions同步给后台了
      this.$store
        .dispatch('addOrUpdateShopCart', {
          skuID: cart.skuId,
          skuNum: disNum
        })
        .then(() => {
          // 此时后台的数据已经改了，要重新获取
          this.getData()
        })
    }
```

```js
// 获取个人购物车数据
getData() {
  // 后面这个.then就是为了照顾快速点击变更数量的节流阀的
  this.$store.dispatch('cartList').then(() => {
     this.numFlag = false
  })
}
```

### 5.删除单个商品

​ 逻辑很简单，传个商品 id 就可以删了，然后仓库数据再更新，代码也很经典，不返回数据，只有成功或者失败，还是贴下代码熟悉一下吧

```js
// 点击删除商品
    delGoods(id) {
      this.$store
        .dispatch('deleteCart', id)
        .then(() => {
          this.getData()
        })
        .catch(error => {
          alert(error.message)
        })
    }
```

```js
// 根据ID删除商品的action，action一定都要commit啊
  async deleteCart({ commit }, skuId) {
    const res = await reqDeleteCart(skuId)
    // 和前面的加入购物车一样，不需要返回数据，只需要知道成功了还是失败了
    if (res.code === 200) {
      // 删除商品成功
      return 'ok'
    } else {
      //  删除商品失败
      return Promise.reject(new Error('faile'))
    }
  }
```

### 6.修改单个商品状态

​ 其实也挺简单，注意后台要的状态变量是字符的“0”和“1”，就不贴代码了，和上面很类似

### 7.删除所有选中的商品

​ 这个有点东西，按照上面的思路，我们需要遍历购物车，其中为选中状态的就发个删除请求给后台，道理是这样，但实际做起来会先想到注释的部分，这样是不对的，注释回答了，所以应该采取更规范的写法，只在组件中派发一次 action，然后在仓库的 action 书写业务逻辑，具体看第 2 段代码

```js
// 点击删除选中的商品
    delCheckedGoods() {
      // 原来我是这样写的，看起来很简洁，但想想要是服务器崩了删100个商品报100个错吗，所以把删除选中商品的函数封装成了action
      /* this.cartInfoList.forEach(item => {
        if (item.isChecked) this.delGoods(item.skuId)
      }) */
      this.$store
        .dispatch('deleteCheckedGoods')
        .then(() => {
          this.getData()
        })
        .catch(error => {
          alert(error.message)
        })
    }
```

```js
// 删除被选中的商品的action，形参context可以就理解为小仓库，里面可以解构出这些东西
  deleteCheckedGoods({ dispatch, getters }) {
    // 先定义一个数组，到时候作为Promise.all的参数
    const PromiseAll = []
    // 然后遍历数组，选中的就派发deleteCart这个根据id删除某个商品的action，然后把返回的Promise对象追加到数组里
    getters.cartList.cartInfoList.forEach(item => {
      const promise = item.isChecked && dispatch('deleteCart', item.skuId)
      PromiseAll.push(promise)
    })
    // Promise.all方法接收一个数组数组里存的都是Promise对象，只要有一个为失败，那整体的就为失败，这样不管被选中的商品有多少删除失败，都只会报一次错了
    return Promise.all(PromiseAll)
  }
```

​ 从第一行看，那个注释注意了，不止可以解构出 commit！

​ 为了不出现百删百错的情况，我们想到了用 Promise .all()方法，上面注释有，action 里面先定义一个数组，然后遍历购物车，接着把删除商品的返回 Promise 对象追加到数组里，再调用 all 方法，就能得到类似 every 的效果！

### 8.点击全选更改所有商品状态

​ 这个就和 7 类似了，提一点，如果商品状态本就是更改全选后的，那就不用改了呗，也就是只给商品状态和全选状态不同的商品发请求，减小服务器压力

```js
 // 点击全选更新所有商品状态
    updateAllChecked(e) {
      const flag = e.target.checked ? '1' : '0'
      this.$store
        .dispatch('updateAllChecked', flag)
        .then(() => {
          this.getData()
        })
        .catch(error => {
          alert(error.message)
        })
    }
```

```js
 // 点击全选更新所有商品状态
  updateAllChecked({ dispatch, state }, isChecked) {
    const PromiseAll = []
    state.cartList[0].cartInfoList.forEach(item => {
      // 如果状态本来就和全选一样，那就不需要发请求了，减小服务器压力
      if (String(item.isChecked) === isChecked) return
      const promise = dispatch('updateChecked', {
        skuID: item.skuId,
        isChecked
      })
      PromiseAll.push(promise)
    })
    return Promise.all(PromiseAll)
  }
```

## 13.登录注册

### 1.静态组件

​ 没的说

### 2.注册部分

​ 值得注意的是，这个验证码是假的，接口接收手机号，然后返回验证码，但实际后台接收验证码的时候不会再判断。

```js
// 用户注册
  async userRegister({ commit }, user) {
    const res = await reqUserRegister(user)
    if (res.code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
```

```js
 userRegister() {
      const { phone, code, password, rePassword } = this
      phone &&
        code &&
        password === rePassword &&
        this.$store
          .dispatch('userRegister', {
            phone,
            code,
            password
          })
          .then(() => {
            this.$router.push('/login')
          })
          .catch(error => {
            alert(error.message)
          })
    }
```

### 3.登录部分

#### 点击登录

​ 当登录请求成功后，服务器会返回 token，然后我们需要仓库存一个，本地存一个，为了更规范，所以我们又弄了个 utils 下面的 token.js 模块，里面写了些 token 的存储，获取，删除方法，在其他模块调用即可

```js
// 点击登录按钮
    userLogin() {
      const { phone, password } = this
      phone &&
        password &&
        this.$store
          .dispatch('userLogin', {
            phone,
            password
          })
          .then(() => {
            const toPath = this.$route.query.redirect || '/home'
            this.$router.push(toPath)
          })
          .catch(error => {
            alert(error.message)
          })
    }
```

```js
const state = {
  code: '',
  token: getToken() || '',
  userInfo: {}
}
```

```js
 // 用户登录
  async userLogin({ commit }, user) {
    const res = await reqUserLogin(user)
    if (res.code === 200) {
      setToken(res.data.token)
      commit('USERLOGIN', res.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  }
```

```js
// 请求拦截器
request.interceptors.request.use(config => {
  ...
  if (getToken()) {
    config.headers.token = getToken()
  }
  ...
  return config
})
```

```js
export const setToken = token => {
  localStorage.setItem('token', token)
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const removeToken = () => {
  return localStorage.removeItem('token')
}
```

#### 获取用户信息

​ 首先，用户登陆成功后，就需要跳转首页（目前来说是的），然后左上角显示用户信息，所以我们需要在首页的 mounted 发起 store .dispatch('get User Info')，但这样有两个问题，一是在跳转其他页后，就需要重新发请求得到用户信息，这样不行，二是用户登录后，不应该再许他去 Login，但用户可以直接地址栏输入跳转，想解决这些问题就不得不用到导航守卫。这个我们后面详解。

#### 退出登录

​ 退出登录是在 Header 模块发送请求的，有两件事需要做，一是通知后台要退出登录，二是清除浏览器存储的数据（无效的 token 和残留用户信息）

```js
logout() {
      // 退出登录要做两件事，1是通知后台清除服务器的数据，2是自己清除浏览器上的数据
      this.$store
        .dispatch('userLogout')
        .then(() => {
          // 退出登录后留在本页面
          this.$router.go(0)
        })
        .catch(error => {
          alert(error.message)
        })
}
```

```js
// 退出登录
  async userLogout({ commit }) {
    const res = await reqUserLogout()
    if (res.code === 200) {
      commit('CLEAR')
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  }
```

```js
CLEAR(state) {
    // 清除本地存储的token
    removeToken()
    // 清除仓库中登录残留信息
    state.token = ''
    state.userInfo = {}
  }
```

#### 导航守卫

​ 导航守卫分为全局，路由独享，组件内，一般就会用到全局，其他两个写起来太麻烦了，下面我直接贴出代码，直接讲解整个切换路由的逻辑

```js
//	黑名单，在这个之内的就必须登录，登录后才许去
const blackList = ['/trade', '/pay', '/center/myorder']
// 全局守卫——————前置守卫
router.beforeEach((to, from, next) => {
  const token = getToken()
  // 获取用户信息中的nickName，来判断是否真正登录才去购物车搜索页等页面，不直接用userInfo是因为空对象为true
  const nickName = store.state.user.userInfo.nickName

  // 首先，判断本地有没有token，里面的跳转都是有token的情况下跳转的
  if (token) {
    // 有了token还去登录是不是有点猫饼？所以返回首页，这就是解决了第二个问题
    if (to.path === '/login') {
      next('/home')
      // 下面就不是去登录页面，带着token去search去cart啦，所以判断是否有用户名，有时上一次进了购物车然后刷新，本地token还在但仓库的用户信息没了，所以需要判断
    } else if (!nickName) {
      // 这里就解决了第一个问题，刷新后会进入这个地方！！！
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
```

​ 上面这个逻辑非常完备了，但为了演示其他种类的功能，有些路由比如加入购物车成功，去支付等都希望路由都只从一个地方跳过来，不然统统拒接，这就用到了路由内独享守卫和组件内守卫

```js
  {
    path: '/trade',
    name: 'trade',
    component: () => import('@/views/Trade'),
    meta: { footerShow: true },
    // 路由独享守卫
    beforeEnter: (to, from, next) => {
      // 为什么是验证这三个呢？只有从购物车跳过来才放行，'/'是防本地刷新from.path为'/'，'/login'是因为有游客没登录体验购物车，点击跳转购物车才发现自己没登录，这时候再登录才从'/login'跳过来，所以也放行
      if (['/shopcart', '/', '/login'].includes(from.path)) {
        next()
      } else next(false)
    }
  },
  {
    path: '/pay',
    name: 'pay',
    component: () => import('@/views/Pay'),
    meta: { footerShow: true },
    beforeEnter: (to, from, next) => {
      // 从trade跳到pay就没必要验证login了，没有登录进不了pay，全局那里写的逻辑
      if (['/trade', '/'].includes(from.path)) {
        next()
      } else next(false)
    }
  }
```

​ 其实到这步后面还有几个组件没搞完，但为了逻辑连贯，就接下来再搞这些组件

## 14.trade 交易页面

​ 这一部分没什么好说的，都挺简单的，但从这里开始，所有的请求将不经过 vuex，而采用古典的方式：main.js

```js
// 当没有vuex的时候，可以全局引入api接口，这样就不用每个组件单独引入使用了
import * as API from '@/api'
new Vue({
 ...
  render: h => h(App),
  beforeCreate() {
    Vue.prototype.$bus = this // 全局事件总线
    Vue.prototype.$API = API
  }
}).$mount('#app')
```

点击提交订单

```js
async submitOrder() {
      const { tradeNo } = this.orderInfo
      const defaultAddress = this.defaultAddress
      const data = {
        consignee: defaultAddress.consignee,
        ...
        orderComment: this.msg,
        orderDetailList: this.detailArrayList
      }
	//	后面没有Store了
      const res = await this.$API.reqSubmitOrder(tradeNo, data)
      if (res.code === 200) {
        this.orderId = res.data
        this.$router.push(`/pay?orderId=${this.orderId}`)
      } else {
        alert(res.message)
      }
    }
```

## 15.Pay 支付页面

    	### 1.静态页面

​ 静态没什么改动，我们跳转过来的时候就带着一个订单号，然后 mounted 里面获取到订单数据（其实就一个总金额还有二维码的 codeURL），然后渲染即可。

​ 漏了一点，生命周期函数中不许 await！！！因为异步请求可能会导致生命周期未按规定顺序结束，拖节奏

### 2.业务逻辑

​ 这里为了多讲点，微信支付弹窗引用了 Element 插件，首先 main.js 按需引入

```js
// 引入饿了么UI，按需引入
import { MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// MessageBox独特的挂载方式
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
```

​ 然后我仔细讲讲下面的代码，先说二维码，那个插件能把下面的字符串转化为二维码图片的引用地址，就那么转化，接着就是支付逻辑

​ 当点击去支付后，弹出收款码弹窗，下面的那一大坨都是 Element 的配置方法，先不管。直接看最后的 if (!this. timer)，搞了个长轮询，打开弹窗的时候就一直问后台有没有支付，支付了就保存 code 并关闭弹窗和定时询问并跳转路由，没有就一直问。

​ 然后是用户点击已支付，这时候如果刹那前已经支付成功了弹窗还没来得及关闭，就会有 code 在 data 中，所以一样是关闭弹窗和定时询问并跳转路由，否则提示'别闹了，快支付'

​ 要是点击支付遇到问题，就不再向后台问询，提示联系管理员就行，并关闭弹窗

```js
codeUrl: 'weixin://wxpay/bizpayurl?pr=vBpQZ8fzz'
```

```js
// 导入二维码字符转码插件
import QRCode from 'qrcode'

async gotoPay() {
      // 点击立即支付后，搞出通过字符串转的二维码的url并显示在弹窗上
      const url = await QRCode.toDataURL(this.payInfo.codeUrl)
      this.$alert(`<img src=${url} />`, '微信支付', {
        dangerouslyUseHTMLString: true,
        center: true,
        showCancelButton: true,
        confirmButtonText: '已支付',
        cancelButtonText: '支付遇见问题',
        showClose: false,
        // 关闭钱的回调,具体配置去饿了么看
        beforeClose: (type, instance, done) => {
          // type:'类型，区分点的是哪个按钮'
          // instance 为 MessageBox 实例
          // done 为 关闭弹窗的方法
          if (type === 'cancel') {
            alert('请联系管理员')
            clearInterval(this.timer)
            this.timer = null
            done()
          } else if (type === 'confirm') {
            // 这里判断注释掉，调试的时候就不用花钱了
            // if (this.code === 200) {
            // 说明已经支付了还没自动关闭，这时候手动关闭并跳转
            clearInterval(this.timer)
            this.timer = null
            // 接下来就是关闭弹窗，准备跳转了
            done()
            this.$router.push('/paysuccess')
            /* } else {
              alert('别闹了，快支付')
            } */
          }
        }
      })

      // 这时，我们就需要长轮询，一直询问后台用户有没有支付
      if (!this.timer) {
        this.timer = setInterval(async () => {
          const res = await this.$API.reqQueryPayStatus(this.orderId)
          if (res.code === 200) {
            // 进了分支说明支付成功，就不要再问后台了
            clearInterval(this.timer)
            this.timer = null

            // 然后保存状态码，等会跳转的依据
            this.code = res.code

            // 接下来就是关闭弹窗，准备跳转了
            this.$msgbox.close()
            this.$router.push('/paysuccess')
          }
        }, 1000)
      }
    }
```

## 16.个人中心

​ 最后一个组件啦，这个组件需要用到二级路由，在我的订单里渲染数据

```js
{
    path: '/center',
    //	重定向
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
```

​ 这个渲染数据有点意思，自己看注释吧，我不想打字了

```html
<!-- 渲染订单部分，有点意思，每一份订单都是一个table -->
<table class="order-item" v-for="order in myOrder.records" :key="order.id">
  <!-- table就分为表头和表体，这个表头就是订单号、时间那些 -->
  <thead>
    <tr>
      <th colspan="5">
        <span class="ordertitle">
          {{ order.createTime }} 订单编号:{{ order.outTradeNo }}
          <span class="pull-right delete">
            <img src="../images/delete.png" />
          </span>
        </span>
      </th>
    </tr>
  </thead>
  <tbody>
    <!-- 而表体里面就是一个个的tr表行了，也就是订单下的各种商品，这时候有意思的来了，你会发现所有的商品共用一个收件人和总金额...也就是需要后四列td只存在一次，那么就需要v-if="index===0"，并且留下来的这份得合并:rowspan="order.orderDetailList.length"个单元格， -->
    <tr v-for="(child, index) in order.orderDetailList" :key="child.id">
      <td width="60%">
        <div class="typographic">
          <img :src="child.imgUrl" style="width: 82px; height: 82px" />
          <a href="#" class="block-text"> {{ child.skuName }} </a>
          <span>x{{ child.skuNum }}</span>
          <a href="#" class="service">售后申请</a>
        </div>
      </td>
      <template v-if="index === 0">
        <td :rowspan="order.orderDetailList.length" width="8%" class="center">
          {{ order.consignee }}
        </td>
        <td
          :rowspan="order.orderDetailList.length"
          width="13%"
          class="center"
          v-if="index === 0"
        >
          <ul class="unstyled">
            <li>总金额¥{{ order.totalAmount }}</li>
            <li>
              {{ order.paymentWay === 'ONLINE' ? '在线支付' : '其他支付' }}
            </li>
          </ul>
        </td>
        <td
          :rowspan="order.orderDetailList.length"
          width="8%"
          class="center"
          v-if="index === 0"
        >
          <a href="#" class="btn">{{ order.orderStatusName }}</a>
        </td>
        <td
          :rowspan="order.orderDetailList.length"
          width="13%"
          class="center"
          v-if="index === 0"
        >
          <ul class="unstyled">
            <li>
              <a href="mycomment.html" target="_blank">评价|晒单</a>
            </li>
          </ul>
        </td>
      </template>
    </tr>
  </tbody>
</table>
```

## 17.图片懒加载

​ 项目最后的优化，图片懒加载，还是会用到插件

```js
// 引入懒加载插件
import VueLazyload from 'vue-lazyload'

// 插入懒加载插件，这个插件的唯一用的地方只有search的商品图，去那里看
const loadimage = require('@/assets/images/头像.jpg') //	还没加载出来用来替代的图
const errorimage = require('@/assets/images/头像.jpg') //	加载错误用来替代的图
Vue.use(VueLazyload, {
  //	插件自己的用法，可以去它官网上看
  preLoad: 1.3,
  error: errorimage,
  loading: loadimage,
  attempt: 1
})
```

这个插件这么用：

```html
<div class="p-img">
  <!-- 点击这里是想带商品详情页 -->
  <router-link :to="`/detail/${goods.id}`">
    <!-- 这里用了懒加载插件的自定义指令 -->
    <img v-lazy="goods.defaultImg" />
  </router-link>
</div>
```

## 18.最后

​ 最后，还有个表单验证的插件使用，因为之前搞登录注册没有验证，但是我懒得搞了，以后用到的时候再说吧，还有就是什么路由懒加载都是已经用过的，就不写了

​ 项目打包后，你会发现 dist 里面的 js 里面有 map 文件，这是用来快速查找错误的，但项目上线后怎么可能会允许报错呢，这该在开发阶段就处理好，所以想要打包的时候不生成.map 文件就在 vue.config.js 里面这样写

```js
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  //代理跨域,前端解决跨域问题
  /* devserver: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000'
        // pathRewrite: { '^/api': '' }   路径重写不需要
      }
    }
  } */
  // 项目打包上线后JS文件夹会有很多个map文件，如果运行报错，是不知道哪行的bug的，但有了map文件就可以准确地输出哪行哪列有错，但已经打包了就没必要再用了，不在开发阶段解决等啥呢
  productionSourceMap: false
})
```

​ 终于写完了！！！
