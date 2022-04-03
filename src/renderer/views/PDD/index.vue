<!--拼多多采集数据页-->
<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-button @click="start()" style="float: left">开始采集</el-button>
        <el-button @click="clean()" style="float: left">清空采集数据</el-button>
        <el-tag style="margin: 5px;" size="">共采集数据:{{list.length}}</el-tag>
      </el-col>
      <el-col  :span="12">
        <download-excel :data="list" :fields="jsonFields" class="export-btn" header="拼多多采集数据"
                        name="拼多多采集.xls" type="xls">
          <el-button icon="el-icon-tickets" style="float: right" type="primary">导出</el-button>
        </download-excel>
      </el-col>
    </el-row>

    <!--表格-->
    <el-table v-loading="loading" :data="tableData" border :empty-text="emptyText" height="600"
              highlight-current-row tooltip-effect="dark">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="店铺ID" prop="mall_id" width="120"></el-table-column>
      <el-table-column label="商品ID" prop="goods_id" width="150"></el-table-column>
      <el-table-column label="商品标题" prop="goods_name" show-overflow-tooltip
                       width="220"></el-table-column>
      <el-table-column label="缩略图" width="125">
        <template slot-scope="scope">
          <el-image :preview-src-list="srcList" :src="scope.row.thumb_url"
                    style="width: 100px; height: 100px" @click="preview(scope.row.thumb_url)"></el-image>
        </template>
      </el-table-column>
      <el-table-column label="拼单价格" width="100">
        <template slot-scope="scope">
          <span>{{ priceTools(scope.row.price) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原价" width="100">
        <template slot-scope="scope">
          <span>{{ priceTools(scope.row.market_price) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单独购买价" width="100">
        <template slot-scope="scope">
          <span>{{ priceTools(scope.row.normal_price) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已拼数量" prop="sales" width="100"></el-table-column>
      <el-table-column label="详情链接">
        <template slot-scope="scope">
          <a :href="baseUrl+'/'+scope.row.link_url" style="color: #0080ff"
             target="_blank">查看商品详情</a>
        </template>
      </el-table-column>
    </el-table>
    <!--分页-->
    <el-pagination :page-size="pageSize"
                   :total="total" background
                   class="pagination"
                   layout="prev, pager, next"
                   @prev-click="prevClick"
                   @current-change="currentClick"
                   @next-click="nextClick">
    </el-pagination>

  </div>
</template>

<script>
import {mapGetters} from "vuex";
import tools from "@/utils/tools";
import PinDuoDuoMixins from "@/mixins/PinDuoDuoMixins";

export default {
  mixins: [tools,PinDuoDuoMixins],
  data: () => {
    return {
      emptyText:'暂无数据，先去采集吧!',
      jsonFields: {  //导出Excel表格的表头设置
        '店铺ID': 'mall_id',
        '商品ID': {field: "goods_id", callback: (value) => {return  value+"&nbsp;";}},
        '商品标题': 'goods_name',
        '拼单价格': {field: "price", callback: (value) => {return  (value/100).toFixed(2)}},
        '原价': {field: "market_price", callback: (value) => {return  (value/100).toFixed(2)}},
        '单独购买价': {field: "normal_price", callback: (value) => {return  (value/100).toFixed(2)}},
        '已拼数量': 'sales',
        '缩略图': 'thumb_url',
        "详情链接": {field: "link_url", callback: (value) => {return process.env.PDD_API + "/" + value;},},
      },
      baseUrl: process.env.PDD_API,
      loading: false,
      tableData: [],//当前分页的数据
      srcList: [],
      pageSize: 20,//每页数据量
      total: 0,//总记录数
      current: 1,//当前页
    }
  },

  computed: {
    //拼多多数据
    ...mapGetters(["PinDuoDuoCaiJiData"]),
    list(){
      const data = [];
      this.PinDuoDuoCaiJiData.forEach(item=>{
        item.items.forEach(good=>{
          data.push(good)
        })
      })
      this.total = data.length;
      return data;
    }
  },
  components: {},
  created() {
    this.initData();
  },
  mounted() {
    var that = this;
    this.$Bus.$on("httpData",(res=>{
      /**
       * 响应的数据是来自采集数据的接口时
       * 将数据存入状态管理和缓存中
       */
      if(this.strRegExp(res.url,'https://app.yangkeduo.com/proxy/api/search?pdduid')){
        console.log("-----采集到数据----",this.PinDuoDuoCaiJiData.length)
        console.log(res.ResponseBody)
        var isSave = true;
        if(res.ResponseBody.error_code==40002){
          this.$message.error("账号被限制，请更换账号或稍后再采集")
          return;
        }
        if(this.PinDuoDuoCaiJiData.length!=0){
          that.PinDuoDuoCaiJiData.forEach(item=>{
            if(item.page == res.ResponseBody.p_search.page){
              isSave = false;
            }
          })
          if (isSave){
            that.$store.dispatch('InsertPinDuoDuoCaiJiData',{
              items:res.ResponseBody.items,//采集到的元数据
              page:res.ResponseBody.p_search.page//当前页码
            })
            that.currentClick(that.PinDuoDuoCaiJiData.length-1)
          }
        }else {
          that.$store.dispatch('InsertPinDuoDuoCaiJiData',{
            items:res.ResponseBody.items,//采集到的元数据
            page:res.ResponseBody.p_search.page//当前页码
          })
          that.currentClick(that.PinDuoDuoCaiJiData.length)
        }
      }
    }))
  },
  methods: {}
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

.pagination {
  text-align: center;
  padding: 10px;
}

.logs {
  height: 80px;
  font-size: 10px;
  padding: 0px !important;
  color: green;
}


</style>
