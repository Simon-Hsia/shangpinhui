<template>
  <div class="home-container">
    <TypeNav />
    <ListContainer />
    <Recommend />
    <Rank />
    <Like />
    <Floor v-for="item in floorList" :key="item.id" :list="item" />
    <Brand />
  </div>
</template>

<script>
import ListContainer from '@/views/Home/ListContainer'
import Recommend from '@/views/Home/Recommend'
import Rank from '@/views/Home/Rank'
import Like from '@/views/Home/Like'
import Floor from '@/views/Home/Floor'
import Brand from '@/views/Home/Brand'

import { mapState } from 'vuex'

export default {
  name: 'Home',
  components: {
    ListContainer,
    Recommend,
    Rank,
    Like,
    Floor,
    Brand
  },
  computed: {
    ...mapState({
      floorList: store => store.home.floorList
    })
  },
  mounted() {
    // 派发action，获得floor组件的数据
    this.$store.dispatch('floorList')
  }
}
</script>

<style></style>
