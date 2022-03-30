<!--拼多多采集数据页-->
<template>
  <div class="app-container">
   <el-row>
     <el-col>
       <download-excel class="export-btn" :data="list" :fields="jsonFields" type="xls" header="拼多多采集数据" name="拼多多采集.xls">
         <el-button style="float: right" type="primary" icon="el-icon-tickets">导出</el-button>
       </download-excel>
     </el-col>
   </el-row>

    <!--表格-->
    <el-table :data="tableData" border height="600" highlight-current-row empty-text="加载中..."  tooltip-effect="dark" v-loading="loading">
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

    <!--分页-->
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
      jsonFields: {  //导出Excel表格的表头设置
        '店铺ID': 'mall_id',
        '商品ID': 'goods_id',
        '商品标题': 'goods_name',
        '拼单价格': 'price',
        '原价': 'market_price',
        '单独购买价': 'normal_price',
        '已拼数量': 'sales',
        '缩略图': 'thumb_url',
        "详情链接" : {
          field: "link_url",
          callback: (value) => {
            return process.env.PDD_API+"/"+value;
          },
        } ,

  },
      baseUrl:process.env.PDD_API,
      loading:false,
      tableData: [],//当前分页的数据
      list:[],//总数据
      srcList:[],
      pageSize:20,//每页数据量
      total:0,//总记录数
      current:1,//当前页
    }
  },

  computed: {

  },
  components: {BottomBar},
  mounted() {
    var task = JSON.parse(localStorage.getItem('task'));
    if(task){
      task.data.forEach(item=>{
        this.list.push(...item.list)
      })
      this.tableData = this.list.slice(0,this.pageSize)
      this.total = this.list.length;
    }
  },

  methods: {

    //点击页面
    currentClick(current){
      this.current = current;
      var task = JSON.parse(localStorage.getItem('task'));
      this.tableData = this.list.slice(this.pageSize*(current-1),this.pageSize*(current-1)+this.pageSize)
    },
    //点击上一页
    prevClick(){
      this.current -=1;
      var task = JSON.parse(localStorage.getItem('task'));
      this.tableData = this.list.slice(this.pageSize*(this.current -1),this.pageSize*(this.current -1)+this.pageSize)
    },
    //点击下一页
    nextClick(){
      var task = JSON.parse(localStorage.getItem('task'));
      this.tableData = this.list.slice(this.pageSize*(this.current),this.pageSize*(this.current)+this.pageSize)
      this.current  +=1;
    },








    outData(){
      this.$message({message: "导出成功", type: "success"});
    },


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
