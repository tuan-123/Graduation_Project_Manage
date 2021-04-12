<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminIndex' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      <el-breadcrumb-item>闲 置</el-breadcrumb-item>
    </el-breadcrumb>
    <!--卡片视图-->
    <el-card>
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <el-col :span="7">
            <el-input placeholder="请输入发布者账号" v-model="queryInfo.query" clearable @clear="getIdleList">
              <el-button slot="append" icon="el-icon-search" @click="getIdleList"></el-button>
            </el-input>
          </el-col>

        </el-row>
        <el-table :data="idleList" border stripe :default-sort="{prop:'createTime',order:'descending'}">
          <el-table-column type="index"></el-table-column>
          <el-table-column label="单号" prop="id"></el-table-column>
          <el-table-column label="发布者" prop="userId"></el-table-column>
          <el-table-column label="物品" prop="title"></el-table-column>
          <el-table-column label="标签" prop="tab" :formatter="tabFormatter"></el-table-column>
          <el-table-column label="价格" prop="price"></el-table-column>
          <el-table-column label="数量" prop="num"></el-table-column>
          <el-table-column label="联系方式" prop="phone"></el-table-column>
          <el-table-column label="发布时间" prop="createTime" :formatter="creatTimeFormatter" sortable></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!--修改按钮-->
              <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="toDetail(scope.row.id)"></el-button>
              </el-tooltip>

              <!--删除按钮-->
              <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteIdleById(scope.row.id)"></el-button>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
      </div>

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
        name: "IdleOrder",
        data(){
            return{
                queryInfo:{
                    query: '',
                    pageNum: 1,
                    pageSize: 5,
                },
                addDialogVisible: false,
                idleList: [],
                total:0,


            }
        },
        mounted(){
            this.getIdleList();
        },
        methods:{
            getIdleList(){
                let vm = this;
                this.axios({
                    url: '/idle/admin/getIdleList',
                    method: 'get',
                    params: vm.queryInfo
                }).then(function(res){
                    if(res.data.code === 200){
                        vm.idleList = res.data.data.adminIdleBriefVoList;
                        vm.total = res.data.data.total;
                    }else{
                        vm.total = 0;
                        vm.$message.error(res.data.msg);
                    }
                }).catch(function (err) {
                    vm.$message.error(err);
                })
            },
            handleSizeChange(newSize){
                this.queryInfo.pageSize = newSize;
                this.getIdleList();
            },
            handleCurrentChange(newPage){
                this.queryInfo.pageNum = newPage;
                this.getIdleList();
            },
            creatTimeFormatter(row,column){
                return row.createTime.substring(0,10);
            },
            toDetail(id){
                this.$router.push({
                    path: '/idleDetail',
                    name: 'IdleDetail',
                    params:{id:id}
                });
            },
            tabFormatter(row,column){
                //console.log(row.tab)
                if(row.tab === null) {
                    return "---";
                } else{
                    let tabString = '';
                    for(let i = 0; i < row.tab.length;i++){
                        tabString += (row.tab[i] + '; ')
                    }
                    return tabString;
                }
            },
            deleteIdleById(id){
                let vm = this;
                this.$confirm("确认删除该订单吗?\n单号: " + id,"提示",{
                    confirmButtonText: "确认",
                    cancelButtonText: '取消',
                    type: "warning"
                }).then(()=>{
                    this.axios({
                        url: '/idle/admin/deleteIdleById',
                        method: 'get',
                        params: {id: id}
                    }).then(function(res){
                        if(res.data.code === 200){
                            vm.$message.success("删除成功");
                            vm.getIdleList();
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
