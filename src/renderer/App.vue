<template>
  <div id="app">
    <c-header></c-header>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import CHeader from "./components/title";
import {ipcRenderer} from "electron";
export default {
  components: { CHeader },
  data: () => {
    return{
      requestUrlList:[],//请求是数链接数据  用于响应内容和请求参数关联
    }
  },
  mounted() {

    /**
     * 打印主进程中的异常消息
     */
    ipcRenderer.on("logs",(e,msg,data)=>{
      console.error(JSON.stringify(msg),JSON.stringify(data))
    })
    /**
     * 监听http请求的数据
     * 使用bus总线将消息发送给需要的地方
     */
    ipcRenderer.on("GetHttpData",(e, method, params)=>{
      if(method.type=='repBody'){
        this.requestUrlList.forEach(item=>{
          if(item.params.requestId == method.params.requestId){
            try{
              params = JSON.parse(params)
            }catch (e) {
              params = params
            }
            item.ResponseBody = params
            this.$Bus.$emit("httpData",item)
          }
        })
      }
      if(method.type=='responseReceived'){
        this.requestUrlList.push({url:method.url,params:params})
      }
    })

    /**
     * TODO 未使用
     * 监听浏览器中cookie变化，存入缓存
     */
    // ipcRenderer.on("cookie",(e,res)=>{
    //   // let PDDAccessToken = res.find(v => v.name == "PDDAccessToken")
    //   // if(PDDAccessToken!=null){
    //     // console.log("监听浏览器中cookie变化，存入缓存 PDDAccessToken:",PDDAccessToken.value)
    //     // this.$message.success("已获取到:PDDAccessToken")
    //     // localStorage.setItem("PDDAccessToken",PDDAccessToken.value)
    //   // }
    // })
  }
}
</script>

<style>
/* CSS */
</style>
