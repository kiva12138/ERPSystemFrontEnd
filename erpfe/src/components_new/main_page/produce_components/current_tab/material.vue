<template>
<div>
  <span>
    <el-dropdown split-button type="success" @command="handleClick"
      style="margin: 10px;" size="small">
      {{selectButton.text}}
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="查看总体数据">查看总体数据</el-dropdown-item>
        <el-dropdown-item command="查看物料分布">查看物料分布</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div :is="currentView"></div>
  </span>
</div>
</template>

<script>
import currentdistribute from '../../material_components/current.vue'
import currentoverall from '../current_tab/material/overall.vue'

export default {
  name: 'statisticByMaterial',
  data () {
    return {
      selectButton: {
        text: '物料查看方式'
      },
      distribute: currentdistribute,
      overall: currentoverall,
      currentView: currentdistribute
    }
  },
  methods: {
    handleClick (command) {
      this.selectButton.text = command
      if (this.selectButton.text === '查看物料分布') {
        this.currentView = this.distribute
      } else {
        this.currentView = this.overall
      }
    }
  },
  computed: {
  },
  mounted () {
  }
}
</script>

<style>
.detailClass {
  padding-top: 1%;
  padding-bottom: 20px;
}
</style>
