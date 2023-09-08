import { getSearchInfo } from '@/api'

//  home模块的小仓库
const state = {
  searchInfo: {}
}
const mutations = {
  SEARCHINFO(state, searchInfo) {
    state.searchInfo = searchInfo
  }
}
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
  attrsList(state) {
    return state.searchInfo.attrsList || []
  },
  trademarkList(state) {
    return state.searchInfo.trademarkList || []
  }
}
export default {
  state,
  mutations,
  actions,
  getters
}
