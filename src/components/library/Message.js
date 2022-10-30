import { createVNode, render } from 'vue'
import XtxMessage from './xtx-message.vue'

// 配置dom容器
const div = document.createElement('div')
div.setAttribute('class', 'xtx-msssage-container')
document.body.appendChild(div)

let timer = null

export default ({ type, text }) => {
  const vnode = createVNode(XtxMessage, { type, text })
  render(vnode, div)
  clearTimeout(timer)
  timer = setTimeout(() => {
    render(null, div)
  }, 3000)
}
