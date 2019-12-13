<template>
<div>
  <div class="statistic_search_station_part">
    <el-row>
      <span class="statistic_searchstationtip">物料编号：</span>
      <el-input placeholder="请输入物料编号"
        class='statistic_searchstationinput'
        v-model="searchMaterial.id"
        clearable/>
      <span class="statistic_searchstationtip">物料名称：</span>
      <el-input placeholder="请输入物料名称"
        class='statistic_searchstationinput'
        v-model="searchMaterial.name"
        clearable/>
      <el-button icon="el-icon-search"
        :disabled='searchDisabled'
        style="margin-left: 40px;"
        type="primary" @click='handleSearch'>筛 选</el-button>
    </el-row>
    <el-row type="flex" algin="middle" justify="center" style="margin-top: 20px;">
      <el-switch
        v-model="bySelectingDays"
        style="display: inline-block; width: 20%;"
        inactive-text="所有时间"
        :active-text="showLatestText">
      </el-switch>
      <el-slider v-model="selectedDays"
        :max="selectedMaxDays"
        style="display: inline-block; width: 70%;"
        :disabled="!bySelectingDays"></el-slider>
    </el-row>
  </div>

  <div class="statistic_table_class"
      v-loading="dataLoading">
    <div v-for="(item, index) in testStatisticMaterial"
      :key="index">
      <div class="statistic_table_tip">
        <span style="color: #C0C4CC;">{{item.id}}</span>
        <span style="color: #606266;">{{item.name}}</span>
      </div>
      <div class="statistic_table_process">
        <el-popover
          placement="top"
          width="350"
          trigger="hover">
          <div>
            <div>
              <span>{{selectedDays}} 天中共使用{{item.use}} 件</span>
              <span> 平均日使用 {{(item.use / selectedDays).toFixed(2)}} 件</span>
            </div>
            <div>
              <span>{{selectedDays}} 天中共产出 {{item.output}} 件</span>
              <span> 平均日产出 {{(item.output / selectedDays).toFixed(2)}} 件</span>
            </div>
          </div>
          <el-progress :text-inside="true"
            :status="process_status[index%3]"
            :stroke-width="26" slot="reference"
            :percentage='parseFloat(((item.use / testStatisticMaterial[0].use) * 100).toFixed(2),10)'>
          </el-progress>
        </el-popover>
      </div>
    </div>
  </div>

  <el-pagination
    class="pagination_class"
    :page-size="pagination.pageSize"
    :current-page.sync="pagination.currentPage"
    background
    layout="prev, pager, next"
    style="text-align: center; margin: 20px;"
    @current-change="handlePagination"
    :total="pagination.stationNumber">
  </el-pagination>

</div>
</template>

<script>
import teststatisticmaterial from '../../../../config_new/teststatisticmaterial.js'

export default {
  name: 'statisticByMaterial',
  data () {
    return {
      testStatisticMaterial: teststatisticmaterial,
      bySelectingDays: false,
      selectedDays: 7,
      selectedMaxDays: 30,
      dataLoading: false,
      pagination: {
        currentPage: 1,
        pageSize: 10,
        stationNumber: 200
      },
      searchMaterial: {
        id: '',
        name: ''
      },
      process_status: ['success', 'warning', 'exception']
    }
  },
  methods: {
    handleSearch () {
      console.log('Searching...')
      console.log(this.searchMaterial)
      // reload material data
      this.reloadData()
    },
    handlePagination () {
      console.log('Page to ' + this.pagination.currentPage)
      this.reloadData()
    },
    reloadData () {
      console.log('Reload Data......')
      this.dataLoading = true
      var self = this
      setTimeout(function () { self.dataLoading = false }, 1000)
    }
  },
  computed: {
    searchDisabled () {
      return this.searchMaterial.id === '' &&
        this.searchMaterial.name === ''
    },
    showLatestText () {
      if (this.bySelectingDays) {
        return '最近' + this.selectedDays + '天'
      } else {
        return '指定时间'
      }
    }
  },
  mounted () {
    this.reloadData()
  }
}
</script>

<style>
.statistic_search_station_part {
  padding: 20px;
}
.statistic_searchstationtip {
  width: 10%;
  margin-left: 10px;
  margin-top: 10px;
  margin-bottom: 20px;
  color: #606266;
  text-align: right;
  display: inline-block;
}
.statistic_searchstationinput {
  width: 15%;
  display: inline-block;
}
.statistic_table_class {
}
.statistic_table_tip {
  font-size: 80%;
  display: inline-block;
  text-align: right;
  margin-bottom: 20px;
  width: 10%;
}
.statistic_table_process {
  display: inline-block;
  width: 85%;
}
</style>
