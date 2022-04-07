<!--1688采集数据页-->
<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12">
        <el-button @click="start(CaiJiStatus)" style="float: left" :type="btnColor">{{btnText}}</el-button>
        <el-button @click="clean()" style="float: left">清空采集数据</el-button>
<!--        <el-button @click="clean1688uRL()" style="float: left">关闭弹窗</el-button>-->

        <vue-xlsx-table @on-select-file="handleSelectedFile"><i class="el-icon-download"></i>导入网址</vue-xlsx-table>

      </el-col>
      <el-col  :span="12">
        <download-excel :data="tableData" :fields="jsonFields" class="export-btn" header="采集数据" name="1688采集.xls" type="xls">
          <el-button icon="el-icon-tickets" style="float: right" type="primary">导出</el-button>
        </download-excel>
      </el-col>
    </el-row>

    <!--表格-->
    <el-table v-loading="loading" :data="tableData" border :empty-text="emptyText" height="400"
              highlight-current-row tooltip-effect="dark">
      <el-table-column label="序号" type="index" width="50"></el-table-column>
      <el-table-column label="企业名称"   prop="companyName" width="180"  show-overflow-tooltip></el-table-column>
      <el-table-column label="移动电话" prop="mobileNo" width="125"></el-table-column>
      <el-table-column label="联系人" prop="name" width="100"></el-table-column>
<!--      <el-table-column label="联系电话" prop="phoneNum"  width="180"></el-table-column>-->
<!--      <el-table-column label="传真" prop="faxNum" width="150"></el-table-column>-->
      <el-table-column label="地址" show-overflow-tooltip prop="address"></el-table-column>
<!--      <el-table-column label="官网" prop="companyName" width="100"></el-table-column>-->
<!--      <el-table-column label="详情链接" width="80"></el-table-column>-->
    </el-table>

    <!--分页-->
<!--    <el-pagination :page-size="pageSize"-->
<!--                   :total="total" background-->
<!--                   class="pagination"-->
<!--                   layout="prev, pager, next"-->
<!--                   @prev-click="prevClick"-->
<!--                   @current-change="currentClick"-->
<!--                   @next-click="nextClick">-->
<!--    </el-pagination>-->

    <el-row style="margin-top: 20px" :gutter="20" v-if="true">
      <el-col :span="12">
        <h4  class="tab">待采集网址[{{AlibabaCaiJiData.urls.length}}]</h4>
        <ul class="infinite-list" style="overflow:auto">
          <div v-if="AlibabaCaiJiData.urls.length==0">暂无数据</div>
          <li v-for="(item,index) in AlibabaCaiJiData.urls" :key="index" style="list-style-type:none; cursor:pointer;" @click="start(item)">
            <el-row><el-col>
              <span style="float: left;width: 70%">{{index+1}}:{{item.url}}</span>
              <span style="float: right;width: 30%">{{item.title}}</span>
            </el-col></el-row>
          </li>
        </ul>
      </el-col>
      <el-col :span="12" v-if="false">
        <h4 class="tab">已采集网址[{{AlibabaCaiJiData.length}}]</h4>
        <ul class="infinite-list" style="overflow:auto">
          <div v-if="AlibabaCaiJiData.length==0">暂无数据</div>
          <li v-for="(item,index) in AlibabaCaiJiData" :key="index" style="list-style-type:none;">
            <div>
              <span>{{index+1}}</span>
              <span>{{item.detailUrl.url}}</span>
              <span style="float: right">{{item.detailUrl.title}}</span>
            </div>
          </li>
        </ul>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import tools from "@/utils/tools";
import AlibabaMixins from "../../mixins/AlibabaMixins";
import {mapGetters} from "vuex";
import {getDataByUrl} from "../../api/api";
import {ipcRenderer} from "electron";
export default {
  mixins: [tools,AlibabaMixins],
  data: () => {
    return {
      emptyText:'暂无数据，先去采集吧!',
      jsonFields: {  //导出Excel表格的表头设置
        '企业名称': 'companyName',
        '移动电话':{field: "mobileNo", callback: (value) => {return  value+"&nbsp;";}},
        '联系人': 'name',
        '联系电话': {field: "phoneNum", callback: (value) => {return  value+"&nbsp;";}},
        '传真':{field: "faxNum", callback: (value) => {return  value+"&nbsp;";}},
        '地址': 'address',
        "详情链接": 'detailUrl'
      },

      loading: false,
      pageSize: 20,//每页数据量
      total: 0,//总记录数
      current: 1,//当前页
      CaiJiStatus:0,//0 未开始采集  1采集中  2暂停采集  3结束采集
      btnText:'开始采集',
      btnColor:'primary'
    }
  },

  watch:{
    CaiJiStatus(newStar,oldStar){
      if(newStar==0){
        this.btnText = '开始采集'
        this.btnColor = 'primary';
      }
      if(newStar==1){
        this.btnText = '暂停采集'
        this.btnColor = 'success';
      }
      if(newStar==2){
        this.btnText = '采集已暂停'
        this.btnColor = 'warning';
      }
    }
  },

  computed: {
    //1688数据
    ...mapGetters(["AlibabaCaiJiData"]),
    tableData(){
      return this.AlibabaCaiJiData.result
    }

  },


  mounted() {
    var that = this;
    this.$Bus.$on("httpData",(async res => {
      let data;
      /**
       * 响应的数据是来自采集数据的接口时
       * 将数据存入状态管理和缓存中
       */
      if (this.strRegExp(res.url, 'renderPcPageData')) {
        // console.log("-----采集到数据6666----")
        // console.log(res.ResponseBody)
      }

      if (this.strRegExp(res.url, '/contactinfo.htm')) {
        console.log("-----采集到数据----")
        // console.log(res.ResponseBody)
        var info;
        var mobilePhone = "";
        var companyName = "";
        var name = "";
        try {
          mobilePhone = res.ResponseBody.match(/"mobilePhone":"(\S*)","companyName"/)[1];
          companyName = res.ResponseBody.match(
              /"moduleData":{"companyName":"(\S*)","detailAddress":"/)[1];
          info = {
            item: {url: res.url},
            status: true,
            data: {"mobileNo": mobilePhone, companyName, name}
          }
        } catch (e) {
          try {
            data = this.interceptStr(res.ResponseBody, '<div class="contcat-desc"', '公司主页')
            mobilePhone = this.StrReplace(this.interceptStr(data, '移动电话', '传'))
            companyName = res.ResponseBody.match(/<h4>(\S*)</)[1];
            name = this.StrReplace(this.interceptStr(res.ResponseBody, 'membername', '</a>&nbsp;'))
            info = {
              item: {url: res.url},
              status: true,
              data: {"mobileNo": mobilePhone, companyName, name}
            }
          } catch (err) {
            // TODO 第三种情况获取 -暂无发获取
            info = {item: {url: res.url}, status: false, data: null}
          }
        }
        //写入数据
        that.$store.dispatch('AddAlibabaCaiJiInfo', info)
        ipcRenderer.invoke("close1688Windows", "")
        await this.sleep(3000);
        this.$Bus.$emit("CaiJi", this.CaiJiStatus)
      }
    }))
  },
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
.xlsx-button {
  margin-left: 10px;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #FFF;
  border: 1px solid #DCDFE6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  box-sizing: border-box;
  outline: 0;
  transition: .1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
}
.infinite-list{
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 20px;
  height: 200px;
  color: #000000;
  font-size: 10px;
  //background-color: rgb(247, 247, 247);
}
.tab{
  background-color: #fff;
  padding: 10px 0px;
}


</style>
