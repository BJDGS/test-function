<template>
<AppTopnav/>
<AppHeader/>
<AppHeaderSticky/>
<div class="app-body">
  <RouterView/>
</div>
<AppFooter/>
</template>

<script>
import AppTopnav from '@/components/app-topnav.vue'
import AppHeader from '@/components/app-header.vue'
import AppFooter from '@/components/app-footer.vue'
import AppHeaderSticky from '@/components/app-header-sticky.vue'
import { useStore } from 'vuex'
export default {
  name: 'Layout',
  components: {
    AppTopnav,
    AppHeader,
    AppFooter,
    AppHeaderSticky
  },
  setup () {
    // 为什么这里要调用这个，而且没有处理数据，没有return
    const store = useStore()
    store.dispatch('category/getList')
  }
}
</script>

<style scroped lang="less">
.app-body {
  min-height: 600px;
}
</style>
