/*
 * @Author: huiziqin
 * @Date: 2022/4/2 00:06
 * @Description: 拼多多采集相关配置
 * @FilePath: src/renderer/utils
 */
import {ipcMain, ipcRenderer, webContents} from "electron";
import request from "../utils/request";

export default {
  methods: {
    /**
     * 初始化数据
     * 不存在数据时创建空数据对象
     */
    initData(){
      console.log(this.AlibabaCaiJiData)
      if(this.AlibabaCaiJiData==null) this.$store.dispatch('SetAlibabCaiJiData',{urls:[]})
      console.log("初始化采集数据...",this.AlibabaCaiJiData)
    },
    /**
     * 清空采集数据
     */
    clean(){
      this.tableData=[]
      this.$store.dispatch('DeleteAlibabaCaiJiData')
    },



    /**
     * Excel导入
     * @param convertedData
     */
    handleSelectedFile(convertedData) {
      this.$store.dispatch('InsertAlibabaCaiJiUrl', convertedData.body)
      this.$message.success('导入成功！共:'+convertedData.body.length+"条数据")
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
      ipcRenderer.invoke("openPddWindows",{url:process.env.PDD_API})
    },


    //翻页
    currentClick(current) {
      this.tableData = [];
      this.current = current;
      this.PinDuoDuoCaiJiData[current-1].items.forEach(item=>{
        this.tableData.push(item)
      })
    },

  }
}
