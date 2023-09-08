// 引入接口，action向后台要数据
import { getBaseCategoryList, getBannerList, getFloorList } from '@/api'

//  home模块的小仓库
const state = {
  // 存储各个组件从后台请求的数据
  categoryList: [],
  bannerList: [],
  floorList: []
}
const mutations = {
  // 这个用大写的被操作数据名字是规范
  CATEGORYLIST(state, categoryList) {
    state.categoryList = categoryList
  },
  BANNERLIST(state, bannerList) {
    state.bannerList = bannerList
  },
  FLOORLIST(state, floorList) {
    state.floorList = floorList
  }
}
const actions = {
  //  通过API里面的接口函数调用，向服务器发请求，获取服务器的数据
  async categoryList({ commit }) {
    const res = await getBaseCategoryList()

    if (res.code === 200) commit('CATEGORYLIST', res.data)
  },
  // 获取轮播图的数据
  async bannerList({ commit }) {
    const res = await getBannerList()
    if (res.code === 200) commit('BANNERLIST', res.data)
  },
  async floorList({ commit }) {
    const res = await getFloorList()
    if (res.code === 200) commit('FLOORLIST', res.data)
  }
}
const getters = {}
export default {
  state,
  mutations,
  actions,
  getters
}
