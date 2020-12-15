import { createRouter, createWebHistory } from 'vue-router';
// 路由懒加载
const Mine = () => import('views/mine/mine')
const MyCar = () => import('views/myCar/myCar')
const BindPlate = () => import('views/bindPlate/bindPlate')
const CardIndex = () => import('views/monthCard/cardIndex')
const CardDetails = () => import('views/monthCard/cardDetails')
const CardSelect = () => import('views/monthCard/cardSelect')
const WxAuthor = () => import('views/carAuthor/wxAuthor')
const CardLook = () => import('views/monthCard/cardLook')
const AgreeMent = () => import('views/carAuthor/agreeMent')

const ChuanBind = () => import('views/againBind/chuanBind')
const MonthCard = () => import('views/monthCard/monthCard')
const Invoice = () => import('views/myCar/invoice')
const BuySuccess = () => import('views/buySuccess/buySuccess')
const CarAuthor = () => import('views/carAuthor/carAuthor')
const MyMonthCard = () => import('views/monthCard/myMonthCard')



const routes = [
  {
    path: '',
    redirect: '/carAuthor/wxAuthor'
  },
  {
    path: '/wxAuthor',
    name: 'WxAuthor',
    component: WxAuthor,
    meta: {
      title: '授权'
    }
  },
  {
    path: '/mine',
    name: 'Mine',
    component: Mine,
    meta: {
      title: '我的'
    }
  },
  {
    path: '/myCar',
    component: MyCar,
    meta: {
      title: '我的车牌'
    }
  },
  {
    path: '/bindPlate',
    component: BindPlate,
    meta: {
      title: '绑定车牌'
    }
  },
  {
    path: '/cardIndex',
    component: CardIndex,
    meta: {
      title: '停车月卡'
    }
  },
  {
    path: '/cardDetails',
    component: CardDetails,
    meta: {
      title: '老月卡详情'
    }
  },
  {
    path: '/cardSelect',
    component: CardSelect,
    meta: {
      title: '购买'
    }
  },
  {
    path: '/cardLook',
    name: 'CardLook',
    component: CardLook,
    meta: {
      title: '新月卡详情'
    }

  },
  {//协议
    path: '/agreeMent',
    name: 'AgreeMent',
    component: AgreeMent,
    meta: {
      title: '协议'
    }
  },
  {//四川地区首页
    path: '/chuanBind',
    name: 'ChuanBind',
    component: ChuanBind,
    meta: {
      title: '首页'
    }
  },
  {//产品列表
    path: '/monthCard',
    name: 'MonthCard',
    component: MonthCard,
    meta: {
      title: '产品列表'
    }
  },
  {//我的发票
    path: '/invoice',
    name: 'Invoice',
    component: Invoice,
    meta: {
      title: '我的发票'
    }
  },
  {//购买成功
    path: '/buySuccess',
    name: 'BuySuccess',
    meta: {
      title: '购买成功'
    },
    component: BuySuccess,
  },
  {//车主认证
    path: '/carAuthor',
    name: 'carAuthor',
    meta: {
      title: '车主认证'
    },
    component: CarAuthor,
  },
  {//我的月卡列表
    path: '/myMonthCard',
    name: 'MyMonthCard',
    meta: {
      title: '我的月卡'
    },
    component: MyMonthCard,
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;
