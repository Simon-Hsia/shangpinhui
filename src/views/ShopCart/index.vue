<template>
  <div class="cart">
    <h4>全部商品</h4>
    <div class="cart-main">
      <div class="cart-th">
        <div class="cart-th1">全部</div>
        <div class="cart-th2">商品</div>
        <div class="cart-th3">单价（元）</div>
        <div class="cart-th4">数量</div>
        <div class="cart-th5">小计（元）</div>
        <div class="cart-th6">操作</div>
      </div>
      <div class="cart-body">
        <ul class="cart-list" v-for="item in cartInfoList" :key="item.id">
          <li class="cart-list-con1">
            <input
              type="checkbox"
              name="chk_list"
              :checked="item.isChecked"
              @change="updateChecked(item, $event)"
            />
          </li>
          <li class="cart-list-con2">
            <img :src="item.imgUrl" />
            <div class="item-msg">
              {{ item.skuName }}
            </div>
          </li>

          <li class="cart-list-con4">
            <span class="price">{{ item.skuPrice }}</span>
          </li>
          <li class="cart-list-con5">
            <a
              href="javascript:void(0)"
              class="mins"
              @click="handler('sub', -1, item)"
            >
              -
            </a>
            <input
              autocomplete="off"
              type="text"
              minnum="1"
              class="itxt"
              :value="item.skuNum"
              @change="handler('change', $event.target.value * 1, item)"
            />
            <a
              href="javascript:void(0)"
              class="plus"
              @click="handler('add', 1, item)"
            >
              +
            </a>
          </li>
          <li class="cart-list-con6">
            <span class="sum">{{ item.skuNum * item.skuPrice }}</span>
          </li>
          <li class="cart-list-con7">
            <a
              href="javascript:void(0)"
              class="sindelet"
              @click="delGoods(item.skuId)"
            >
              删除
            </a>
            <br />
            <a href="javascript:void(0)">移到收藏</a>
          </li>
        </ul>
      </div>
    </div>
    <div class="cart-tool">
      <div class="select-all">
        <input
          class="chooseAll"
          type="checkbox"
          :checked="cartInfoList.length && isAllCheck"
          @click="updateAllChecked"
        />
        <span>全选</span>
      </div>
      <div class="option">
        <a href="javascript:void(0)" @click="delCheckedGoods">删除选中的商品</a>
        <a href="javascript:void(0)">移到我的关注</a>
        <a href="javascript:void(0)">清除下柜商品</a>
      </div>
      <div class="money-box">
        <div class="chosed">已选择 <span>0</span>件商品</div>
        <div class="sumprice">
          <em>总价（不含运费） ：</em>
          <i class="summoney">{{ tatalPrice }}</i>
        </div>
        <div class="sumbtn">
          <router-link class="sum-btn" to="/trade">结算</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'ShopCart',
  data() {
    return {
      numFlag: false
    }
  },
  mounted() {
    this.getData()
  },
  computed: {
    ...mapGetters(['cartList']),
    // 最终抽离出的购物车数据
    cartInfoList() {
      return this.cartList.cartInfoList || []
    },
    // 计算总价
    tatalPrice() {
      return this.cartInfoList
        .filter(item => item.isChecked)
        .reduce((amt, item) => (amt += item.skuNum * item.skuPrice), 0)
    },
    // 总复选框的计算值
    isAllCheck() {
      return this.cartInfoList.every(item => item.isChecked)
    }
  },
  methods: {
    // 获取个人购物车数据
    getData() {
      // 后面这个.then就是为了照顾快速点击变更数量的节流阀的
      this.$store.dispatch('cartList').then(() => {
        this.numFlag = false
      })
    },
    // 点击更改商品数量
    handler(type, disNum, cart) {
      // type是为了区分是基于三处的哪处做的改动，disNum是变更的数量，cart是为了拿到当前商品的id和上一次修改后的数量
      // 改变了数量，向后台更新数据，但注意这个接口要把更新的个数传过去，所以是-1,+1,5-3
      if (this.numFlag) return
      this.numFlag = true
      switch (type) {
        case 'add':
          disNum = 1
          break
        case 'sub':
          // 判断当前购物车中的数量是否已经为最小值1了，不是的话可以减一，否则为0，用cart.skuNum判断是因为肯定是最新的并且还没经过这次改动的
          disNum = cart.skuNum > 1 ? -1 : 0
          break
        case 'change':
          // 用户输入奇怪的东西，要限制,不过输入的是小数也可以，这里取整了
          disNum =
            isNaN(disNum) || disNum < 1 ? 0 : parseInt(disNum) - cart.skuNum
          break
        default:
          disNum = 0
      }

      // 前台验证好数据后，可以通过派发actions同步给后台了
      this.$store
        .dispatch('addOrUpdateShopCart', {
          skuID: cart.skuId,
          skuNum: disNum
        })
        .then(() => {
          // 此时后台的数据已经改了，要重新获取
          this.getData()
        })
    },
    // 点击删除商品
    delGoods(id) {
      this.$store
        .dispatch('deleteCart', id)
        .then(() => {
          this.getData()
        })
        .catch(error => {
          alert(error.message)
        })
    },
    // 修改某个商品的状态
    updateChecked(goods, e) {
      // 接口要求传字符串格式的01
      const checked = e.target.checked ? '1' : '0'
      this.$store
        .dispatch('updateChecked', {
          skuID: goods.skuId,
          isChecked: checked
        })
        .then(() => {
          this.getData()
        })
        .catch(error => {
          alert(error.message)
        })
    },
    // 点击删除选中的商品
    delCheckedGoods() {
      // 原来我是这样写的，看起来很简洁，但想想要是服务器崩了删100个商品报100个错吗，所以把删除选中商品的函数封装成了action
      /* this.cartInfoList.forEach(item => {
        if (item.isChecked) this.delGoods(item.skuId)
      }) */
      this.$store
        .dispatch('deleteCheckedGoods')
        .then(() => {
          this.getData()
        })
        .catch(error => {
          alert(error.message)
        })
    },
    // 点击全选更新所有商品状态
    updateAllChecked(e) {
      const flag = e.target.checked ? '1' : '0'
      this.$store
        .dispatch('updateAllChecked', flag)
        .then(() => {
          this.getData()
        })
        .catch(error => {
          alert(error.message)
        })
    }
  }
}
</script>

<style lang="less" scoped>
.cart {
  width: 1200px;
  margin: 0 auto;

  h4 {
    margin: 9px 0;
    font-size: 14px;
    line-height: 21px;
  }

  .cart-main {
    .cart-th {
      background: #f5f5f5;
      border: 1px solid #ddd;
      padding: 10px;
      overflow: hidden;

      & > div {
        float: left;
      }

      .cart-th1 {
        width: 25%;

        input {
          vertical-align: middle;
        }

        span {
          vertical-align: middle;
        }
      }

      .cart-th2 {
        width: 25%;
      }

      .cart-th3,
      .cart-th4,
      .cart-th5,
      .cart-th6 {
        width: 12.5%;
      }
    }

    .cart-body {
      margin: 15px 0;
      border: 1px solid #ddd;

      .cart-list {
        padding: 10px;
        border-bottom: 1px solid #ddd;
        overflow: hidden;

        & > li {
          float: left;
        }

        .cart-list-con1 {
          width: 15%;
        }

        .cart-list-con2 {
          width: 35%;

          img {
            width: 82px;
            height: 82px;
            float: left;
          }

          .item-msg {
            float: left;
            width: 150px;
            margin: 0 10px;
            line-height: 18px;
          }
        }

        .cart-list-con4 {
          width: 10%;
        }

        .cart-list-con5 {
          width: 13%;

          .mins {
            border: 1px solid #ddd;
            border-right: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }

          input {
            border: 1px solid #ddd;
            width: 40px;
            height: 33px;
            float: left;
            text-align: center;
            font-size: 14px;
          }

          .plus {
            border: 1px solid #ddd;
            border-left: 0;
            float: left;
            color: #666;
            width: 6px;
            text-align: center;
            padding: 8px;
          }
        }

        .cart-list-con6 {
          width: 12.5%;

          .sum {
            font-size: 16px;
          }
        }

        .cart-list-con7 {
          width: 12.5%;

          a {
            color: #666;
          }
        }
      }
    }
  }

  .cart-tool {
    overflow: hidden;
    border: 1px solid #ddd;

    .select-all {
      padding: 10px;
      overflow: hidden;
      float: left;

      span {
        vertical-align: middle;
      }

      input {
        vertical-align: middle;
      }
    }

    .option {
      padding: 10px;
      overflow: hidden;
      float: left;

      a {
        float: left;
        padding: 0 10px;
        color: #666;
      }
    }

    .money-box {
      float: right;

      .chosed {
        line-height: 26px;
        float: left;
        padding: 0 10px;
      }

      .sumprice {
        width: 200px;
        line-height: 22px;
        float: left;
        padding: 0 10px;

        .summoney {
          color: #c81623;
          font-size: 16px;
        }
      }

      .sumbtn {
        float: right;

        a {
          display: block;
          position: relative;
          width: 96px;
          height: 52px;
          line-height: 52px;
          color: #fff;
          text-align: center;
          font-size: 18px;
          font-family: 'Microsoft YaHei';
          background: #e1251b;
          overflow: hidden;
        }
      }
    }
  }
}
</style>
