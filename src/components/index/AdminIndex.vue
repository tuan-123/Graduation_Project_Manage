<template>
  <div>
    <div class="container">
      <div class="smContainer div1">
          <div style="float:left;position:relative;left: 140px;top: 100px;">
            <el-image :src="useronlineImg"></el-image>
            <div style="position:relative;left:-15px;top: 30px;font-size: 30px">用户在线数</div>
          </div>
          <div id="userOnlineCount" class="countSize1">
            {{userOnline}}
          </div>
      </div>
      <div class="smContainer div2">
        <div style="float:left;position:relative;left: 140px;top: 100px;">
          <el-image :src="askImg"></el-image>
          <div style="position:relative;left:-15px;top: 30px;font-size: 30px">提问发布数</div>
        </div>
        <div id="askCount" class="countSize1">
          {{askCount}}
        </div>
      </div>
      <div class="smContainer div3">
        <div style="float:left;position:relative;left: 140px;top: 100px;">
          <el-image :src="helpImg"></el-image>
          <div style="position:relative;left:-15px;top: 30px;font-size: 30px">帮代发布数</div>
        </div>
        <div id="helpCount" class="countSize1">
          {{helpCount}}
        </div>
      </div>
      <div class="smContainer div4">
        <div style="float:left;position:relative;left: 140px;top: 100px;">
          <el-image :src="idleImg"></el-image>
          <div style="position:relative;left:-15px;top: 30px;font-size: 30px">闲置发布数</div>
        </div>
        <div id="idleCount" class="countSize1">
          {{idleCount}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import GLOBAL from "../../api/global_variable";
    export default {
        name: "AdminIndex",
        data(){
            return{
                userOnline: 0,
                askCount: 0,
                helpCount: 0,
                idleCount: 0,
                useronlineImg: require("../../assets/img/useronline.png"),
                askImg: require("../../assets/img/ask.png"),
                helpImg: require("../../assets/img/help.png"),
                idleImg: require("../../assets/img/idle.png"),
            }
        },
        mounted(){
            this.getRealData();
            this.createWebSocket(window.sessionStorage.getItem("userId"));
        },
        methods:{
            createWebSocket(userId){
                try{
                    if(GLOBAL.webSocket === null || true){
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
                //console.log(JSON.parse(msg.data));
                let data = JSON.parse(msg.data);
                if(data.userOnline !== undefined && document.getElementById("userOnlineCount") !== null){
                    document.getElementById("userOnlineCount").className = data.userOnline < 999 ? "countSize1" : (data.userOnline < 99999 ? "countSize2" : "countSize3");
                    this.userOnline = data.userOnline;
                    document.getElementById("askCount").className = data.askCount < 999 ? "countSize1" : (data.askCount < 99999 ? "countSize2" : "countSize3");
                    this.askCount = data.askCount;
                    document.getElementById("helpCount").className = data.helpCount < 999 ? "countSize1" : (data.helpCount < 99999 ? "countSize2" : "countSize3");
                    this.helpCount = data.helpCount;
                    document.getElementById("idleCount").className = data.idleCount < 999 ? "countSize1" : (data.idleCount < 99999 ? "countSize2" : "countSize3");
                    this.idleCount = data.idleCount;
                }
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
                    //console.log("发送ping到后台");
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

            getRealData(){
                let vm = this;
                this.axios({
                    url: '/user/admin/getIndexData',
                    method: 'get',
                }).then(function (res) {
                   if(res.data.code === 200){
                       document.getElementById("userOnlineCount").className = res.data.data.userOnline < 999 ? "countSize1" : ((res.data.data.userOnline) < 99999 ? "countSize2" : "countSize3")
                       vm.userOnline = res.data.data.userOnline;
                       document.getElementById("userOnlineCount").className = res.data.data.askCount < 999 ? "countSize1" : ((res.data.data.askCount) < 99999 ? "countSize2" : "countSize3")
                       vm.askCount = res.data.data.askCount;
                       document.getElementById("userOnlineCount").className = res.data.data.helpCount < 999 ? "countSize1" : ((res.data.data.helpCount) < 99999 ? "countSize2" : "countSize3")
                       vm.helpCount = res.data.data.helpCount;
                       document.getElementById("userOnlineCount").className = res.data.data.idleCount < 999 ? "countSize1" : ((res.data.data.idleCount) < 99999 ? "countSize2" : "countSize3")
                       vm.idleCount = res.data.data.idleCount;
                   }else{
                       vm.$message.error(res.data.msg);
                   }
                }).catch(function (err){
                    this.$message.error(err);
                });
            }
        }
    }
</script>

<style scoped>

  .container{
    background-color: #f3f4fa;
  }
  .container .smContainer{
    width: 49%;
    background-color: #ffffff;
    display: inline-block;
    height: 385px;
  }
  .div1{
    margin-right: 1%;
    margin-bottom: 1%;
  }
  .div2{
    float: right;
  }
  .div3{
    margin-right: 1%;
  }
  .div4{
    float: right;
  }
  .countSize1{
    /*0---999*/
    position: relative;
    top: 80px;
    left: 280px;
    font-size: 140px;
    color: lightskyblue;
  }
  .countSize2{
    /*1000---99999*/
    position: relative;
    top: 80px;
    left: 190px;
    font-size: 140px;
    color: lightskyblue;
  }
  .countSize3{
    /*100000---9999999*/
    position: relative;
    top: 100px;
    left: 150px;
    font-size: 120px;
    color: lightskyblue;
  }
</style>
