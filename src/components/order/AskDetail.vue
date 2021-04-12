<template>
    <div>

      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/adminIndex' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单列表</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/askOrder'}">交 流</el-breadcrumb-item>
        <el-breadcrumb-item>详 情</el-breadcrumb-item>
      </el-breadcrumb>

      <el-card>

        <div class="item">
          <span class="title">单 号：</span>
          <span class="content">{{ask.id}}</span>
        </div>

        <div class="item">
          <span class="title">发 布 者：</span>
          <span class="content">{{ask.userId}}</span>
        </div>

        <div class="item">
          <span class="title">所 属 学 校：</span>
          <span class="content">{{ask.school}}</span>
        </div>

        <div class="item">
          <span class="title">发 布 内 容：</span>
          <span class="content">{{ask.content}}</span>
        </div>

        <div class="item">
          <span class="title">发 布 附 件：</span>
          <span  class="content" v-if="ask.photos === [] || ask.photos === null">无</span>
          <span style="margin-left: 35px" v-if="ask.photos !== null && ask.photos.length !== 0" v-for="(item,index) in ask.photos " :key="index">
            <el-image :src="httpBaseUrl + item" style="width: 100px; height: 100px;padding-right: 10px"></el-image>
          </span>
        </div>

        <div class="item">
          <span class="title">发 布 时 间：</span>
          <span class="content">{{ask.createTime}}</span>
        </div>

        <div class="item">
          <span class="title">留 言：</span>
          <span  class="content" v-if="ask.comments.length === 0">无</span>
          <span v-if="ask.comments !== null && ask.comments.length !== 0" v-for="(item,index) in ask.comments" :key="index">
            <div style="margin-left: 140px;margin-bottom: 10px;">
              <span style="color: orangered">{{item.userId}} : </span>
              <span>{{item.content}}</span>
            </div>
          </span>
        </div>


      </el-card>

    </div>
</template>

<script>
  import GLOBAL from '../../api/global_variable'
    export default {
        name: "AskDetail",
        data(){
            return{
                ask:{
                    id: 0,
                    userId: '',
                    school: '',
                    content: '',
                    photos: [],
                    createTime: '',
                    comments:[],
                },
                httpBaseUrl:GLOBAL.httpBaseUrl,
            }
        },
        mounted(){
            let id = this.$route.params.id;
            if(id === undefined || id === '' || id === null){
                this.$router.push("/askOrder");
            }else{
                this.getAskById(id);
            }
        },
        methods:{
            getAskById(id){
                let vm = this;
                this.axios({
                    url: '/ask/admin/getAskById',
                    method: 'get',
                    params:{id: id}
                }).then(function (res) {
                    if(res.data.code === 200){
                        //console.log(res.data.data);
                        vm.ask.id = res.data.data.id;
                        vm.ask.userId = res.data.data.userId;
                        vm.ask.school = res.data.data.school;
                        vm.ask.content = res.data.data.content;
                        vm.ask.photos = res.data.data.photos;
                        vm.ask.createTime = res.data.data.createTime;
                        vm.ask.comments = res.data.data.commentVoList
                    }else{
                        vm.$message.error(res.data.msg);
                    }
                }).catch(function (err) {
                    this.$message.error("故障啦" + err);
                })
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
