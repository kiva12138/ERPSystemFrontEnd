<template>
<div>
  <el-tabs v-model="activeName"
    @tab-click="handleTabClick"
    :lazy="true"
    class="material_statistic_tab">
    <el-tab-pane label="工位拒收" name="ByRefuse"><ByRefuse/></el-tab-pane>
    <el-tab-pane label="工位生产中止" name="ByStopped"><ByStopped/></el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import byRefuse from './stop_tab/refused.vue'
import byStopped from './stop_tab/stopped.vue'

export default {
  name: 'Stop',
  components: {
    'ByRefuse': byRefuse,
    'ByStopped': byStopped
  },
  data () {
    return {
      activeName: 'ByRefuse'
    }
  },
  methods: {
    handleTabClick (tab, event) {
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
