<template>
<div>
  <el-tabs v-model="activeName"
    @tab-click="handleTabClick"
    :lazy="true"
    class="material_statistic_tab">
    <el-tab-pane label="总体配置" name="all"><All/></el-tab-pane>
    <el-tab-pane label="单独配置" name="onebyone"><OneByOne/></el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import warnsetall from './warnset_tab/warnsetall.vue'
import warnsetonebyone from './warnset_tab/warnsetonebyone.vue'

export default {
  name: 'Warnset',
  components: {
    'All': warnsetall,
    'OneByOne': warnsetonebyone
  },
  data () {
    return {
      activeName: 'all'
    }
  },
  methods: {
    handleTabClick (tab, event) {
      console.log('Tab changed')
      console.log(tab.name)
    }
  }
}
</script>

<style>
.material_statistic_tab {
  margin-left: 20px;
  margin-right: 20px;
}
</style>
