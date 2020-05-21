<template>
<div>
  <span v-loading="dataLoading">
    <div  style="vertical-align: center; margin-top: 1%; text-align: center;">

      <div style="width: 30%; text-align: center; display: inline-block;">
        <div>
          <span style="font-size: 80%; color: #606266;">总计</span>
          <span style="font-size: 250%; color: #67C23A;">
            {{billData.waitingMount}}
          </span>
          <span style="font-size: 80%; color: #606266;">个工单</span>
        </div>
        <div>
          <span style="font-size: 100%; color: #303133;">目前正在生产</span>
        </div>
      </div>

      <div style="width: 30%; text-align: center; display: inline-block;">
        <div>
          <div style="font-size: 80%; color: #606266;">占据所有活跃工单的百分比为</div>
          <div style="font-size: 250%; color: #409EFF;">
            {{(100 * billData.waitingMount / billData.activeMount).toFixed(2)}}%
          </div>
        </div>
      </div>

      <div style="width: 30%; text-align: center; display: inline-block;">
        <el-progress type="circle"
          color="#E6A23C"
          :percentage="parseFloat((100 * billData.waitingMount / billData.activeMount).toFixed(2))"/>
      </div>

    </div>

    <div class="detailClass">
      <el-collapse accordion>
        <el-collapse-item v-for="(item, index) in billData.waitingBills" v-bind:key="index">
          <template slot="title">
            <span style="padding: 20px;">{{item.name}}</span>
            <i class="header-icon el-icon-info" style="padding-left: 20px; color: #67C23A;"></i>
            <span style="padding-left: 10px; color: #67C23A;">正在生产</span>
          </template>
          <div style="padding: 20px; padding-left: 40px;">
            <div>
              <span>工单编号：{{item.id}}</span>
              <span style="padding-left: 40px;">状态：</span>
              <span style="color: #E6A23C;">
                {{billStatus[item.status-1].name}}
              </span>
              <span style="padding-left: 40px;">
                产出物料编号：{{item.outBrief}}
              </span>
              <span>
                ({{materialClass[item.outputKind-1].name}})
              </span>
            </div>
            <div>
              <span>预计使用时间：</span>
              <span style="color: #409EFF;">{{item.estimateTime}}小时</span>
              <span style="padding-left: 40px;">创建时间：</span>
              <span style="color: #409EFF;">
                {{item.createdTime.split('T')[0]}}
              </span>
            </div>
            <div>
              <span>
                详细描述：{{item.description}}
              </span>
              <span v-if="item.description === ''">
                暂无
              </span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </span>
</div>
</template>

<script>
import billstatus from '../../../../config_new/billstatus.js'
import materialclass from '../../../../config_new/materialclass.js'

export default {
  name: 'statisticByMaterial',
  data () {
    return {
      dataLoading: false,
      billData: {
        activeMount: 10,
        waitingMount: 5,
        waitingBills: []
      },
      billStatus: billstatus,
      materialClass: materialclass
    }
  },
  methods: {
    reloadData () {
      this.dataLoading = true
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/produce/getproducingbill'
      }).then(response => {
        if (response.data.code === 1) {
          this.billData = {
            activeMount: response.data.activeMount,
            waitingMount: response.data.waitingMount,
            waitingBills: response.data.bills
          }
        } else {
          this.$message({
            message: '查询失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
            type: 'error'
          })
        }
      }).catch(error => {
        console.log(error)
        this.$message({
          message: '查询错误。' + '错误原因：' + error.response.status,
          type: 'error'
        })
      })
      this.dataLoading = false
    }
  },
  computed: {
  },
  mounted () {
    this.reloadData()
  }
}
</script>

<style>
.detailClass {
  padding-top: 1%;
  padding-bottom: 20px;
}
</style>
