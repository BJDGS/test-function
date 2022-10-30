<template>
  <div class="cart">
    <!-- 购物车图标 -->
    <RouterLink class="curr" to="/cart">
      <i class="iconfont icon-cart"></i>
      <em>{{$store.getters['cart/validTotal']}}</em>
    </RouterLink>
    <!-- 购物车弹出层 -->
    <div class="layer" v-if="$store.getters['cart/validTotal']>0&&$route.path!=='/cart'">
      <div class="list">
        <div class="item" v-for="goods in $store.getters['cart/validList']" :key="goods.skuId">
          <RouterLink :to="`/product/${goods.id}`">
            <img :src="goods.picture" alt="" />
            <div class="center">
              <p class="name ellipsis-2">{{goods.name}}</p>
              <p class="attr ellipsis">{{goods.attrsText}}</p>
            </div>
            <div class="right">
              <p class="price">&yen;{{goods.nowPrice}}</p>
              <p class="count">x{{goods.count}}</p>
            </div>
          </RouterLink>
          <i @click="deleteCart(goods.skuId)" class="iconfont icon-close-new"></i>
        </div>
      </div>
      <div class="foot">
        <div class="total">
          <p>共 {{$store.getters['cart/validTotal']}} 件商品</p>
          <p>&yen;{{$store.getters['cart/validAmount']}}</p>
        </div>
        <XtxButton @click="$router.push('/cart')" type="plain">去购物车结算</XtxButton>
      </div>
    </div>
  </div>
</template>
<script>
import { useStore } from 'vuex'
// import Message from './library/Message'
export default {
  name: 'AppHeaderCart',
  setup () {
    const store = useStore()
    // store.dispatch('cart/findCart').then(() => {
    //   // Message({ type: 'success', text: '更新本地购物车成功' })
    // })
    // 删除函数
    const deleteCart = (skuId) => {
      store.dispatch('cart/deleteCart', skuId)
    }

    return { deleteCart }
  }
}
</script>

<style lang="less" scoped>
.cart {
    width: 50px;
    position: relative;
    z-index: 600;
    .curr {
        height: 32px;
        line-height: 32px;
        text-align: center;
        position: relative;
        display: block;
        .icon-cart {
            font-size: 22px;
        }
        em {
            position: absolute;
            top: 0;
            right: 0;
            border-radius: 10px;
            background: @helpColor;
            color: #fff;
            padding: 1px 6px;
            line-height: 1;
            font-style: normal;
            font-family: Arial;
            font-size: 12px;
        }
    }
    &:hover {
        .layer {
            opacity: 1;
            transform: none;
        }
    }
    .layer {
        opacity: 0;
        transition: all .5s .2s;
        // 1. 动画从配置的位置变化到DOM定义的位置
        // 2. 没有下面这一行，默认按照上面的transition定义的时间渐变过来
        // 3. 不写translateY也就是默认从DOM的中心点开始变化，写上就从偏移的位置开始变，此处（从DOM位置上面200px的位置变下来）
        // 4. scale（x，y）不写就是默认（1，1）写上就是从写的倍数缩放到1，此处（X:1>1, Y:0>1）
        transform: translateY(-200px) scale(1, 0);
        width: 400px;
        height: 400px;
        position: absolute;
        top: 50px;
        right: 0;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        background: #fff;
        border-radius: 4px;
        padding-top: 10px;
        // 小三角
        &::before{
          content: "";
          position: absolute;
          right: 14px;
          top: -10px;
          width: 20px;
          height: 20px;
          background: #fff;
          transform: scale(0.6, 1) rotate(45deg);
          // 阴影一般用3个px属性，1个颜色属性。第一个X，正值在右边，负值在左边，0没有
          // 第二个Y，正值在下面，负值在上面，0没有。第三个值是阴影模糊程度，数字越大越模糊
          // 第四个是颜色，前3个是rgb，最后一个透明度
          box-shadow: -3px -3px 5px rgba(0, 0, 0, 0.1);
          // border: 2px solid red;
        }
        .list {
            height: 310px;
            overflow: auto;
            padding: 0 10px;
            &::-webkit-scrollbar{
                width:10px;
                height:10px;
            }
            &::-webkit-scrollbar-track{
                background: #f8f8f8;
                border-radius: 2px;
            }
            &::-webkit-scrollbar-thumb{
                background: #eee;
                border-radius:10px;
            }
            &::-webkit-scrollbar-thumb:hover{
                background: #ccc;
            }
            .item {
                position: relative;
                border-bottom: 1px solid #f5f5f5;
                padding: 10px 0;
                a {
                    display: flex;
                    align-items: center;
                    img {
                        width: 80px;
                        height: 80px;
                    }
                    .center {
                        width: 200px;
                        padding: 0 10px;
                        .attr {
                          color: #999;
                          // font-size: 10px;
                          padding-top: 5px;
                        }
                    }
                    .right {
                        width: 100px;
                        padding-right: 20px;
                        text-align: center;
                        .price {
                          font-size: 16px;
                          color: @priceColor;
                        }
                        .count {
                          color: #999;
                          margin-top: 5px;
                          font-size: 16px;
                        }
                    }
                }
                i {
                    position: absolute;
                    // display: block;
                    right: 0;
                    bottom: 38px;
                    opacity: 0;
                    transition: all .5;
                    color: #666;
                }
                &:hover {
                    i {
                        opacity: 1;
                        cursor: pointer;
                    }
                }
            }
        }
        .foot {
            display: flex;
            justify-content: space-between;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            padding: 10px;
            .total {
                // margin-top: 5px;
                padding-left: 10px;
                color: #999;
                p {
                    padding-top: 2px;
                    &:last-child {
                        color: @priceColor;
                        font-size: 16px;
                    }
                }
            }
        }
    }
}
</style>
