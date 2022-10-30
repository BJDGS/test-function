// import XtxSkeleton from './xtx-skeleton.vue'
// import XtxCarousel from './xtx-carousel.vue'
// // import XtxMore from './xtx-more.vue'
// import XtxMore from './xtx-more.vue'
// import XtxBreadItem from './xtx-bread-item.vue'
// import XtxBread from './xtx-bread.vue'

import defaultImg from '@/assets/images/200.png'
import Message from './Message'

const importFn = require.context('./', false, /\.vue$/)

export default {
  install (app) {
    // app.component(XtxSkeleton.name, XtxSkeleton)
    // app.component(XtxCarousel.name, XtxCarousel)
    // app.component(XtxMore.name, XtxMore)
    // app.component(XtxBreadItem.name, XtxBreadItem)
    // app.component(XtxBread.name, XtxBread)
    importFn.keys().forEach(path => {
      const component = importFn(path).default
      app.component(component.name, component)
    })

    defineDirective(app)

    // 如果你想挂载全局的属性，能够通过组件实例调用的属性   this.$message
    app.config.globalProperties.$message = Message
  }
}

const defineDirective = (app) => {
  app.directive('lazy', {
    mounted (el, binding) {
      const observe = new IntersectionObserver(([{ isIntersecting }]) => {
        if (isIntersecting) {
          observe.unobserve(el)
          el.onerror = () => {
            el.src = defaultImg
          }
          el.src = binding.value
        }
      }, {
        threshold: 0
      })
      observe.observe(el)
    }
  })
}
