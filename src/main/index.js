'use strict'

import {net,app, BrowserView,session, BrowserWindow, dialog, ipcMain,netLog,protocol} from 'electron'
import initWindow from './services/windowManager'
import DisableButton from './config/DisableButton'
import electronDevtoolsInstaller, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import initWindow_web from "./services/windowManager_web";

global.sharedObject = {
  winId:0,//打开的web窗口ID
}



//TODO 自定义协议

// const agreement = 'pdd' // 自定义协议名
// // 注册自定义协议
// function setDefaultProtocol() {
//   let isSet = false // 是否注册成功
//   app.removeAsDefaultProtocolClient(agreement) // 每次运行都删除自定义协议 然后再重新注册
//   // 开发模式下在window运行需要做兼容
//   if (process.env.NODE_ENV === 'development' && process.platform === 'win32') {
//     // 设置electron.exe 和 app的路径
//     isSet = app.setAsDefaultProtocolClient(agreement, process.execPath, [
//       path.resolve(process.argv[1]),
//     ])
//   } else {
//     isSet = app.setAsDefaultProtocolClient(agreement)
//   }
//   console.log('协议是否注册成功', isSet)
// }
// setDefaultProtocol()
// // 验证是否为自定义协议的链接
// const AGREEMENT_REGEXP = new RegExp(`^${agreement}://`)
// // 监听自定义协议唤起
// function watchProtocol() {
//   // mac唤醒应用 会激活open-url事件 在open-url中判断是否为自定义协议打开事件
//   app.on('open-url', (event, url) => {
//     const isProtocol = AGREEMENT_REGEXP.test(url)
//     if (isProtocol) {
//       console.log('获取协议链接, 根据参数做各种事情,自定义协议链接:',url)
//     }
//   })
//   // window系统下唤醒应用会激活second-instance事件 它在ready执行之后才能被监听
//   app.on('second-instance', (event, commandLine) => {
//     // commandLine 是一个数组， 唤醒的链接作为数组的一个元素放在这里面
//     commandLine.forEach(str => {
//       if (AGREEMENT_REGEXP.test(str)) {
//         console.log('获取协议链接, 根据参数做各种事情')
//         dialog.showMessageBox({
//           type: 'info',
//           message: 'window protocol 自定义协议打开',
//           detail: `自定义协议链接:${str}`,
//         })
//       }
//     })
//   })
// }
//
// app.on('ready', function() {
//   watchProtocol()
//   console.log('监听成功')
// })
// end 自定义协议







function onAppReady () {
  if(!net.online){
    dialog.showErrorBox(
        '错误',
        "未连接网络"
    )
  }





  initWindow()
  // initWindow_web()
  DisableButton.Disablef12()
  if (process.env.NODE_ENV === 'development') {
    electronDevtoolsInstaller(VUEJS_DEVTOOLS)
      .then((name) => console.log(`installed: ${name}`))
      .catch(err => console.log('Unable to install `vue-devtools`: \n', err))
  }

}



//禁止程序多开，此处需要单例锁的同学打开注释即可
// const gotTheLock = app.requestSingleInstanceLock()
// if(!gotTheLock){
//   app.quit()
// }
app.isReady() ? onAppReady() : app.on('ready', onAppReady)
// 解决9.x跨域异常问题
app.commandLine.appendSwitch('disable-features', 'OutOfBlinkCors')
app.on("test",(event,status)=>{
  console.log("renderer-data::"+status);
})
app.on('window-all-closed', () => {
  // 所有平台均为所有窗口关闭就退出软件
  app.quit()
})
app.on('browser-window-created', () => {})

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.removeAsDefaultProtocolClient('极简电商采集器')
    console.log('有于框架特殊性开发环境下无法使用')
  }
} else {
  app.setAsDefaultProtocolClient('极简电商采集器')
}
