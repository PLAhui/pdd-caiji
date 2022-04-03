<template>
  <el-menu :class="'navbar-header-fixed' + (isMac ? ' dragTitle' : '')" mode="horizontal">
    <el-dialog
        title="修改密码"
        :visible.sync="dialogVisible"
        width="50%"
        :modal="false">

        <el-form
            class="login-form"
            autocomplete="on"
            :model="form"
            :rules="passwordRules"
            ref="form"
            label-position="left"
        >
          <el-form-item prop="password">
          <span class="svg-container svg-container_login">
           <svg-icon icon-class="password"></svg-icon>
          </span>
            <el-input
                name="password"
                :type="pwdType"
                @keyup.enter.native="handleLogin"
                v-model="form.password"
                autocomplete="on"
                placeholder="密码"
            />
          </el-form-item>
          <el-form-item prop="twopassword">
          <span class="svg-container">
            <svg-icon icon-class="password"></svg-icon>
          </span>
            <el-input
                name="twopassword"
                :type="pwdType"
                @keyup.enter.native="handleLogin"
                v-model="form.twopassword"
                autocomplete="on"
                placeholder="重复输入密码"
            ></el-input>
            <span class="show-pwd" @click="showPwd">
            <svg-icon
                :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'"
            />
          </span>
          </el-form-item>
        </el-form>


      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="handleLogin">确 定</el-button>
  </span>
    </el-dialog>



    <div class="top-right">
      <div class="hb-bd">
        <hamburger
          class="hamburger-container"
          :toggleClick="toggleSideBar"
          :isActive="sidebar.opened"
        ></hamburger>
        <breadcrumb></breadcrumb>
      </div>

      <div class="top-select">
        <div class="go-index">{{time}}</div>
        <div class="select-right">
          <el-dropdown trigger="click">
            <div>
              <el-image :src="userInfo.avatar" class="avatar">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <div class="el-dropdown-link">
               尊敬的： {{userInfo.realname}}
                <i class="el-icon-arrow-down el-icon--right"></i>
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/">
                <el-dropdown-item>返回首页</el-dropdown-item>
              </router-link>
              <el-dropdown-item @click.native="logout">
                <span>切换账号</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="passwordChange">
                <span>重置密码</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </el-menu>
</template>

<script>
import { format } from "date-fns";
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";
import {login, logout, passwordChange} from "../../api/login";
export default {



  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
  const validatePass = (rule, value, callback) => {
    // if (!isvalidUsername(value)) {
    if (value.length < 6) {
      callback(new Error("密码不能小于6位"));
    } else {
      callback();
    }
  };
  const twovalidatePass = (rule, value, callback) => {
    if (value.length < 6) {
      callback(new Error("密码不能小于6位"));
    }else if(value !=this.form.password){
      callback(new Error("两次输入的密码不一致"));
    }
    else {
      callback();
    }
  };
  return {

    passwordRules: {
      password: [
        { required: true, trigger: "blur", validator: validatePass },
      ],
      twopassword: [
        { required: true, trigger: "blur", validator: twovalidatePass },
      ],
    },
    loading: false,
    pwdType: "password",
    form:{
      password:'',
      twopassword:'',
    },
    dialogVisible:false,
    time: "",
    userImage: require("@/assets/user.png"),
    isMac: process.platform === "darwin"
  }},
  mounted() {
    this.set_time();
    this.timer = setInterval(() => {
      this.set_time();
    }, 60000);
    console.log(this.userImage)
  },
  methods: {
    showPwd() {
      if (this.pwdType === "password") {
        this.pwdType = "";
      } else {
        this.pwdType = "password";
      }
    },
    handleLogin() {
      var that = this;
      this.$refs.form.validate((valid) => {
        if (valid) {
          console.log("修改密码");
          // this.loading = true;
          passwordChange(that.form).then(res=>{
            if(res.data.code==0){
              that.$message.success(res.data.message)
              that.dialogVisible = false;
              that.form = []
            }else{
              that.$message.error(res.data.message)
            }
            console.log(res)
          }).catch(e=>{
            that.$message.error(e)
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },

    /**
     * 重置密码
     */
    passwordChange(){
      console.log("重置密码")
      this.dialogVisible = true;
    },
    toggleSideBar() {
      this.$store.dispatch("ToggleSideBar");
    },
    logout() {
      const that = this;
      logout().then(res=>{
        console.log("===",res)
        that.$store.dispatch("LogOut")
        that.$message({message: "退出成功", type: "success"});
        that.$router.push('/login')
      })
      // this.$store.dispatch("LogOut").then(() => {
      //
      // });
    },
    set_time() {
      this.time = format(new Date(), "yyyy/MM/dd HH:mm");
    }
  },
  computed: {
    ...mapGetters(["userInfo", "role", "sidebar"])
  },
  beforeDestroy() {
    console.log("销毁计时器------------");
    clearInterval(this.timer);
    this.timer = null;
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar-header-fixed {
  transition: width 0.28s;
  width: calc(100% - 256px);
  display: flex;
  align-items: center;
  position: fixed;
  right: 0;
  z-index: 1002;
  height: 62px;
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 10px;
  }
  .logo {
    width: 199px;
    height: 62px;
  }
  .top-right {
    display: flex;
    width: 100%;
    height: 100%;
    background-color: #ffffff;
    justify-content: space-between;
    padding: 0 19px;
    .hb-bd {
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .avatar {
      width: 30px;
      height: 30px;
      margin-right: 10px;
      ::v-deep img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .top-select {
      display: flex;
      align-items: center;
      .go-index {
        color: #333333;
        font-weight: 400;
        margin-right: 20px;
        padding-right: 20px;
        border-right: 1px solid #cccccc;
      }
      .select-right ::v-deep .el-dropdown > span {
        font-size: 6px;
      }
      .select-right {
        .el-dropdown-link {
          color: #333333;
          font-weight: 400;
        }
        ::v-deep .el-dropdown-selfdefine {
          display: flex;
          align-items: center;
        }
      }
    }
  }
}
$bg: #2d3a4b;
$light_gray: #eee;
$dark_gray: #889aa4;
$light_gray: #eee;
.dragTitle {
  -webkit-app-region: drag;
}
.el-input{
  width:90%
}
.login-container {
  //position: fixed;
  //height: 100%;
  //width: 100%;
  //top: 0;
  //left: 0;
  //background-image: url("https://i.loli.net/2019/10/18/buDT4YS6zUMfHst.jpg");
  //background-position: center;
  //::v-deep .el-input {
  //  display: inline-block;
  //  height: 47px;
  //  width: 85%;
  //  input {
  //    background: transparent;
  //    border: 0px;
  //    -webkit-appearance: none;
  //    border-radius: 0px;
  //    padding: 12px 5px 12px 15px;
  //    color: $light_gray;
  //    height: 47px;
  //    &:-webkit-autofill {
  //      -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
  //      -webkit-text-fill-color: #fff !important;
  //    }
  //  }
  //}
  //::v-deep .el-form-item {
  //  border: 1px solid rgba(255, 255, 255, 0.1);
  //  background: rgba(0, 0, 0, 0.1);
  //  border-radius: 5px;
  //  color: #454545;
  //}
  .login-from-box {
    position: relative;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 520px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
      align-items: center;
      color: white;
      backdrop-filter: saturate(180%) blur(20px);
      background: rgba(0, 0, 0, .65);
      border-radius: 10px;
      box-shadow: 0 0.4px 0.6px rgba(0, 0, 0, 0.141),
      0 1px 1.3px rgba(0, 0, 0, 0.202), 0 1.9px 2.5px rgba(0, 0, 0, 0.25),
      0 3.4px 4.5px rgba(0, 0, 0, 0.298), 0 6.3px 8.4px rgba(0, 0, 0, 0.359),
      0 15px 20px rgba(0, 0, 0, .26);
      .login-btn {
        .btn {
          position: relative;
          width: 100%;
          padding: 6px 0;
          margin: 10px 0 36px 0;
          font-size: 1.2em;
          color: white;
          background: transparent;
          border: 2px solid hsla(204, 70%, 53%, 1);
          outline: none;
          cursor: pointer;
          overflow: hidden;
          transition: 0.5s;

          &::before {
            position: absolute;
            content: "";
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(
                    120deg,
                    transparent,
                    hsla(204, 70%, 53%, 0.5),
                    transparent
            );
            transform: translateX(-100%);
            transition: 0.5s;
          }

          &:hover {
            box-shadow: 0 0 20px 10px hsla(204, 70%, 53%, 0.5);
          }

          &:hover::before {
            transform: translateX(100%);
          }
        }
      }
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title {
      font-size: 26px;
      font-weight: 400;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
  }
}
</style>

