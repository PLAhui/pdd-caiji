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
      // test_url:'https://pifa.pinduoduo.com/',
      test_url:'https://shop3v50v56334048.1688.com/page/contactinfo.htm'
    }
  },
  name: "ToolsBar",
  mounted() {




    /**
     * 监听浏览器中cookie变化，存入缓存
     */
    ipcRenderer.on("cookie",(e,res)=>{
      let PDDAccessToken = res.find(v => v.name == "PDDAccessToken")
      if(PDDAccessToken!=null){
        console.log("监听浏览器中cookie变化，存入缓存 PDDAccessToken:",PDDAccessToken.value)
        // this.$message.success("已获取到:PDDAccessToken")
        // localStorage.setItem("PDDAccessToken",PDDAccessToken.value)
      }
    })
    // ipcRenderer.on("GetHttpData",(e, method, params)=>{
    //   if(method.type=='repBody'){
    //     console.log("链接：",method.url, "参数",JSON.parse(params))
        // var s  = 'mtopjsonp2({"v":"1.0"})';
        // s = params;
        // s = s.replace("mtopjsonp1(","");
        // s =s.replace(")","");
        // console.log(params)
        // try{
        //   s = JSON.parse(s)
        //   if(s.api){
        //     console.log(s.data)
        //   }
        // }catch (e) {
        //
        // }


    //   }
    //   // console.log("请求说明：",JSON.stringify(method), "参数",params)
    // })

  },
  methods:{
    test(){
      ipcRenderer.invoke("openPddWindows",{url:this.test_url})
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
