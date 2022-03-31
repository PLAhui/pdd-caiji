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
/**
 * 采集拼多多关键词搜索的数据
 * @param conf {filter,keyword,current}
 * @returns {*}
 */
export function qryData(conf) {
  const {filter,keyword,current} = conf;
  return request({
    url: process.env.PDD_API+'/proxy/api/search?sort=default&filter='+filter+'&q='+keyword+'&page='+current+'&is_new_query=1&size=20&source=index',
    method: 'get',
    headers:{
      AccessToken:localStorage.getItem('PDDAccessToken')
    }
  })
}

/**
 * 1688企业列表数据
 * @param conf
 * @returns {*}
 */
export function qry1688List(conf) {
  const {AccessToken,filter,keyword,current} = conf;
  return request({
    url: process.env.Ali1688_API+'/service/companySearchBusinessService?keywords='+keyword+'&spm=a26352.24780423.searchbox.input&async=true&requestId='+AccessToken+'&sessionId=b832393730ed4aa8adc2f8de1f309918&pageName=supplier&beginPage='+current+'&asyncCount=20&pageSize=20&startIndex=0',
    method: 'get',
    headers:{
      requestId:AccessToken
    }
  })
}

/**
 * 获取版本说明信息
 * @param conf
 * @returns {*}
 */
export function getVersionInfo(conf) {
  return request({
    url: process.env.BASE_API+'/reademe.json',
    method: 'get',
  })
}





export function test(url){
  return request({
    url: url,
    method: 'get',
  })
}
