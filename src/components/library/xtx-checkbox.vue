<template>
  <div class="xtx-checkbox" @click="changeChecked()">
    <i v-if="checked" class="iconfont icon-checked"></i>
    <i v-else class="iconfont icon-unchecked"></i>
    <span v-if="$slots.default">
      <slot />
    </span>
  </div>
</template>

<script>
// import { ref, watch } from 'vue'
import { useVModel } from '@vueuse/core'
export default {
  name: 'XtxCheckbox',
  props: {
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  setup (props, { emit }) {
    // const checked =  ref(false)
    // 使用useVModel实现双向数据绑定v-model指令
    const checked = useVModel(props, 'modelValue', emit)
    const changeChecked = () => {
      // checked.value = !checked.value
      // emit('update:modelValue', checked.value)
      const newVal = !checked.value
      checked.value = newVal
      emit('change', newVal)
    }
    // watch(() => props.modelValue, () => {
    //   checked.value = props.modelValue
    // },{immediate:true})
    return { checked, changeChecked }
  }
}
</script>

<style scoped lang="less">
.xtx-checkbox {
  display: inline-block;
  margin-right: 2px;
  .icon-checked {
    color: @xtxColor;
    ~ span {
      color: @xtxColor;
    }
  }
  i {
    position: relative;
    top: 1px;
  }
  span {
    margin-left: 2px;
  }
}
</style>
