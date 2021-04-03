import Vue from 'vue'
import Router from 'vue-router'
import Login from "../components/Login"
import Index from "../components/Index"
import User from "../components/user/User"
import AdminIndex from "../components/index/AdminIndex";
import CarouselMapConfig from "../components/indexConfig/CarouselMapConfig";
import NoticeConfig from "../components/indexConfig/NoticeConfig";
import AskOrder from "../components/order/AskOrder";
import AskDetail from "../components/order/AskDetail";
import HelpOrder from "../components/order/HelpOrder";
import HelpDetail from "../components/order/HelpDetail";
import IdleDetail from "../components/order/IdleDetail";
import IdleOrder from "../components/order/IdleOrder";
import OperLog from "../components/log/OperLog";
import ExceptionLog from "../components/log/ExceptionLog";
import OperLogDetail from "../components/log/OperLogDetail";
import ExceptionLogDetail from "../components/log/ExceptionLogDetail";
import ExceptionLogDetailExceptionMessage from "../components/log/ExceptionLogDetailExceptionMessage";


Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      redirect: '/adminIndex',
      children:[
        {
          path: '/adminIndex',
          name: 'AdminIndex',
          component: AdminIndex
        },
        {
          path: '/user',
          name: "User",
          component: User
        },
        {
          path: '/carouselMapConfig',
          name: 'CarouselMapConfig',
          component: CarouselMapConfig
        },
        {
          path: '/noticeConfig',
          name: 'NoticeConfig',
          component: NoticeConfig
        },
        {
          path: '/askOrder',
          name: 'AskOrder',
          component: AskOrder
        },
        {
          path:'/askDetail',
          name: 'AskDetail',
          component: AskDetail
        },
        {
          path: '/helpOrder',
          name: 'HelpOrder',
          component: HelpOrder
        },
        {
          path: '/helpDetail',
          name: 'HelpDetail',
          component: HelpDetail
        },
        {
          path: '/idleOrder',
          name: 'IdleOrder',
          component: IdleOrder
        },
        {
          path: '/idleDetail',
          name: 'IdleDetail',
          component: IdleDetail
        },
        {
          path: '/operLog',
          name: "OperLog",
          component: OperLog
        },
        {
          path: '/exceptionLog',
          name: "ExceptionLog",
          component: ExceptionLog
        },
        {
          path: '/operLogDetail',
          name: 'OperLogDetail',
          component: OperLogDetail
        },
        {
          path: '/exceptionLogDetail',
          name: 'ExceptionLogDetail',
          component: ExceptionLogDetail
        },
        {
          path: '/exceptionLogDetailExceptionMessage',
          name: 'ExceptionLogDetailExceptionMessage',
          component: ExceptionLogDetailExceptionMessage
        }
      ]
    },
  ]
})
