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
    const that = this;
    this.initData()
    /**
     * 监听采集指令
     * 这里收到消息时执行采集
     */
    this.$Bus.$on("CaiJi",async (res) => {
      if (res == 1) {
          await this.sleep(3000);
          this.caiji()
      }else {
        // console.log("暂停采集")
      }
    })
  },
  methods: {
    /**
     * 设置延迟
     * @param ms
     * @returns {Promise<unknown>}
     */
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    },

    /**
     * 点击开始采集按钮
     * 打开模拟器
     */
    start(status){
      // this.caiji()


      console.log("打开模拟器，开始采集数据..")
      //开始采集
      if(status==0) this.CaiJiStatus = 1;
      //暂停采集
      if(status==1) this.CaiJiStatus = 2;
      //状态设置为未采集
      if(status==2) this.CaiJiStatus = 0;

      /**
       * 发送采集指令
       */
      this.$Bus.$emit("CaiJi",this.CaiJiStatus)


    },

    /**
     * 采集数据
     */
    caiji(){
      var  url = "https://hmqh1688.1688.com/page/contactinfo.htm"
      ipcRenderer.invoke("open1688Windows",{url:url})

      // if(this.AlibabaCaiJiData.urls.length!=0){
      //   var item = this.AlibabaCaiJiData.urls[0];
      //   console.log('企业：',item.title,'网址：',item.url)
      //   ipcRenderer.invoke("open1688Windows",{url:item.url})
      // }else {
      //   this.CaiJiStatus = 0
      //   this.$message.error("无采集网址")
      // }
    },




    /**
     * 初始化数据
     * 不存在数据时创建空数据对象
     */
    initData(){
      if(this.AlibabaCaiJiData==null) this.$store.dispatch('SetAlibabCaiJiData',{urls:[],result:[],errorUrls:[]})
      console.log("初始化采集数据...")
    },
    /**
     * 清空采集数据
     */
    clean(){
      this.$store.dispatch('DeleteAlibabaCaiJiData')
    },
    /**
     * 清空采集网址库
     */
    clean1688uRL(){

    },
    /**
     * Excel导入
     * @param convertedData
     */
    handleSelectedFile(convertedData) {
      this.$store.dispatch('InsertAlibabaCaiJiUrl', convertedData.body)
      this.$message.success('导入成功！共:'+convertedData.body.length+"条数据")
    },

    /**
     * 点击上一页
     */
    prevClick() {
      this.current -= 1;
    },
    /**
     * 点击下一页
     */
    nextClick() {
      this.current += 1;
    },

    /**
     * 翻页
     * @param current
     */
    currentClick(current) {
      // this.tableData = [];
      // this.current = current;
      // this.PinDuoDuoCaiJiData[current-1].items.forEach(item=>{
      //   this.tableData.push(item)
      // })
    },

  }
}
