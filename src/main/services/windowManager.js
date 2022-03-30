import { BrowserWindow, Menu, app } from 'electron'
import { platform } from "os"
import menuconfig from '../config/menu'
import config from '@config'
import setIpc from './ipcMain'
import { winURL, loadingURL } from '../config/StaticPath'

var loadWindow = null
var mainWindow = null
setIpc.Mainfunc(config.IsUseSysTitle)

//创建一个渲染进程（打开一个页面）
function createMainWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    title:'采集器',
    height: 900,
    useContentSize: true,
    width: 1400,
    minWidth: 600,
    show: false,
    frame: config.IsUseSysTitle,
    titleBarStyle: platform().includes('win32') ? 'default' : 'hidden',
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
      // 如果是开发模式可以使用devTools
      // devTools: process.env.NODE_ENV === 'development',
      devTools: true,
      // 在macos中启用橡皮动画
      scrollBounce: process.platform === 'darwin'
    }
  })
  // 这里设置只有开发环境才注入显示开发者模式
  // if (process.env.NODE_ENV === 'development') {
  menuconfig.push({
      label: '开发者设置',
      submenu: [{
        label: '切换到开发者模式',
        accelerator: 'CmdOrCtrl+I',
        role: 'toggledevtools'
      }]
    })
  // }
  menuconfig.push({
    label: '编辑',
    submenu: [
      { label: '剪切', accelerator: 'CmdOrCtrl+X', selector: 'cut:' },
      { label: '复制', accelerator: 'CmdOrCtrl+C', selector: 'copy:' },
      { label: '粘贴', accelerator: 'CmdOrCtrl+V', selector: 'paste:' },
      { label: '全选', accelerator: 'CmdOrCtrl+A', selector: 'selectAll:' }
    ]
  })

  // 载入菜单
  Menu.setApplicationMenu(Menu.buildFromTemplate(menuconfig))
  mainWindow.loadURL(winURL)





  mainWindow.webContents.once('dom-ready', () => {
    mainWindow.show()
    if (process.env.NODE_ENV === 'development') mainWindow.webContents.openDevTools(true)
    if (config.UseStartupChart) loadWindow.destroy()
  })
  mainWindow.on('maximize',()=>{
      mainWindow.webContents.send("w-max",true)
  })
  mainWindow.on('unmaximize',()=>{
      mainWindow.webContents.send("w-max",false)
  })
  mainWindow.on('closed', () => {
    mainWindow = null
    app.quit();
  })
}

function loadingWindow() {
  loadWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    backgroundColor: '#222',
    skipTaskbar: true,
    transparent: true,
    resizable: false,
    webPreferences: { experimentalFeatures: true }
  })

  loadWindow.loadURL(loadingURL)

  loadWindow.show()

  setTimeout(() => {
    createMainWindow()
  }, 2000)

  loadWindow.on('closed', () => {
    loadWindow = null
  })
}

function initWindow() {
  if (config.UseStartupChart) {
    return loadingWindow()
  } else {
    return createMainWindow()
  }
}
export default initWindow
