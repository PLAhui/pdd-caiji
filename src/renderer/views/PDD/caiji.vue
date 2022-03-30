<!--拼多多采集配置-->
<template>
  <div class="app-container">
   <!--采集配置-->
    <el-form ref="conf" :inline="true" :model="conf" :rules="rules" label-width="80px" size="mini" style="">
      <el-form-item label="关键词" prop="keyword">
        <el-input v-model="conf.keyword" size="mini" style="width: 130px;"/>
      </el-form-item>
      <el-form-item label="搜索条件" prop="filter">
        <el-input v-model="conf.filter" size="mini" style="width: 130px;"/>
      </el-form-item>
      <el-form-item label="开始页" prop="startPageNum">
        <el-input-number v-model="conf.startPageNum" size="mini" style="width: 130px;"/>
      </el-form-item>
      <el-form-item label="结束页" prop="endPageNum">
        <el-input-number v-model="conf.endPageNum" size="mini" style="width: 130px;"/>
      </el-form-item>
      <el-form-item style="">
        <el-button style="width: 130px;" @click="createTask">生成采集任务</el-button>
      </el-form-item>
    </el-form>

    <!--采集日志-->
    <ul class="infinite-list" style="overflow:auto">
      <div v-if="Logs.length==0">暂无日志</div>
      <li v-for="(item,index) in Logs" :key="index" :class="{Logli:true,info:item.type=='info'}">
        <div>
          <span>{{item.value}}</span>
          <span style="float: right">{{item.time}}</span>
        </div>
      </li>
    </ul>


    <el-row style="margin-top: 20px">
      <el-col :span="12">
        <el-button style="width: 100px" type="primary" icon="el-icon-search" @click="startCaiJi">采集</el-button>
      </el-col>
      <!--采集任务展示-->
      <el-col :span="12">
        <ul class="infinite-list-task" style="overflow:auto">
          <div v-if="TaskConfig==null">暂无任务</div>
          <li  v-else v-for="(item,index) in TaskConfig.url" :key="index" style="margin: 10px;list-style-type:none;">
            <div>
              <span>{{index+1}}:</span>
              <span>关键词:{{item.keyword}}</span>
              <span style="padding:0 10px;">搜索条件:{{item.filter}}</span>
              <span>页码:{{item.current}}</span>
              <span style="float: right"><el-tag size="mini" :type="tagStatus(item.status)">{{item.status}}</el-tag></span>
            </div>
          </li>
        </ul>
      </el-col>
    </el-row>



  </div>
</template>

<script>
import tools from "@/utils/tools";
import {format} from "date-fns";
import {ipcRenderer} from "electron";
import {qryData} from "@/api/api";

export default {
  mixins: [tools],
  data: () => {
    return {
      rules: {
        keyword: [
          {required: true, message: '请输入关键词', trigger: 'blur'},
        ],
        filter: [
          {required: true, message: '请输入搜索条件', trigger: 'blur'},
        ],
        endPageNum: [
          {required: true, message: '请输入结束页', trigger: 'blur'},
        ],
        startPageNum: [
          {required: true, message: '请输入开始页', trigger: 'blur'},
        ],
      },
      conf: {
        keyword: "充电宝",//关键词
        filter: "price,10,30",//搜索条件
        endPageNum: 2,//结束页
        startPageNum: 1,//开始页
      },
      TaskConfig:null,//采集的配置
    }
  },
  computed: {
    //采集日志
    Logs: function () {
      if(this.TaskConfig!=null){
        return this.TaskConfig.logs
      }else{
        return []
      }
    }
  },
  mounted() {

  },

  methods: {
    /**
     * 生成采集任务
     */
    createTask() {
      const that = this;
      this.$refs.conf.validate((valid) => {
        if (valid) {//校验参数是否正确
          const taskConf = {"id": '1', "task_status": 1, "config": this.conf, "url": [], "data": [], "logs": []};
          /**
           * 生成采集任务配置
           */
          taskConf.logs.unshift({value: "开始生成采集配置", time: format(new Date(), "HH:mm:ss")})
          that.TaskConfig = taskConf;
          for (let i = that.conf.startPageNum; i <= that.conf.endPageNum; i++) {
            const item = {
              status: '未执行',
              filter: that.conf.filter,
              keyword: that.conf.keyword,
              current: i
            };
            taskConf.url.push(item)
          }
          taskConf.logs.unshift({value: "采集配置生成完毕", time: format(new Date(), "HH:mm:ss")})
          that.TaskConfig = taskConf;
          localStorage.setItem('task', JSON.stringify(taskConf))
        }
        this.$message.success("生成采集任务")
      })
    },
    /**
     * 开始采集
     * 手动翻页采集
     */
    startCaiJi(){
      try{
        var isOver = true;
        this.TaskConfig.url.some((item)=>{
          if(item.status=='未执行' || item.status == '采集异常'){
            isOver = false;
            this.TaskConfig.logs.unshift({value: "当前采集的页码为:"+item.current, time: format(new Date(), "HH:mm:ss")})
            //发送http请求获取数据
            const status = this.getData(item);
            console.log("status",status)
            return true; //跳出循环
          }
        })
        //判断是否已经采集完
        if (isOver){
          this.TaskConfig.logs.unshift({value: "采集已完成，共 "+this.TaskConfig.data.length+' 页数据', time: format(new Date(), "HH:mm:ss")})
          this.$message.success("采集已完成")
        }
      }catch (e) {
        this.$message.error("请先生成采集任务")
      }
    },

    /**
     * 请求接口获取采集数据
     * @param data
     */
    getData(data){
      const that = this;
      try {
        qryData(data).then((res)=>{
          //令牌失效的时候
          if(res.status!=200){
            data.status = "采集异常"
            this.TaskConfig.logs.unshift({status:false,value: "令牌失效，请通过操作拼多多窗口获取新令牌", time: format(new Date(), "HH:mm:ss")})
            this.errOperation('令牌失效，请通过操作拼多多窗口获取新令牌');
            return false;
          }
          data.status = "已采集"
          this.TaskConfig.logs.unshift({status:true,value: "第 "+data.current+"页 已采集", time: format(new Date(), "HH:mm:ss")})
          const {items} = res.data
          this.TaskConfig.data.push({list: items, config: data})
          localStorage.setItem('task',JSON.stringify(this.TaskConfig))
          return  true;
        }).catch((e)=>{
          data.status = "采集异常"
          this.TaskConfig.logs.unshift({status:false,value: "请求被官方限制了，需重新登录", time: format(new Date(), "HH:mm:ss")})
          this.errOperation('请求被官方限制了，需重新登录');
          return false;
        })
      }catch (e) {
        data.status = "采集异常"
        this.TaskConfig.logs.unshift({status:false,value: "请求被官方限制了，需重新登录", time: format(new Date(), "HH:mm:ss")})
        this.errOperation('请求被官方限制了，需重新登录');
        return false;
      }
    },




  }
}

</script>
<style lang="scss">
.app-container {
  //box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1)
}
.infinite-list{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 20px;
  height: 200px;
  color: #000000;
  background-color: rgb(247, 247, 247);
}
.infinite-list-task{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 20px;
  height: 300px;
  color: #000000;
  font-size: 12px;
  background-color: rgb(247, 247, 247);
}
.Logli{
  font-size: 12px;
  opacity: 0.8;padding: 5px;margin: 1px;border-radius: 5px
}
.info{
  background-color: #c3c2c2;
}
.error{
  background-color: #d81b1b;
}
.warning{
  background-color: rgba(255, 225, 108, 0.96);
}
</style>
