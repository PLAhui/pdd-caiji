<template>
  <div class="app-container">
    <el-row :gutter="24" type="flex" class="row-bg" justify="end">
      <el-col :span="8">
        <el-button type="primary" icon="el-icon-video-play" @click="start">开始采集</el-button>
      </el-col>
      <el-col :span="8"></el-col>
      <el-col :span="4"></el-col>
      <el-col :span="4">
        <el-button style="float: right" type="primary" icon="el-icon-tickets" @click="outData">导出</el-button>
      </el-col>
    </el-row>



    <el-table :data="tableData" border height="600" highlight-current-row :empty-text="emptyText"  tooltip-effect="dark" v-loading="loading">
      <el-table-column type="index"   label="序号"  width="50"></el-table-column>
      <el-table-column label="企业名称" prop="companyModel.company"></el-table-column>
      <el-table-column label="详情链接"  width="200">
        <template slot-scope="scope">
          <a :href="'https://'+scope.row.companyModel.domainUri+'/page/contactinfo.htm'" target="_blank" style="color: #0080ff">查看详情</a>
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
import {qry1688List} from "@/api/api";
import tools from "@/utils/tools";
import BottomBar from "../../components/parts/BottomBar";
export default {
  mixins:[tools],
  data: () => {
    return {
      emptyText:'请点击开始采集，获取数据',
      loading:false,
      baseUrl:process.env.PDD_API,
      conf:JSON.parse(localStorage.getItem("conf")),
      tableData: [],
      srcList:[],
      pageSize:20,//每页数据量
      total:0,//总记录数
      current:1,//当前页
    }
  },

  components: {BottomBar},
  mounted() {
    const {AccessToken,filter,keyword} = this.conf;
    // this.getData({AccessToken,filter,keyword,current:this.current})
  },

  methods: {

    currentClick(current){
      this.current = current;
      const {AccessToken,filter,keyword} = this.conf;
      this.getData({AccessToken,filter,keyword,current:this.current})
    },
    prevClick(){
      this.current -=1;
      const {AccessToken,filter,keyword} = this.conf;
      this.getData({AccessToken,filter,keyword,current:this.current})
    },
    nextClick(){
      this.current  +=1;
      const {AccessToken,filter,keyword} = this.conf;
      this.getData({AccessToken,filter,keyword,current:this.current})
    },
    preview(url){
      this.srcList.push(url)
    },
    start(){
      this.$message({message: "开始采集", type: "success"});
      const {AccessToken,filter,keyword} = this.conf;
      this.getData({AccessToken,filter,keyword,current:this.current})
    },
    getData(data){
      this.emptyText = "正在加载中...";
      this.loading = true;
      try {
        qry1688List(data).then((res)=>{
          this.loading = false;
          var result = res.data.data;
          console.log(result)
          if(result==undefined){
            this.emptyText = "令牌失效！";
            this.$message.error("令牌失效")
            return;
          }
          const items = result.data.companyWithOfferLists
          this.total = result.data.totalCount;
          this.tableData = items
        })
      }catch (e) {
        this.loading = false;
        this.emptyText = "令牌失效！";
        this.$message.error("令牌失效")
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
