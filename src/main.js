// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// 导入element ui 模块与样式
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import axios from 'axios'
import VueAxios from 'vue-axios'

//导入全局样式表
import './assets/css/global.css'
//导入字体图标
import './assets/fonts/iconfont.css'



Vue.use(VueAxios,axios);
//配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8087';
//axios.defaults.baseURL = 'http://192.168.2.104:8087';

//通过axios的拦截器添加token验证
axios.interceptors.request.use(config =>{
  //console.log(config);
  config.headers.Authorization = window.sessionStorage.getItem('token');
  return config;
});


Vue.use(ElementUI);

Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
