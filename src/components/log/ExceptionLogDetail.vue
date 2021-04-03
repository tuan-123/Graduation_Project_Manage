<template>
  <div style="overflow-x: hidden">

    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminIndex' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>日志列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/exceptionLog' }">异常日志</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>
      <div class="item">
        <span class="title">I D：</span>
        <span class="content">{{exceptionLogDetail.id}}</span>
      </div>

      <div class="item">
        <span class="title">异 常 名 称：</span>
        <span class="content">{{exceptionLogDetail.excName}}</span>
      </div>

      <div class="item">
        <span class="title">异 常 信 息：</span>
        <span class="content"><el-button type="primary" @click="toExceptionMessage(exceptionLogDetail.id,exceptionLogDetail.excMessage)">查看</el-button></span>
      </div>

      <div class="item">
        <span class="title">请 求 URI：</span>
        <span class="content">{{exceptionLogDetail.operUri}}</span>
      </div>

      <div class="item">
        <span class="title">操 作 方 法：</span>
        <span class="content">{{exceptionLogDetail.operMethod}}</span>
      </div>

      <div class="item">
        <span class="title">请 求 参 数：</span>
        <span class="content">{{exceptionLogDetail.excRequParam}}</span>
      </div>


      <div class="item">
        <span class="title">操 作 员 (id)：</span>
        <span class="content">{{exceptionLogDetail.operUserId}}</span>
      </div>

      <div class="item">
        <span class="title">请 求 IP：</span>
        <span class="content">{{exceptionLogDetail.operIp}}</span>
      </div>

      <div class="item">
        <span class="title">操 作 时 间：</span>
        <span class="content">{{exceptionLogDetail.createTime}}</span>
      </div>

    </el-card>

  </div>
</template>

<script>
    export default {
        name: "ExceptionLogDetail",
        data(){
            return{
                exceptionLogDetail:{
                    id: 0,
                    excRequParam: '',
                    excName: '',
                    excMessage: '',
                    operUserId: '',
                    operMethod: '',
                    operUri: '',
                    operIp: '',
                    createTime: '',
                },
            }
        },
        mounted(){
            let id = this.$route.params.id;
            if(id === undefined || id === '' || id === null)
                this.$router.push("/exceptionLog");
            else
                this.getOperLogDetailById(id);
        },
        methods:{
            getOperLogDetailById(id){
                let vm = this;
                this.axios({
                    url: '/exceptionLog/admin/getExceptionLogById',
                    method: 'get',
                    params:{id: id}
                }).then(function (res) {
                    if(res.data.code === 200){
                        vm.exceptionLogDetail = res.data.data;
                    }else{
                        vm.$message.error(res.data.msg);
                    }
                }).catch(function (err) {
                    vm.$message.error("故障啦" + err);
                })
            },
            toExceptionMessage(id,message){
                this.$router.push({
                    path: '/exceptionLogDetailExceptionMessage',
                    name: 'ExceptionLogDetailExceptionMessage',
                    params:{
                        id: id,
                        message: message
                    }
                });
            }
        },
    }
</script>

<style scoped>
  .el-breadcrumb{
    margin-bottom: 15px;
    font-size: 14px;
  }

  .el-card{
    box-shadow: 0 1px 1px rgba(0,0,0,0.15);
  }

  .item{
    width: 100%;
    font-size: 17px;
    height: 50px;
    line-height: 50px;
    margin-left: 10px;
  }
  .title{
    color: blue;
  }
  .content{
    position: absolute;
    left: 21%;
    /* 解决span标签不自动换行 */
    display: inline;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    margin-right: 40px;
  }
</style>
