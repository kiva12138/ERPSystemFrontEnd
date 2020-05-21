<template>
<div>
  <el-row>
    <div style="width: 30%; text-align: center; display: inline-block; margin: 40px;">
      <div>
        <span style="font-size: 100%; color: #303133;">近30天内生产的成功率为:</span>
      </div>
      <div>
        <span style="font-size: 250%; color: #409EFF;">
          {{successRate * 100}}
        </span>
        <span style="font-size: 80%; color: #606266;">%</span>
      </div>
    </div>
    <div style="width: 30%; text-align: center; display: inline-block; margin: 40px;">
      <div style="margin: 10px;">
        <span style="font-size: 100%; color: #303133;">手动调整生产成功率:</span>
      </div>
      <div>
        <el-input-number v-model="successRate"
          :precision="2" :step="0.1" :max="1"></el-input-number>
        <span style="font-size: 80%; color: #606266;">%</span>
      </div>
    </div>
    <div style="width: 20%; text-align: center; display: inline-block; margin: 40px;">
      <div style="margin: 10px;">
        <span style="font-size: 100%; color: #909399;">成功率由近30天的数据统计而成</span>
      </div>
      <div style="margin: 10px;">
        <span style="font-size: 100%; color: #909399;">您也可以进行相应的手动调整</span>
      </div>
      <div style="margin: 10px;">
        <span style="font-size: 100%; color: #909399;">结果仅供参考</span>
      </div>
    </div>
  </el-row>
  <el-row>
    <div style="width: 40%; text-align: center; display: inline-block; margin: 40px;">
      <div>
        <span style="font-size: 100%; color: #303133;">当前正在生产的工单数量为:</span>
      </div>
      <div>
        <span style="font-size: 250%; color: #E6A23C;">
          {{currentBill}}
        </span>
        <span style="font-size: 80%; color: #606266;">件</span>
      </div>
    </div>
    <div style="width: 40%; text-align: center; display: inline-block; margin: 40px;">
      <div>
        <span style="font-size: 100%; color: #303133;">预计成功生产的数量为:</span>
      </div>
      <div>
        <span style="font-size: 250%; color: #67C23A;">
          {{estimateBill}}
        </span>
        <span style="font-size: 80%; color: #606266;">件</span>
      </div>
    </div>
  </el-row>
  <el-row>
    <div style="width: 40%; text-align: center; display: inline-block; margin: 40px;">
      <div>
        <span style="font-size: 100%; color: #303133;">当前正在生产的物料数量为:</span>
      </div>
      <div>
        <span style="font-size: 250%; color: #E6A23C;">
          {{currentMaterial}}
        </span>
        <span style="font-size: 80%; color: #606266;">件</span>
      </div>
    </div>
    <div style="width: 40%; text-align: center; display: inline-block; margin: 40px;">
      <div>
        <span style="font-size: 100%; color: #303133;">预计成功产出的物料为:</span>
      </div>
      <div>
        <span style="font-size: 250%; color: #67C23A;">
          {{estimateMaterial}}
        </span>
        <span style="font-size: 80%; color: #606266;">件</span>
      </div>
    </div>
  </el-row>
</div>
</template>

<script>

export default {
  name: 'Overall',
  data () {
    return {
      dataLoading: false,
      successRate: 0.5,
      currentMaterial: 10,
      currentBill: 10
    }
  },
  methods: {
    searchData () {
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/produce/estimatedata'
      }).then(response => {
        if (response.data.code === 1) {
          this.successRate = response.data.successRate
          this.currentMaterial = response.data.currentMaterial
          this.currentBill = response.data.currentBill
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
  },
  computed: {
    estimateMaterial () {
      return parseInt(this.successRate * this.currentMaterial)
    },
    estimateBill () {
      return parseInt(this.successRate * this.currentBill)
    }
  },
  mounted () {
    this.dataLoading = true
    this.searchData()
    this.dataLoading = false
  }
}
</script>

<style>
</style>
