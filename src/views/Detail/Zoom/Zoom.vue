<template>
  <div class="spec-preview">
    <img :src="imgObj.imgUrl" />
    <div class="event" @mousemove="handler"></div>
    <div class="big">
      <img :src="imgObj.imgUrl" ref="big" />
    </div>
    <div class="mask" ref="mask"></div>
  </div>
</template>

<script>
export default {
  name: 'Zoom',
  props: ['skuImageList'],
  data() {
    return {
      currentIndex: 0
    }
  },
  computed: {
    // 搞一个对象，通过index来获取相应的数组条目
    imgObj() {
      return this.skuImageList[this.currentIndex] || {}
    }
  },
  mounted() {
    // 全局事件总线获取兄弟组件传输过来的索引值
    this.$bus.$on('getIndex', i => {
      this.currentIndex = i
    })
  },
  methods: {
    // 放大镜函数
    handler(e) {
      // 获取DOM元素
      const mask = this.$refs.mask
      const big = this.$refs.big
      // 获取遮罩层的相对距离
      let left = e.offsetX - mask.offsetWidth / 2
      let top = e.offsetY - mask.offsetHeight / 2

      // 判断遮罩层所处位置来给它赋新的值,不在特殊位置就保持初始let left的值
      if (left < 0) {
        left = 0
      } else if (left > mask.offsetWidth) {
        left = mask.offsetWidth
      }

      if (top < 0) {
        top = 0
      } else if (top > mask.offsetHeight) {
        top = mask.offsetHeight
      }

      // 要赋的值已经存在临时变量中，正式赋值
      mask.style.left = left + 'px'
      mask.style.top = top + 'px'

      big.style.left = -2 * left + 'px'
      big.style.top = -2 * top + 'px'
    }
  }
}
</script>

<style lang="less">
.spec-preview {
  position: relative;
  width: 400px;
  height: 400px;
  border: 1px solid #ccc;

  img {
    width: 100%;
    height: 100%;
  }

  .event {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 998;
  }

  .mask {
    width: 50%;
    height: 50%;
    background-color: rgba(0, 255, 0, 0.3);
    position: absolute;
    left: 0;
    top: 0;
    display: none;
  }

  .big {
    width: 100%;
    height: 100%;
    position: absolute;
    top: -1px;
    left: 100%;
    border: 1px solid #aaa;
    overflow: hidden;
    z-index: 998;
    display: none;
    background: white;

    img {
      width: 200%;
      max-width: 200%;
      height: 200%;
      position: absolute;
      left: 0;
      top: 0;
    }
  }

  .event:hover ~ .mask,
  .event:hover ~ .big {
    display: block;
  }
}
</style>
