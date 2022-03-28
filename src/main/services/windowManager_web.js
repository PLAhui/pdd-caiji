import {
  BrowserWindow,
  webContents,
  app,
  netLog,
  ipcRenderer,
  dialog
} from 'electron'
import { platform } from "os"
import config from '@config'
var loadWindow = null
var mainWindow = null
const session = require('electron').session;

//创建一个渲染进程（打开一个页面）
function createMainWindow(url) {
  mainWindow = new BrowserWindow({
    title:'模拟器',
    height: 844,
    useContentSize: true,
    width: 390,
    show: false,
    frame: config.IsUseSysTitle,
    titleBarStyle: platform().includes('win32') ? 'default' : 'hidden',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
      devTools: true,
      plugins: true, //是否支持插件
      webviewTag: true, //是否启用 tag标签
      scrollBounce: process.platform === 'darwin',
      sandbox: true,    //沙盒选项,这个很重要
    }
  })
  mainWindow.loadURL(url)

  var webContents = mainWindow.webContents;
  let cookieInstance = webContents.session.cookies;

  webContents.on('did-start-loading', function(event, result) {
    console.log("开始加载")
  });
  webContents.on('did-stop-loading', function(event, result) {
    console.log("结束加载")
    cookieInstance.get({domain:'app.yangkeduo.com'}, (error, cookies) => {
      console.log("cookies", cookies)
    }).then(r => {
      let tarCookie = r.find(v => v.name == "PDDAccessToken")
      console.log("PDDAccessToken 找到啦！！！", tarCookie)
      dialog.showErrorBox('PDDAccessToken 找到啦', tarCookie.value)
    })
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



  mainWindow.webContents.once('dom-ready', () => {

    webContents.openDevTools()//打开开发者工具
    mainWindow.show()
  })
  mainWindow.on('maximize',()=>{
      mainWindow.webContents.send("w-max",true)
  })
  mainWindow.on('unmaximize',()=>{
      mainWindow.webContents.send("w-max",false)
  })
  mainWindow.on('closed', () => {
    mainWindow = null
    // mainWindow.quit();
  })
  app.whenReady().then(async () => {
    await netLog.startLogging('log')
    // After some network events
    const path = await netLog.stopLogging()
    console.log('网络日志写入', path)
  })

}



function initWindow_web(url) {
  return createMainWindow(url)
}
export default initWindow_web