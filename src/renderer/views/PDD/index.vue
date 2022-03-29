<!--拼多多采集数据页-->
<template>
  <div class="app-container">
    <el-row :gutter="24" type="flex" class="row-bg" justify="end">
      <el-col :span="4">
        <el-button type="primary" icon="el-icon-video-play" @click="start">开始采集</el-button>
      </el-col>
      <el-col :span="4">{{explain}}</el-col>
      <el-col :span="16">
        <el-form :model="conf" :rules="rules" ref="conf" :inline="true" size="mini" label-width="80px" >
          <el-form-item label="关键词" prop="keyword">
            <el-input v-model="conf.keyword"  size="mini"/>
          </el-form-item>
          <el-form-item label="搜索条件" prop="filter" >
            <el-input v-model="conf.filter"  size="mini"/>
          </el-form-item>
          <el-form-item label="开始页码" prop="startPageNum" >
            <el-input v-model="conf.startPageNum"  size="mini"/>
          </el-form-item>
          <el-form-item label="采集总页" prop="sumPageNum" >
            <el-input v-model="conf.sumPageNum"  size="mini"/>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="4">
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
import {qryData} from "@/api/api";
import tools from "@/utils/tools";
import BottomBar from "../../components/parts/BottomBar";
export default {
  mixins:[tools],
  data: () => {
    return {
      rules: {
        keyword: [
          {required: true, message: '请输入关键词', trigger: 'blur'},
        ],
        filter: [
          {required: true, message: '请输入搜索条件', trigger: 'blur'},
        ],
        sumPageNum: [
          {required: true, message: '请输入总页数', trigger: 'blur'},
        ],
        startPageNum: [
          {required: true, message: '请输入开始页', trigger: 'blur'},
        ],
      },
      conf: {
        keyword: "充电宝",//关键词
        filter: "price,10,30",//搜索条件
        sumPageNum:5,//总页数
        startPageNum:1,//开始页
      },

      explain:'暂未开始采集',
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
      //采集相关配置
      CJ_Data:{
        current:1,// 当前采集页
        cj_Status:false,//采集状态
        cj_list:[],//采集数据[{index:0,list:[]}] //页码-数据
        speed:[5000,12000],//采集请求速度随机（毫秒）
      }
    }
  },

  components: {BottomBar},
  mounted() {
    if(this.PDDAccessToken==null){
      this.$message.error('请先打开拼多多');
      return;
    }
    if(localStorage.getItem("CJ_Data")){
      this.CJ_Data=JSON.parse(localStorage.getItem("CJ_Data"))
      this.tableData = this.CJ_Data.cj_list[0].list
      this.CJ_Data.cj_list.forEach(item=>{
        this.total = this.total +item.list.length
      })
    }
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
     * 点击开始采集
     */
    start(){
      this.$refs.conf.validate((valid) => {
        if (valid) {
          this.startCaiJi()
        } else {
          return false;
        }
      });
    },

    startCaiJi(){
      const that = this;
      this.$message({message: "开始采集", type: "success"});
      that.CJ_Data.cj_Status = true;
      const {AccessToken,filter,keyword} = this.conf;
      const interval =  setInterval(function (){
        if(that.CJ_Data.cj_Status){
          if(that.conf.sumPageNum+that.conf.startPageNum>that.CJ_Data.current){
            that.explain='开始采集，正在采集第'+that.CJ_Data.current+'页'
            that.getData({AccessToken,filter,keyword,current:that.CJ_Data.current})
          }else {
            that.explain='采集结束'
            that.CJ_Data.cj_Status = false;
            clearInterval(interval);
          }
        }
      },this.CJ_Data.speed[0])
    },

    getData(data){
      const that = this;
      this.emptyText = "正在加载中...";
      this.loading = true;
      try {
        qryData(data).then((res)=>{
          this.loading = false;
          if(res.data.error_code){
            this.emptyText = this.errorText;
            this.CJ_Data.cj_Status = false;
            this.$message.error(this.errorText);
            return;
          }
          const {items} = res.data
          this.total = res.data.total;
          this.CJ_Data.cj_list.push({index:this.CJ_Data.current,list: items})
          this.CJ_Data.current+=1;
          localStorage.setItem('CJ_Data',JSON.stringify(this.CJ_Data))
        })
      }catch (e) {
        this.loading = false;
        this.CJ_Data.cj_Status = false;
        this.emptyText = this.errorText;
      }
    },

    outData(){
      this.$message({message: "导出成功", type: "success"});
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

</style>
