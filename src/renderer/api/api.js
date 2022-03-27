// 仅示例
import request from '@/utils/request'
// export function login (data) {
//   return request({
//     url: '/user/login',
//     method: 'post',
//     data
//   })
// }

// export function getInfo (token) {
//   return request({
//     url: '/user/info',
//     method: 'get',
//     params: { token }
//   })
// }
export function qryData(conf) {
  console.log(conf)
  const {AccessToken,filter,keyword,current} = conf;
  return request({
    url: process.env.PDD_API+'/proxy/api/search?sort=default&filter='+filter+'&q='+keyword+'&page='+current+'&is_new_query=1&size=20',
    method: 'get',
    headers:{
      AccessToken:AccessToken
    }
  })
}
