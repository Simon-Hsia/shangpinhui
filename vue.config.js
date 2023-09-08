const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  //代理跨域,前端解决跨域问题
  /* devserver: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000'
        // pathRewrite: { '^/api': '' }   路径重写不需要
      }
    }
  } */
  // 项目打包上线后JS文件夹会有很多个map文件，如果运行报错，是不知道哪行的bug的，但有了map文件就可以准确地输出哪行哪列有错，但已经打包了就没必要再用了，不在开发阶段解决等啥呢
  productionSourceMap: false
})
