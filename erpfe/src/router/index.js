import Vue from 'vue'
import Router from 'vue-router'

import NotFoundPage from '@/components/notfoundcomponents/notfoundpage.vue'
import LoginPage from '@/components/logincomponents/loginpage.vue'

import BasicDataPage from '@/components/basicdatacomponents/basicdatapage.vue'
import BillPage from '@/components/billcomponents/billpage.vue'
import BoardPage from '@/components/boardcomponents/boardpage.vue'
import EquipmentPage from '@/components/equipmentcomponents/equipmentpage.vue'
import ExceptionPage from '@/components/exceptioncomponents/exceptionpage.vue'
import ProducePage from '@/components/producecomponents/producepage.vue'
import QualityPage from '@/components/qualitycomponents/qualitypage.vue'
import TaskPage from '@/components/taskcomponents/taskpage.vue'
import TracePage from '@/components/tracecomponents/tracepage.vue'
import WareHousePage from '@/components/warehousecomponents/warehousepage.vue'

Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '*',
      name: 'NotFound',
      component: NotFoundPage,
      meta: {
        title: '页面不见了'
      }
    },
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'LoginPage',
      component: LoginPage,
      meta: {
        title: '请先登录'
      }
    },
    {
      path: '/basicdata',
      name: 'BasicData',
      component: BasicDataPage,
      meta: {
        title: '基础数据管理'
      }
    },
    {
      path: '/bill',
      name: 'BillPage',
      component: BillPage,
      meta: {
        title: '工单管理'
      }
    },
    {
      path: '/board',
      name: 'BoardPage',
      component: BoardPage,
      meta: {
        title: '看板管理'
      }
    },
    {
      path: '/equipment',
      name: 'EquipmentPage',
      component: EquipmentPage,
      meta: {
        title: '设备管理'
      }
    },
    {
      path: '/exception',
      name: 'ExceptionPage',
      component: ExceptionPage,
      meta: {
        title: '异常管理'
      }
    },
    {
      path: '/produce',
      name: 'ProducePage',
      component: ProducePage,
      meta: {
        title: '生产管理'
      }
    },
    {
      path: '/quality',
      name: 'QualityPage',
      component: QualityPage,
      meta: {
        title: '质量管理'
      }
    },
    {
      path: '/task',
      name: 'TaskPage',
      component: TaskPage,
      meta: {
        title: '任务管理'
      }
    },
    {
      path: '/trace',
      name: 'TracePage',
      component: TracePage,
      meta: {
        title: '追溯管理'
      }
    },
    {
      path: '/warehouse',
      name: 'WarehousePage',
      component: WareHousePage,
      meta: {
        title: '仓储物流管理'
      }
    }
  ]
})

export default router

router.beforeEach((to, from, next) => {
  if (Vue.prototype.$cookies.isKey('login')) {
    if (to.meta.title) {
      document.title = to.meta.title
    }
  } else {
    if (from.name === 'LoginPage') {
      return
    }
    if (to.name !== 'LoginPage') {
      router.push({
        path: '/login'
      })
    }
  }
  next()
})

router.afterEach((to, from) => {
})
