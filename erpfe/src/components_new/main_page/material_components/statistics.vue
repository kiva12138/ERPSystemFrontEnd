<template>
<div>
  <el-tabs v-model="activeName"
    @tab-click="handleTabClick"
    class="material_statistic_tab">
    <el-tab-pane label="按物料查看" name="byMaterial"><ByMaterial/></el-tab-pane>
    <el-tab-pane label="按工位查看" name="byStation"><ByStation/></el-tab-pane>
  </el-tabs>
</div>
</template>

<script>
import statisticByStation from './statistics_tab/statisticbystation.vue'
import statisticByMaterial from './statistics_tab/statisticbymaterial.vue'

export default {
  name: 'Statistics',
  components: {
    'ByStation': statisticByStation,
    'ByMaterial': statisticByMaterial
  },
  data () {
    return {
      activeName: 'byMaterial'
    }
  },
  methods: {
    handleTabClick (tab, event) {
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
