// 先引入mock模块
import Mock from 'mockjs'

// 再把json 数据引入，注意json格式数据是默认对外暴露的，直接引入
import banner from './banner.json'
import floor from './floor.json'
import searchList from './searchList.json'
import trade from './trade.json'

//  mock数据:第一个参数请求地址,第二个参数:请求数据
Mock.mock('/mock/banner', { code: 200, data: banner })
Mock.mock('/mock/floor', { code: 200, data: floor })
Mock.mock('/mock/searchList', { code: 200, data: searchList })
Mock.mock('/mock/trade', { code: 200, data: trade })
