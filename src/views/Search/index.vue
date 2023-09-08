<template>
  <div>
    <TypeNav />
    <div class="main">
      <div class="py-container">
        <!--面包屑-->
        <div class="bread">
          <ul class="fl sui-breadcrumb">
            <li>
              <a href="#">全部结果</a>
            </li>
          </ul>
          <ul class="fl sui-tag">
            <!-- 分类面包屑 -->
            <li class="with-x" v-show="this.searchParams.categoryName">
              {{ this.searchParams.categoryName }}
              <i @click="removeCategoryName">×</i>
            </li>
            <!-- 关键词面包屑 -->
            <li class="with-x" v-show="this.searchParams.keyword">
              {{ this.searchParams.keyword }}
              <i @click="removeKeyword">×</i>
            </li>
            <!-- 品牌信息面包屑,这个必须用v-if，不然在trademark为未定义的时候会删不掉 -->
            <li class="with-x" v-if="this.searchParams.trademark">
              {{ this.searchParams.trademark.split(':')[1] }}
              <i @click="removeTrademark">×</i>
            </li>
            <!-- 售卖属性的展示 -->
            <li
              class="with-x"
              v-for="(prop, index) in this.searchParams.props"
              :key="prop.split(':')[0]"
            >
              {{ prop.split(':')[1] }}
              <i @click="removeProp(index)">×</i>
            </li>
          </ul>
        </div>

        <!--selector-->
        <!-- 利用自定义事件接收各类信息 -->
        <SearchSelector @trademarkInfo="getTrademark" @attrInfo="getAttrInfo" />

        <!--details-->
        <div class="details clearfix">
          <div class="sui-navbar">
            <div class="navbar-inner filter">
              <!-- 排序部分 -->
              <ul class="sui-nav">
                <li @click="order('1')" :class="{ active: toggleMethod('1') }">
                  <a href="#">
                    综合
                    <span v-show="toggleMethod('1')">
                      {{ toggleMethod('asc') ? '↑' : '↓' }}
                    </span>
                  </a>
                </li>

                <li @click="order('2')" :class="{ active: toggleMethod('2') }">
                  <a href="#">
                    价格
                    <span v-show="toggleMethod('2')">
                      {{ toggleMethod('asc') ? '↑' : '↓' }}
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div class="goods-list">
            <ul class="yui3-g">
              <li class="yui3-u-1-5" v-for="goods in goodsList" :key="goods.id">
                <div class="list-wrap">
                  <div class="p-img">
                    <!-- 点击这里是想带商品详情页 -->
                    <router-link :to="`/detail/${goods.id}`">
                      <!-- 这里用了懒加载插件的自定义指令 -->
                      <img v-lazy="goods.defaultImg" />
                    </router-link>
                  </div>
                  <div class="price">
                    <strong>
                      <em>¥ </em>
                      <i>{{ goods.price }}</i>
                    </strong>
                  </div>
                  <div class="attr">
                    <a
                      target="_blank"
                      href="item.html"
                      title="促销信息，下单即赠送三个月CIBN视频会员卡！【小米电视新品4A 58 火爆预约中】"
                      v-html="goods.title"
                    >
                    </a>
                  </div>
                  <div class="commit">
                    <i class="command">已有<span>2000</span>人评价</i>
                  </div>
                  <div class="operate">
                    <a
                      href="success-cart.html"
                      target="_blank"
                      class="sui-btn btn-bordered btn-danger"
                    >
                      加入购物车
                    </a>
                    <a href="javascript:void(0);" class="sui-btn btn-bordered">
                      收藏
                    </a>
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <!-- 分页器组件 -->
          <Pagination
            :pageNo="searchParams.pageNo"
            :pageSize="searchParams.pageSize"
            :total="total"
            :continues="5"
            @getPageNo="getPageNo"
          />
          <!-- continues代表连续的页码数是5 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchSelector from './SearchSelector/SearchSelector'

// 注意，goodsList用的是getters计算属性，所以引入mapGetters
import { mapGetters, mapState } from 'vuex'
export default {
  name: 'Search',
  data() {
    return {
      searchParams: {
        category1Id: '',
        category2Id: '',
        category3Id: '',
        categoryName: '', // 分类名称
        keyword: '',
        order: '1:desc', //  排序方式,初始应该是综合降序
        pageNo: 1, //  当前页码
        pageSize: 10, // 每页条数
        props: [], //  平台售卖属性的参数
        trademark: '' //  品牌
      }
    }
  },
  components: {
    SearchSelector
  },
  computed: {
    // 这个用法也与mapState不同，那个是对象方法，这个是直接数组里写数据名
    ...mapGetters(['goodsList']),
    ...mapState({
      total: state => state.search.searchInfo.total
    })
  },
  watch: {
    // 监听路由的数据是否发生变化，如是就重新发起请求
    $route() {
      this.mergeNewParams()
      this.getData()
    }
  },
  beforeMount() {
    // 组件挂载完毕之前先执行一次参数合并
    // 将分类信息和关键词都统合到这个对象中
    this.mergeNewParams()
  },
  mounted() {
    this.getData()
  },
  methods: {
    // 合并参数简化方法
    mergeNewParams() {
      Object.assign(this.searchParams, this.$route.params, this.$route.query)
    },
    // 封装获取数据的语句为方法,传params参数，方便从服务器拉取不同的数据
    getData() {
      this.$store.dispatch('searchInfo', this.searchParams)
    },
    // 点击面包屑删除分类名字
    removeCategoryName() {
      // 把当前组件下的临时分类名，Id置空
      this.searchParams.category1Id = undefined
      // 每次拉取完手机列表数据后，要清空Id。如果这次是请求的3Id，不清空的话下次可能搜索1Id，导致携带了两个Id参数
      this.searchParams.category2Id = undefined
      // 属性值设置为undefined请求就不会携带该参数
      this.searchParams.category3Id = undefined
      this.searchParams.categoryName = undefined
      // 但是这只是把临时的变更了，还有route的这些东西没变，看路径就发现没变，所以需要重定向到search,变相清空query，当然关键词不应该删，所以重定向的时候带着
      this.$router.push({ name: 'search', params: this.$route.params })
    },
    // 点击关键词的面包屑三处删除关键词
    removeKeyword() {
      // 和点击分类面包屑一样的套路，先把searchParams的keyword清空
      this.searchParams.keyword = undefined
      // 然后携带query/params重定向，这时params/query清空了watch就监听到了，自己就发起请求了
      this.$router.push({ name: 'search', query: this.$route.query })
      // 这时route中的和searchParams中的keyword都没了，再通知兄弟组件清空输入框就行了
      this.$bus.$emit('clearKeyword')
    },
    // 自定义事件触发该函数，获取到品牌信息
    getTrademark(trademark) {
      this.searchParams.trademark = `${trademark.tmId}:${trademark.tmName}`
      this.getData()
    },
    // 点击面包屑删除品牌信息
    removeTrademark() {
      this.searchParams.trademark = undefined
      this.getData()
    },
    // 自定义事件触发该函数，获取到属性信息
    getAttrInfo(attr, val) {
      // 整理参数成props需要的模样
      const prop = `${attr.attrId}:${val}:${attr.attrName}`
      // 判断这个属性是否已经被添加过了
      if (!this.searchParams.props.includes(prop)) {
        this.searchParams.props.push(prop)
        this.getData()
      }
    },
    // 点击属性面包屑
    removeProp(index) {
      // 点击删除此属性，然后重新发送请求
      this.searchParams.props.splice(index, 1)
      this.getData()
    },
    // 下面排序根据order切换类名和箭头用到的函数
    toggleMethod(str) {
      return this.searchParams.order.includes(str)
    },
    // 点击排序方块触发更改排序方式
    order(num) {
      const orderNum = this.searchParams.order.split(':')[0]
      const orderSort = this.searchParams.order.split(':')[1]
      let newOrder
      // 为true说明当前点击的排序方式(综合/价格)和原依据方式相同，是想降序升序切换
      if (orderNum === num) {
        newOrder = `${orderNum}:${orderSort === 'asc' ? 'desc' : 'asc'}`
      } else {
        // 否则说明想从综合切换到价格，反之亦然
        newOrder = `${num}:desc`
        // 切换之后将升序降序修改为默认的降序
      }
      this.searchParams.order = newOrder
      // 更改order参数后，重新发请求获得排序后的数据
      this.getData()
    },
    // 从分页器组件收到当前页码
    getPageNo(pageNo) {
      this.searchParams.pageNo = pageNo
      this.getData()
    }
  }
}
</script>

<style lang="less" scoped>
.main {
  margin: 10px 0;

  .py-container {
    width: 1200px;
    margin: 0 auto;

    .bread {
      margin-bottom: 5px;
      overflow: hidden;

      .sui-breadcrumb {
        padding: 3px 15px;
        margin: 0;
        font-weight: 400;
        border-radius: 3px;
        float: left;

        li {
          display: inline-block;
          line-height: 18px;

          a {
            color: #666;
            text-decoration: none;

            &:hover {
              color: #4cb9fc;
            }
          }
        }
      }

      .sui-tag {
        margin-top: -5px;
        list-style: none;
        font-size: 0;
        line-height: 0;
        padding: 5px 0 0;
        margin-bottom: 18px;
        float: left;

        .with-x {
          font-size: 12px;
          margin: 0 5px 5px 0;
          display: inline-block;
          overflow: hidden;
          color: #000;
          background: #f7f7f7;
          padding: 0 7px;
          height: 20px;
          line-height: 20px;
          border: 1px solid #dedede;
          white-space: nowrap;
          transition: color 400ms;
          cursor: pointer;

          i {
            margin-left: 10px;
            cursor: pointer;
            font: 400 14px tahoma;
            display: inline-block;
            height: 100%;
            vertical-align: middle;
          }

          &:hover {
            color: #28a3ef;
          }
        }
      }
    }

    .details {
      margin-bottom: 5px;

      .sui-navbar {
        overflow: visible;
        margin-bottom: 0;

        .filter {
          min-height: 40px;
          padding-right: 20px;
          background: #fbfbfb;
          border: 1px solid #e2e2e2;
          padding-left: 0;
          border-radius: 0;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.065);

          .sui-nav {
            position: relative;
            left: 0;
            display: block;
            float: left;
            margin: 0 10px 0 0;

            li {
              float: left;
              line-height: 18px;

              a {
                display: block;
                cursor: pointer;
                padding: 11px 15px;
                color: #777;
                text-decoration: none;
              }

              &.active {
                a {
                  background: #e1251b;
                  color: #fff;
                }
              }
            }
          }
        }
      }

      .goods-list {
        margin: 20px 0;

        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            height: 100%;
            width: 20%;
            margin-top: 10px;
            line-height: 28px;

            .list-wrap {
              .p-img {
                padding-left: 15px;
                width: 215px;
                height: 255px;

                a {
                  color: #666;

                  img {
                    max-width: 100%;
                    height: auto;
                    vertical-align: middle;
                  }
                }
              }

              .price {
                padding-left: 15px;
                font-size: 18px;
                color: #c81623;

                strong {
                  font-weight: 700;

                  i {
                    margin-left: -5px;
                  }
                }
              }

              .attr {
                padding-left: 15px;
                width: 85%;
                overflow: hidden;
                margin-bottom: 8px;
                min-height: 38px;
                cursor: pointer;
                line-height: 1.8;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;

                a {
                  color: #333;
                  text-decoration: none;
                }
              }

              .commit {
                padding-left: 15px;
                height: 22px;
                font-size: 13px;
                color: #a7a7a7;

                span {
                  font-weight: 700;
                  color: #646fb0;
                }
              }

              .operate {
                padding: 12px 15px;

                .sui-btn {
                  display: inline-block;
                  padding: 2px 14px;
                  box-sizing: border-box;
                  margin-bottom: 0;
                  font-size: 12px;
                  line-height: 18px;
                  text-align: center;
                  vertical-align: middle;
                  cursor: pointer;
                  border-radius: 0;
                  background-color: transparent;
                  margin-right: 15px;
                }

                .btn-bordered {
                  min-width: 85px;
                  background-color: transparent;
                  border: 1px solid #8c8c8c;
                  color: #8c8c8c;

                  &:hover {
                    border: 1px solid #666;
                    color: #fff !important;
                    background-color: #666;
                    text-decoration: none;
                  }
                }

                .btn-danger {
                  border: 1px solid #e1251b;
                  color: #e1251b;

                  &:hover {
                    border: 1px solid #e1251b;
                    background-color: #e1251b;
                    color: white !important;
                    text-decoration: none;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
