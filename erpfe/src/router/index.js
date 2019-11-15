import Vue from 'vue'
import Router from 'vue-router'

import NotFoundPage from '@/components/notfoundcomponents/notfoundpage.vue'
import LoginPage from '@/components/logincomponents/loginpage.vue'

import BasicDataPage from '@/components/basicdatacomponents/basicdatapage.vue'
import ProcessComponent from '@/components/basicdatacomponents/processcomp.vue'
import CraftsComponent from '@/components/basicdatacomponents/craftscomp.vue'
import BomComponent from '@/components/basicdatacomponents/bomcomp.vue'

import BillPage from '@/components/billcomponents/billpage.vue'

import BoardPage from '@/components/boardcomponents/boardpage.vue'

import EquipmentPage from '@/components/equipmentcomponents/equipmentpage.vue'
import EquipmentFileComponent from '@/components/equipmentcomponents/filecomp.vue'
import EquipmentLogComponent from '@/components/equipmentcomponents/logcomp.vue'
import MoldComponent from '@/components/equipmentcomponents/moldcomp.vue'
import EquipmentRepairComponent from '@/components/equipmentcomponents/repaircomp.vue'
import EquipmentMaintainComponent from '@/components/equipmentcomponents/maintaincomp.vue'
import EquipmentCheckComponent from '@/components/equipmentcomponents/checkcomp.vue'
import SpareComponent from '@/components/equipmentcomponents/sparecomp.vue'

import ExceptionPage from '@/components/exceptioncomponents/exceptionpage.vue'
import ExceptionDefinationComponent from '@/components/exceptioncomponents/definationcomp.vue'
import ExceptionTagComponent from '@/components/exceptioncomponents/tagcomp.vue'
import ExceptionSubscribeComponent from '@/components/exceptioncomponents/subscribecomp.vue'

import ProducePage from '@/components/producecomponents/producepage.vue'

import QualityPage from '@/components/qualitycomponents/qualitypage.vue'
import QualitySettingComponent from '@/components/qualitycomponents/settingcomp.vue'
import QualityCarringComponent from '@/components/qualitycomponents/carringcomp.vue'

import TaskPage from '@/components/taskcomponents/taskpage.vue'
import ScheduleComponent from '@/components/taskcomponents/schedulecomp.vue'

import TracePage from '@/components/tracecomponents/tracepage.vue'

import WareHousePage from '@/components/warehousecomponents/warehousepage.vue'
import StorageComponent from '@/components/warehousecomponents/storagecomp.vue'
import TransportComponent from '@/components/warehousecomponents/transportcomp.vue'

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
      },
      children: [
        {
          path: 'process',
          component: ProcessComponent,
          meta: {
            title: '工序管理'
          }
        },
        {
          path: 'crafts',
          component: CraftsComponent,
          meta: {
            title: '工艺管理'
          }
        },
        {
          path: 'bom',
          component: BomComponent,
          meta: {
            title: 'Bom管理'
          }
        }
      ]
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
      },
      children: [
        {
          path: 'file',
          component: EquipmentFileComponent,
          meta: {
            title: '设备档案管理'
          }
        },
        {
          path: 'log',
          component: EquipmentLogComponent,
          meta: {
            title: '设备日志'
          }
        },
        {
          path: 'mold',
          component: MoldComponent,
          meta: {
            title: '模具管理'
          }
        },
        {
          path: 'maintain',
          component: EquipmentMaintainComponent,
          meta: {
            title: '设备保养'
          }
        },
        {
          path: 'repair',
          component: EquipmentRepairComponent,
          meta: {
            title: '设备维修'
          }
        },
        {
          path: 'check',
          component: EquipmentCheckComponent,
          meta: {
            title: '设备点检'
          }
        },
        {
          path: 'spare',
          component: SpareComponent,
          meta: {
            title: '备件更换'
          }
        }
      ]
    },
    {
      path: '/exception',
      name: 'ExceptionPage',
      component: ExceptionPage,
      meta: {
        title: '异常管理'
      },
      children: [
        {
          path: 'defination',
          component: ExceptionDefinationComponent,
          meta: {
            title: '异常定义'
          }
        },
        {
          path: 'tag',
          component: ExceptionTagComponent,
          meta: {
            title: '异常标签'
          }
        },
        {
          path: 'subscribe',
          component: ExceptionSubscribeComponent,
          meta: {
            title: '异常订阅'
          }
        }
      ]
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
      },
      children: [
        {
          path: 'setting',
          component: QualitySettingComponent,
          meta: {
            title: '质量配置'
          }
        },
        {
          path: 'carring',
          component: QualityCarringComponent,
          meta: {
            title: '质检执行'
          }
        }
      ]
    },
    {
      path: '/task',
      name: 'TaskPage',
      component: TaskPage,
      meta: {
        title: '任务管理'
      },
      children: [
        {
          path: 'schedule',
          component: ScheduleComponent,
          meta: {
            title: '排程'
          }
        }
      ]
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
      },
      children: [
        {
          path: 'storage',
          component: StorageComponent,
          meta: {
            title: '仓储管理'
          }
        },
        {
          path: 'transport',
          component: TransportComponent,
          meta: {
            title: '物流管理'
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
