<template>
<div>
  <el-tabs v-model="activeName"
    @tab-click="handleTabClick"
    :lazy="true"
    class="material_statistic_tab">
    <el-tab-pane label="物料" name="byMaterial"><ByMaterial/></el-tab-pane>
    <el-tab-pane label="工单" name="byBill"><ByBill/></el-tab-pane>
    <el-tab-pane label="工位" name="byStation"><ByStation/></el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import statisticByBill from './current_tab/bill.vue'
import statisticByMaterial from './current_tab/material.vue'
import statisticByStation from './current_tab/station.vue'

export default {
  name: 'Waiting',
  components: {
    'ByBill': statisticByBill,
    'ByMaterial': statisticByMaterial,
    'ByStation': statisticByStation
  },
  data () {
    return {
      activeName: 'byMaterial'
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
