import {webContents} from "electron";


/**
 * 可以获取到发送请求是的数据
 *  request
 * Network.requestWillBeSent
 * 可以获取到收到的响应数据-不含响应内容（可进一步获取响应内容）
 *  response
 * Network.responseReceived
 */

/**
 *
 * 用于webContents.debugger中
 * 监听网页中http请求，获取请求和响应数据
 * @param webWindow  当前窗体实例
 * @param id 窗体实例ID，用于在渲染线程显示数据
 * @constructor hzq
 */
export default function  GetHttpData(webWindow,id) {
  try {
    webWindow.webContents.debugger.attach('1.1');
  } catch (err) {
    console.log('调试器连接失败: ', err)
  }
  webWindow.webContents.debugger.on('detach', (event, reason) => {
    console.log('调试器由于以下原因而分离 : ', reason)
  });
  webWindow.webContents.debugger.on('message', (event, method, params) => {
    //params中无响应数据只有响应头

    if (method === 'Network.requestWillBeSent') {
      webContents.fromId(id).send("GetHttpData",
          {type: 'req', url: params.request.url}, params)
    }

    if (method === 'Network.responseReceived') {
      const mimeType = params.response.mimeType;
      const Type = ['image/gif','image/jpeg','text/css','image/webp','application/javascript','application/octet-stream','text/html','image/png','application/x-font-ttf'];

      if(Type.indexOf(mimeType) == -1){
        console.log(Type.indexOf(mimeType),mimeType)
        webContents.fromId(id).send("GetHttpData", {type: 'rep', url: params.response.url}, params)
        webWindow.webContents.debugger.sendCommand('Network.getResponseBody', {requestId: params.requestId}).then(response=>{
          webContents.fromId(id).send("GetHttpData", {type: 'repBody', url: params.response.url},response.body)
        }).catch(err=>{
          console.error("出现异常:",params)
          // console.error(params.requestId,params)
          // console.log("params",params)
          // console.log("url",params.response.url)
          // console.log("AccessToken",params.response.requestHeaders.AccessToken)
          if(params.response.requestHeaders.AccessToken!=null){
            webContents.fromId(id).send("GetHttpData", {type: 'repBody', url: params.response.url}, JSON.stringify({data:'抛出异常',msg: {url:params.response.url,AccessToken:params.response.requestHeaders.AccessToken}}))
          }else{
            webContents.fromId(id).send("GetHttpData", {type: 'repBody', url: params.response.url}, JSON.stringify({data:'抛出异常',msg:err}))
          }
        });


      }



      //&& mimeType == 'application/json' && mimeType=='application/json;charset=UTF-8'
    }
  })

  webWindow.webContents.debugger.sendCommand('Network.enable');
}


