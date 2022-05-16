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
    height: 400,
    useContentSize: true,
    width: 400,
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

  GetHttpData(webWindow,2)

  /**
   * 监听网页中http请求，获取请求和响应数据
   */


  let cookieInstance = webWindow.webContents.session.cookies;
  webWindow.webContents.on('did-start-loading', function(event, result) {});
  webWindow.webContents.on('did-stop-loading', function(event, result) {
    // 查询与指定 url 相关的所有 cookies.
    cookieInstance.get({domain:'app.yangkeduo.com'}, (error, cookies) => {}).then(r => {
      //向ID为2的渲染进程发送消息
      // webContents.fromId(2).send("cookie",r)
    })

  });



  webWindow.webContents.once('dom-ready', () => {
    global.sharedObject.winId_alibaba.push(webWindow.id); //将窗口ID放入全局变量
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
    console.log("closed webWindow")
    global.sharedObject.winId_alibaba=[]
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



function alibaba_web(url) {
  return createMainWindow(url)
}
export default alibaba_web
