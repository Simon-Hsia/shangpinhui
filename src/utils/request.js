import axios from 'axios'

// 引入进度条
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 进度条上的属性：
// start代表进度条开始，done代表结束

// 引入仓库，请求拦截器要用到存的临时身份
import store from '@/store'

import { getToken } from '@/utils/token.js'
const baseURL = 'http://gmall-h5-api.atguigu.cn/api'
const request = axios.create({
  // 基础路径
  baseURL,
  // 规定超时毫秒数
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(config => {
  //  config配置对象，里面一个属性很重要，叫做请求头header
  // 把生成的临时身份给请求带着传给后台，才能获取到购物车数据
  config.headers.userTempId = store.state.detail.uuid_token

  if (getToken()) {
    config.headers.token = getToken()
  }

  nprogress.start()
  return config
})

// 响应拦截器
request.interceptors.response.use(
  res => {
    nprogress.done()
    return res.data
  }
  // 响应失败的函数
  // error => Promise.reject(new Error('faile'))
)

export default request
