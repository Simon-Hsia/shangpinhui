import request from '@/utils/request.js'

// 引入假的"ajax"
import mockRequest from '@/utils/mockRequest.js'

/**
 * 请求TypeNav列表数据
 * @returns 一个Promise对象
 */
export const getBaseCategoryList = () =>
  request.get('/product/getBaseCategoryList')

/**
 * 向mock发送假的数据请求
 * @returns 返回一个返回示例，是假数据
 */
export const getBannerList = () => mockRequest.get('/banner')

/**
 * 向mock发送假的数据请求
 * @returns 返回一个返回示例，是假数据
 */
export const getFloorList = () => mockRequest.get('/floor')

// 这个是请求尚品汇官方服务器的数据的，但是经常崩，所以用下面封装的请求存下来的mock数据
/* export const getSearchInfo = params =>
  request({
    url: '/list',
    method: 'POST',
    data: params
  }) */
// 换成了请求mock数据
export const getSearchInfo = params => mockRequest.post('/searchList', params)

// 获取商品详情信息,传入点击商品的id，就跳转到对应商品的详情页
export const getDetailInfo = skuId => request.get(`/item/${skuId}`)

// 加入购物车按钮，或者获取更新某一个产品的个数
export const reqAddOrUpdateShopCart = (skuID, skuNum) =>
  request({
    url: `/cart/addToCart/${skuID}/${skuNum}`,
    method: 'POST'
  })

// 获取购物车列表
export const getCartList = () => request.get('/cart/cartList')

// 删除购物车商品
export const reqDeleteCart = skuId =>
  request({
    url: `/cart/deleteCart/${skuId}`,
    method: 'DELETE'
  })

// 修改商品选中状态
export const reqUpdateChecked = (skuID, isChecked) =>
  request.get(`/cart/checkCart/${skuID}/${isChecked}`)

// 获取验证码的接口
export const reqGetCode = phone =>
  request.get(`/user/passport/sendCode/${phone}`)

// 用户注册
export const reqUserRegister = data =>
  request({
    url: '/user/passport/register',
    method: 'POST',
    data
  })

// 用户登录
export const reqUserLogin = data =>
  request({
    url: '/user/passport/login',
    method: 'POST',
    data
  })

// 登录后获取用户信息(需要带着用户的token)
export const reqGetUserInfo = () =>
  request.get('/user/passport/auth/getUserInfo')

// 退出登录
export const reqUserLogout = () => request.get('/user/passport/logout')

// 获取用户地址信息
export const reqGetUserAddress = () =>
  // 没办法，除了讲师的账号都获取不到地址数据，只能自己mock了
  // request.get('/user/userAddress/auth/findUserAddressList')
  mockRequest.get('/trade')

// 获取订单信息
export const reqGetOrderInfo = () => request.get('/order/auth/trade')

// 提交订单给后台
export const reqSubmitOrder = (tradeNo, data) =>
  request({
    url: `/order/auth/submitOrder?tradeNo=${tradeNo}`,
    method: 'POST',
    data
  })

// 获取订单支付信息
export const reqGetPayInfo = orderId =>
  request.get(`/payment/weixin/createNative/${orderId}`)

// 查询支付订单状态
export const reqQueryPayStatus = orderId =>
  request.get(`/payment/weixin/queryPayStatus/${orderId}`)

// 获取我的订单列表
export const reqGetMyOrder = (page, limit) =>
  request.get(`/order/auth/${page}/${limit}`)
