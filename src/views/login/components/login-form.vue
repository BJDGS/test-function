<template>
  <div class="account-box">
    <!-- 【1】使用账号or短信切换 -->
    <div class="toggle">
      <!-- 两个a标签分别显示账号？短信登录 -->
      <a @click="isMsgLogin=false" v-if="isMsgLogin" href="javascript:;">
        <i class="iconfont icon-user"></i>使用账号登录
      </a>
      <a @click="isMsgLogin=true" v-else href="javascript:;">
        <i class="iconfont icon-msg"></i>使用短信登录
      </a>
    </div>
    <!-- 【2】表单、协议、按钮 -->
    <!-- Form 添加 v-slot="{errors}" 使用作用域插槽暴露 errors 错误对象,通过 errors['校验规则名称'] 取出错误信息，有则显示，无即隐藏 -->
    <Form class="form" ref="formCom" :validation-schema="schema" v-slot="{errors}" autocomplete="off">
      <!-- 账号登录表单 -->
      <template v-if="!isMsgLogin">
        <!-- 1-1 账号文本框 -->
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <!-- <input type="text" placeholder="请输入用户名或手机号"/> -->
            <Field :class="{error:errors.account}" v-model="form.account" name="account" type="text" placeholder="请输入用户名" />
          </div>
          <div class="error" v-if="errors.account">
            <i class="iconfont icon-warning"></i>
            {{errors.account}}
          </div>
        </div>
        <!-- 1-2 密码文本框 -->
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-lock"></i>
            <!-- <input type="password" placeholder="请输入密码"/> -->
            <Field :class="{error:errors.password}" v-model="form.password" name="password" type="password" placeholder="请输入密码" />
          </div>
          <div class="error" v-if="errors.password">
            <i class="iconfont icon-warning" />
            {{errors.password}}
          </div>
        </div>
      </template>
      <!-- 手机验证登录表单 -->
      <template v-else>
        <!-- 2-1 手机号文本框 -->
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-user"></i>
            <!-- <input type="text" placeholder="请输入手机号"/> -->
            <Field :class="{error:errors.mobile}" v-model="form.mobile" name="mobile" type="text" placeholder="请输入手机号" />
          </div>
          <div class="error" v-if="errors.mobile">
            <i class="iconfont icon-warning" />
            {{errors.mobile}}
          </div>
        </div>
        <!-- 2-2 验证码文本框 -->
        <div class="form-item">
          <div class="input">
            <i class="iconfont icon-code"></i>
            <!-- <input type="password" placeholder="请输入验证码"/> -->
            <Field :class="{error:errors.code}" v-model="form.code" name="code" type="text" placeholder="请输入验证码" />
            <span class="code" @click="send()">
              {{time===0?'发送验证码':`${time}秒发送`}}
            </span>
          </div>
          <div class="error" v-if="errors.code">
            <i class="iconfont icon-warning" />
            {{errors.code}}
          </div>
        </div>
      </template>
        <!-- 协议勾选 -->
        <div class="form-item">
          <!-- 勾选协议 -->
          <div class="agree">
            <!-- <xtx-checkbox v-model="form.isAgree" /> -->
            <!-- Field 的 as 属性可以指定为其他标签，也可指定为组件。但是组件需要支持 v-model 否则校验不会触发。 -->
            <Field as="XtxCheckbox" name="isAgree" v-model="form.isAgree" />
            <span>我已同意</span>
            <a href="javascript:;">《隐私条款》</a>
            <span>和</span>
            <a href="javascript:;">《服务条款》</a>
          </div>
        </div>
        <!-- 登录按钮 -->
        <a @click="login()" href="javascript:;" class="btn">登录</a>
    </Form>
    <!-- 【3】底部QQ、忘记、注册 -->
    <div class="action">
      <a href="https://graph.qq.com/oauth2.0/authorize?client_id=100556005&response_type=token&scope=all&redirect_uri=http%3A%2F%2Fwww.corho.com%3A8080%2F%23%2Flogin%2Fcallback">
        <img src="https://qzonestyle.gtimg.cn/qzone/vas/opensns/res/img/Connect_logo_7.png" alt="">
      </a>
      <div class="url">
        <a href="javascript:;">忘记密码</a>
        <a href="javascript:;">免费注册</a>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, reactive, watch, onUnmounted } from 'vue'
import { Form, Field } from 'vee-validate'
import schema from '@/utils/vee-validate-schema'
import { userAccountLogin, userMobileLogin, userMobileLoginMsg } from '@/api/user'
import Message from '@/components/library/Message'
import { useStore } from 'vuex'
import { useRoute, useRouter } from 'vue-router'
import { useIntervalFn } from '@vueuse/core'
export default {
  name: 'LoginForm',
  components: { Form, Field },
  setup () {
    const isMsgLogin = ref(false)
    // 表单对象数据
    const form = reactive({
      isAgree: true,
      account: null,
      password: null,
      mobile: null,
      code: null
    })
    // 校验规则对象
    const mySchema = {
      account: schema.account,
      password: schema.password,
      mobile: schema.mobile,
      code: schema.code,
      isAgree: schema.isAgree
    }
    // 监听isMsgLogin重置表单（数据+清除校验结果）
    const formCom = ref(null)
    watch(isMsgLogin, () => {
      // 重置数据
      form.isAgree = true
      form.account = null
      form.password = null
      form.mobile = null
      form.code = null
      // 如果是没有销毁Field组件，之前的校验结果是不会清除  例如：v-show切换的
      // Form组件提供了一个 resetForm 函数清除校验结果
      formCom.value.resetForm()
    })
    // 需要在点击登录的时候对整体表单进行校验
    const store = useStore()
    const route = useRoute()
    const router = useRouter()
    const login = async () => {
      // Form组件提供了一个 validate 函数作为整体表单校验，当是返回的是一个promise
      const valid = await formCom.value.validate()
      if (valid) {
        try {
          let data = null
          if (isMsgLogin.value) {
            const { mobile, code } = form
            data = await userMobileLogin({ mobile, code })
          } else {
            const { account, password } = form
            data = await userAccountLogin({ account, password })
          }
           const { id, account, avatar, mobile, nickname, token } = data.result
           store.commit('user/setUser', { id, account, avatar, mobile, nickname, token })
          //  store.dispatch('cart/mergeCart').then(() => {
           router.push(route.query.redirectUrl || '/')
           Message({ type: 'success', text: '登录成功' })
          //  })
        } catch (e) {
          if (e.response.data) {
            Message({ type: 'error', text: e.response.data.message || '登陆失败' })
          }
        }
      }
    }
    // 验证码倒计时逻辑
    const time = ref(0)
    // pause 暂停 resume 开始, useIntervalFn(回调函数,执行间隔,是否立即开启)
    const { pause, resume } = useIntervalFn(() => {
      time.value--
      if (time.value <= 0) {
        pause()
      }
    }, 1000, false)
    onUnmounted(() => {
      pause()
    })
    // 发送验证码
    const send = async () => {
      const valid = mySchema.mobile(form.mobile)
      if (valid === true) {
        if (time.value === 0) {
          await userMobileLoginMsg(form.mobile)
          Message({ type: 'success', text: '发送成功' })
          time.value = 60
          resume()
        }
      } else {
        // 失败，使用vee的错误函数显示错误信息 setFieldError(字段,错误信息)
        formCom.value.setFieldError('mobile', valid)
      }
    }
    return { isMsgLogin, form, schema: mySchema, formCom, login, send, time }
  }
}
</script>

<style lang="less" scoped>
// 账号容器
.account-box {
  .toggle {
    padding: 15px 40px;
    text-align: right;
    a {
      color: @xtxColor;
      i {
        font-size: 14px;
      }
    }
  }
  .form {
    padding: 0 40px;
    &-item {
      margin-bottom: 28px;
      .input {
        position: relative;
        height: 36px;
        > i {
          width: 34px;
          height: 34px;
          background: #cfcdcd;
          color: #fff;
          position: absolute;
          left: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 18px;
        }
        input {
          padding-left: 44px;
          border: 1px solid #cfcdcd;
          height: 36px;
          line-height: 36px;
          width: 100%;
          &.error {
            border-color: @priceColor;
          }
          &.active,&:focus {
            border-color: @xtxColor;
          }
        }
        .code {
          position: absolute;
          right: 1px;
          top: 1px;
          text-align: center;
          line-height: 34px;
          font-size: 14px;
          background: #f5f5f5;
          color: #666;
          width: 90px;
          height: 34px;
          cursor: pointer;
        }
      }
      > .error {
        position: absolute;
        font-size: 12px;
        line-height: 28px;
        color: @priceColor;
        i {
          font-size: 14px;
          margin-right: 2px;
        }
      }
    }
    .agree {
      a {
        color: #069;
      }
    }
    .btn {
      display: block;
      width: 100%;
      height: 40px;
      color: #fff;
      text-align: center;
      line-height: 40px;
      background: @xtxColor;
      &.disabled {
        background: #cfcdcd;
      }
    }
  }
  .action {
    padding: 20px 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .url {
      a {
        color: #999;
        margin-left: 10px;
      }
    }
  }
}
</style>
