<template>
<div v-loading="dataLoading">
  <div  style="vertical-align: center; margin-top: 1%; text-align: center;">

    <div style="width: 30%; text-align: center; display: inline-block;">
      <div>
        <span style="font-size: 80%; color: #606266;">总计</span>
        <span style="font-size: 250%; color: #67C23A;">
          {{producingStations.stations.length}}
        </span>
        <span style="font-size: 80%; color: #606266;">个工位</span>
      </div>
      <div>
        <span style="font-size: 100%; color: #303133;">正在生产中</span>
      </div>
    </div>

    <div style="width: 30%; text-align: center; display: inline-block;">
      <div>
        <div style="font-size: 80%; color: #606266;">生产占比为</div>
        <div style="font-size: 250%; color: #409EFF;">
          {{(100 * producingStations.producingMount / producingStations.activeMount).toFixed(2)}}%
        </div>
      </div>
    </div>

    <div style="width: 30%; text-align: center; display: inline-block;">
      <el-progress type="circle"
        color="#E6A23C"
        :percentage="parseFloat((100 * producingStations.producingMount / producingStations.activeMount).toFixed(2))"/>
    </div>

  </div>
  <div class="material_current_table" style="margin-top: 20px;">
    <el-row :gutter="10"
      class="material_current_row">
      <el-col v-for="(item, index) in producingStations.stations"
        :key = "index"
        :span="6"
        class="material_current_col">
        <el-popover
          placement="top"
          width="300"
          trigger="hover">
          <div>
            <div style="color: #C0C4CC">目前正在生产的工单有:</div>
            <div v-for="(mitem, index) in item.billIds" :key="index">
              <span style="color: #67C23A; margin-left: 20px;" v-if="item.status===1">
                第{{mitem}}号工单
              </span>
            </div>

          </div>
          <div class="grid-content" slot="reference">
            <div><span style="color: #909399;">编号:{{item.id}}</span></div>
            <div>{{item.name}}</div>
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
          </div>
        </el-popover>
      </el-col>
    </el-row>
  </div>

</div>
</template>

<script>
// import testMaterialCurrent from '../../../config_new/testmaterialcurrent.js'
import stationstatus from '../../../../config_new/stationstatus.js'

export default {
  name: 'Current',
  data () {
    return {
      dataLoading: false,
      testMaterialCurrent: [],
      stationStatus: stationstatus,
      pagination: {
        currentPage: 1,
        pageSize: 50,
        stationNumber: 0
      },
      tableGutter: 10,
      tableStationSpan: [2, 4, 6, 8],
      producingStations: {
        activeMount: 10,
        producingMount: 5,
        stations: []
      }
    }
  },
  methods: {
    reloadData () {
      this.dataLoading = true
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/produce/getproducingstation'
      }).then(response => {
        if (response.data.code === 1) {
          this.producingStations = {
            activeMount: response.data.activeMount,
            producingMount: response.data.producingMount,
            stations: response.data.stations
          }
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
    },
    handleSearch () {
      console.log(this.searchCurrent)
      this.reloadData()
    },
    handlePagination () {
      this.reloadData()
    }
  },
  mounted () {
    this.reloadData()
  },
  computed: {
    searchDisabled () {
      return this.searchCurrent.materialId === '' &&
        this.searchCurrent.stationId === ''
    },
    randomSpan () {
      var j = Math.random() * 5 + 3
      return parseInt(j)
    }
  }
}
</script>

<style>
.material_current_hint {
  color: #909399;
  margin: 20px;
}
.search_current_part {
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.searchcurrentinput {
  width: 12%;
  display: inline-block;
  white-space:nowrap;
}
.searchcurrenttip {
  width: 10%;
  margin-left: 5px;
  margin-top: 10px;
  margin-bottom: 20px;
  font-size: 90%;
  color: #606266;
  text-align: right;
  display: inline-block;
  white-space:nowrap;
}
.material_current_table {
  margin: 10px;
}
.material_current_row {
}
.material_current_col {
  margin-bottom: 10px;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;
}
.grid-content {
  border-radius: 4px;
  min-height: 60px;
  background: #d3dce6;
  color: #606266;
  text-align: center;
  font-size: 80%;
}
</style>
