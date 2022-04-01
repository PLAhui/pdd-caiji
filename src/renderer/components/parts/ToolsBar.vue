<template>
<div>
  <el-button @click="open('https://app.yangkeduo.com/')">打开拼夕夕</el-button>
  <el-button  @click="open('http://192.168.2.31/ssrew-web/#/index')">测试自定义协议</el-button>
  <a href="pdd://www.yusouu.com">测试自定义协议</a>
</div>
</template>

<script>
import {ipcMain} from "electron";
import initWindow_web from "../../../main/services/windowManager_web";

const { session ,ipcRenderer} = require('electron')
export default {
  name: "ToolsBar",
  mounted() {
    console.log("页面1",require('electron').remote.getGlobal('sharedObject').someProperty)
    /**
     * 监听浏览器中cookie变化，存入缓存
     */
    ipcRenderer.on("cookie",(e,res)=>{
      let PDDAccessToken = res.find(v => v.name == "PDDAccessToken")
      if(PDDAccessToken!=null){
        this.$message.success("已获取到:PDDAccessToken")
        localStorage.setItem("PDDAccessToken",PDDAccessToken.value)
      }
    })
    ipcRenderer.on("GetHttpData",(e, method, params)=>{
      console.log("请求说明：：",JSON.stringify(method), "参数",params)
    })

  },
  methods:{
     open(url) {
       ipcRenderer.invoke("openPddWindows",{url:url}).then(res => {
         console.log(res)
       });
    },
  }
}
</script>

<style scoped>

</style>
