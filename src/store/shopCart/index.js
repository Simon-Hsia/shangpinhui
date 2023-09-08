import { getCartList, reqDeleteCart, reqUpdateChecked } from '@/api'

//  detail模块的小仓库
const state = {
  cartList: []
}

const mutations = {
  CARTLIST(state, cartList) {
    state.cartList = cartList
  }
}
const actions = {
  // 获取Search模块的数据
  async cartList({ commit }) {
    const res = await getCartList()
    if (res.code === 200) commit('CARTLIST', res.data)
  },
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
  },
  // 更改单个商品的状态
  async updateChecked({ commit }, { skuID, isChecked }) {
    const res = await reqUpdateChecked(skuID, isChecked)
    if (res.code === 200) {
      // 更新商品状态成功
      return 'ok'
    } else {
      //  更新商品状态失败
      return Promise.reject(new Error('faile'))
    }
  },
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
  },
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
}

const getters = {
  cartList: state => {
    return state.cartList[0] || {}
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
