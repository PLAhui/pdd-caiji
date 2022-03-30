<!--拼多多采集数据页-->
<template>
  <div class="app-container">
    <el-row :gutter="24" type="flex" class="row-bg" justify="end">
      <el-col :span="3">
        <el-popover
            v-if="taskBtn.status==1 || taskBtn.status==4 || taskBtn.status==2"
            placement="top"
            width="200"
            trigger="hover">
          <p>采集控制面板</p>
          <div style="text-align: left; margin: 0">
            <el-row :gutter="20">
              <el-col :span="12"><el-button size="mini" :type="taskBtn.title=='继续采集'?'success':'warning'" @click="tackClick">{{taskBtn.title}}</el-button></el-col>
              <el-col :span="12"> <el-button size="mini"  type="info" @click="stopTask" v-if="taskBtn.status != 0">结束采集</el-button></el-col>
            </el-row>
          </div>
          <el-button slot="reference" :type="taskBtn.type">{{taskBtn.status==1?'正在采集':taskBtn.title}}</el-button>
        </el-popover>
        <el-button v-else @click="tackClick" :type="taskBtn.type">{{taskBtn.title}}</el-button>


      </el-col>
      <el-col :span="6"  class="logs">
        <ul class="infinite-list logs" style="overflow:auto">
          <li v-for="item in taskConf.logs" class="infinite-list-item" style="margin: 5px 0">
            <span style="float: left">{{item.value}}</span>
            <span style="float: right">{{item.time}}</span>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <el-form :model="conf" :rules="rules" ref="conf" :inline="true" size="mini" label-width="80px" >
          <el-form-item label="关键词" prop="keyword">
            <el-input v-model="conf.keyword"  size="mini" style="width: 130px;"/>
          </el-form-item>
          <el-form-item label="搜索条件" prop="filter" >
            <el-input v-model="conf.filter"  size="mini" style="width: 130px;"/>
          </el-form-item>
          <el-form-item label="开始页" prop="startPageNum" >
            <el-input-number v-model="conf.startPageNum"  size="mini"/>
          </el-form-item>
          <el-form-item label="结束页" prop="endPageNum" >
            <el-input-number v-model="conf.endPageNum"  size="mini"/>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="3">
        <el-button style="float: right" type="primary" icon="el-icon-tickets" @click="outData">导出</el-button>
      </el-col>
    </el-row>



    <el-table :data="tableData" border height="600" highlight-current-row :empty-text="emptyText"  tooltip-effect="dark" v-loading="loading">
      <el-table-column type="index"   label="序号"  width="50"></el-table-column>
      <el-table-column label="店铺ID" prop="mall_id" width="120"></el-table-column>
      <el-table-column label="商品ID" prop="goods_id" width="150"></el-table-column>
      <el-table-column label="商品标题" show-overflow-tooltip prop="goods_name" width="220"></el-table-column>
      <el-table-column label="缩略图" width="125">
        <template slot-scope="scope">
          <el-image @click="preview(scope.row.thumb_url)" style="width: 100px; height: 100px" :src="scope.row.thumb_url" :preview-src-list="srcList"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="拼单价格" width="100">
        <template slot-scope="scope">
          <span>{{priceTools(scope.row.price)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="原价" width="100">
        <template slot-scope="scope">
          <span>{{priceTools(scope.row.market_price)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="单独购买价" width="100">
        <template slot-scope="scope">
          <span>{{priceTools(scope.row.normal_price)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="已拼数量" prop="sales" width="100"></el-table-column>
      <el-table-column label="详情链接">
        <template slot-scope="scope">
          <a :href="baseUrl+'/'+scope.row.link_url" target="_blank" style="color: #0080ff">查看商品详情</a>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="pagination"
        background :page-size="pageSize"
        layout="prev, pager, next"
        @prev-click="prevClick"
        @current-change="currentClick"
        @next-click="nextClick"
        :total="total">
    </el-pagination>

    <BottomBar/>
  </div>
</template>

<script>
import taskConfig from '@/config/task_config.json'
import {qryData} from "@/api/api";
import tools from "@/utils/tools";
import BottomBar from "../../components/parts/BottomBar";
import {format} from "date-fns";
import {ipcRenderer} from "electron";
export default {
  mixins:[tools],
  data: () => {
    return {
      taskConf:{},//采集任务配置
      taskBtn: {title:'开始采集',status:0,type:"primary" },//采集按钮显示及状态
      logs:[{value:'未开始采集',time:''}],
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
        endPageNum:2,//结束页
        startPageNum:1,//开始页
      },
      errorText:'令牌失效，请打开搜索页，滑动验证后继续',
      emptyText:'点击开始采集按钮，开始...',
      loading:false,
      baseUrl:process.env.PDD_API,
      PDDAccessToken:localStorage.getItem("PDDAccessToken"),
      tableData: [],
      srcList:[],
      pageSize:20,//每页数据量
      total:0,//总记录数
      current:1,//当前页
      speed:[5000,12000],//采集请求速度随机（毫秒）

    }
  },

  components: {BottomBar},
  mounted() {
    // console.log(taskConfig)
    if(this.PDDAccessToken==null){
      ipcRenderer.invoke("openPddWindows",{url:process.env.PDD_API}).then(res => {
        console.log(res)
      });
      return;
    }
    // if(localStorage.getItem("CJ_Data")){
    //   this.CJ_Data=JSON.parse(localStorage.getItem("CJ_Data"))
    //   this.tableData = this.CJ_Data.cj_list[0].list
    //   this.CJ_Data.cj_list.forEach(item=>{
    //     this.total = this.total +item.list.length
    //   })
    // }
    this.conf.AccessToken = this.PDDAccessToken;
  },

  methods: {

    currentClick(current){
      this.current = current;
      this.tableData = this.CJ_Data.cj_list[this.current-1].list
      // const {AccessToken,filter,keyword} = this.conf;
      // this.getData({AccessToken,filter,keyword,current:this.current})
    },
    prevClick(){
      this.current -=1;
      this.tableData = this.CJ_Data.cj_list[this.current-2].list
      // const {AccessToken,filter,keyword} = this.conf;
      // this.getData({AccessToken,filter,keyword,current:this.current})
    },
    nextClick(){
      this.current  +=1;
      this.tableData = this.CJ_Data.cj_list[this.current].list
      // const {AccessToken,filter,keyword} = this.conf;
      // this.getData({AccessToken,filter,keyword,current:this.current})
    },
    preview(url){
      this.srcList = [url]
    },
    /**
     * 任务按钮点击事件
     */
    tackClick(){
      var that = this;
      //任务状态 0未启动  1运行中  2已暂停  3已结束  4异常
      if(this.taskConf.task_status==1){//暂停采集
        this.$confirm('是否暂停采集?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {this.taskConf.task_status = 2;this.CaiJi_Status();this.$message({type: 'success', message: '任务已暂停!'});
          that.taskConf.logs.unshift({value:"任务已暂停",time:format(new Date(), "HH:mm:ss")})
          localStorage.setItem('task',JSON.stringify(that.taskConf))
        }).catch(() => {});
      }else if(this.taskConf.task_status==2){//继续采集
        this.$confirm('是否继续采集?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
        }).then(() => {this.taskConf.task_status =1;this.CaiJi_Status();this.$message({type: 'success', message: '任务已继续!'});
          that.taskConf.logs.unshift({value:"任务已继续",time:format(new Date(), "HH:mm:ss")})
          localStorage.setItem('task',JSON.stringify(that.taskConf))
        }).catch(() => {});
      }
      else {
        this.start()
      }
    },
    //停止任务
    stopTask(){
      var that = this;
      this.$confirm('是否停止采集?', '提示', {confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
      }).then(() => {this.taskConf.task_status =3;this.CaiJi_Status();this.$message({type: 'success', message: '任务已停止!'});
        that.taskConf.logs.unshift({value:"任务已停止",time:format(new Date(), "HH:mm:ss")})
        localStorage.setItem('task',JSON.stringify(that.taskConf))
      }).catch(() => {});

    },


    //开始采集
    start(){
      var that = this;
      this.$refs.conf.validate((valid) => {if(valid) {//校验参数是否正确
        const taskconf = {"id": '1', "task_status": 1, "config": this.conf, "url": [], "data": [], "logs": []};
        /**
         * 生成采集任务配置
         */
        taskconf.logs.unshift({value:"开始生成采集配置",time:format(new Date(), "HH:mm:ss")})
        for (let i=that.conf.startPageNum;i<=that.conf.endPageNum;i++){
         const item = {status:0,AccessToken: that.conf.AccessToken, filter:that.conf.filter, keyword: that.conf.keyword, current: i};
          taskconf.url.push(item)
       }
        taskconf.logs.unshift({value:"采集配置生成完毕",time:format(new Date(), "HH:mm:ss")})
        that.taskConf = taskconf;
        localStorage.setItem('task',JSON.stringify(taskconf))
        this.CaiJi_Status()
        //开始采集
        this.startCaiJi()


      }else{return false;}});
    },

    startCaiJi(){
      const that = this;
      this.$message({message: "开始采集", type: "success"});
      this.taskConf.logs.unshift({value:"开始采集",time:format(new Date(), "HH:mm:ss")})
      this.taskConf.url.forEach(item=>{
        var status = that.getData(item)
        console.log(status)
      })
      this.taskConf.logs.unshift({value:"采集结束",time:format(new Date(), "HH:mm:ss")})
      localStorage.setItem('task',JSON.stringify(this.taskConf))
    },





    getData(data){
      this.taskConf.logs.unshift({value:"正在获取第"+data.current+"页",time:format(new Date(), "HH:mm:ss")})
      console.log(JSON.stringify(this.taskConf.logs[0]))
      const that = this;
      // this.loading = true;
      try {
        qryData(data).then((res)=>{
          if(res.data.error_code){
            ipcRenderer.invoke("openPddWindows",{url:process.env.PDD_API}).then(res => {
              console.log(res)
            });
            this.emptyText = this.errorText;
            this.$message.error(this.errorText);
            data.status = 4;
            return;
          }
          const {items} = res.data
          that.tableData  = items;
          that.taskConf.data.push({list:items,config:data})

        })
      }catch (e) {
        data.status = 4;
      }
    },

    outData(){
      this.$message({message: "导出成功", type: "success"});
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
    }
  }
}

</script>
<style lang="scss">
.app-container ::-webkit-scrollbar {
  display: block !important;
  background-color: #fff;
  width: 10px;
}

.el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 5px;
  -webkit-box-shadow: inset 0 0 6px rgba(70, 57, 57, 0.3);
  background-color: rgba(0, 0, 0, .1)
}
.el-row {
  margin-bottom: 10px;
  &:last-child {
     margin-bottom: 0px;
  }
}
.el-col {
  border-radius: 4px;
}
.pagination{
  text-align:center;
  padding: 10px;
}

.logs{
  height: 80px;
  font-size: 10px;
  padding: 0px !important;
  color: green;
}


</style>
