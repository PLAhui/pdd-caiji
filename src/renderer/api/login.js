// 仅示例
import request from '@/utils/request'

/**
 * 登录接口
 * @param data
 * @returns {*}
 */
export function login (data) {
  return request({
    url: process.env.BASE_ADMIN_API+'/nb/v2/api/user/login',
    method: 'post',
    data
  })
}

// export function getInfo (token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }
export function message () {
  return request({
    url: '/message',
    method: 'get'
  })
}
