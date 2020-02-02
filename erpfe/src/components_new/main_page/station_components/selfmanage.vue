<template>
<div>
  <SelectStation/>
  <div style="text-align: center;">
    <div v-if="selectStationId===''"
      style="color: #606266; text-align: center; font-size: 200%; padding-top: 20%;">
      请首先选择工位。
    </div>
    <div v-else
      style="color: #606266; text-align: center; padding-top: 10%;">
      <el-row type="flex" justify="center">
        <span class="self_manage_tip">工位编号:</span>
        <span class="self_manage_input">{{stationData.id}}</span>
      </el-row>
      <el-row type="flex" justify="center">
        <span class="self_manage_tip">工位名称:</span>
        <span class="self_manage_input">{{stationData.name}}</span>
      </el-row>
      <el-row type="flex" justify="center">
        <span class="self_manage_tip">工位状态:</span>
        <span class="self_manage_input">
          <i class="el-icon-circle-check" style="color: #67C23A;" v-if="stationData.status===1"/>
          <span style="color: #67C23A;" v-if="stationData.status===1">
            {{stationStatus[stationData.status-1].name}}
          </span>
          <i class="el-icon-circle-close" style="color: #F56C6C;" v-if="stationData.status===2"/>
          <span style="color: #F56C6C;" v-if="stationData.status===2">
            {{stationStatus[stationData.status-1].name}}
          </span>
          <i class="el-icon-warning-outline" style="color: #E6A23C;" v-if="stationData.status===3"/>
          <span style="color: #E6A23C;" v-if="stationData.status===3">
            {{stationStatus[stationData.status-1].name}}
          </span>
          <!--
          <i class="el-icon-warning-outline" style="color: #E6A23C;" v-if="stationData.status===4"/>
          <span style="color: #E6A23C;" v-if="stationData.status===4">
            {{stationStatus[stationData.status-1].name}}
          </span>
          -->
        </span>
      </el-row>
      <!--
      <el-row type="flex" justify="center">
        <span class="self_manage_tip">设备数量:</span>
        <span class="self_manage_input">{{stationData.equipmentmount}}台设备</span>
      </el-row>
      -->
      <el-row type="flex" justify="center">
        <span class="self_manage_tip">上次维护时间:</span>
        <span class="self_manage_input">{{stationData.lastmaintain}}</span>
      </el-row>
    </div>
  </div>
  <div class="selfmanage_operation" v-if="selectStationId!==''">
    <el-button type="warning" size="small"
      :disabled="stationData.status===2 || stationData.status===3"
      @click='handleMaintain()'>维护休整</el-button>

    <el-button type="success" size="small"
      :disabled="stationData.status===1 || stationData.status===4"
      @click='handleRecover()'>恢复生产</el-button>

    <el-button type="danger" size="small"
      :disabled="stationData.status===2"
      @click='handleStop()'>停工</el-button>

  </div>
</div>
</template>

<script>
import selectstation from './select_components/selectstation.vue'
import stationstatus from '../../../config_new/stationstatus.js'

export default {
  name: 'SelfManage',
  data () {
    return {
      selectStationId: '',
      stationStatus: stationstatus,
      stationData: {
        id: '',
        name: '',
        status: 1,
        lastmaintain: ''
      }
    }
  },
  methods: {
    handleMaintain () {
      this.$axios({
        method: 'post',
        url: this.GLOBAL.backEndIp + '/api/station/maintain',
        params: {
          id: this.selectStationId
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.$message({
            message: '维护成功。',
            type: 'success'
          })
          this.reloadData()
        } else {
          this.$message({
            message: '维护失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '维护错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
    },
    handleRecover () {
      this.$axios({
        method: 'post',
        url: this.GLOBAL.backEndIp + '/api/station/reproduce',
        params: {
          id: this.selectStationId
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.$message({
            message: '恢复生产成功。',
            type: 'success'
          })
          this.reloadData()
        } else {
          this.$message({
            message: '恢复生产失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '恢复生产错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
    },
    handleStop () {
      this.$axios({
        method: 'post',
        url: this.GLOBAL.backEndIp + '/api/station/stopproduce',
        params: {
          id: this.selectStationId
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.$message({
            message: '停工成功。',
            type: 'success'
          })
          this.reloadData()
        } else {
          this.$message({
            message: '停工失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '停工错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
    },
    getTimeInFormat (time) {
      if (time === undefined) {
        return ''
      }
      var dateStrs = time.split('T')[0].split('-')
      var timeStrs = time.split('T')[1].split('.')[0].split(':')
      var year = parseInt(dateStrs[0], 10)
      var month = parseInt(dateStrs[1], 10) + 1
      var day = parseInt(dateStrs[2], 10)
      var hour = parseInt(timeStrs[0], 10)
      var minute = parseInt(timeStrs[1], 10)
      var second = parseInt(timeStrs[2], 10)
      return year + '年' + month + '月' + day + '日 ' +
        hour + ':' + minute + ':' + second
    }
  },
  components: {
    'SelectStation': selectstation
  },
  mounted () {
    if (this.$cookies.isKey('selectStationId')) {
      this.selectStationId = this.$cookies.get('selectStationId')
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/station/getbyid',
        params: {
          id: this.selectStationId
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.stationData = {
            id: response.data.station.id,
            name: response.data.station.name,
            status: response.data.station.status,
            lastmaintain: this.getTimeInFormat(response.data.station.lastmaintain)
          }
        } else {
          this.$message({
            message: '查询失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        this.$message({
          message: '查询错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
    }
  }
}
</script>

<style>
.self_manage_tip {
  color: #606266;
  margin-top: 20px;
  text-align: right;
  width: 45%;
  padding-right: 20px;
}
.self_manage_input {
  color: #303133;
  margin-top: 20px;
  text-align: left;
  width: 50%;
}
.selfmanage_operation {
  text-align: center;
  margin: 40px;
}
</style>
