/*
 * @Author: huiziqin
 * @Date: 2022/4/2 00:06
 * @Description: 采集相关配置
 * @FilePath: src/renderer/utils
 */
import {ipcMain, ipcRenderer, webContents} from "electron";
import request from "./request";

export default {
  created() {
    /**
     * 监听浏览器窗口请求和响应的数据
     */
    // ipcRenderer.on("GetHttpData", (e, method, params) => {
    //   if (method.type == 'repBody') {
    //     // console.log("链接：", method.url,'内容',params)
    //     try{
    //       params = params.replace("mtopjsonp1(","");
    //       params =params.replace(")","");
    //       params = JSON.parse(params)
    //       if(params.api){
    //         if(params.data.companyName){
    //           console.log(params.data)
    //           // debugger
    //           params.data['detailUrl']=JSON.parse(localStorage.getItem('tempUrl'))
    //           this.insertData(params.data)
    //         }
    //       }
    //     }catch (e) {
    //       console.error("未获取到数据",e)
    //       // console.error("链接：", method.url,'内容',params)
    //     }
    //   }
    // })
  },


  methods: {
    /**
     * 当获取数据失败时，重新请求
     * @constructor
     */
     GetData(url,token){
        return request({
          url: url,
          method: 'get',
          headers:{AccessToken:token}
        })
      },

    /**
     * 向缓存中写入采集数据
     * @param list
     */
    insertData(data){
      var AlibabaCaijiData = JSON.parse(localStorage.getItem('AlibabaCaijiData'));
      if(AlibabaCaijiData==null){
        AlibabaCaijiData = []
      }

      //是否可以保存
      var isSave = true
      AlibabaCaijiData.forEach(item=>{
        if(item.companyName==data.companyName){
          return false
        }
      })
      if(isSave){ //不存在记录
        AlibabaCaijiData.push(data)
        localStorage.setItem("AlibabaCaijiData",JSON.stringify(AlibabaCaijiData))
        var CaiJiUrlList = JSON.parse(localStorage.getItem('1688List'));
        for(var i=0;i<CaiJiUrlList.length;i++){
          if(CaiJiUrlList[i].url==JSON.parse(localStorage.getItem('tempUrl')).url){
            console.log("移除：",localStorage.getItem('tempUrl'))
            CaiJiUrlList.splice(i,1);
            localStorage.setItem("1688List",JSON.stringify(CaiJiUrlList))
            localStorage.removeItem('tempUrl')
            this.$message.success("采集成功")
            //更新数据
            this.$Bus.$emit('upDataList','')
          }
        }
      }
    },

    /**
     * 清空采集数据
     */
    clean(){
      console.log("清空采集数据")
      localStorage.removeItem('AlibabaCaijiData')
      this.$Bus.$emit('upDataList','')
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
     * 格式化数据
     * list
     * 数据量
     * @param CaiJiList
     */
    initList(CaiJiList){
      // CaiJiList.forEach(item=>{
      //   item.items.forEach(goods=>{
      //     this.list.push(goods.item_data.goods_model)
      //   })
      // })
      // this.total = this.list.length;
    },

    // Excel导入
    handleSelectedFile(convertedData) {
      this.CaiJiUrlList = convertedData.body;
      localStorage.setItem("1688List",JSON.stringify(convertedData.body))
      this.$message.success('导入成功！共:'+convertedData.body.length+"条数据")
    },

  }
}
