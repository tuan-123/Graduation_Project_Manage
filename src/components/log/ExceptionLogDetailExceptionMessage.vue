<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminIndex' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>日志列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/exceptionLog' }">异常日志</el-breadcrumb-item>
      <el-breadcrumb-item>详情</el-breadcrumb-item>
      <el-breadcrumb-item>异常信息</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <div style="margin-bottom: 30px">
        <el-button type="primary" icon="el-icon-arrow-left" @click="backToExceptionDetail(id)">返回</el-button>
      </div>

      <div class="item">
        <span class="title">I D：</span>
        <span style="margin-left: 90px">{{id}}</span>
      </div>

      <div class="item">
        <span class="title" style="float: left">异 常 信 息：</span>
        <span class="content">{{message}}</span>
      </div>

    </el-card>


  </div>
</template>

<script>
    export default {
        name: "ExceptionLogDetailExceptionMessage",
        data(){
            return{
                id:'',
                message:'',
            }
        },
        mounted() {
            let id = this.$route.params.id;
            if(id === undefined || id === null || id === ''){
                this.$router.push("/exceptionLog");
            }else{
                this.id = id;
                this.message = this.$route.params.message;
            }
        },
        methods:{
            backToExceptionDetail(id){
                this.$router.push({
                    path: '/exceptionLogDetail',
                    name: 'ExceptionLogDetail',
                    params:{
                        id: id,
                    }
                });
            }
        }
    }
</script>

<style>
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
    margin-bottom: 20px;
    margin-left: 10px;
  }
  .title{
    color: blue;
  }
  .content{
    /*position: relative;
    left: 21%;*/
    /* 解决span标签不自动换行 */
    /*display: inline-block;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    margin-right: 40px;*/
    /*文本换行*/

    white-space: pre-wrap;
    display: inline-block;
    margin-left: 30px;
    margin-right: 30px;

  }


</style>
