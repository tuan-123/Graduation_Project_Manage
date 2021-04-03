<template>
    <div>
      <!--面包屑导航区-->
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/adminIndex' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>

      <!--卡片视图-->
      <el-card>
        <div style="margin-top: 15px;">
            <el-row :gutter="20">
            <el-col :span="7">
              <el-input placeholder="请输入用户(id)" v-model="queryInfo.query" clearable @clear="getUserList">
                <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
              </el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
            </el-col>
          </el-row>
        </div>

        <!--用户列表区-->
        <el-table :data="userList" border stripe :default-sort="{prop:'createTime',order:'descending'}">
          <el-table-column type="index"></el-table-column>
          <el-table-column label="用户" prop="userId"></el-table-column>
          <el-table-column label="昵称" prop="nickName"></el-table-column>
          <el-table-column label="邮箱" prop="email"></el-table-column>
          <el-table-column label="头像">
            <template slot-scope="scope">
              <el-avatar shape="square" :src="httpBaseUrl + scope.row.image"></el-avatar>
            </template>
          </el-table-column>
          <el-table-column label="学校" prop="school" sortable :formatter="schoolFormatter"></el-table-column>
          <el-table-column label="学号" prop="schoolNum" sortable :formatter="schoolNumFormatter"></el-table-column>
          <el-table-column label="人脸登录" prop="faceLogin" :formatter="faceLoginFormatter"></el-table-column>
          <!--
          <el-table-column label="角色" prop="role" :formatter="roleFormatter"></el-table-column>
          -->
          <!--这里是在有用户状态情况下使用的，这里只是利用role的值简单模仿了一下效果-->
          <el-table-column label="状态">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.state" :inactive-value="0" :active-value="1" active-text="正常" inactive-text="禁用" @change="stateChange(scope.row.state,scope.row.userId)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="注册时间" prop="createTime" :formatter="creatTimeFormatter" sortable></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <!--修改按钮-->
              <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
                <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateUser(scope.row.userId,scope.row.email,scope.row.school,scope.row.schoolNum,scope.$index)"></el-button>
              </el-tooltip>

              <!--删除按钮-->
              <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row.userId)"></el-button>
              </el-tooltip>

              <!--分配角色按钮-->
              <!--
              <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                <el-button type="warning" icon="el-icon-setting" size="mini"></el-button>
              </el-tooltip>
              -->

            </template>
          </el-table-column>
        </el-table>
        <!--分页区域-->
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

      <!--添加用户对话框-->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisible"
        width="30%"
        @close="addDialogClosed">
        <!--主体-->
        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px" v-loading="addUserLoading">
          <el-form-item label="手机号" prop="userId">
            <el-input prefix-icon="iconfont icon-user" placeholder="请输入手机号码" v-model="addForm.userId"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input type="password" prefix-icon="iconfont icon-3702mima" placeholder="请输入密码" v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input prefix-icon="el-icon-s-comment" v-model="addForm.email" placeholder="请输入邮箱" ></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-radio v-model="addForm.radio" label="0" style="margin-left: 20px">普通用户</el-radio>
            <el-radio v-model="addForm.radio" label="2" >管理员</el-radio>
          </el-form-item>
        </el-form>
        <!--底部区-->
        <span slot="footer">
          <el-button @click="addDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!--编辑用户对话框-->
      <el-dialog
        title="编辑用户"
        :visible.sync="updateUserDialogVisible"
        width="30%"
        @close="updateDialogClosed">
        <!--主体-->
        <el-form :model="updateForm" :rules="addFormRules" ref="updateFormRef" label-width="70px" v-loading="updateUserLoading">
          <el-form-item label="用户" prop="userId">
            <el-input prefix-icon="iconfont icon-user" placeholder="请输入手机号码" v-model="updateForm.userId" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input prefix-icon="el-icon-s-comment" v-model="updateForm.email" placeholder="请输入邮箱" style="width: 60%"></el-input><el-button type="primary" round @click="updateEmail" style="margin-left: 30px">更换</el-button>
          </el-form-item>
          <el-form-item label="学校" prop="school">
            {{updateForm.school === '-1' ? '未绑定' : updateForm.school}}
            <el-button round type="danger" :disabled="updateForm.school === '-1'" @click="unbundlingSchool" style="margin-left: 30px">解绑</el-button>
          </el-form-item>
          <el-form-item label="学号" prop="schoolNum">
            {{updateForm.schoolNum === '-1' ? '未绑定' : updateForm.schoolNum}}
            <el-button round type="danger" :disabled="updateForm.schoolNum === '-1'" @click="unbundlingSchoolNum" style="margin-left: 30px">解绑</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>

    </div>
</template>

<script>
  import GLOBAL from "../../api/global_variable";
    export default {
        name: "User",
        data(){
            return {
                queryInfo:{
                    query: '',
                    pageNum: 1,
                    pageSize: 5,
                },
                userList: [],
                total: 0,
                addDialogVisible: false,
                httpBaseUrl: GLOBAL.httpBaseUrl,

                addForm:{
                    userId: '',
                    password: '',
                    email: '',
                    radio: '0',
                },
                addFormRules:{
                    userId: [
                        {required:true,message:'请输入手机号码',trigger:'blur'},
                        { pattern: /^1[3|4|5|7|8][0-9]{9}$/,min:11,max:11,message: '请输入正确的手机号码',trigger: 'blur'}
                    ],
                    password: [
                        {required:true,message:'请输入密码',trigger:'blur'},
                        { min:6,max:12,message: '长度在6到12个字符',trigger: 'blur'}
                    ],
                    email:[
                        {required:true,message:'请输入邮箱',trigger:'blur'},
                        {pattern: /^[A-Za-z\d]+[A-Za-z\d\-_\.]*@([A-Za-z\d]+[A-Za-z\d\-]*\.)+[A-Za-z]{2,4}$/,message: '请输入正确的邮箱',trigger: 'blur'}
                    ]
                },
                addUserLoading: false,
                updateUserDialogVisible: false,
                updateUserLoading: false,
                updateForm:{
                    userId:'',
                    email: '',
                    school: '',
                    schoolNum: '',
                },
                updateFormRules:{
                    userId: [
                        {required:true,message:'请输入手机号码',trigger:'blur'},
                        { pattern: /^1[3|4|5|7|8][0-9]{9}$/,min:11,max:11,message: '请输入正确的手机号码',trigger: 'blur'}
                    ],
                    email:[
                        {required:true,message:'请输入邮箱',trigger:'blur'},
                        {pattern: /^[A-Za-z\d]+[A-Za-z\d\-_\.]*@([A-Za-z\d]+[A-Za-z\d\-]*\.)+[A-Za-z]{2,4}$/,message: '请输入正确的邮箱',trigger: 'blur'}
                    ]
                },
                oldEmail: '',
            }
        },
        mounted(){
            this.getUserList();
        },
        methods:{
            getUserList(){
                let vm = this;
                this.axios({
                    url: '/user/admin/getUserList',
                    method: 'get',
                    params: vm.queryInfo
                }).then(function(res){
                    //console.log(res);
                    if(res.data.code === 200){
                        vm.userList = res.data.data.userVoList;
                        vm.total = res.data.data.total;
                    }else {
                        vm.$message.error(res.data.msg);
                        vm.total = 0;
                    }

                }).catch(function (err) {
                    vm.$message.error(err);
                })
            },
            // 监听pageSize改变的事件
            handleSizeChange(newSize){
                this.queryInfo.pageSize = newSize;
                this.getUserList();
            },
            //监听currentPage的事件(pageNum)
            handleCurrentChange(newPage){
                this.queryInfo.pageNum = newPage;
                this.getUserList();
            },
            roleFormatter(row,column){
                if(row.role === 0 ){
                    return '普通用户';
                }else if(row.role === 1){
                    return '管理员';
                }
            },
            creatTimeFormatter(row,column){
                return row.createTime.substring(0,10);
            },
            schoolFormatter(row,column){
                if(row.school === '-1')
                    return '未绑定';
                return row.school;
            },
            schoolNumFormatter(row,column){
                if(row.schoolNum === '-1')
                    return '未绑定';
                return row.schoolNum;
            },
            faceLoginFormatter(row,column){
                if(row.faceLogin === 0)
                    return "未开启";
                return "已开启";
            },
            stateChange(newState,userId){
                //console.log(newState);
                //console.log(userId);
                let vm = this;
                this.axios({
                    url: '/user/admin/changeStateById',
                    method: 'get',
                    params:{
                        userId: userId,
                        state: newState
                    }
                }).then(function (res) {
                    if(res.data.code === 200){
                        vm.$message.success("修改成功");
                    }else{
                        vm.$message.error(res.data.msg);
                    }
                }).catch(function (err) {
                    vm.$message.error("故障啦---" + err);
                })
            },

            addDialogClosed(){
                this.$refs.addFormRef.resetFields();
            },
            addUser(){
                /**
                 this.$refs.addFormRef.validate(async valid => {
                    if(!valid){
                        this.$message.error('请仔细检查哦！');
                        return;
                    }
                    const {data:res} = await this.$http.post('/user/add',{
                        data:{
                            userId:this.addForm.userId,
                            password:this.addForm.password,
                            email:this.addForm.email,
                            role:parseInt(this.addForm.radio)
                        }
                    });

                    if(res.data.code !== 200){
                        this.$message.error(res.data.msg);
                    }else{
                        this.$message.success("添加用户成功！");
                        this.addDialogVisible = false;
                        this.getUserList();
                    }


                })
                 **/
                this.$refs.addFormRef.validate(async valid => {
                    if(!valid){
                        this.$message.error('请仔细检查哦！');
                        return;
                    }
                    this.addUserLoading = true;
                    var vm = this;
                    this.axios({
                        url:'/user/admin/addUser',
                        method: 'post',
                        data:{
                            userId: this.addForm.userId,
                            password: this.addForm.password,
                            email: this.addForm.email,
                            role: parseInt(this.addForm.radio)
                        }
                    }).then(function (response) {
                        vm.addUserLoading = false;
                        if(response.data.code !== 200){
                            vm.$message.error("添加失败");
                            //vm.$message.error(response.data.msg);
                        }else{
                            vm.$message.success("添加用户成功！");
                            vm.addDialogVisible = false;
                            vm.getUserList();
                        }
                    })

                })
            },
            deleteUser(userId){
                let vm = this;
                this.$confirm('是否删除该用户: ' + userId, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(()=>{
                    vm.axios({
                        url: '/user/admin/deleteUserById',
                        method: 'get',
                        params:{userId: userId}
                    }).then(function (res) {
                        if(res.data.code === 200) {
                            vm.$message.success("删除成功");
                            vm.getUserList();
                        }else
                            vm.$message.error(res.data.msg);
                    }).catch(function (err) {
                        vm.$message.error("故障啦 : " + err);
                    })
                }).catch(()=>{

                });
            },
            updateDialogClosed(){

                // 采用es6中的新特性
                (this.userList.find(item => item.userId === this.updateForm.userId)).email = this.updateForm.email;
                (this.userList.find(item => item.userId === this.updateForm.userId)).school = this.updateForm.school;
                (this.userList.find(item => item.userId === this.updateForm.userId)).schoolNum = this.updateForm.schoolNum;
                this.$refs.updateFormRef.resetFields();
            },
            updateUser(userId,email,school,schoolNum){
                this.updateForm.userId = userId;
                this.updateForm.email = email;
                this.oldEmail = email;
                this.updateForm.school = school;
                this.updateForm.schoolNum = schoolNum;
                this.updateUserDialogVisible = true;
            },
            unbundlingSchool(){
                let vm = this;
                this.$confirm("确定解绑该学校吗？","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText: "取消"
                }).then(()=>{
                    this.updateUserLoading = true;
                    this.axios({
                        url: '/user/admin/unBundlingSchool',
                        method: 'get',
                        params:{
                            userId: vm.updateForm.userId
                        }
                    }).then(function(res){
                        vm.updateUserLoading = false;
                        if(res.data.code === 200){
                            vm.updateForm.school = '-1';
                            vm.$message.success("解绑成功");
                        }else{
                            vm.$message.error("解绑失败");
                        }
                    }).catch(function(err){
                        vm.updateUserLoading = false;
                        vm.$message.error("故障啦 " + err);
                    });
                }).catch(()=>{

                });
            },
            unbundlingSchoolNum(){
                let vm = this;
                this.$confirm("确定解绑该学号吗？","提示",{
                    confirmButtonText:"确定",
                    cancelButtonText: "取消"
                }).then(()=>{
                    this.updateUserLoading = true;
                    this.axios({
                        url: '/user/admin/unBundlingSchoolNum',
                        method: 'get',
                        params:{
                            userId: vm.updateForm.userId
                        }
                    }).then(function(res){
                        vm.updateUserLoading = false;
                        if(res.data.code === 200){
                            vm.updateForm.schoolNum = '-1';
                            vm.$message.success("解绑成功");
                        }else{
                            vm.$message.error("解绑失败");
                        }
                    }).catch(function(err){
                        vm.updateUserLoading = false;
                        vm.$message.error("故障啦 " + err);
                    });
                }).catch(()=>{

                });
            },
            updateEmail(){
                this.$refs.updateFormRef.validate(async valid =>{
                   if(!valid){
                       this.$message.error('请仔细检查哦！');
                       return;
                   }
                   let vm = this;
                   this.$confirm("是否更换为：" + vm.updateForm.email,"提示", {
                       confirmButtonText: '确定',
                       cancelButtonText: '取消',
                       type: 'warning'
                   }).then(()=>{
                       vm.updateUserLoading = true;
                       vm.axios({
                           url: '/user/admin/updateEmail',
                           method: 'get',
                           params:{
                               userId: vm.updateForm.userId,
                               email: vm.updateForm.email
                           }
                       }).then(function (res) {
                           vm.updateUserLoading = false;
                           if(res.data.code === 200){
                               vm.$message.success("更改成功");
                           }else{
                               vm.updateForm.email = vm.oldEmail;
                               vm.$message.error(res.data.msg);
                           }
                       }).catch(function (err) {
                           vm.updateUserLoading = false;
                           vm.updateForm.email = vm.oldEmail;
                           vm.$message.error("故障啦 " + err);
                       })

                   }).catch(()=>{
                       vm.$message.warning("已取消");
                   });
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
