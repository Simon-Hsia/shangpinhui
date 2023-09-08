// 登录和注册模块
import {
  reqGetCode,
  reqUserRegister,
  reqUserLogin,
  reqGetUserInfo,
  reqUserLogout
} from '@/api'

// 引入处理token的函数模块
import { setToken, getToken, removeToken } from '@/utils/token.js'
const state = {
  code: '',
  token: getToken() || '',
  userInfo: {}
}

const mutations = {
  GETCODE(state, code) {
    state.code = code
  },
  USERLOGIN(state, token) {
    state.token = token
  },
  GETUSERINFO(state, userInfo) {
    state.userInfo = userInfo
  },
  CLEAR(state) {
    // 清除本地存储的token
    removeToken()
    // 清除仓库中登录残留信息
    state.token = ''
    state.userInfo = {}
  }
}

const actions = {
  // 获取验证码
  async getCode({ commit }, phone) {
    const res = await reqGetCode(phone)
    if (res.code === 200) {
      commit('GETCODE', res.data)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
  // 用户注册
  async userRegister({ commit }, user) {
    const res = await reqUserRegister(user)
    if (res.code === 200) {
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
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
  },
  // 获取用户信息
  async getUserInfo({ commit }) {
    const res = await reqGetUserInfo()
    if (res.code === 200) {
      commit('GETUSERINFO', res.data)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },
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
}

const getters = {}

export default {
  state,
  mutations,
  actions,
  getters
}
