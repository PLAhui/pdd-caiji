<!--拼多多采集配置-->
<template>
  <div class="app-container">

    <el-row style="margin: 0px 10px 10px 10px">
     <el-col>
       <el-steps :active="step" :space="500"  finish-status="success" align-center>
         <el-step title="配置采集任务" description="填写关键词，搜索条件，采集页码，点击生成任务"></el-step>
         <el-step title="采集数据" description="点击采集按钮，采集分页数据"></el-step>
         <el-step title="导出数据" description="采集完成后在【拼多多数据】菜单可预览，导出数据"></el-step>
       </el-steps>
     </el-col>
    </el-row>

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
      <el-select v-model="conf.sort" placeholder="请选择排序条件" size="mini" clearable>
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-form-item style="">
        <el-button style="width: 130px;" @click="createTask">生成采集任务</el-button>
      </el-form-item>
    </el-form>


    <!--采集日志-->
    <ul class="infinite-list" style="overflow:auto">
      <div v-if="Logs.length==0">暂无日志</div>
      <li v-for="(item,index) in Logs" :key="index" :class="{Logli:true,error:item.status==false,success:item.status==true}">
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
              <span style="float: right">
                <el-tag size="mini" :type="tagStatus(item.status)" @click="retry(item)">{{item.status}}</el-tag>
                <el-tag v-if="item.status=='采集异常'" @click="retry(item)" size="mini" type="" style=" cursor:pointer;">重试</el-tag>
              </span>
            </div>
          </li>
        </ul>
      </el-col>
    </el-row>
<!--    sort: price  低到高-->

<!--    sort: _price  高到低-->

<!--    sort: _sales-->


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
      step: 0,//当前步骤
      options: [{label: '【价格】从低到高', value: 'price'},{label: '【价格】从高到低', value: '_price'}],
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
        sort:'default',
        keyword: "充电宝",//关键词
        filter: "price,0,10,custom",//搜索条件
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
              sort:that.conf.sort==''?'default':that.conf.sort,
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
        this.step = 1;
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
            this.getData(item);
            return true; //跳出循环
          }
        })
        //判断是否已经采集完
        if (isOver){
          this.TaskConfig.logs.unshift({value: "采集已完成，共 "+this.TaskConfig.data.length+' 页数据', time: format(new Date(), "HH:mm:ss")})
          this.$message.success("采集已完成")
          this.step = 2;
          this.TaskConfig.task_status = 200;//采集完成
          localStorage.setItem('task',JSON.stringify(this.TaskConfig))
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
      const loading = this.$loading({lock: true, text: '正在采集数据...', spinner: 'el-icon-loading', background: 'rgba(0, 0, 0, 0.7)'});
      try {
        qryData(data).then((res)=>{
          console.log(res)
          loading.close();
          //令牌失效的时候
          if(res.data.error_code==54001){
            loading.close();
            data.status = "采集异常"
            this.TaskConfig.logs.unshift({info:data, status:false,value: "令牌失效，请通过操作拼多多窗口获取新令牌", time: format(new Date(), "HH:mm:ss")})
            this.errOperation('令牌失效，请通过操作拼多多窗口获取新令牌');
            return false;
          }
          data.status = "已采集"
          this.TaskConfig.logs.unshift({status:true,value: "第 "+data.current+"页 已采集", time: format(new Date(), "HH:mm:ss")})
          const {items} = res.data
          this.TaskConfig.data.push({list: items, config: data})
          localStorage.setItem('task',JSON.stringify(this.TaskConfig))
          this.$notify({
            title: '采集成功',
            message:"第 "+data.current+"页 已采集"
          });
          return  true;
        }).catch((e)=>{
          loading.close();
          data.status = "采集异常"
          this.TaskConfig.logs.unshift({info:data, status:false,value: "请求被官方限制了，需重新登录", time: format(new Date(), "HH:mm:ss")})
          this.errOperation('请求被官方限制了，需重新登录');
          return false;
        })
      }catch (e) {
        loading.close();
        data.status = "采集异常"
        this.TaskConfig.logs.unshift({info:data, status:false,value: "请求被官方限制了，需重新登录", time: format(new Date(), "HH:mm:ss")})
        this.errOperation('请求被官方限制了，需重新登录');
        return false;
      }
    },

    /**
     * 采集失败时
     * 重试采集
     */
    retry(info){
      this.getData(info);
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
  //background-color: rgb(247, 247, 247);
}
.infinite-list-task{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 20px;
  height: 300px;
  color: #000000;
  font-size: 12px;
  //background-color: rgb(247, 247, 247);
}
.Logli{
  font-size: 12px;
  opacity: 0.8;padding: 5px;margin: 1px;border-radius: 5px
}
.info{
  background-color: #c3c2c2;
}
.error{
  color: #fff;
  background-color: #d81b1b;
}
.warning{
  background-color: rgba(255, 225, 108, 0.96);
}
.success{
  background-color: #2dc26b;
  color: #fff;
}
</style>
