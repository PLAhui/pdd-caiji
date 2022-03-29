<template>
<div>
  <el-button id="btn_submit" @click="open('https://app.yangkeduo.com/')">打开拼夕夕</el-button>
</div>
</template>

<script>
import {ipcMain} from "electron";
import initWindow_web from "../../../main/services/windowManager_web";

const { session ,ipcRenderer} = require('electron')
export default {
  name: "ToolsBar",
  mounted() {
    /**
     * 监听浏览器中cookie变化
     */
    ipcRenderer.on("cookie",(e,res)=>{
      let PDDAccessToken = res.find(v => v.name == "PDDAccessToken")
      if(PDDAccessToken!=null){
        this.$message.success("已获取到:PDDAccessToken")
        localStorage.setItem("PDDAccessToken",PDDAccessToken.value)
      }

    })
    ipcRenderer.on("log",(e, method, params)=>{
      console.log("请求方法：",method, "参数",params)
    })

  },
  methods:{
     open(url) {
       ipcRenderer.invoke("test",{url:url}).then(res => {
          console.log(res)
       });
    },
  }
}
</script>

<style scoped>

</style>
