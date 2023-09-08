// 登录和注册模块
import { reqGetUserAddress, reqGetOrderInfo } from '@/api'

const state = {
  addressList: [],
  orderInfo: {}
}

const mutations = {
  GETUSERADDRESS(state, list) {
    state.addressList = list
  },
  GETORDERINFO(state, orderInfo) {
    state.orderInfo = orderInfo
  }
}

const actions = {
  // 获取用户地址列表
  async getUserAddress({ commit }) {
    const res = await reqGetUserAddress()
    if (res.code === 200) {
      commit('GETUSERADDRESS', res.data)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
  async getOrderInfo({ commit }) {
    const res = await reqGetOrderInfo()
    if (res.code === 200) {
      commit('GETORDERINFO', res.data)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  }
}

const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}
