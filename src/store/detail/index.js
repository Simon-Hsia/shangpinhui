import { getDetailInfo, reqAddOrUpdateShopCart } from '@/api'
// 封装游客身份模块。随机一个字符串，一旦本地有了就不能再变了
import { getUUID } from '@/utils/uuid_token'
//  detail模块的小仓库
const state = {
  detailInfo: {},
  uuid_token: getUUID()
}

const mutations = {
  DETAILINFO(state, detailInfo) {
    state.detailInfo = detailInfo
  },
  ADDORUPDATESHOPCART(state, message) {
    state.shopCartMessage = message
  }
}
const actions = {
  // 获取Search模块的数据
  async detailInfo({ commit }, skuId) {
    const res = await getDetailInfo(skuId)
    if (res.code === 200) commit('DETAILINFO', res.data)
  },
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
}

const getters = {
  categoryView: state => {
    return state.detailInfo.categoryView || {}
  },
  price: state => {
    return state.detailInfo.price || 0
  },
  skuInfo: state => {
    return state.detailInfo.skuInfo || {}
  },
  spuSaleAttrList: state => {
    return state.detailInfo.spuSaleAttrList || []
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
