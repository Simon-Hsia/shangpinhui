import axios from 'axios'

// 引入进度条
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
// 进度条上的属性：
// start代表进度条开始，done代表结束

const baseURL = '/mock'
const request = axios.create({
  // 基础路径
  baseURL,
  // 规定超时毫秒数
  timeout: 5000
})

// 请求拦截器
request.interceptors.request.use(config => {
  //  config配置对象，里面一个属性很重要，叫做请求头header
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
