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
      <el-table-column label="店铺ID" prop="mall_id" width="100"></el-table-column>
      <el-table-column label="商品ID" prop="goods_id" width="120"></el-table-column>
      <el-table-column label="商品标题" show-overflow-tooltip prop="goods_name" width="200"></el-table-column>
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
      emptyText:'正在加载中...',
      loading:true,
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
    this.getData({AccessToken,filter,keyword,current:this.current})
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
        qryData(data).then((res)=>{
          this.loading = false;
          if(res.data.error_code){
            this.emptyText = "令牌失效！";
            return;
          }
          const {items} = res.data
          this.total = res.data.total;
          this.tableData = items
        })
      }catch (e) {
        this.loading = false;
        this.emptyText = "令牌失效！";
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
