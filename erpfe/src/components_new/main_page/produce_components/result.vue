<template>
<div>
  <el-tabs v-model="activeName"
    @tab-click="handleTabClick"
    :lazy="true"
    class="material_statistic_tab">
    <el-tab-pane label="物料生产记录" name="byRecord"><byRecord/></el-tab-pane>
    <el-tab-pane label="物料生产统计" name="byMaterial"><byMaterial/></el-tab-pane>
    <el-tab-pane label="工位生产统计" name="byStation"><ByStation/></el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import statisticByRecord from './result_tab/record.vue'
import statisticByMaterial from '../material_components/statistics_tab/statisticbymaterial.vue'
import statisticByStation from '../material_components/statistics_tab/statisticbystation.vue'

export default {
  name: 'Waiting',
  components: {
    'byRecord': statisticByRecord,
    'ByMaterial': statisticByMaterial,
    'ByStation': statisticByStation
  },
  data () {
    return {
      activeName: 'byRecord'
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
