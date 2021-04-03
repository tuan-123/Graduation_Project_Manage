<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminIndex' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>日志列表</el-breadcrumb-item>
      <el-breadcrumb-item>操作日志</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card>
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <el-col :span="5">
            <el-input placeholder="请输入操作描述" v-model="queryInfo.query" clearable></el-input>
          </el-col>
          <el-col :span="3.1">
            <el-date-picker
              v-model="queryInfo.startTime"
              :editable="false"
              :picker-options="pickerOptionsStart"
              type="datetime"
              placeholder="选择起始时间"></el-date-picker>
          </el-col>
          <el-col :span="0.5">
            <el-tag>至</el-tag>
          </el-col>
          <el-col :span="4">
            <el-date-picker
              v-model="queryInfo.endTime"
              :editable="false"
              :picker-options="pickerOptionsEnd"
              type="datetime"
              placeholder="选择日期时间"></el-date-picker>
          </el-col>
          <el-col :span="1.5">
            <el-button type="primary" @click="selectOperLog">查询</el-button>
          </el-col>
          <el-col :span="2">
            <el-button type="info" @click="resetQueryInfo">重置</el-button>
          </el-col>

        </el-row>
      </div>

      <el-table :data="operLogList" border stripe :default-sort="{prop:'createTime',order:'descending'}">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="ID" prop="id"></el-table-column>
        <el-table-column label="操作模块" prop="modul"></el-table-column>
        <el-table-column label="操作类型" prop="type"></el-table-column>
        <el-table-column label="操作描述" prop="desc"></el-table-column>
        <el-table-column label="操作员" prop="userId"></el-table-column>
        <el-table-column label="IP" prop="ip"></el-table-column>
        <el-table-column label="操作时间" prop="createTime" :formatter="creatTimeFormatter" sortable></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-tooltip effect="dark" content="详情" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="toDetail(scope.row.id)"></el-button>
            </el-tooltip>

            <!--删除按钮-->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button disabled type="danger" icon="el-icon-delete" size="mini" @click=""></el-button>
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
        name: "OperLog",
        data(){
            return{
                queryInfo:{
                    query: '',
                    pageNum: 1,
                    pageSize: 5,
                    startTime: null,
                    endTime: null
                },
                operLogList:[],
                total: 0,
                pickerOptionsStart: {
                    disabledDate: time => {
                        let endDateVal = this.queryInfo.endTime;
                        if (endDateVal) {
                            return time.getTime() > new Date(endDateVal).getTime();
                        }
                    }
                },
                pickerOptionsEnd: {
                    disabledDate: time => {
                        let beginDateVal = this.queryInfo.startTime;
                        if (beginDateVal) {
                            return (
                                time.getTime() < new Date(beginDateVal).getTime()
                            );
                        }
                    },
                },
            }
        },
        mounted(){
            this.getOperLogList();
        },
        methods:{
            getOperLogList(){
                let vm = this;
                this.axios({
                    url: '/operLog/admin/getOperLogBriefList',
                    method: 'get',
                    params: {
                        query:vm.queryInfo.query,
                        pageNum: vm.queryInfo.pageNum,
                        pageSize: vm.queryInfo.pageSize,
                        startTime: vm.queryInfo.startTime != null ? formatDate(vm.queryInfo.startTime) : null,
                        endTime: vm.queryInfo.endTime != null ? formatDate(vm.queryInfo.endTime) : null,
                    }
                }).then(function(res){
                    if(res.data.code === 200){
                        vm.operLogList = res.data.data.operLogBriefVos;
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
                this.getOperLogList();
            },
            handleCurrentChange(newPage){
                this.queryInfo.pageNum = newPage;
                this.getOperLogList();
            },
            toDetail(id){
                this.$router.push({
                    path: '/operLogDetail',
                    name: 'OperLogDetail',
                    params:{
                        id: id
                    }
                });
            },
            selectOperLog(){
                this.getOperLogList();
            },
            resetQueryInfo(){
                this.queryInfo.query = '';
                this.queryInfo.startTime = null;
                this.queryInfo.endTime = null;
            },

        }

    }

    var formatDate = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        var second= date.getSeconds();
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+ second;
    };
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
