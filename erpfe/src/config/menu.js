const navItems = [
  {
    'name': '基础数据',
    'url': '/basicdata',
    'submenu': [
      {
        'name': '工序',
        'url': 'process'
      },
      {
        'name': '工艺路线',
        'url': 'crafts'
      },
      {
        'name': '生产BOM',
        'url': 'bom'
      }
    ]
  },
  {
    'name': '工单管理',
    'url': '/bill',
    'submenu': [
    ]},
  {
    'name': '任务管理',
    'url': '/task',
    'submenu': [
      {
        'name': '排程',
        'url': 'schedule'
      }
    ]
  },
  {
    'name': '生产操作',
    'url': '/produce',
    'submenu': [
    ]
  },
  {
    'name': '质量管理',
    'url': '/quality',
    'submenu': [
      {
        'name': '质量配置',
        'url': 'setting'
      },
      {
        'name': '质检执行',
        'url': 'carring'
      }
    ]
  },
  {
    'name': '仓储与物流管理',
    'url': '/warehouse',
    'submenu': [
      {
        'name': '仓储管理',
        'url': 'storage'
      },
      {
        'name': '物流管理',
        'url': 'transport'
      }
    ]
  },
  {
    'name': '异常管理',
    'url': '/exception',
    'submenu': [
      {
        'name': '异常事件定义',
        'url': 'defination'
      },
      {
        'name': '异常处理标签',
        'url': 'tag'
      },
      {
        'name': '异常订阅',
        'url': 'subscribe'
      }
    ]
  },
  {
    'name': '追溯管理',
    'url': '/trace',
    'submenu': [
    ]
  },
  {
    'name': 'BI报表和看板',
    'url': '/board',
    'submenu': [
    ]
  },
  {
    'name': '设备管理',
    'url': '/equipment',
    'submenu': [
      {
        'name': '设备档案',
        'url': 'file'
      },
      {
        'name': '设备日志',
        'url': 'log'
      },
      {
        'name': '模具管理',
        'url': 'mold'
      },
      {
        'name': '维修任务',
        'url': 'repair'
      },
      {
        'name': '保养任务',
        'url': 'maintain'
      },
      {
        'name': '点检任务',
        'url': 'check'
      },
      {
        'name': '备件更换',
        'url': 'spare'
      }
    ]
  }
]

export default navItems
