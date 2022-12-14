// 用户模块
export default {
  namespaced: true,
  state () {
    return {
      profile: {
        id: '',
        account: '',
        avatar: '',
        nickname: '',
        mobile: '',
        token: ''
      },
      // 登录后回跳路径
      redirectUrl: '/'
    }
  },
  mutations: {
    setUser (state, payload) {
      state.profile = payload
    },
    // 修改回跳地址
    setRedirectUrl (state, url) {
      state.redirectUrl = url
    }
  }
}
