<template>
  <el-container class="index_container" v-loading.fullscreen.lock="funllscreenLoading">
    <el-header>
      <div>
        <img src="../assets/img/qiu.png" alt="" style="width: 60px;height: 60px">
        <span>校园助手管理系统</span>
      </div>
      <div>
        <div>
          <span>欢迎您: </span>
          <span>{{nickName}}</span>
        </div>
        <el-avatar :src="httpBaseUrl + img"></el-avatar>
        <el-button type="primary" @click="logout" style="margin-left: 20px">退出</el-button>
      </div>
    </el-header>

    <el-container>
      <el-aside :width="isCollapsed?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isCollapsed"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath">
          <!--一级菜单-->
          <el-submenu :index="item.id + ''" v-for="item in menuList" :key="item.id">
            <!--一级菜单的模板区域-->
            <template slot="title">
              <!--图标-->
              <i :class="item.icon"></i>
              <!--文本-->
              <span>{{item.name}}</span>
            </template>

            <!--二级菜单-->
            <el-menu-item :index="subItem.path" v-for="subItem in item.children" :key="subItem.id">
              <template slot="title" @click="saveNavState(subItem.path)">
                <!--图标-->
                <i class="el-icon-menu"></i>
                <!--文本-->
                <span>{{subItem.name}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!--右侧内容主体-->
      <el-main>
        <!--路由占位符-->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  import GLOBAL from '../api/global_variable'
  import AdminIndex from "./index/AdminIndex";
    export default {
        name: "Index",
        data(){
            return{
                menuList:[
                    {id:1, name: '用户管理', icon: 'iconfont icon-user',children:[{id:1001,name:'用户列表',path:'/user'}]},
                    {id:2, name: '首页配置', icon: 'iconfont icon-tijikongjian',children:[{id:2001,name:'公告配置',path:'/noticeConfig'},{id:2002,name:'轮播图配置',path:'/carouselMapConfig'}]},
                    {id:3, name: '订单列表', icon: 'iconfont icon-shangpin',children:[{id:3001,name:'提 问',path:'/askOrder'},{id:3002,name:'帮 代',path:'/helpOrder'},{id:3003,name:'闲 置',path:'/idleOrder'}]},
                    {id:4, name: '日志列表', icon: 'iconfont icon-danju',children:[{id:4001,name:'操作日志',path:'/operLog'},{id:4002,name:'异常日志',path:'/exceptionLog'}]}
                ],
                isCollapsed: false,
                activePath: '',

                httpBaseUrl: GLOBAL.httpBaseUrl,

                nickName: '',
                img: '',

                funllscreenLoading: false
            }
        },
        mounted(){
            this.nickName = window.sessionStorage.getItem("userName");
            this.img = window.sessionStorage.getItem("userImage");
            this.activePath = window.sessionStorage.getItem('activePath');
            //this.createWebSocket(window.sessionStorage.getItem("userId"));
        },
        methods:{
            logout(){
                let vm = this;
                this.$confirm('是否退出?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.funllscreenLoading = true;
                    this.axios({
                        url: '/user/logout',
                        method: 'get'
                    }).then(function (res) {
                        if(res.data.code === 200){
                            if(GLOBAL.webSocket !== null){
                                GLOBAL.lockReconnect = true;
                                GLOBAL.webSocket.close();
                                clearTimeout(GLOBAL.webSocketTimeOutObj);
                                clearTimeout(GLOBAL.webSocketServerTimeOutObj);
                                GLOBAL.webSocket = null;
                            }
                            window.sessionStorage.clear();
                            vm.$message({
                                type: 'success',
                                message: '退出成功'
                            });
                            vm.$router.push("/login");
                        }else{
                            vm.$message({
                                type: 'error',
                                message: '退出失败'
                            });
                        }
                    }).catch(function (err) {
                        vm.$message({
                            type: 'error',
                            message: err
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });
            },
            toggleCollapse(){
                this.isCollapsed = !this.isCollapsed;
            },
            //保存链接的激活状态
            saveNavState(activePath){
                window.sessionStorage.setItem('activePath',activePath);
                this.activePath = activePath;
            },


            /*

            createWebSocket(userId){
                try{
                    if(GLOBAL.webSocket === null){
                        if('WebSocket' in window){
                            GLOBAL.webSocket = new WebSocket(GLOBAL.webSocketUrl + userId);
                        }else if('MozWebSocket' in window){
                            GLOBAL.webSocket = new MozWebSocket(GLOBAL.webSocketUrl + userId);
                        }else{
                            GLOBAL.webSocket = new SocketJs(GLOBAL.webSocketUrl + userId);
                        }
                        this.init();
                        GLOBAL.lockReconnect = false;
                    }
                }catch (e) {
                    this.reconnect();
                }
            },
            init(){
                try {
                    //监听socket连接
                    GLOBAL.webSocket.onopen = this.webSocketOpen;
                    //监听socket错误信息
                    GLOBAL.webSocket.onerror = this.webSocketError;
                    //监听socket消息
                    GLOBAL.webSocket.onmessage = this.webSocketGetMessage;
                    GLOBAL.webSocket.onclose = this.webSocketClose;
                }catch (e) {
                    this.reconnect();
                }
            },
            webSocketOpen(){
                console.log("socket连接成功");
                this.start();
                //this.sendMessage("嗯哼“);
                //this.sendMessageToUserId("中午好",666)
            },
            webSocketError(){
                console.log("socket连接错误");
                this.reconnect();
            },
            webSocketGetMessage(msg){
                //console.log(msg);
                console.log(JSON.parse(msg.data));
                //alert(msg.data);
                this.start();
            },
            sendMessageToUserId(message,userId){
                let data = {"fromUserId": this.userId, "toUserId": userId, "message": message};
                GLOBAL.webSocket.send(JSON.stringify(data));
            },
            sendMessage(msg){
                GLOBAL.webSocket.send(msg);
            },
            webSocketClose(){
                console.log("socket已关闭");
                GLOBAL.webSocket = null;
                this.reconnect();
                //手动清除
                //this.clear();
            },
            reconnect(){
                if(GLOBAL.lockReconnect){
                    return;
                }
                let vm = this;
                console.log("1秒后重连");
                GLOBAL.lockReconnect = true;
                this.wsCreateHandler && clearTimeout(this.wsCreateHandler);
                this.wsCreateHandler = setTimeout(function () {
                    console.log("重连..."  + "假设这是url");
                    vm.createWebSocket();
                    GLOBAL.lockReconnect = false;
                },1000)
            },
            //心跳检测
            reset() {
                clearTimeout(GLOBAL.webSocketTimeOutObj);
                clearTimeout(GLOBAL.webSocketServerTimeOutObj);
                this.start();
            },
            start() {
                let vm = this;
                GLOBAL.webSocketTimeOutObj && clearTimeout(GLOBAL.webSocketTimeOutObj);
                GLOBAL.webSocketServerTimeOutObj && clearTimeout(GLOBAL.webSocketServerTimeOutObj);
                GLOBAL.webSocketTimeOutObj = setTimeout(function () {
                    console.log("发送ping到后台");
                    try {
                        GLOBAL.webSocket.send("ping");
                    }catch (e) {
                        console.log("发送ping异常");
                    }
                    GLOBAL.webSocketServerTimeOutObj = setTimeout(function () {
                        console.log("没有收到后台的数据，关闭连接");
                        vm.reconnect();
                    },GLOBAL.webSocketTimeOut);
                }, GLOBAL.webSocketTimeOut);
            },

             */
        }
    }
</script>

<style scoped>

  .index_container{
    height: 100%;
  }

  .el-header{
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;

  }
  .el-header div{
    display: flex;
    align-items: center;
  }
  .el-header div span{
    margin-left: 15px;
  }

  .el-aside {
    background-color: #333744;
  }
  .toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color:#fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-aside .el-menu{
    border-right: none;
  }

  .el-main {
    background-color: #eaedf1;
  }

  .iconfont {
    margin-right: 10px;
  }

</style>
