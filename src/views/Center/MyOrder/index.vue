<template>
  <div class="myorder-container">
    <div class="order-right">
      <div class="order-content">
        <div class="title">
          <h3>我的订单</h3>
        </div>
        <div class="chosetype">
          <table>
            <thead>
              <tr>
                <th width="29%">商品</th>
                <th width="31%">订单详情</th>
                <th width="13%">收货人</th>
                <th>金额</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
          </table>
        </div>
        <div class="orders">
          <!-- 渲染订单部分，有点意思，每一份订单都是一个table -->
          <table
            class="order-item"
            v-for="order in myOrder.records"
            :key="order.id"
          >
            <!-- table就分为表头和表体，这个表头就是订单号、时间那些 -->
            <thead>
              <tr>
                <th colspan="5">
                  <span class="ordertitle">
                    {{ order.createTime }} 订单编号:{{ order.outTradeNo }}
                    <span class="pull-right delete">
                      <img src="../images/delete.png" />
                    </span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- 而表体里面就是一个个的tr表行了，也就是订单下的各种商品，这时候有意思的来了，你会发现所有的商品共用一个收件人和总金额...也就是需要后四列td只存在一次，那么就需要v-if="index===0"，并且留下来的这份得合并:rowspan="order.orderDetailList.length"个单元格， -->
              <tr
                v-for="(child, index) in order.orderDetailList"
                :key="child.id"
              >
                <td width="60%">
                  <div class="typographic">
                    <img
                      :src="child.imgUrl"
                      style="width: 82px; height: 82px"
                    />
                    <a href="#" class="block-text">
                      {{ child.skuName }}
                    </a>
                    <span>x{{ child.skuNum }}</span>
                    <a href="#" class="service">售后申请</a>
                  </div>
                </td>
                <template v-if="index === 0">
                  <td
                    :rowspan="order.orderDetailList.length"
                    width="8%"
                    class="center"
                  >
                    {{ order.consignee }}
                  </td>
                  <td
                    :rowspan="order.orderDetailList.length"
                    width="13%"
                    class="center"
                    v-if="index === 0"
                  >
                    <ul class="unstyled">
                      <li>总金额¥{{ order.totalAmount }}</li>
                      <li>
                        {{
                          order.paymentWay === 'ONLINE'
                            ? '在线支付'
                            : '其他支付'
                        }}
                      </li>
                    </ul>
                  </td>
                  <td
                    :rowspan="order.orderDetailList.length"
                    width="8%"
                    class="center"
                    v-if="index === 0"
                  >
                    <a href="#" class="btn">{{ order.orderStatusName }}</a>
                  </td>
                  <td
                    :rowspan="order.orderDetailList.length"
                    width="13%"
                    class="center"
                    v-if="index === 0"
                  >
                    <ul class="unstyled">
                      <li>
                        <a href="mycomment.html" target="_blank">评价|晒单</a>
                      </li>
                    </ul>
                  </td>
                </template>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="choose-order">
          <!-- 分页器组件 -->
          <Pagination
            :pageNo="page"
            :pageSize="limit"
            :total="myOrder.total"
            :continues="3"
            @getPageNo="getPageNo"
          />
          <!-- continues代表连续的页码数是5 -->
        </div>
      </div>
      <!--猜你喜欢-->
      <div class="like">
        <h4 class="kt">猜你喜欢</h4>
        <ul class="like-list">
          <li class="likeItem">
            <div class="p-img">
              <img src="../images/itemlike01.png" />
            </div>
            <div class="attr">
              <em>DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</em>
            </div>
            <div class="price">
              <em>¥</em>
              <i>3699.00</i>
            </div>
            <div class="commit">已有6人评价</div>
          </li>
          <li class="likeItem">
            <div class="p-img">
              <img src="../images/itemlike02.png" />
            </div>
            <div class="attr">Apple苹果iPhone 6s/6s Plus 16G 64G 128G</div>
            <div class="price">
              <em>¥</em>
              <i>4388.00</i>
            </div>
            <div class="commit">已有700人评价</div>
          </li>
          <li class="likeItem">
            <div class="p-img">
              <img src="../images/itemlike03.png" />
            </div>
            <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</div>
            <div class="price">
              <em>¥</em>
              <i>4088.00</i>
            </div>
            <div class="commit">已有700人评价</div>
          </li>
          <li class="likeItem">
            <div class="p-img">
              <img src="../images/itemlike04.png" />
            </div>
            <div class="attr">DELL戴尔Ins 15MR-7528SS 15英寸 银色 笔记本</div>
            <div class="price">
              <em>¥</em>
              <i>4088.00</i>
            </div>
            <div class="commit">已有700人评价</div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MyOrder',
  data() {
    return {
      page: 1,
      limit: 3,
      myOrder: {}
    }
  },
  mounted() {
    this.getMyOrder()
  },
  methods: {
    async getMyOrder() {
      const res = await this.$API.reqGetMyOrder(this.page, this.limit)
      if (res.code === 200) {
        this.myOrder = res.data
      } else {
        alert(res.message)
      }
    },
    getPageNo(page) {
      this.page = page
      this.getMyOrder()
    }
  }
}
</script>

<style></style>
