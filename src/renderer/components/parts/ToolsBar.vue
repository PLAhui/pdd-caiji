<template>
<div>
<!--  <el-button @click="open('https://app.yangkeduo.com/')">打开拼夕夕</el-button>-->


  <el-input v-model="test_url" placeholder="请输入网址" size="mini" style="width: 300px"></el-input>
  <el-button  @click="test()">测试监听http请求</el-button>

</div>
</template>

<script>
import {ipcMain} from "electron";
import initWindow_web from "../../../main/services/windowManager_web";

const { session ,ipcRenderer} = require('electron')
export default {
  data: () => {
    return{
      test_url:'https://pifa.pinduoduo.com/',
    }
  },
  name: "ToolsBar",
  mounted() {

  },
  methods:{
    test(){
      ipcRenderer.invoke("openPddWindows",{url:this.test_url}).then(res => {
        console.log(res)
      });
    },
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
