<template>
  <div class="pagination-container">
    <button :disabled="pageNo === 1" @click="postPageNo(pageNo - 1)">
      上一页
    </button>

    <button v-if="continueArr[0] > 1" @click="postPageNo(1)">1</button>

    <button v-if="continueArr[0] > 2">···</button>

    <!-- 中间的continues按钮 -->
    <button
      v-for="num in continueArr"
      :key="num"
      @click="postPageNo(num)"
      :class="{ active: pageNo === num }"
    >
      <!-- 这里给中间的加类就行了，而不需要给两边的1或者totalPage按钮加，因为在点击后他们都会消失，由循环中的按钮替代 -->
      {{ num }}
    </button>

    <button v-if="continueArr[continueArr.length - 1] < totalPage - 1">
      ···
    </button>

    <button
      v-if="continueArr[continueArr.length - 1] < totalPage"
      @click="postPageNo(totalPage)"
    >
      {{ totalPage }}
    </button>

    <button :disabled="pageNo === totalPage" @click="postPageNo(pageNo + 1)">
      下一页
    </button>

    <button style="margin-left: 30px">共 {{ total }} 条</button>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: ['pageNo', 'pageSize', 'total', 'continues'],
  computed: {
    // 最大的页码
    totalPage() {
      return Math.ceil(this.total / this.pageSize)
    },
    // 计算出中间部分的起始和结尾
    continueArr() {
      // 解构赋值，不然写很多this
      const { continues, totalPage, pageNo } = this
      let start = 1
      let end = totalPage
      if (continues < totalPage) {
        start = pageNo - parseInt(continues / 2)
        end = pageNo + parseInt(continues / 2)
        if (start < 1) {
          start = 1
          end = continues
        }
        if (end > totalPage) {
          start = totalPage - continues + 1
          end = totalPage
        }
      }
      const arr = []
      for (let i = start; i <= end; i++) arr.push(i)
      return arr
    }
  },
  methods: {
    // 向父组件发送将修改的pageNo
    postPageNo(pageNo) {
      this.$emit('getPageNo', pageNo)
    }
  }
}
</script>

<style lang="less" scoped>
.pagination-container {
  text-align: center;
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>
