<template>
    <div style="overflow-x: hidden">

      <!--面包屑导航区-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/adminIndex' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>日志列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/operLog' }">操作日志</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>
        <div class="item" style="margin-top: 20px">
          <span class="title"> I D：</span>
          <span class="content">{{operLogDetail.id}}</span>
        </div>

        <div class="item">
          <span class="title">操 作 模 块：</span>
          <span class="content">{{operLogDetail.modul}}</span>
        </div>

        <div class="item">
          <span class="title">操 作 类 型：</span>
          <span class="content">{{operLogDetail.type}}</span>
        </div>

        <div class="item">
          <span class="title">操 作 描 述：</span>
          <span class="content">{{operLogDetail.descr}}</span>
        </div>

        <div class="item">
          <span class="title">请 求 URI：</span>
          <span class="content">{{operLogDetail.uri}}</span>
        </div>

        <div class="item">
          <span class="title">操 作 方 法：</span>
          <span class="content">{{operLogDetail.method}}</span>
        </div>

        <div class="item">
          <span class="title">请 求 参 数：</span>
          <span class="content">{{operLogDetail.requestParam}}</span>
        </div>


        <div class="item">
          <span class="title">操 作 员 (id)：</span>
          <span class="content">{{operLogDetail.userId}}</span>
        </div>

        <div class="item">
          <span class="title">请 求 IP：</span>
          <span class="content">{{operLogDetail.ip}}</span>
        </div>

        <div class="item">
          <span class="title">操 作 时 间：</span>
          <span class="content">{{operLogDetail.createTime}}</span>
        </div>


      </el-card>

    </div>
</template>

<script>
    export default {
        name: "OperLogDetail",
        data(){
            return{
                operLogDetail:{
                    id: 0,
                    modul: '',
                    type: '',
                    descr: '',
                    requestParam: '',
                    userId: '',
                    method: '',
                    uri: '',
                    ip: '',
                    createTime: '',
                },
            }
        },
        mounted(){
            let id = this.$route.params.id;
            if(id === undefined || id === '' || id === null)
                this.$router.push("/operLog");
            else
                this.getOperLogDetailById(id);
        },
        methods:{
            getOperLogDetailById(id){
                let vm = this;
                this.axios({
                    url: '/operLog/admin/getOperLogById',
                    method: 'get',
                    params:{id: id}
                }).then(function (res) {
                    if(res.data.code === 200){
                        vm.operLogDetail = res.data.data;
                    }else{
                        vm.$message.error(res.data.msg);
                    }
                }).catch(function (err) {
                    vm.$message.error("故障啦" + err);
                })
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
    margin-bottom: 45px;
    margin-left: 10px;
  }
  .title{
    color: blue;
  }
  .content{
    position: absolute;
    left: 21%;
    /* 解决span标签不自动换行 */
    display: inline-block;
    word-wrap: break-word;
    word-break: break-all;
    overflow: hidden;
    margin-right: 40px;
  }
</style>
