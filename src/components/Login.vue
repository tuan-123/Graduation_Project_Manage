<template>
  <div class="container">
    <div class="login-container">
      <div style="width: 70%;margin: 0 auto">
        <div class="big-title">
          Hello
        </div>
        <div class="title">
          欢迎来到管理系统
        </div>
        <div class="login-box" v-loading="loginLoading">
          <el-form label-width="60px" :model="form" :rules="rules" ref="form" class="demo-ruleForm">
            <el-form-item prop="name" label="账 号">
              <el-input placeholder="请输入手机号码" v-model="form.name" prefix-icon="el-icon-user" ></el-input>
            </el-form-item>
            <el-form-item prop="password" label="密 码">
              <el-input type="password" v-model="form.password" placeholder="请输入密码" prefix-icon="el-icon-suitcase" ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit('form')">登录</el-button>
              <el-button type="info" @click="resetForm('form')">重置</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import GLOBAL from "../api/global_variable";
    export default {
        name: "Login",
        data(){
            return{
                loginLoading: false,

                form:{
                    name: '',
                    password: '',
                },
                rules:{
                    name:[
                        {required:true,message:'请输入手机号码',trigger:'blur'},
                        { pattern: /^1[3|4|5|7|8][0-9]{9}$/,min:11,max:11,message: '请输入正确的手机号码',trigger: 'blur'},
                    ],
                    password: [
                        { required:true,message: '请输入密码',trigger:'blur'},
                        { min:6,max:12,message: '长度在6到12个字符',trigger: 'blur'}
                    ]
                }
            }
        },
        methods:{
            onSubmit(formName){
                var vm = this;
                this.$refs[formName].validate((valid) =>{
                    if (valid) {
                        //alert('submit!');
                        this.loginLoading = true;
                        this.axios({
                            method: 'post',
                            url: '/user/admin/login',
                            data: {
                                phone: vm.form.name,
                                password: vm.form.password
                            }
                        }).then(function (response) {
                            //console.log(response);
                            vm.loginLoading = false;
                            if(response.data.code === 200){
                                //console.log(response.data);
                                //登录成功
                                //1、将登录成功之后的token保存到客户端的sessionStorage
                                //  1.1、项目除了登录之后的其他API接口，必须在登录之后才能访问
                                //  1.2、token只应在当前网站打开期间有效，所有将token保存在sessionStorage中
                                window.sessionStorage.setItem('token',response.data.token);
                                //2保存当前用户信息
                                window.sessionStorage.setItem('userId',response.data.data.phone);
                                /*
                                vm.$router.push({
                                    url: '/index',
                                    name: 'Index',
                                    params: response.data.data
                                });
                                 */
                                window.sessionStorage.setItem("userName",response.data.data.nickName);
                                window.sessionStorage.setItem("userImage",response.data.data.image);
                                vm.$router.push("/index");
                            }else if(response.data.code === 1001){
                                //alert(response.data.msg);
                                vm.$message.error(response.data.msg);
                            }
                        }).catch(function (err) {
                            vm.loginLoading = false;
                            vm.$message.error(err);
                        })
                    } else {
                        this.$message.error("用户名或密码格式不正确");
                        return false;
                    }
                });
            },
            resetForm(formName){
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>
  .container{
    background: url("../assets/img/bg.png");
    background-size: 100% 100%;
    height: 100%;
    position: fixed;
    width: 100%
  }
  .container .login-container{
    width: 700px;
    height: 600px;
    position: absolute;
    right: 100px;
    top: 100px;
  }
  .container .login-container .big-title{
    font-size: 50px;
    font-family: Bahnschrift;
    font-style: italic;
  }
  .title{
    font-size: 35px;
    font-family: Bahnschrift;
    font-style: italic;
  }
  .login-box{
    padding-top: 100px;
  }
  .login-box .el-input--prefix{
    width: 70%;
  }

</style>
