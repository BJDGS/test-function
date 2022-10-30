<script>
import { h } from 'vue'
export default {
  name: 'XtxBread',
  render () {
    // $slots 自动获取所有节点
    const items = this.$slots.default()
    const dymanicItems = []
    items.forEach((item, i) => {
      if (item.type.name === 'XtxBreadItem' || item.type.displayName === 'Transition') {
        dymanicItems.push(item)
        if (i < (items.length - 1)) {
          dymanicItems.push(h('i', { class: 'iconfont icon-angle-right' }))
        }
      }
    })
    // 标签类型，标签属性对象，第三个参数子节点（谁放进来）
    return h('div', { class: 'xtx-bread' }, dymanicItems)
  }
}
</script>

<style lang='less'>
.xtx-bread{
  display: flex;
  padding: 25px 10px;
  &-item {
    a {
      color: #666;
      transition: all .4s;
      &:hover {
        color: @xtxColor;
      }
    }
  }
  i {
    font-size: 12px;
    margin-left: 5px;
    margin-right: 5px;
    line-height: 22px;
  }
}
</style>
