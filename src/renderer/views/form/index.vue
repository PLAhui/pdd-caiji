<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="关键词">
        <el-input v-model="form.keyword" placeholder="输入搜索关键词" ></el-input>
      </el-form-item>
      <el-form-item label="筛选条件">
        <el-input v-model="form.filter"placeholder="price,0,30"  ></el-input>
      </el-form-item>
<!--      <el-form-item label="AccessToken">-->
<!--        <el-input v-model="form.AccessToken"placeholder="访问令牌"  ></el-input>-->
<!--      </el-form-item>-->


      <el-form-item>
        <el-button type="primary" @click="onSubmit">保存</el-button>
      </el-form-item>
    </el-form>
    <BottomBar/>
  </div>
</template>

<script>
import Tinymce from "@/components/Tinymce";
import BottomBar from "../../components/parts/BottomBar";
export default {
  components: {BottomBar, Tinymce },
  data() {
    return {
      form: {
        keyword: "",
        filter: "",
        // AccessToken:'',
      }
    };
  },
  mounted() {
    const conf = localStorage.getItem("conf");
    if(conf){
      this.form = JSON.parse(conf)
    }
  },
  methods: {
    onSubmit() {
      console.log(this.form)
      //将配置存入缓存
      localStorage.setItem("conf",JSON.stringify(this.form));
      this.$message({
        message: "保存成功",
        type: "success"
      });
    },
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning"
      });
    }
  }
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

