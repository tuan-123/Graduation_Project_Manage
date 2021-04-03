<template>
  <div>
    <!--面包屑导航区-->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminIndex' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>首页配置</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图配置</el-breadcrumb-item>
    </el-breadcrumb>

    <!--卡片视图-->
    <el-card style="margin-top: 15px;" v-loading="deleteCarouselMapLoading">
      <div style="margin-top: 15px;">
        <el-row :gutter="20">
          <el-col :span="4">
            <el-button type="primary" @click="addCarouselDialogVisible = true" :disabled="carouselMapObj.length === carouselMapMaxNum">添加轮播图</el-button>
          </el-col>
        </el-row>
      </div>

      <el-table :data="carouselMapObj" border stripe style="margin-top:10px">
        <el-table-column type="index"></el-table-column>
        <el-table-column label="图片" prop="picture">
          <template slot-scope="scope">
            <el-avatar shape="square" :src="httpBaseUrl + scope.row.img"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="链接地址" prop="address">
          <template slot-scope="scope" >
            <el-link>{{scope.row.url}}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="createTime" :formatter="creatTimeFormatter"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!--修改按钮-->
            <el-tooltip effect="dark" content="编辑" placement="top" :enterable="false">
              <el-button disabled type="primary" icon="el-icon-edit" size="mini" @click="updateCarouselMap(scope.row.id,scope.row.picture,scope.row.address)"></el-button>
            </el-tooltip>

            <!--删除按钮-->
            <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
              <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteCarouselMap(scope.row.id)"></el-button>
            </el-tooltip>

          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--添加对话框-->
    <el-dialog
      title="添加轮播图"
      :visible.sync="addCarouselDialogVisible"
      width="30%"
      @close="addDialogClosed">
      <!--主体-->
      <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="110px" v-loading="addCarouselLoading">
        <el-form-item label="轮播图" prop="picture">
          <!--<el-input type="textarea" prefix-icon="iconfont icon-user" placeholder="请输入公告内容" v-model="addForm.picture"></el-input>-->

          <el-upload
            class="upload-demo"
            ref="upload"
            accept="image/*"
            :limit="1"
            :before-upload="beforeUpLoad"
            :on-remove="myRemove"
            :on-error="uploadError"
            :on-success="uploadSuccess"
            :on-exceed="uploadExceed"
            :headers="headers"
            :action="uploadUrl"
            :data="data"
            :file-list="fileList"
            :auto-upload="false"
            list-type="picture">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>

        </el-form-item>
        <el-form-item label="链接" prop="address">
          <el-input type="textarea" prefix-icon="iconfont icon-user" placeholder="请输入链接地址" v-model="addForm.address"></el-input>
        </el-form-item>
      </el-form>
      <!--底部区-->
      <span slot="footer">
          <el-button @click="addCarouselDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addCarousel">确 定</el-button>
        </span>
    </el-dialog>

  </div>
</template>

<script>
  import GLOBAL from '../../api/global_variable';
    export default {
        name: "CarouselMapConfig",
        data(){
            return{
                httpBaseUrl:GLOBAL.httpBaseUrl,
                uploadUrl:GLOBAL.httpBaseUrl + "/carousel/admin/addCarouselMap",
                deleteCarouselMapLoading: false,
                carouselMapObj:[],
                carouselMapMaxNum: 6,
                addCarouselDialogVisible: false,
                addForm:{
                    picture:'',
                    address:'',
                },
                addFormRules:{
                    picture:[
                        {required: true,message:"请上传图片",trigger:'blur'},
                    ],
                },
                addCarouselLoading: false,

                headers:{'Authorization': window.sessionStorage.getItem("token")},
                data:{'address':'','userId':window.sessionStorage.getItem("userId")},
                fileList:[],
            }
        },
        mounted(){
            this.getCarouselMapList();
        },
        methods:{
            creatTimeFormatter(row,column){
                return row.createTime.substring(0,10);
            },
            updateCarouselMap(id,picture,address){

            },
            deleteCarouselMap(id){
                this.$confirm("确定删除？","提示",{
                    confirmButtonText: "确认",
                    cancelButtonText: "取消",
                    type:'warning'
                }).then(()=>{
                    this.deleteCarouselMapLoading = true;
                    let vm = this;
                    this.axios({
                        url: '/carousel/admin/deleteCarousel',
                        method:'get',
                        params:{
                            id: id
                        }
                    }).then(function (res) {
                        vm.deleteCarouselMapLoading = false;
                        if(res.data.code === 200){
                            vm.$message.success("删除成功");
                            vm.getCarouselMapList();
                        }else{
                            vm.$message.error(res.data.msg);
                        }
                    }).catch(function (err) {
                        vm.deleteCarouselMapLoading = false;
                        vm.$message.error("故障啦"+err);
                    })
                }).catch(()=>{
                    this.$message.warning("已取消");
                });

            },
            addCarousel(){
                this.data.address = this.addForm.address;
                this.addCarouselLoading = true;
                this.$refs.upload.submit();
            },
            addDialogClosed(){
                this.$refs.addFormRef.resetFields();
                this.fileList = [];
            },
            uploadExceed(files,fileList){
                this.$message.warning("不要贪心啦");
            },
            uploadError(err, file, fileList){
                this.$message.error("上传失败："+err);
            },
            uploadSuccess(response,file,fileList){
                this.addCarouselLoading = false;
                //console.log(response);
                if(response.code === 200){
                    this.$message.success("添加成功");
                    this.addCarouselDialogVisible = false;
                    this.getCarouselMapList();
                }else{
                    this.$message.error(response.msg);
                }
            },
            myRemove(file,fileList){
                this.fileList = [];
            },
            beforeUpLoad(file){
                //console.log(file)
                if(file.type.indexOf("image") === -1){
                    this.$message.warning("请选择图片");
                    return false;
                }else if(file.size > 5242880){
                    this.$message.warning("图片不能超过5兆");
                    return false
                }
                return true;
            },
            getCarouselMapList(){
                let vm = this;
                this.axios({
                    url: '/carousel/getCarouselList',
                    method: 'get',
                }).then(function (res) {
                    if(res.data.code === 200){
                        vm.carouselMapObj = res.data.data;
                    }else{
                        vm.$message.error(res.data.msg);
                    }
                }).catch(function (err) {
                    this.$message.error("故障啦" + err);
                })
            }
        },
    }
</script>

<style scoped>

</style>
