<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminIndex' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>首页配置</el-breadcrumb-item>
      <el-breadcrumb-item>公告配置</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card style="margin-top: 15px;" v-loading="deleteNoticeLoading">
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-button type="primary" @click="addNoticeDialogVisible = true" :disabled="noticeObj.length === 1">添加公告</el-button>
          </el-col>
        </el-row>
      </div>

      <el-table :data="noticeObj" border stripe style="margin-top:10px">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="内容" prop="content"></el-table-column>
        <el-table-column label="链接地址" prop="address">
          <template slot-scope="scope" >
            <el-link>{{scope.row.address}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="公告时间" prop="startTime"></el-table-column>
        <el-table-column label="结束时间" prop="endTime"></el-table-column>
        <el-table-column label="创建时间" prop="createTime" :formatter="creatTimeFormatter"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button type="primary" icon="el-icon-edit" size="mini" @click="updateNotice(scope.row.id,scope.row.content,scope.row.address,scope.row.startTime,scope.row.endTime)"></el-button>
            </el-tooltip>

            <!--删除按钮-->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteNotice(scope.row.id)"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--添加对话框-->
    <el-dialog
      title="添加公告"
      :visible.sync="addNoticeDialogVisible"
      width="30%"
      @close="addDialogClosed">
      <!--主体-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="110px" v-loading="addNoticeLoading">
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" prefix-icon="iconfont icon-user" placeholder="请输入公告内容" v-model="addForm.content"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="address">
          <el-input type="textarea" prefix-icon="iconfont icon-user" placeholder="请输入链接地址" v-model="addForm.address"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="addForm.startTime"
            :editable="false"
            :picker-options="pickerOptionsStart"
            type="datetime"
            placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="addForm.endTime"
            :editable="false"
            :picker-options="pickerOptionsEnd"
            type="datetime"
            placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer">
          <el-button @click="addNoticeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addNotice">确 定</el-button>
        </span>
    </el-dialog>

    <!--修改对话框-->
    <el-dialog
      title="修改公告"
      :visible.sync="updateNoticeDialogVisible"
      width="30%"
      @close="updateDialogClosed">
      <!--主体-->
      <el-form :model="updateForm" :rules="updateFormRules" ref="updateFormRef" label-width="110px" v-loading="updateNoticeLoading">
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" prefix-icon="iconfont icon-user" placeholder="请输入公告内容" v-model="updateForm.content"></el-input>
        </el-form-item>
        <el-form-item label="链接" prop="address">
          <el-input type="textarea" prefix-icon="iconfont icon-user" placeholder="请输入链接地址" v-model="updateForm.address"></el-input>
        </el-form-item>
        <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            v-model="updateForm.startTime"
            :editable="false"
            :picker-options="updatePickerOptionsStart"
            type="datetime"
            placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            v-model="updateForm.endTime"
            :editable="false"
            :picker-options="updatePickerOptionsEnd"
            type="datetime"
            placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer">
          <el-button @click="updateNoticeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="update">修 改</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
    export default {
        name: "NoticeConfig",
        data(){
            return{
                addNoticeDialogVisible: false,
                noticeObj:[],

                addForm:{
                    content: '',
                    address: '',
                    startTime: '',
                    endTime: '',
                },
                addFormRules:{
                    content: [
                        {required:true,message:'请输入公告内容',trigger:'blur'},
                    ],
                    startTime:[
                        {required: true,message:'请选择开始时间',trigger: 'blur'},
                    ],
                    endTime:[
                        {required:true,message: '请选择结束时间',trigger: 'blur'},
                    ]
                },
                addNoticeLoading: false,

                pickerOptionsStart: {
                    disabledDate: time => {
                        let endDateVal = this.addForm.endTime;
                        if (endDateVal) {
                            return time.getTime() > new Date(endDateVal).getTime();
                        }
                    }
                },
                pickerOptionsEnd: {
                    disabledDate: time => {
                        let beginDateVal = this.addForm.startTime;
                        if (beginDateVal) {
                            return (
                                time.getTime() < new Date(beginDateVal).getTime()
                            );
                        }
                    },
                },
                deleteNoticeLoading: false,


                updateNoticeLoading: false,
                updateNoticeDialogVisible: false,
                updateForm:{
                    id: 0,
                    content: '',
                    address: '',
                    startTime: '',
                    endTime: '',
                },
                updateFormRules:{
                    content: [
                        {required:true,message:'请输入公告内容',trigger:'blur'},
                    ],
                    startTime:[
                        {required: true,message:'请选择开始时间',trigger: 'blur'},
                    ],
                    endTime:[
                        {required:true,message: '请选择结束时间',trigger: 'blur'},
                    ]
                },
                updatePickerOptionsStart: {
                    disabledDate: time => {
                        let endDateVal = this.updateForm.endTime;
                        if (endDateVal) {
                            return time.getTime() > new Date(endDateVal).getTime();
                        }
                    }
                },
                updatePickerOptionsEnd: {
                    disabledDate: time => {
                        let beginDateVal = this.updateForm.startTime;
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
            this.getNoticeData();
        },
        methods:{
            creatTimeFormatter(row,column){
                return row.createTime.substring(0,10);
            },
            addDialogClosed(){
                this.$refs.addFormRef.resetFields();
            },
            addNotice(){
                this.$refs.addFormRef.validate(async valid =>{
                    if(!valid){
                        this.$message.error('请仔细检查哦！');
                        return;
                    }
                    this.addNoticeLoading = true;
                    let vm = this;
                    this.axios({
                        url: '/notice/admin/addNotice',
                        method: 'post',
                        data:{
                            content: vm.addForm.content,
                            address: vm.addForm.address,
                            startTime: vm.addForm.startTime,
                            endTime: vm.addForm.endTime
                        }
                    }).then(function (res) {
                        vm.addNoticeLoading = false;
                        if(res.data.code === 200){
                            vm.$message.success("添加成功");
                            vm.addNoticeDialogVisible = false;
                            vm.getNoticeData();
                        }else{
                            vm.$message.error(res.data.msg);
                        }
                    }).catch(function (err) {
                        vm.addNoticeLoading = false;
                        vm.$message.error("故障啦" + err);
                    })

                });
            },
            getNoticeData(){
                let vm = this;
                this.axios({
                    url: '/notice/admin/adminGetNotice',
                    method: 'get',
                }).then(function (res) {
                    if(res.data.code === 200){
                        if(res.data.data !== undefined && res.data.data !== null)
                            vm.noticeObj.push(res.data.data);
                    }else{
                        vm.$message.error(res.data.msg);
                    }
                }).catch(function (err) {
                    vm.$message.error("故障啦 " + err);
                })
            },
            deleteNotice(id){
                this.$confirm("确定要删除该公告吗？","提示",{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: "warning"
                }).then(()=>{
                    this.deleteNoticeLoading = true;
                    let vm = this;
                    this.axios({
                        url: "/notice/admin/deleteNotice",
                        method: 'get',
                        params:{id: id}
                    }).then(function (res) {
                        vm.deleteNoticeLoading = false;
                        if(res.data.code === 200){
                            vm.noticeObj = [];
                            vm.$message.success("已删除");
                        }else{
                            vm.$message.error(res.date.msg);
                        }
                    }).catch(function (err) {
                        vm.deleteNoticeLoading = false;
                        vm.$message.error("故障啦 " + err);
                    });

                }).catch(()=>{
                   this.$message.warning("已取消");
                });
            },



            updateDialogClosed(){
                this.$refs.updateFormRef.resetFields();
            },
            updateNotice(id,content,address,startTime,endTime){
                this.updateForm.id = id;
                this.updateForm.content = content;
                this.updateForm.address = address;
                this.updateForm.startTime = parserDate(startTime);
                this.updateForm.endTime = parserDate(endTime);
                this.updateNoticeDialogVisible = true;
            },
            update(){
                this.$confirm("确认修改吗?","提示",{
                    confirmButtonText: "确认",
                    cancelButtonText: '取消',
                    type: "warning"
                }).then(()=>{
                    let vm = this;
                    this.$refs.updateFormRef.validate(async valid => {
                        if(!valid){
                            vm.$message.error("请仔细检查哦！");
                            return;
                        }
                        vm.updateNoticeLoading = true;
                        vm.axios({
                            url: '/notice/admin/updateNoticeById',
                            method: 'post',
                            data: vm.updateForm
                        }).then(function (res) {
                            vm.updateNoticeLoading = false;
                            if(res.data.code === 200){
                                vm.$message.success("修改成功");
                                (vm.noticeObj.find(item => item.id === vm.updateForm.id)).content = vm.updateForm.content;                                (vm.noticeObj.find(item => item.id === vm.updateForm.id)).content = vm.updateForm.content;
                                (vm.noticeObj.find(item => item.id === vm.updateForm.id)).address = vm.updateForm.address;
                                (vm.noticeObj.find(item => item.id === vm.updateForm.id)).startTime = formatDate(vm.updateForm.startTime);
                                (vm.noticeObj.find(item => item.id === vm.updateForm.id)).endTime = formatDate(vm.updateForm.endTime);
                                vm.updateNoticeDialogVisible = false;
                            }else{
                                vm.$message.error(res.data.msg);
                            }
                        }).catch(function (err) {
                            vm.updateNoticeLoading = false;
                            vm.$message.error("故障啦 " + err);
                        })
                    });
                }).catch(()=>{
                    this.$message.warning("已取消");
                })

            }
        },

    }


    var formatDate = function (date) {
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        var minute = date.getMinutes();
        minute = minute < 10 ? ('0' + minute) : minute;
        var second= date.getSeconds();
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d+' '+h+':'+minute+':'+ second;
    };

    var parserDate = function (date) {
        var t = Date.parse(date);
        if (!isNaN(t)) {
            return new Date(Date.parse(date.replace(/-/g, "/")));
        } else {
            return new Date();
        }
    };

</script>

<style scoped>

</style>
