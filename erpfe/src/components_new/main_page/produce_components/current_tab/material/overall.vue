<template>
<div>
  <span v-loading="dataLoading">
    <div  style="vertical-align: center; margin-top: 1%; text-align: center;">

      <div style="width: 30%; text-align: center; display: inline-block;">
        <div>
          <span style="font-size: 80%; color: #606266;">总计</span>
          <span style="font-size: 250%; color: #67C23A;">
            {{materialData.waitingMount}}
          </span>
          <span style="font-size: 80%; color: #606266;">件物料</span>
        </div>
        <div>
          <span style="font-size: 100%; color: #303133;">正在生产中</span>
        </div>
      </div>

      <div style="width: 30%; text-align: center; display: inline-block;">
        <div>
          <div style="font-size: 80%; color: #606266;">占据所有活跃种物料的百分比为</div>
          <div style="font-size: 250%; color: #409EFF;">
            {{(100 * materialData.waitingMount / materialData.activeMount).toFixed(2)}}%
          </div>
        </div>
      </div>

      <div style="width: 30%; text-align: center; display: inline-block;">
        <el-progress type="circle"
          color="#E6A23C"
          :percentage="parseFloat((100 * materialData.waitingMount / materialData.activeMount).toFixed(2))"/>
      </div>

    </div>

    <div class="detailClass">
      <el-collapse accordion>
        <el-collapse-item v-for="(item, index) in materialData.waitingMaterials" v-bind:key="index">
          <template slot="title">
            <span style="padding: 20px;">{{item.name}}</span>
            <i class="header-icon el-icon-info" style="padding-left: 20px; color: #67C23A;"></i>
            <span style="padding-left: 10px; color: #67C23A;">生产中</span>
          </template>
          <div style="padding: 20px; padding-left: 40px;">
            {{item.name}}   (物料编号:{{item.id}})
            <div style="padding-left: 20px; color: #606266;">
              目前有
              <span style="color: #409EFF; font-size: 120%;">{{item.mount}}</span>
              件待生产
            </div>
            <div>目前生产该物料的工单有:</div>
            <div style="padding-left: 20px; color: #606266;">
              <span v-for="(item2, index2) in item.billids"
                v-bind:key="index2" style="padding-right: 10px">
                {{item2}}号工单
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

export default {
  name: 'statisticByMaterial',
  data () {
    return {
      dataLoading: false,
      materialData: {
        activeMount: 10,
        waitingMount: 5,
        waitingMaterials: []
      }
    }
  },
  methods: {
    reloadData () {
      this.dataLoading = true
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/produce/getproducingmaterial'
      }).then(response => {
        if (response.data.code === 1) {
          this.materialData = {
            activeMount: response.data.activeMount,
            waitingMount: response.data.waitingMount,
            waitingMaterials: response.data.waitingMaterials
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
