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
    //请求将被发送时
    if (method === 'Network.requestWillBeSent') {
      // webContents.fromId(id).send("GetHttpData",{type: 'requestWillBeSent', url: params.request.url}, params)
    }
    //装载完成时
    if(method === 'Network.loadingFinished'){
      // console.log("装载完成：method:",method,"params",params)
      webWindow.webContents.debugger.sendCommand('Network.getResponseBody', { requestId: params.requestId }).then(function(response) {
        webContents.fromId(id).send("GetHttpData", {type: 'repBody', params: params}, response.body)
      }).catch(err=>{
        webContents.fromId(id).send("logs", {method:'GetHttpData',msg:"获取响应内容异常",error:err},params);
      })
    }

    //收到答复时
    if (method === 'Network.responseReceived') {
      // console.log("收到答复时：url:",params.response.url,"params",params)
      //params中无响应数据只有响应头
      const mimeType = params.response.mimeType;
      const Type = ['image/gif','image/jpeg','text/css','image/webp','application/javascript','application/octet-stream','text/html-1','image/png','application/x-font-ttf'];
      if(Type.indexOf(mimeType) == -1){
        webContents.fromId(id).send("GetHttpData", {type: 'responseReceived', url: params.response.url}, params)
      }
    }
  })
  webWindow.webContents.debugger.sendCommand('Network.enable').catch(e=>{
    webContents.fromId(id).send("NetworkEnable", {type: 'error_msg'},e)
  })
}


