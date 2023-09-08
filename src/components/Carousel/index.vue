<template>
  <div class="carousel-container">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for="img in list" :key="img.id">
          <img :src="img.imgUrl" />
        </div>
      </div>
      <!-- 如果需要分页器 -->
      <div class="swiper-pagination"></div>

      <!-- 如果需要导航按钮 -->
      <div class="swiper-button-prev"></div>
      <div class="swiper-button-next"></div>
    </div>
  </div>
</template>

<script>
// 引入轮播图插件
import Swiper from 'swiper'

export default {
  name: 'Carousel',
  props: ['list'],
  watch: {
    list: {
      // floor组件中的这个数据是没有变化的(从父组件传的)，但为了封装轮播图组件所以必须用监听(为了和home的轮播图实例结构一样)，因此为了让监听执行就用到了immediate，数据生成之时就执行一次，不过我不懂，这样对于listContainer组件不就会生成两次实例吗，开局一次，收到库中数据变化又一次
      immediate: true,
      handler() {
        // 要先进行判断，不然主页轮播图的小圆点会发生错乱
        if (this.list.length === 0) return
        // 这个时候数据已经更新了，但是最新的DOM结构还没有生成，所以是不能直接newSwiper对象的
        this.$nextTick(() => {
          const mySwiper = new Swiper('.swiper-container', {
            // direction: 'vertical', // 垂直切换选项
            loop: true, // 循环模式选项

            // 如果需要分页器
            pagination: {
              el: '.swiper-pagination',
              clickable: true
            },

            // 如果需要前进后退按钮
            navigation: {
              nextEl: '.swiper-button-next',
              prevEl: '.swiper-button-prev'
            },

            // 如果需要滚动条
            scrollbar: {
              el: '.swiper-scrollbar'
            }
          })
          // 这个不应该返回的，但是我用了ESLint，不使用变量就会报错，又不好搞规则，所以只能使用了
          return mySwiper
        })
      }
    }
  }
}
</script>

<style></style>
