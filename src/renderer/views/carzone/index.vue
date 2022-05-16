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
        <download-excel :data="list" :fields="jsonFields" class="export-btn" header="采集数据"
                        :name="'天猫汽车数据-'+fileName+'.xls'" type="xls">
          <el-button icon="el-icon-tickets" style="float: right" type="primary">导出</el-button>
        </download-excel>
      </el-col>
    </el-row>

    <!--表格-->
    <el-table v-loading="loading" :data="tableData" border :empty-text="emptyText" height="600"
              highlight-current-row tooltip-effect="dark">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="联系方式" prop="tel" width="120"></el-table-column>
      <el-table-column label="门店id" prop="id" width="150"></el-table-column>
      <el-table-column label="门店名称" prop="name" show-overflow-tooltip width="220"></el-table-column>
      <el-table-column label="门店地址" prop="address" width="200" show-overflow-tooltip></el-table-column>

      <el-table-column label="门头照片" width="125">
        <template slot-scope="scope">
          <el-image :preview-src-list="srcList" :src="scope.row.imgUrl"
                    style="width: 100px; height: 100px" @click="preview(scope.row.imgUrl)"></el-image>
        </template>
      </el-table-column>

      <el-table-column label="待服务单量" prop="orderQuantityMileage" width="100"></el-table-column>
      <el-table-column label="累计单量" prop="orderNum" width="100"></el-table-column>
      <el-table-column label="平均评分" prop="avgScore" width="100"></el-table-column>
      <el-table-column label="距离(km)" prop="distanceMileage" width="100"></el-table-column>

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
import CarZoneMixins from "@/mixins/CarZoneMixins";
import Carzone from "./index";

export default {
  mixins: [tools,CarZoneMixins],
  data: () => {
    return {
      emptyText:'暂无数据，先去采集吧!',
      jsonFields: {  //导出Excel表格的表头设置
        '门店id': 'id',
        '门店名称':'name',
        '门店地址': 'address',
        '联系方式': 'tel',
        '待服务单量': 'orderQuantityMileage',
        '累计单量': 'orderNum',
        '平均评分': 'avgScore',
        '距离(km)': 'distanceMileage',
        "门头照片":'imgUrl',
      },
      baseUrl: process.env.CarZone_API,
      loading: false,
      tableData: [],//当前分页的数据
      srcList: [],
      pageSize: 10,//每页数据量
      total: 0,//总记录数
      current: 1,//当前页
      fileName:'',
    }
  },

  computed: {
    //拼多多数据
    ...mapGetters(["CarZoneCaiJiData"]),
    list(){
      const data = [];

      this.CarZoneCaiJiData.forEach(item=>{
        item.items.forEach(good=>{
          data.push(good)
        })
      })
      this.total = data.length;
      if(data.length>0){
        this.fileName = data[0].serverInfoROs[0].productId+'-'+data[0].serverInfoROs[0].productName
      }
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
      if(this.strRegExp(res.url,'https://f.carzone365.com/superapi/providersmg/storefacade/page?appkey')){
        console.log("-----采集到数据----",this.CarZoneCaiJiData.length)
        var ret= res.ResponseBody
        var matches = ret.match('(?<="resultList":)(.+?)(?=\\},"msg")')
        if(matches){
          ret = JSON.parse(matches[1])
        }
        console.log(ret)


        if(this.CarZoneCaiJiData.length!=0){

            that.$store.dispatch('InsertCarZoneCaiJiData',{
              items:ret,//采集到的元数据
            })
            that.currentClick(that.CarZoneCaiJiData.length-1)

        }else {
          that.$store.dispatch('InsertCarZoneCaiJiData',{
            items:ret,//采集到的元数据
          })
          that.currentClick(that.CarZoneCaiJiData.length)
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
