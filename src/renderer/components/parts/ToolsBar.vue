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
    ipcRenderer.on("cookie",(e,res)=>{
      console.log("cookie",res)
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
