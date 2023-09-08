<template>
  <!-- 商品分类导航 -->
  <div class="type-nav">
    <div class="container">
      <div @mouseenter="changeShow(true)" @mouseleave="changeShow(false)">
        <h2 class="all">全部商品分类</h2>
        <transition name="sort">
          <div class="sort" v-show="show">
            <div class="all-sort-list2" @click="goSearch">
              <div
                class="item"
                v-for="item in categoryList"
                :key="item.categoryId"
              >
                <h3>
                  <a
                    :data-categoryName="item.categoryName"
                    :data-category1Id="item.categoryId"
                  >
                    {{ item.categoryName }}
                  </a>
                </h3>
                <div class="item-list clearfix">
                  <div class="subitem">
                    <dl
                      class="fore"
                      v-for="child in item.categoryChild"
                      :key="child.categoryId"
                    >
                      <dt>
                        <a
                          :data-categoryName="child.categoryName"
                          :data-category2Id="child.categoryId"
                        >
                          {{ child.categoryName }}
                        </a>
                      </dt>
                      <dd>
                        <em
                          v-for="grandson in child.categoryChild"
                          :key="grandson.categoryId"
                        >
                          <a
                            :data-categoryName="grandson.categoryName"
                            :data-category3Id="grandson.categoryId"
                          >
                            {{ grandson.categoryName }}
                          </a>
                        </em>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <nav class="nav">
        <a href="###">服装城</a>
        <a href="###">美妆馆</a>
        <a href="###">尚品汇超市</a>
        <a href="###">全球购</a>
        <a href="###">闪购</a>
        <a href="###">团购</a>
        <a href="###">有趣</a>
        <a href="###">秒杀</a>
      </nav>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
//  注意State要大写，注意mapState和mapGetters是映射在计算属性里面的，而mapActions和mapMutations是映射在methods里面的

export default {
  name: 'TypeNav',
  data() {
    return {
      show: true
    }
  },
  //  组件挂载完毕:可以向服务器发请求，但为了只发一遍，改到App.vue上了
  mounted() {
    // 通过判断当前组件是在home还是search路由下来实现sort列表的隐藏显示
    this.show = this.$route.meta.sortShow
  },
  computed: {
    ...mapState({
      //  右侧需要的是一个函数，当使用这个计算属性的时候，右侧函数会立即执行一次
      //  注入一个参数state，其实即为大仓库中的数据
      categoryList: state => state.home.categoryList.slice(0, 15)
    })
  },
  methods: {
    goSearch(e) {
      // 解构出跳转标签的信息并整理，准备跳转
      const { categoryname, category1id, category2id, category3id } =
        e.target.dataset

      const query = {
        categoryName: categoryname
      }

      if (categoryname) {
        if (category1id) query.category1Id = category1id
        else if (category2id) query.category2Id = category2id
        else if (category3id) query.category3Id = category3id
      }

      const location = { name: 'search', query }

      location.params = this.$route.params
      this.$router.push(location)
    },
    changeShow(flag) {
      if (!this.$route.path.includes('/search')) return
      this.show = flag
    }
  }
}
</script>

<style lang="less" scoped>
.type-nav {
  border-bottom: 2px solid #e1251b;
  .container {
    width: 1200px;
    margin: 0 auto;
    display: flex;
    position: relative;

    .all {
      width: 210px;
      height: 45px;
      background-color: #e1251b;
      line-height: 45px;
      text-align: center;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
    }

    .nav {
      box-sizing: border-box;
      height: 45px;
      a {
        height: 45px;
        margin: 0 22px;
        line-height: 45px;
        font-size: 16px;
        color: #333;
      }
    }

    .sort {
      position: absolute;
      left: 0;
      top: 47px;
      width: 210px;
      height: 461px;
      background: #fafafa;
      z-index: 999;
      .all-sort-list2 {
        .item {
          &:hover {
            background-color: skyblue;
            cursor: pointer;
          }
          h3 {
            line-height: 30px;
            font-size: 14px;
            font-weight: 400;
            overflow: hidden;
            padding: 0 20px;
            margin: 0;
            a {
              color: #333;
            }
          }

          .item-list {
            display: none;
            position: absolute;
            width: 734px;
            min-height: 460px;
            _height: 200px;
            background: #f7f7f7;
            left: 210px;
            border: 1px solid #ddd;
            top: 5px;
            z-index: 9999 !important;

            .subitem {
              float: left;
              width: 650px;
              padding: 0 4px 0 8px;

              dl {
                border-top: 1px solid #eee;
                padding: 6px 0;
                overflow: hidden;
                zoom: 1;

                &.fore {
                  border-top: 0;
                }

                dt {
                  float: left;
                  width: 54px;
                  line-height: 22px;
                  text-align: right;
                  padding: 3px 6px 0 0;
                  font-weight: 700;
                }

                dd {
                  float: left;
                  width: 415px;
                  padding: 3px 0 0;
                  overflow: hidden;

                  em {
                    float: left;
                    height: 14px;
                    line-height: 14px;
                    padding: 0 8px;
                    margin-top: 5px;
                    border-left: 1px solid #ccc;
                  }
                }
              }
            }
          }

          &:hover {
            .item-list {
              display: block;
            }
          }
        }
      }
    }

    // 定义过渡的属性和时长的地方，用active
    .sort-enter-active,
    .sort-leave-active {
      transition: opacity 0.5s;
    }

    // 定义过度动画开始和离开结束时的透明度为0
    .sort-enter,
    .sort-leave-to {
      opacity: 0;
    }
  }
}
</style>
