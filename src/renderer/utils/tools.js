import {ipcRenderer} from "electron";
import {format} from "date-fns";

export default {
  methods: {
    /**
     * 字符串是否包含另一个字符串
     * @param url  完整的字符串
     * @param str 包含的字符串
     * @returns {boolean} true 包含  false 不包含
     */
    strRegExp(url,str){
      if(url.indexOf(str)!= -1){
        return true;
      }
      return false;
    },

    /**
     * 字符串截取
     * @param str  待截取字符串
     * @param start 开始字符串
     * @param end 结束字符串
     */
    interceptStr(str,start,end){
      str = str.substring(str.lastIndexOf(start));
      str =  str.substring(0,str.lastIndexOf(end))
      return str;
    },
    /**
     * 字符过滤
     * @param str
     * @returns {*}
     * @constructor
     */
    StrReplace(str){
      str = str.replace(/\s*/g,"");
      str = str.replace("<dt>", "")
      str = str.replace("</dt>", "")
      str = str.replace("移动电话：", "")
      str = str.replace("\n", "")
      str = str.replace("<dd>", "")
      str = str.replace("</dd>", "")
      str = str.replace("</dl>", "")
      str = str.replace("<dl>", "")
      str = str.replace('class=\"address\">','')
      str = str.replace("membername\"target=\"_blank\">","")
      return str;
    },




    priceTools (price){
      return (price/100).toFixed(2);
    },
    /**
     * 请求异常时的操作
     * 错误提示
     * 清除缓存中的令牌
     * 打开拼多多窗口
     */
    errOperation(msg){
      this.$message.error(msg);
      localStorage.removeItem('PDDAccessToken')
      ipcRenderer.invoke("openPddWindows",{url:process.env.PDD_API})
      localStorage.setItem('task',JSON.stringify(this.TaskConfig))
    },
    //根据状态显示不同类型文本
    tagStatus(status){
      // this.TaskConfig.logs.unshift({value: "1111111111", time: format(new Date(), "HH:mm:ss")})
      if(status=='未执行'){
        return 'info'
      }
      if(status=='已采集'){
        return 'success'
      }
      if(status=='采集异常'){
        return 'danger'
      }
      return 'warning'
    },


    //获取当前任务状态
    CaiJi_Status(){
      if(this.taskConf.task_status){//任务状态 0未启动  1运行中  2已暂停  3已结束  4异常
        if(this.taskConf.task_status == 0){
          this.taskBtn =  {title:'开始采集',status:0,type:"primary" }
        }
        if(this.taskConf.task_status == 1){
          this.taskBtn =   {title:'暂停采集',status:1,type:"success" }
        }
        if(this.taskConf.task_status == 2){
          this.taskBtn =   {title:'继续采集',status:2,type:"warning" }
        }
        if(this.taskConf.task_status == 3){
          this.taskBtn =   {title:'开始采集',status:3,type:"primary" }
        }
        if(this.taskConf.task_status == 4){
          this.taskBtn =   {title:'出现异常，请重新采集',status:4,type:"danger" }
        }
      }else {
        this.taskBtn =   {title:'开始采集',status:0,type:"primary" }
      }
    },
    preview(url){
      this.srcList = [url]
    },

  }
}


