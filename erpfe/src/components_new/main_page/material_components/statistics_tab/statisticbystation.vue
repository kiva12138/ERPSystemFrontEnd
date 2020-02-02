<template>
<div>
  <div class="statistic_search_station_part">
    <el-row>
      <span class="statistic_searchstationtip">工位编号：</span>
      <el-input placeholder="请输入工位编号"
        class='statistic_searchstationinput'
        v-model="searchStation.id"
        type="number"/>
      <span class="statistic_searchstationtip">工位名称：</span>
      <el-input placeholder="请输入工位名称"
        class='statistic_searchstationinput'
        v-model="searchStation.name"
        clearable/>
      <span class="statistic_searchstationtip">工位状态：</span>
      <el-select v-model="searchStation.status" placeholder="请选择状态">
        <el-option
          v-for="item in stationStatus"
          :key="item.id"
          :label="item.name"
          :value="item.id" />
      </el-select>
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

  <div class="statistic_table_class">
    <el-row :gutter="tableGutter"
      v-loading="dataLoading"
      class="statistic_station_row">
      <el-col v-for="(item, index) in testStatisticStation"
        :key = "index"
        :span="randomSpan"
        class="statistic_station_col">
        <el-popover
          placement="top"
          width="500"
          trigger="hover">
          <div>
            <div v-for="(mitem, index1) in item.use" :key="index1">
              <span style="color: #C0C4CC">{{mitem.id}}</span>
              <span>{{days}} 天中共使用 {{mitem.name}} {{mitem.mount}} 件</span>
              <span> 平均日使用 {{(mitem.mount / days).toFixed(2)}} 件</span>
            </div>
            <el-divider></el-divider>
            <div v-for="(mitem, index2) in item.out" :key="index2 + 1000">
              <span style="color: #C0C4CC">{{mitem.id}}</span>
              <span>{{days}} 天中共产出 {{mitem.name}} {{mitem.mount}} 件</span>
              <span> 平均日产出 {{(mitem.mount / days).toFixed(2)}} 件</span>
            </div>
          </div>
          <div class="station_statistic_grid_content" slot="reference">
            <div>
              <span style="color: #909399;">编号:{{item.id}}</span>
              <span style="color: #606266;">{{item.name}}</span>
            </div>
            <div v-if="item.status===1" style="color: #67C23A;">
              {{stationStatus[item.status-1].name}}
            </div>
            <div v-if="item.status===2" style="color: #F56C6C;">
              {{stationStatus[item.status-1].name}}
            </div>
            <div v-if="item.status===3" style="color: #F56C6C;">
              {{stationStatus[item.status-1].name}}
            </div>
            <div v-if="item.status===4" style="color: #E6A23C;">
              {{stationStatus[item.status-1].name}}
            </div>
            <div>
              <span style="color: #606266;">
                总计使用{{item.use.length}}种物料
              </span>
            </div>
            <div>
              <span style="color: #606266;">
                总计产出{{item.out.length}}种物料
              </span>
            </div>
          </div>
        </el-popover>
      </el-col>
    </el-row>
  </div>

  <el-pagination
    class="pagination_class"
    :page-size="pagination.pageSize"
    :current-page.sync="pagination.currentPage"
    background
    layout="prev, pager, next"
    style="text-align: center; margin: 20px;"
    @current-change="handlePagination"
    :total="pagination.total">
  </el-pagination>

</div>
</template>

<script>
import stationstatus from '../../../../config_new/stationstatus.js'
// import teststatisticstation from '../../../../config_new/teststatisticstation.js'

export default {
  name: 'statisticByStation',
  data () {
    return {
      testStatisticStation: [],
      stationStatus: stationstatus,
      bySelectingDays: false,
      selectedDays: 7,
      selectedMaxDays: 30,
      dataLoading: false,
      pagination: {
        currentPage: 1,
        pageSize: 15,
        total: 0
      },
      searchStation: {
        id: '',
        name: '',
        status: ''
      },
      tableGutter: 10,
      tableStationSpan: [3, 4, 5, 6]
    }
  },
  methods: {
    handleSearch () {
      console.log('Searching...')
      console.log(this.searchStation)
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
      var day = 30
      var id = 0
      var status = 0
      if (this.searchStation.id !== '') {
        id = this.searchStation.id
      }
      if (this.searchStation.status !== '') {
        status = this.searchStation.status
      }
      if (this.bySelectingDays) {
        day = this.selectedDays
      }
      this.dataLoading = true
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/station/getmaterialdata',
        params: {
          id: id,
          name: this.searchStation.name,
          status: status,
          time: day,
          page: this.pagination.currentPage - 1
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.testStatisticStation = response.data.data
          this.pagination.total = response.data.allLength
        } else {
          this.$message({
            message: '查找失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '查找错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
      this.dataLoading = false
    }
  },
  computed: {
    searchDisabled () {
      return this.searchStation.id === '' &&
        this.searchStation.name === '' &&
        this.searchStation.status === ''
    },
    days () {
      if (this.bySelectingDays) {
        return this.selectedDays
      } else {
        return this.selectedMaxDays
      }
    },
    showLatestText () {
      if (this.bySelectingDays) {
        return '最近' + this.selectedDays + '天'
      } else {
        return '指定时间'
      }
    },
    randomSpan () {
      var j = Math.random() * 5 + 3
      return parseInt(j)
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
.statistic_station_row {
}
.statistic_station_col {
  margin-bottom: 10px;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
}
.station_statistic_grid_content {
  border-radius: 4px;
  min-height: 70px;
  background: #d3dce6;
  color: #606266;
  text-align: center;
  font-size: 80%;
}
</style>
