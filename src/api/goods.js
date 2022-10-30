import request from '@/utils/request'

export const findCommentInfoByGoods = (id) => {
  return request(`/goods/${id}/evaluate`)
}
