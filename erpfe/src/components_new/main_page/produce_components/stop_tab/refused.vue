<template>
<div>
  <span v-loading="dataLoading">

    <div  style="vertical-align: center; margin-top: 1%; text-align: center;">

      <div style="width: 30%; text-align: center; display: inline-block;">
        <div>
          <span style="font-size: 80%; color: #606266;">总计</span>
          <span style="font-size: 250%; color: #67C23A;">
            {{materialData.refuseMount}}
          </span>
          <span style="font-size: 80%; color: #606266;">件工单</span>
        </div>
        <div>
          <span style="font-size: 100%; color: #303133;">被工位拒绝</span>
        </div>
      </div>

      <div style="width: 40%; text-align: center; display: inline-block;">
         <el-select v-model="currentKind" placeholder="物料不足" @change="handleChange">
          <el-option
            v-for="item in refuseReasons"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        <span style="font-size: 80%; padding: 10px; color: #909399">您可以在此选择拒绝的种类</span>
      </div>

    </div>

    <div class="detailClass">
      <el-collapse accordion>
        <el-collapse-item v-for="(item, index) in materialData.waitingMaterials" v-bind:key="index">
          <template slot="title">
            <span style="padding: 20px;">工单: {{item.name}}</span>
            <i class="header-icon el-icon-error" style="padding-left: 20px; color: #F56C6C;"></i>
            <span style="padding-left: 10px; color: #F56C6C;">已拒绝</span>
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
              <span>拒绝原因: </span>
              <span style="color: #F56C6C;">{{refuseReasons[item.refuseKind-1].name}}</span>
              <span style="padding-left: 20px;">拒绝附加说明:</span>
              <span style="color: #F56C6C;">{{item.refuseReason}}</span>
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
import refuseReason from '../../../../config_new/refusereason.js'

export default {
  name: 'statisticByMaterial',
  data () {
    return {
      dataLoading: false,
      refuseReasons: refuseReason,
      currentKind: '',
      materialData: {
        refuseMount: 10,
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
      var kind = 1
      if (this.currentKind !== '') {
        kind = this.currentKind
      }
      this.$axios({
        method: 'get',
        url: this.GLOBAL.backEndIp + '/api/produce/refused',
        params: {
          refuseKind: kind
        }
      }).then(response => {
        if (response.data.code === 1) {
          this.materialData = {
            refuseMount: response.data.refusedMount,
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
