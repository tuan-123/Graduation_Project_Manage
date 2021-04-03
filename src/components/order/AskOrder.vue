<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminIndex' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      <el-breadcrumb-item>提 问</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入发布者账号" v-model="queryInfo.query" clearable @clear="getAskList">
              <el-button slot="append" icon="el-icon-search" @click="getAskList"></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>


      <el-table :data="askList" border stripe :default-sort="{prop:'createTime',order:'descending'}">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="流水号" prop="id"></el-table-column>
        <el-table-column label="发布者" prop="userId"></el-table-column>
        <el-table-column label="内容" prop="content"></el-table-column>
        <el-table-column label="发布时间" prop="createTime" :formatter="creatTimeFormatter" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="toDetail(scope.row.id)"></el-button>
            </el-tooltip>

            <!--删除按钮-->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteAskById(scope.row.id)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pageNum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>

    </el-card>





  </div>
</template>

<script>
    export default {
        name: "AskOrder",
        data(){
            return{
                queryInfo:{
                    query: '',
                    pageNum: 1,
                    pageSize: 5,
                },
                addDialogVisible: false,
                askList: [],
                total:0,


            }
        },
        mounted(){
            this.getAskList();
        },
        methods:{

            getAskList(){
                let vm = this;
                this.axios({
                    url: '/ask/admin/getAskList',
                    method: 'get',
                    params: vm.queryInfo
                }).then(function(res){
                    if(res.data.code === 200){
                        vm.askList = res.data.data.askVoList;
                        vm.total = res.data.data.total;
                    }else{
                        vm.total = 0;
                        vm.$message.error(res.data.msg);
                    }
                }).catch(function (err) {
                    vm.$message.error(err);
                })
            },
            creatTimeFormatter(row,column){
                return row.createTime.substring(0,10);
            },

            handleSizeChange(newSize){
                this.queryInfo.pageSize = newSize;
                this.getAskList();
            },
            handleCurrentChange(newPage){
                this.queryInfo.pageNum = newPage;
                this.getAskList();
            },
            toDetail(id){
                this.$router.push({
                    path: '/askDetail',
                    name: 'AskDetail',
                    params:{id:id}
                });
            },
            deleteAskById(id){
                let vm = this;
                this.$confirm("确认删除该订单吗?\n单号: " + id,"提示",{
                    confirmButtonText: "确认",
                    cancelButtonText: '取消',
                    type: "warning"
                }).then(()=>{
                    this.axios({
                        url: '/ask/admin/deleteAskById',
                        method: 'get',
                        params: {id: id}
                    }).then(function(res){
                        if(res.data.code === 200){
                            vm.$message.success("删除成功");
                            vm.getAskList();
                        }else{
                            vm.$message.error(res.data.msg);
                        }
                    }).catch(function(err){
                        vm.$message.error("故障啦" + err);
                    });
                }).catch(()=>{
                    this.$message.warning("已取消")
                });
            }


        }

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

  .el-table{
    margin-top: 15px;
  }

  .el-pagination{
    margin-top: 15px;
  }
</style>
