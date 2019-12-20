<template>
<div>
  <span class="select_station_tip">
    提示: 单工位旨在模仿MIS系统，因此在进行单工位操作之前请首先选择具体工位。
  </span>

  <el-row>
    <span class="search_select_station_tip">所选工位编号：</span>
    <el-input placeholder="请输入所选工位编号"
      class='search_select_station_input' size="small"
      v-model="searchStationId"
      clearable/>

    <el-button icon="el-icon-search"
      :disabled='searchDisabled' size="small"
      style="margin-left: 40px;"
      type="primary" @click='handleSearch'>选择工位</el-button>

    <span style="margin-left: 40px;color: #606266;margin-top: 20px;"
      v-if="selectStationId!==''">
      您已经选择了编号为{{selectStationId}}的工位。
    </span>
  </el-row>
</div>
</template>

<script>
export default {
  name: 'SelectStation',
  data () {
    return {
      searchStationId: '',
      selectStationId: ''
    }
  },
  methods: {
    handleSearch () {
      console.log(this.searchStationId)
      // Do the work of search
      this.selectStationId = this.searchStationId
      this.$cookies.set('selectStationId', this.selectStationId, {expires: '24h'})
      location.reload()
    }
  },
  computed: {
    searchDisabled () {
      return this.searchStationId === ''
    }
  },
  mounted () {
    if (this.$cookies.isKey('selectStationId')) {
      this.selectStationId = this.$cookies.get('selectStationId')
    }
  }
}
</script>

<style>
.select_station_tip {
  color: #909399;
  margin-left: 20px;
}
.search_select_station_tip {
  width: 10%;
  margin-left: 5px;
  margin-top: 20px;
  margin-bottom: 20px;
  color: #606266;
  text-align: right;
  display: inline-block;
  white-space:nowrap;
}
.search_select_station_input {
  width: 15%;
  display: inline-block;
  margin-top: 20px;
  white-space:nowrap;
}
</style>
