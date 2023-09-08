// 调用uuid依赖包来生成临时身份，去官网上能看到这个引入方式
import { v4 as uuidv4 } from 'uuid'

// 暴露一个获取身份的函数
export const getUUID = () => {
  // 如果本地没有UUID，那就设置一个，然后再return
  if (!localStorage.getItem('UUID')) localStorage.setItem('UUID', uuidv4())
  return localStorage.getItem('UUID')
}
