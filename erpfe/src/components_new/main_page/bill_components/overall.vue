<template>
<div>

  <el-row type="flex" algin="middle" justify="center" style="margin-top: 20px;">
    <el-switch
      v-model="selections.bySelectingDays"
      style="display: inline-block; width: 20%;"
      inactive-text="所有时间"
      :active-text="showLatestText"/>
    <el-slider v-model="selections.selectedDays"
      :max="selections.selectedMaxDays"
      @change="handleChange"
      style="display: inline-block; width: 70%;"
      :disabled="!selections.bySelectingDays"/>
  </el-row>

  <div class="bill_overall_data_class" v-loading="dataLoading">
    <div style="width: 20%; text-align: center; display: inline-block;">
      <div>
        <span style="font-size: 250%; color: #409EFF;">
          {{overallData.all}}
        </span>
        <span style="font-size: 80%; color: #606266;">件</span>
      </div>
      <div>
        <span style="font-size: 100%; color: #303133;">全部订单</span>
      </div>
    </div>

    <div style="width: 20%; text-align: center; display: inline-block;">
      <div>
        <span style="font-size: 250%; color: #67C23A;">
          {{overallData.finished}}
        </span>
        <span style="font-size: 80%; color: #606266;">件</span>
      </div>
      <div>
        <span style="font-size: 100%; color: #303133;">已完成订单</span>
      </div>
    </div>

  <div style="width: 20%; text-align: center; display: inline-block;">
    <div>
      <span style="font-size: 250%; color: #E6A23C;">
        {{overallData.all - overallData.finished}}
      </span>
      <span style="font-size: 80%; color: #606266;">件</span>
    </div>
    <div>
      <span style="font-size: 100%; color: #303133;">未完成订单</span>
    </div>
  </div>

  <div style="width: 20%; text-align: center; display: inline-block;">
    <div>
      <span style="font-size: 250%; color: #8E44AD;">
        {{overallData.producing}}
      </span>
      <span style="font-size: 80%; color: #606266;">件</span>
    </div>
    <div>
      <span style="font-size: 100%; color: #303133;">生产中订单</span>
    </div>
  </div>

  <div style="width: 18%; text-align: center; display: inline-block;">
    <div>
      <span style="font-size: 250%; color: #F56C6C;">
        {{overallData.stopping}}
      </span>
      <span style="font-size: 80%; color: #606266;">件</span>
    </div>
    <div>
      <span style="font-size: 100%; color: #303133;">停滞中订单</span>
    </div>
  </div>

  <div style="width: 49%; text-align: center; display: inline-block; margin-top: 100px;">
    <div>
      <!-- <span style="font-size: 250%; color: #67C23A;">
        {{(overallData.finished / overallData.all).toFixed(4) * 100}}%
      </span> -->
      <el-progress type="circle"
        color="#67C23A"
        :percentage="(overallData.finished / overallData.all).toFixed(5) * 100"/>
    </div>
    <div>
      <span style="font-size: 100%; color: #303133;">订单完成率</span>
    </div>
  </div>

  <div style="width: 50%; text-align: center; display: inline-block; margin-top: 100px;">
    <div>
      <span style="font-size: 250%; color: #409EFF;">
        {{(overallData.finished / selections.selectedDays).toFixed(2)}}
      </span>
      <span style="font-size: 80%; color: #606266;">件</span>
    </div>
    <div>
      <span style="font-size: 100%; color: #303133;">平均日完成订单</span>
    </div>
  </div>

  </div>
</div>
</template>

<script>
export default {
  name: 'Overall',
  data () {
    return {
      selections: {
        bySelectingDays: false,
        selectedDays: 15,
        selectedMaxDays: 30
      },
      dataLoading: false,
      overallData: {
        all: 1,
        finished: 1,
        producing: 0,
        stopping: 0
      }
    }
  },
  methods: {
    reloadData () {
      console.log('Reload Data......')
      this.dataLoading = true
      var time = this.selections.selectedMaxDays
      if (this.selections.bySelectingDays) {
        time = this.selections.selectedDays
      }
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/bill/overall',
        params: {
          time: time
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.overallData.all = response.data.all
          this.overallData.finished = response.data.finished
          this.overallData.producing = response.data.producing
          this.overallData.stopping = response.data.stopping
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
      this.dataLoading = false
    },
    handleChange () {
      this.reloadData()
    }
  },
  mounted () {
    this.reloadData()
  },
  computed: {
    showLatestText () {
      if (this.selections.bySelectingDays) {
        return '最近' + this.selections.selectedDays + '天'
      } else {
        return '指定时间查看'
      }
    }
  }
}
</script>

<style>
.bill_overall_data_class {
  margin-top: 60px;
  padding: 20px;
}
</style>
