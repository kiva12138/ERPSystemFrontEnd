<template>
<div>
  <SelectStation/>
  <div style="text-align: center;">
    <div v-if="selectStationId===''"
      style="color: #606266; text-align: center; font-size: 200%; padding-top: 20%;">
      请首先选择工位。
    </div>
    <div v-else>
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
          <i class="el-icon-warning-outline" style="color: #E6A23C;" v-if="stationData.status===4"/>
          <span style="color: #E6A23C;" v-if="stationData.status===4">
            {{stationStatus[stationData.status-1].name}}
          </span>
        </span>
      </el-row>
      <el-row type="flex" justify="center">
        <span class="self_manage_tip">设备数量:</span>
        <span class="self_manage_input">{{stationData.equipmentmount}}台设备</span>
      </el-row>
      <el-row type="flex" justify="center">
        <span class="self_manage_tip">上次维护时间:</span>
        <span class="self_manage_input">{{stationData.lastmaintain}}</span>
      </el-row>
    </div>
  </div>
  <div class="selfmanage_operation">
    <el-button type="warning" size="small"
      :disabled="stationData.status===2 || stationData.status===3"
      @click='handleMaintain(scope.row.id)'>维护休整</el-button>

    <el-button type="success" size="small"
      :disabled="stationData.status===1 || stationData.status===4"
      @click='handleRecover(scope.row.id)'>恢复生产</el-button>

    <el-button type="danger" size="small"
      :disabled="stationData.status===2"
      @click='handleStop(scope.row.id)'>停工</el-button>

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
        equipmentmount: 3,
        lastmaintain: ''
      }
    }
  },
  methods: {
    handleStop (id) {
      console.log('Stop')
    },
    handleRecover (id) {
      console.log('Recover')
    },
    handleMaintain (id) {
      console.log('Maintain')
    }
  },
  components: {
    'SelectStation': selectstation
  },
  mounted () {
    if (this.$cookies.isKey('selectStationId')) {
      this.selectStationId = this.$cookies.get('selectStationId')
      this.stationData = {
        id: this.selectStationId = this.$cookies.get('selectStationId'),
        name: '某某某生产工位',
        status: 2,
        equipmentmount: 3,
        lastmaintain: '2019-08-26'
      }
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
