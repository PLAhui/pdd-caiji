import {
  BrowserWindow,
  webContents,
  app,
  remote,
  netLog,
  ipcRenderer,
  session,
  dialog, ipcMain
} from 'electron'
import { platform } from "os"
import config from '@config'
import GetHttpData from "../common";
var webWindow = null


//创建一个渲染进程（打开一个页面）
function createMainWindow(url) {
  webWindow = new BrowserWindow({
    title:'模拟器',
    height: 844,
    useContentSize: true,
    width: 390,
    x:1600,
    y:100,
    show: false,
    frame: config.IsUseSysTitle,
    titleBarStyle: platform().includes('win32') ? 'default' : 'hidden',
    webPreferences: {
      enableRemoteModule:true,
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
      devTools: false,
      plugins: true, //是否支持插件
      webviewTag: true, //是否启用 tag标签
      scrollBounce: process.platform === 'darwin',
      sandbox: true,    //沙盒选项,这个很重要
    }
  })
  webWindow.loadURL(url)

  /**
   * 监听网页中http请求，获取请求和响应数据
   */
  GetHttpData(webWindow,2)

  //
  // session.defaultSession.webRequest.onBeforeRequest((e,cl)=>{
  //   let url = e.url;
  //   if(e.method=='POST'){
  //     webContents.fromId(2).send("log","logs",e.method)
  //   }
  //   cl({})
  // })
  //无法看到响应内容
  // //监听请求的信息
  // //将调试器附加到webContents
  // try {
  //   webWindow.webContents.debugger.attach('1.1')
  // } catch (err) {
  //   console.log('调试器连接失败: ', err)
  // }
  // webWindow.webContents.debugger.on('detach', (event, reason) => {
  //   console.log('调试器由于以下原因而分离 : ', reason)
  // })
  // webWindow.webContents.debugger.addListener('message', (event, method, params) => {
  //   if (method === 'Network.responseReceived') {
  //     var mimeType = params.response.mimeType;
  //     if(mimeType !='image/gif' && mimeType !='image/jpeg' && mimeType == 'application/json'){
  //       webContents.fromId(2).send("log",method,params)
  //     }
  //   }
  // })
  // webWindow.webContents.debugger.sendCommand('Network.enable')



  // TODO 未使用
  let cookieInstance = webWindow.webContents.session.cookies;
  webWindow.webContents.on('did-start-loading', function(event, result) {});
  webWindow.webContents.on('did-stop-loading', function(event, result) {
    // 查询与指定 url 相关的所有 cookies.
    // cookieInstance.get({domain:'app.yangkeduo.com'}, (error, cookies) => {}).then(r => {
    //   //向ID为2的渲染进程发送消息
    //   webContents.fromId(2).send("cookie",r)
    // })

  });


  //
  //
  //
  // mainWindow.webContents.debugger.on('message', (event, method, params) => {
  //
  //     console.log(params.response.url);
  //     mainWindow.webContents.debugger.sendCommand('Network.getResponseBody', { requestId: params.requestId }).then(function(response) {
  //       console.log(response);
  //     });
  //
  // })
  //
  // mainWindow.webContents.debugger.sendCommand('Network.enable');
  //
  // let cookieInstance = webContents.session.cookies;
  //
  //
  //
  //
  // webContents.on('did-stop-loading', function(event, result) {
  //   console.log("当 tab 的spinner 结束 spinning的时候.")
  //
  //
  //   cookieInstance.on('changed', (e, cookie, cause, removed) => {
  //     let obj = { e, cookie, cause, removed }
  //     console.log("cookie",cookie);
  //   });
  //   // webContents.on('did-get-response-details', (e, status, url, originalURL, httpResponseCode, requestMethod, referrer, header) => {
  //   //   console.log(header)
  //   // })
  //   // cookieInstance.get({}, (error, cookies) => {
  //   //   console.log("cookies",cookies)
  //   // });
  //   // mainWindow.webContents.debugger.on('message', (event, method, params) => {
  //   //   webContents.on('did-get-response-details', (e, status, url, originalURL, httpResponseCode, requestMethod, referrer, header) => {
  //   //     console.log(header)
  //   //   })
  //   //   if (method === 'Network.responseReceived') {
  //   //
  //   //     console.log('Event: responseReceived ' + params)
  //   //
  //   //
  //   //   }
  //   //
  //   //   if(method === 'Network.webSocketFrameReceived'){
  //   //     console.log(params)
  //   //   }
  //   // })
  // });
  // webContents.on('dom-ready', function(event, result) {
  //   console.log("当指定 frame 中的 文档加载完成的时候发出事件..")
  // });
  //
  // webContents.on('did-finish-load', function(event, result) {
  //   console.log("当导航完成时发出事件，onload 事件也完成.")
  // });
  // webContents.on('did-fail-load', function(event, result) {
  //   console.log("但是是在加载失败或取消加载时发出, 例如， window.stop() 请求结束.错误代码的完整列表和它们的含义都可以在 here 找到")
  // });
  // webContents.on('did-frame-finish-load', function(event, result) {
  //   console.log(webContents.getUserAgent())
  //   // webContents.beginFrameSubscription((e,org)=>{
  //   //   // console.log("beginFrameSubscription",org)
  //   // });
  //   console.log("当一个 frame 导航完成的时候发出事件.")
  // });
  // webContents.on('did-get-response-details', function(event, result) {
  //   console.log("当有关请求资源的详细信息可用的时候发出事件. status 标识了 socket链接来下载资源.")
  // });
  // webContents.on('did-frame-finish-load', function(event, result) {
  //   console.log("当一个 frame 导航完成的时候发出事件.")
  // });
  // webContents.on('did-navigate-in-page', function(event, result) {
  //   console.log("当页内导航发生的时候发出事件当页内导航发生的时候，page 的url 改变，但是不会跳出界面.例如当点击锚链接时或者 DOM 的 hashchange 事件发生")
  // });
  // // webContents.on('login', function(event, result) {
  // //   console.log("当 webContents 想做基本验证的时候发出事件.")
  // // });
  // //关闭模拟器时触发的事件
  // webContents.on('destroyed', function(event, result) {
  //   // console.log(webContents.getUserAgent())
  //   console.log("当 webContents 被删除的时候发出事件.",result)
  // });



  webWindow.webContents.once('dom-ready', () => {
    webWindow.webContents.openDevTools()//打开开发者工具
    webWindow.show()
  })
  webWindow.on('maximize',()=>{
    webWindow.webContents.send("w-max",true)
  })
  webWindow.on('unmaximize',()=>{
    webWindow.webContents.send("w-max",false)
  })
  webWindow.on('closed', () => {
    webWindow = null
    // mainWindow.quit();
  })
  app.whenReady().then(async () => {
    // await netLog.startLogging('log')
    // After some network events
    // const path = await netLog.stopLogging()
    // console.log('网络日志写入', path)
  })

}



function initWindow_web(url) {
  return createMainWindow(url)
}
export default initWindow_web
