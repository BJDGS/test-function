<template>
  <div class="home-panel">
    <div class="container">
      <div class="head">
        <h3>{{title}}<small>{{subTitle}}</small></h3>
        <!-- slot -->
        <slot name="right"/>
      </div>
       <!-- <slot/> -->
      <slot/>
    </div>
    <div>testtest</div>
  </div>
</template>

<script>
export default {
  name: 'HomePanel',
  props: {
    title: {
      typle: String,
      default: ''
    },
    subTitle: {
      typle: String,
      default: ''
    }
  }
}
</script>

<style scoped lang='less'>
.home-panel {
  background-color: #fff;
  .head {
    padding: 40px 0;
    display: flex;
    align-items: flex-end;
    h3 {
      flex: 1;
      font-size: 32px;
      font-weight: normal;
      margin-left: 6px;
      height: 35px;
      line-height: 35px;
      small {
        font-size: 16px;
        color: #999;
        margin-left: 20px;
      }
    }
  }
}
</style>
