const navItemsNew = [
  {
    'name': '物料管理',
    'url': '/material',
    'submenu': [
      {
        'name': '物料种类概览',
        'url': 'overview'
      },
      {
        'name': '当前物料分布',
        'url': 'current'
      },
      {
        'name': '物料统计',
        'url': 'statistics'
      },
      {
        'name': '配送与库存管理',
        'url': 'transport'
      },
      {
        'name': '物料警示配置',
        'url': 'warnset'
      }
    ]
  },
  {
    'name': '工单管理',
    'url': '/bill',
    'submenu': [
      {
        'name': '工单总览',
        'url': 'overview'
      },
      {
        'name': '已创建工单',
        'url': 'created'
      },
      {
        'name': '已分配工单',
        'url': 'distributed'
      },
      {
        'name': '生产中工单',
        'url': 'producing'
      },
      {
        'name': '停滞中工单',
        'url': 'stopped'
      },
      {
        'name': '已完成\\停止工单',
        'url': 'completed'
      }
    ]
  },
  {
    'name': '工位管理',
    'url': '/stations',
    'submenu': [
      {
        'name': '工位总览',
        'url': 'overview'
      },
      {
        'name': '设备总览',
        'url': 'equipment'
      }
    ]
  },
  {
    'name': '单工位管理',
    'url': '/station',
    'submenu': [
      {
        'name': '工位自管理',
        'url': 'selfmanage'
      },
      {
        'name': '设备管理',
        'url': 'equipment'
      },
      {
        'name': '未接受任务',
        'url': 'unaccepted'
      },
      {
        'name': '已接受任务',
        'url': 'accepted'
      },
      {
        'name': '执行中任务',
        'url': 'producing'
      }
    ]
  }
]

export default navItemsNew
