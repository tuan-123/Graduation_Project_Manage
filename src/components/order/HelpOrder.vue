<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminIndex' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      <el-breadcrumb-item>帮 代</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入发布者账号" v-model="queryInfo.query" clearable @clear="getHelpList">
              <el-button slot="append" icon="el-icon-search" @click="getHelpList"></el-button>
            </el-input>
          </el-col>

        </el-row>
      </div>

      <el-table :data="helpList" border stripe :default-sort="{prop:'createTime',order:'descending'}">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="单号" prop="id"></el-table-column>
        <el-table-column label="发布者" prop="userId"></el-table-column>
        <el-table-column label="帮代物品" prop="helpArticle"></el-table-column>
        <el-table-column label="帮代状态" prop="helpState" :formatter="helpStateFormatter" ></el-table-column>
        <el-table-column label="发布时间" prop="createTime" :formatter="creatTimeFormatter" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="toDetail(scope.row.id)"></el-button>
            </el-tooltip>

            <!--删除按钮-->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteHelpById(scope.row.id)"></el-button>
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
        name: "HelpOrder",
        data(){
            return{
                queryInfo:{
                    query: '',
                    pageNum: 1,
                    pageSize: 5,
                },
                addDialogVisible: false,
                helpList: [],
                total:0,


            }
        },
        mounted(){
            this.getHelpList();
        },
        methods:{
            getHelpList(){
                let vm = this;
                this.axios({
                    url: '/help/admin/getHelpList',
                    method: 'get',
                    params: vm.queryInfo
                }).then(function(res){
                    if(res.data.code === 200){
                        vm.helpList = res.data.data.helpBriefVos;
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
            toDetail(id){
                this.$router.push({
                    path: '/helpDetail',
                    name: 'HelpDetail',
                    params:{id:id}
                });
            },
            handleSizeChange(newSize){
                this.queryInfo.pageSize = newSize;
                this.getHelpList();
            },
            handleCurrentChange(newPage){
                this.queryInfo.pageNum = newPage;
                this.getHelpList();
            },
            helpStateFormatter(row,column){
                return row.helpState === 1 ? "已接单" : "未接单";
            },
            deleteHelpById(id){
                let vm = this;
                this.$confirm("确认删除该订单吗?\n单号: " + id,"提示",{
                    confirmButtonText: "确认",
                    cancelButtonText: '取消',
                    type: "warning"
                }).then(()=>{
                    this.axios({
                        url: '/help/deleteHelpById',
                        method: 'get',
                        params: {id: id}
                    }).then(function(res){
                        if(res.data.code === 200){
                            vm.$message.success("删除成功");
                            vm.getHelpList();
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
