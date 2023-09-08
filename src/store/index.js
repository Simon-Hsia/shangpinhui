import Vue from 'vue'
import Vuex from 'vuex'

// 引入小仓库
import home from './home'
import search from './search'
import detail from './detail'
import shopCart from './shopCart'
import user from './User'
import trade from './Trade'

Vue.use(Vuex)

// 对外暴露一个Store实例
export default new Vuex.Store({
  //  实现vuex仓库模块化存储
  modules: {
    home,
    search,
    detail,
    shopCart,
    user,
    trade
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
