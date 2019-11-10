const navItems = [
  {'name': '基础数据', 'url': '/basicdata', 'submenu': ['工序', '工艺路线', '生产BOM']},
  {'name': '工单管理', 'url': '/bill', 'submenu': []},
  {'name': '任务管理', 'url': '/task', 'submenu': ['排程']},
  {'name': '生产操作', 'url': '/produce', 'submenu': []},
  {'name': '质量管理', 'url': '/quality', 'submenu': ['质量配置', '质检执行']},
  {'name': '仓储与物流管理', 'url': '/warehouse', 'submenu': ['仓储管理', '物流管理']},
  {'name': '异常管理', 'url': '/exception', 'submenu': ['异常事件定义', '异常处理标签', '异常订阅']},
  {'name': '追溯管理', 'url': '/trace', 'submenu': []},
  {'name': 'BI报表和看板', 'url': '/board', 'submenu': []},
  {'name': '设备管理', 'url': '/equipment', 'submenu': ['设备档案', '设备日志', '模具管理', '维修任务', '保养任务', '点检任务', '备件更换']}
]

export default navItems
