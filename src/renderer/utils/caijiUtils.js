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
    ipcRenderer.on("GetHttpData", (e, method, params) => {
      if (method.type == 'repBody') {
        console.log("链接：", method.url)
       try{
          if(JSON.parse(params).data=='抛出异常'){
            console.error(params)
            var paramsJson = JSON.parse(params)
            try {
              if(paramsJson.msg.url){
                this.GetData(paramsJson.msg.url,paramsJson.msg.AccessToken).then(res=>{
                  console.log(res.data)
                  if(res.data.items){
                    this. insertData(res.data)
                  }
                })
              }
            }catch (e) {}
          }else {
            const data = JSON.parse(params);
            console.log(data)
          }
       }catch (e) {
         console.error(e)
       }
      }
    })
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
    insertData(list){
      var {items,p_search} =list;
      var CaiJiList = JSON.parse(localStorage.getItem('CaiJiList'));
      CaiJiList.push({items,page:p_search.page})
      localStorage.setItem("CaiJiList",JSON.stringify(CaiJiList))
      this.$message.success("采集到"+list.items.length+"条数据")
      //更新数据
      this.$Bus.$emit('upDataList','')
    },

    /**
     * 清空采集数据
     */
    clean(){
      console.log("清空采集数据")
      localStorage.removeItem('CaiJiList')
      this.list = [];
      this.tableData = [];
      //更新数据
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
      CaiJiList.forEach(item=>{
        item.items.forEach(goods=>{
          this.list.push(goods.item_data.goods_model)
        })
      })
      this.total = this.list.length;
    }

  }
}
