<template>
  <div>

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/adminIndex' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/idleOrder'}">闲 置</el-breadcrumb-item>
      <el-breadcrumb-item>详 情</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card>

      <div class="item">
        <span class="title">单 号：</span>
        <span class="content">{{idle.id}}</span>
      </div>

      <div class="item">
        <span class="title">发 布 者：</span>
        <span class="content">{{idle.userId}}</span>
      </div>

      <div class="item">
        <span class="title">所 属 学 校：</span>
        <span class="content">{{idle.school}}</span>
      </div>

      <div class="item">
        <span class="title">闲 置 物 品：</span>
        <span class="content">{{idle.title}}</span>
      </div>

      <div class="item">
        <span class="title">闲 置 标 签：</span>
        <span class="content" v-if="idle.tab === null">无</span>
        <span style="margin-left: 35px" v-if="idle.tab !== null && idle.tab.length > 0" v-for="(item,index) in idle.tab" :key="index">
          <span>{{item}}</span>
        </span>
      </div>

      <div class="item">
        <span class="title">闲 置 描 述：</span>
        <span class="content">{{idle.describe}}</span>
      </div>

      <div class="item">
        <span class="title">数 量：</span>
        <span class="content">{{idle.num}}</span>
      </div>

      <div class="item">
        <span class="title">价 格：</span>
        <span class="content">{{idle.price}}</span>
      </div>

      <div class="item">
        <span class="title">帮 代 附 件：</span>
        <span  class="content" v-if="idle.photo === [] || idle.photo === null">无</span>
        <span style="margin-left: 35px" v-if="idle.photo !== null && idle.photo.length !== 0" v-for="(item,index) in idle.photo " :key="index">
            <el-image :src="httpBaseUrl + item" style="width: 100px; height: 100px;"></el-image>
        </span>
      </div>

      <div class="item">
        <span class="title">联 系 方 式：</span>
        <span class="content">{{idle.phone}}</span>
      </div>

      <div class="item">
        <span class="title">订 单 状 态：</span>
        <span class="content">{{idle.state === 0 ? "已下架" : "已上架"}}</span>
      </div>

      <div class="item">
        <span class="title">发 布 时 间：</span>
        <span class="content">{{idle.createTime}}</span>
      </div>

      <div class="item">
        <span class="title">留 言：</span>
        <span  class="content" v-if="idle.comments.length === 0">无</span>
        <span v-if="idle.comments !== null && idle.comments.length !== 0" v-for="(item,index) in idle.comments" :key="index">
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
        name: "IdleDetail",
        data(){
            return{
                idle:{
                    id: 0,
                    userId: '',
                    school: '',
                    title: '',
                    tab: [],
                    describe: '',
                    num: 0,
                    price: 0,
                    photo:[],
                    phone: '',
                    state: 0,
                    createTime: '',
                    comments: []
                },
                httpBaseUrl: GLOBAL.httpBaseUrl,
            }
        },
        mounted(){
            let id = this.$route.params.id;
            if(id === undefined){
                this.$router.push("/idleOrder");
            }{
                this.getIdleById(id);
            }
        },
        methods:{
            getIdleById(id){
                let vm = this;
                this.axios({
                    url: '/idle/admin/getIdleById',
                    method: 'get',
                    params:{id: id}
                }).then(function(res){
                    if(res.data.code === 200){
                        vm.idle = res.data.data;
                    }else {
                        vm.$message.error(res.data.msg);
                    }
                }).catch(function(err){
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
    margin-bottom: 35px;
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
