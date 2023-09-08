<template>
  <div class="app-container">
    <Header></Header>
    <div class="main">
      <router-view></router-view>
    </div>
    <Footer v-show="$route.meta.footerShow"></Footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    // 本来这个列表请求是放在typenav发送的，但主页和搜索页都会创建销毁一道组件，于是把请求放在这里，就不会请求两边了。当然也可以用缓存组件的方法，但比起来更复杂。还有说放在入口文件的，虽说也是只会执行一次，但那里的this是window，所以不能
    //  通知Vuex发请求，获取数据，存储于仓库当中
    this.$store.dispatch('categoryList')
  }
}
</script>

<style>
/* html {
  filter: grayscale(1);
} */
</style>
