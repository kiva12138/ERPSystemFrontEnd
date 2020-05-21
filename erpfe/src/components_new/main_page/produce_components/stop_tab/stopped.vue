<template>
<div>
  <span v-loading="dataLoading">

    <div  style="vertical-align: center; margin-top: 1%; text-align: center;">

      <div style="width: 30%; text-align: center; display: inline-block;">
        <div>
          <span style="font-size: 80%; color: #606266;">总计</span>
          <span style="font-size: 250%; color: #67C23A;">
            {{materialData.stopMount}}
          </span>
          <span style="font-size: 80%; color: #606266;">件工单</span>
        </div>
        <div>
          <span style="font-size: 100%; color: #303133;">停滞生产</span>
        </div>
      </div>

    </div>

    <div class="detailClass">
      <el-collapse accordion>
        <el-collapse-item v-for="(item, index) in materialData.waitingMaterials" v-bind:key="index">
          <template slot="title">
            <span style="padding: 20px;">工单: {{item.name}}</span>
            <i class="header-icon el-icon-error" style="padding-left: 20px; color: #F56C6C;"></i>
            <span style="padding-left: 10px; color: #F56C6C;">已停滞</span>
          </template>
          <div style="padding: 20px; padding-left: 40px; color: #606266;">
            <div>
              <span>工单: </span>
              <span style="color: #409EFF;">{{item.name}}</span>
              <span style="padding-left: 20px;">编号:</span>
              <span style="color: #409EFF;">{{item.id}}</span>
              <span style="padding-left: 20px;">预计时间:</span>
              <span style="color: #409EFF;">{{item.estimateTime}}小时</span>
            </div>

            <div >
              <span>预计产出:</span>
              <span style="color: #67C23A;">
                {{item.output}} * {{item.outputMount}}
              </span>
              <span style="padding-left: 20px;">所需物料:</span>
              <span v-for="(item1, index1) in item.materials"
                style="color: #67C23A;"
                v-bind:key="index1">
                {{item1.name}}
              </span>
            </div>

            <div>
              <span>工单描述: </span>
              <span v-if="item.description !== ''" style="color: #E6A23C">
                {{item.description}}
              </span>
              <span v-else style="color: #E6A23C">暂无</span>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </span>
</div>
</template>

<script>

export default {
  name: 'statisticByMaterial',
  data () {
    return {
      dataLoading: false,
      materialData: {
        stopMount: 10,
        waitingMaterials: []
      }
    }
  },
  methods: {
    handleChange () {
      this.reloadData()
    },
    reloadData () {
      this.dataLoading = true
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/produce/stopped'
      }).then(response => {
        if (response.data.code === 1) {
          this.materialData = {
            stopMount: response.data.stoppedMount,
            waitingMaterials: response.data.bills
          }
        } else {
          this.$message({
            message: '查询失败。' + '错误原因：' + response.data.code + '-' +
              response.data.message,
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
