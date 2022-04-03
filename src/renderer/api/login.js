// 仅示例
import request from '@/utils/request'
import store from "../store";

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

/**
 * 退出登录
 * @param data
 * @returns {*}
 */
export function logout (data) {
  return request({
    url: process.env.BASE_ADMIN_API+'/nb/v2/api/user/logout',
    method: 'post',
    headers:{
      'x-access-token':store.getters.token
    },
    data
  })
}

/**
 * 修改密码
 * @param data
 * @returns {*}
 */
export function passwordChange (data) {
  return request({
    url: process.env.BASE_ADMIN_API+'/nb/v2/api/user/passwordChange?password='+data.password,
    method: 'get',
    headers:{
      'x-access-token':store.getters.token
    },
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
