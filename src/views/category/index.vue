<template>
  <div class="top-category">
    <div class="container">
      <!-- <xtx-bread>
        <xtx-bread-item to="/">首页</xtx-bread-item>
        <xtx-bread-item>{{topCategory.name}}</xtx-bread-item>
      </xtx-bread> -->
      <XtxBread>
        <XtxBreadItem to="/">首页</XtxBreadItem>
        <Transition name="fade-right" mode="out-in">
          <XtxBreadItem :key="topCategory.id">{{topCategory.name}}</XtxBreadItem>
        </Transition>
      </XtxBread>
      <xtx-carousel :sliders="sliders" style="height:500px" />
      <div class="sub-list">
        <h3>全部分类</h3>
        <ul>
          <li v-for="sub in topCategory.children" :key="sub.id">
            <a href="javascript:;">
              <img :src="sub.picture" alt="">
              <p>{{sub.name}}</p>
            </a>
          </li>
        </ul>
      </div>
      <!-- Goods -->
      <div class="ref-goods" v-for="sub in subList" :key="sub.id">
        <div class="head">
          <h3>- {{sub.name}} -</h3>
          <p class="tag">{{sub.desc}}</p>
          <XtxMore :path="`/category/sub/${sub.id}`" />
        </div>
        <div class="body">
          <GoodsItem v-for="goods in sub.goods" :key="goods.id" :goods="goods"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { findBanner } from '@/api/home'
import xtxBreadItem from '@/components/library/xtx-bread-item.vue'
import XtxCarousel from '@/components/library/xtx-carousel.vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { computed, ref, watch } from 'vue'
// 子组件
import GoodsItem from './components/goods-item.vue'
import { findTopCategory } from '@/api/category'
export default {
  name: 'TopCategory',
  components: { xtxBreadItem, XtxCarousel, GoodsItem },
  setup () {
    // 轮播图
    const sliders = ref([])
    findBanner().then(data => {
      sliders.value = data.result
    })
    // 全部分类
    const route = useRoute()
    const store = useStore()
    const topCategory = computed(() => {
      let cate = {}
      const item = store.state.category.list.find(item => {
        return item.id === route.params.id
      })
      if (item) cate = item
      return cate
    })
    // 分类与商品
    const subList = ref([])
    const getSubList = () => {
      findTopCategory(route.params.id).then(data => {
        subList.value = data.result.children
      })
    }
    watch(() => route.params.id, (newVal) => {
      // newVal && getSubList()
      // 切换到二级类目路由的时候也有ID，但是也触发了watch导致发送了请求，需要处理。
      if (newVal && `/category/${newVal}` === route.path) getSubList()
    }, { immediate: true })
    return { sliders, topCategory, subList }
  }
}
</script>

<style scoped lang="less">
.top-category {
  h3 {
    font-size: 28px;
    color: #666;
    font-weight: normal;
    text-align: center;
    line-height: 100px;
  }
  .sub-list {
    margin-top: 20px;
    background-color: #fff;
    ul {
      display: flex;
      padding: 0 32px;
      flex-wrap: wrap;
      min-height: 160px;
      li {
        width: 168px;
        height: 160px;
        a {
          text-align: center;
          display: block;
          font-size: 16px;
          img {
            width: 100px;
            height: 100px;
          }
          p {
            line-height: 40px;
          }
          &:hover {
            color: @xtxColor;
          }
        }
      }
    }
  }
  // 推荐商品
  .ref-goods {
    background-color: #fff;
    margin-top: 20px;
    position: relative;
    .head {
      .xtx-more {
        position: absolute;
        top: 20px;
        right: 20px;
      }
      .tag {
        text-align: center;
        color: #999;
        font-size: 20px;
        position: relative;
        top: -20px;
      }
    }
    .body {
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      padding: 0 65px 30px;
    }
  }
}
</style>
