/*
 * @Author: huiziqin
 * @Date: 2022/4/2 00:06
 * @Description: 拼多多采集相关配置
 * @FilePath: src/renderer/utils
 */
import {ipcMain, ipcRenderer, webContents} from "electron";
import request from "../utils/request";

export default {
  created() {

  },


  methods: {

    /**
     * 清空采集数据
     */
    clean(){
      this.tableData=[]
      this.$store.dispatch('DeleteCarZoneCaiJiData')
    },

    //点击上一页
    prevClick() {
      this.current -= 1;
    },
    //点击下一页
    nextClick() {
      this.current += 1;
    },

    /**
     * 点击开始采集按钮
     * 打开模拟器
     */
    start(){
      console.log("打开模拟器，开始采集数据..")
      ipcRenderer.invoke("openPddWindows",{url:process.env.CarZone_API})
    },

    /**
     * 初始化数据
     * 不存在数据时创建空数据对象
     */
    initData(){
      if(this.SetCarZoneCaiJiData==null) this.$store.dispatch('SetCarZoneCaiJiData',[])
      console.log("初始化采集数据...",this.CarZoneCaiJiData)
      if (this.CarZoneCaiJiData.length!=0){
        this.tableData = this.CarZoneCaiJiData[0].items
      }
    },
    //翻页
    currentClick(current) {
      this.tableData = [];
      this.current = current;
      this.CarZoneCaiJiData[current-1].items.forEach(item=>{
        this.tableData.push(item)
      })
    },

  }
}
