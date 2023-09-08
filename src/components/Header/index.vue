<template>
  <div class="header-container">
    <header class="header">
      <!-- 头部的第一行 -->
      <div class="top">
        <div class="container">
          <div class="loginList">
            <p>尚品汇欢迎您！</p>
            <!-- 没有登录：显示登录与注册 -->

            <p v-if="!$store.state.user.userInfo.nickName">
              <span>请</span>
              <!--
                声明式导航,当然你也可以使用编程式导航,因为不管是那个导航，都可以实现路由跳转，
                但是最后为什么选择声明式导航，没有任何业务、逻辑
               -->
              <router-link to="/login">登录</router-link>
              <router-link class="register" to="/register">注册</router-link>
            </p>
            <!-- 如果登录显示的是用户名字与退出登录 -->
            <p v-else>
              <a>{{ $store.state.user.userInfo.nickName }}</a>
              <a class="register" @click="logout">退出登录</a>
            </p>
          </div>
          <div class="typeList">
            <router-link to="/center">我的订单</router-link>
            <router-link to="/shopcart">我的购物车</router-link>
            <a href="###">我的尚品汇</a>
            <a href="###">尚品汇会员</a>
            <a href="###">企业采购</a>
            <a href="###">关注尚品汇</a>
            <a href="###">合作招商</a>
            <a href="###">商家后台</a>
          </div>
        </div>
      </div>
      <!--头部第二行 搜索区域-->
      <div class="bottom">
        <h1 class="logoArea">
          <router-link class="logo" to="/home">
            <img src="@/assets/images/header/logo.png" alt="" />
          </router-link>
        </h1>
        <div class="searchArea">
          <form action="###" class="searchForm">
            <input
              type="text"
              id="autocomplete"
              class="input-error input-xxlarge"
              v-model="keyword"
            />
            <!-- 编程式导航:因为有业务 -->
            <button
              class="sui-btn btn-xlarge btn-danger"
              type="button"
              @click="goSearch"
            >
              搜索
            </button>
          </form>
        </div>
      </div>
    </header>
  </div>
</template>

<script>
export default {
  name: 'Header',
  data() {
    return {
      keyword: ''
    }
  },
  mounted() {
    // 这里是search面包屑关键字操作的对接部分
    // 通过全局事件总线清除关键字
    this.$bus.$on('clearKeyword', () => {
      this.keyword = ''
    })
  },
  methods: {
    logout() {
      // 退出登录要做两件事，1是通知后台清除服务器的数据，2是自己清除浏览器上的数据
      this.$store
        .dispatch('userLogout')
        .then(() => {
          // 退出登录后留在本页面
          this.$router.go(0)
        })
        .catch(error => {
          alert(error.message)
        })
    },
    goSearch() {
      const location = {
        name: 'search',
        params: {
          keyword: this.keyword
        }
      }
      location.query = this.$route.query
      this.$router.push(
        location,
        // 为什么下面会这样写？
        // 这个this.$router.push()的返回值是个Promise对象，在第一次点击跳转后，不会出现任何问题，但是Promise对象需要传参(resolve,reject),第二次点击的时候就没有参数了，但Promise进程一旦开启不可逆转，只有成功或者失败，于是就reject了，就报错。于是下面就捕获异常的函数里写空就什么事都不做了，不然就会报错
        () => {}, // 成功函数
        () => {} // 失败函数
      )
    }
  }
}
</script>

<style scoped lang="less">
.header {
  & > .top {
    background-color: #eaeaea;
    height: 30px;
    line-height: 30px;

    .container {
      width: 1200px;
      margin: 0 auto;
      overflow: hidden;

      .loginList {
        float: left;

        p {
          float: left;
          margin-right: 10px;

          .register {
            border-left: 1px solid #b3aeae;
            padding: 0 5px;
            margin-left: 5px;
          }
        }
      }

      .typeList {
        float: right;

        a {
          padding: 0 10px;
          text-decoration: none;
          & + a {
            border-left: 1px solid #b3aeae;
          }
          &:hover {
            color: rgb(234, 74, 54);
          }
        }
      }
    }
  }

  & > .bottom {
    width: 1200px;
    margin: 0 auto;
    overflow: hidden;

    .logoArea {
      float: left;

      .logo {
        img {
          width: 175px;
          margin: 25px 45px;
        }
      }
    }

    .searchArea {
      float: right;
      margin-top: 35px;

      .searchForm {
        overflow: hidden;

        input {
          box-sizing: border-box;
          width: 490px;
          height: 32px;
          padding: 0px 4px;
          border: 2px solid #ea4a36;
          float: left;

          &:focus {
            outline: none;
          }
        }

        button {
          height: 32px;
          width: 68px;
          background-color: #ea4a36;
          border: none;
          color: #fff;
          float: left;
          cursor: pointer;

          &:focus {
            outline: none;
          }
        }
      }
    }
  }
}
</style>
