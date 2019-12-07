import Vue from 'vue'
import Router from 'vue-router'

import NotFoundPage from '@/components_new/main_page/notfound_components/notfoundpage.vue'
import LoginPage from '@/components_new/main_page/login_components/loginpage.vue'

import MaterailPage from '@/components_new/main_page/material_components/material_page.vue'
import MaterialOverallComp from '@/components_new/main_page/material_components/overall.vue'
import MaterialCurrentComp from '@/components_new/main_page/material_components/current.vue'
import MaterialStatisticsComp from '@/components_new/main_page/material_components/statistics.vue'
import MaterialTransportComp from '@/components_new/main_page/material_components/transport.vue'
import MaterialWarnsetComp from '@/components_new/main_page/material_components/warnset.vue'

import BillPage from '@/components_new/main_page/bill_components/bill_page.vue'
import BillCompletedComp from '@/components_new/main_page/bill_components/completed.vue'
import BillCreatedComp from '@/components_new/main_page/bill_components/created.vue'
import BillDistributedComp from '@/components_new/main_page/bill_components/distributed.vue'
import BillOverallComp from '@/components_new/main_page/bill_components/overall.vue'
import BillProducingComp from '@/components_new/main_page/bill_components/producing.vue'
import BillStoppedComp from '@/components_new/main_page/bill_components/stopped.vue'

import StationPage from '@/components_new/main_page/station_components/station_page.vue'
import StationAcceptedComp from '@/components_new/main_page/station_components/accepted.vue'
import StationEquipmentComp from '@/components_new/main_page/station_components/equipment.vue'
import StationProducingComp from '@/components_new/main_page/station_components/producing.vue'
import StationSelfManageComp from '@/components_new/main_page/station_components/selfmanage.vue'
import StationUnacceptedComp from '@/components_new/main_page/station_components/unaccepted.vue'

import StationsPage from '@/components_new/main_page/stations_components/stations_page.vue'
import StationsOverallComp from '@/components_new/main_page/stations_components/overall.vue'
import StationsEquipmentComp from '@/components_new/main_page/stations_components/equipment.vue'

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
        title: '登录'
      }
    },
    {
      path: '/material',
      name: 'Material',
      component: MaterailPage,
      meta: {
        title: '物料管理'
      },
      children: [
        {
          path: 'current',
          component: MaterialCurrentComp,
          meta: {
            title: '当前物料分布'
          }
        },
        {
          path: 'overview',
          component: MaterialOverallComp,
          meta: {
            title: '物料总览'
          }
        },
        {
          path: 'statistics',
          component: MaterialStatisticsComp,
          meta: {
            title: '物料使用统计'
          }
        },
        {
          path: 'transport',
          component: MaterialTransportComp,
          meta: {
            title: '配送与库存管理'
          }
        },
        {
          path: 'warnset',
          component: MaterialWarnsetComp,
          meta: {
            title: '警示信息配置'
          }
        }
      ]
    },
    {
      path: '/bill',
      name: 'Bill',
      component: BillPage,
      meta: {
        title: '工单管理'
      },
      children: [
        {
          path: 'overview',
          component: BillOverallComp,
          meta: {
            title: '工单总览'
          }
        },
        {
          path: 'created',
          component: BillCreatedComp,
          meta: {
            title: '已创建工单'
          }
        },
        {
          path: 'distributed',
          component: BillDistributedComp,
          meta: {
            title: '已分配工单'
          }
        },
        {
          path: 'producing',
          component: BillProducingComp,
          meta: {
            title: '生产中工单'
          }
        },
        {
          path: 'stopped',
          component: BillStoppedComp,
          meta: {
            title: '停滞中工单'
          }
        },
        {
          path: 'completed',
          component: BillCompletedComp,
          meta: {
            title: '已完成工单'
          }
        }
      ]
    },
    {
      path: '/stations',
      name: 'Stations',
      component: StationsPage,
      meta: {
        title: '工位管理'
      },
      children: [
        {
          path: 'overview',
          component: StationsOverallComp,
          meta: {
            title: '工位总览'
          }
        },
        {
          path: 'equipment',
          component: StationsEquipmentComp,
          meta: {
            title: '设备总览'
          }
        }
      ]
    },
    {
      path: '/station',
      name: 'Station',
      component: StationPage,
      meta: {
        title: '单工位管理'
      },
      children: [
        {
          path: 'selfmanage',
          component: StationSelfManageComp,
          meta: {
            title: '工位自管理'
          }
        },
        {
          path: 'equipment',
          component: StationEquipmentComp,
          meta: {
            title: '设备管理'
          }
        },
        {
          path: 'unaccepted',
          component: StationUnacceptedComp,
          meta: {
            title: '未接受任务'
          }
        },
        {
          path: 'accepted',
          component: StationAcceptedComp,
          meta: {
            title: '已接受任务'
          }
        },
        {
          path: 'producing',
          component: StationProducingComp,
          meta: {
            title: '执行中任务'
          }
        }
      ]
    }
  ]
})

export default router

router.beforeEach((to, from, next) => {
  if (to.path === from.path) {
    return
  }
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
