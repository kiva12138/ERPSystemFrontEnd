<template>
<div style="margin-top: 10%;">
  <div style="color: #F56C6C;text-align: center;">
    注意：修改总体配置会统一将所有物料的警示配置修改，请谨慎修改
  </div>
  <div style="margin-top: 40px;">
    <el-steps :active="3">
      <el-step title="存货充足" icon="el-icon-success"></el-step>
      <el-step title="存货偏少" icon="el-icon-warning"></el-step>
      <el-step title="缺货" icon="el-icon-error"></el-step>
    </el-steps>
  </div>
  <div style="display: inline-block; width: 50%;">
    <div class="warnset_all_tip_class">存货偏少阈值：</div>
    <div class="warnset_all_input_class">
      <el-input-number v-model="current.warn"
        :min="1" :max="99999" label="描述文字">
      </el-input-number>
    </div>
  </div>
  <div style="display: inline-block; width: 49%;">
    <div class="warnset_all_tip_class">缺货阈值：</div>
    <div class="warnset_all_input_class">
      <el-input-number v-model="current.error"
        :min="1" :max="99999" label="描述文字">
      </el-input-number>
    </div>
  </div>
  <div style="text-align: center;margin-top: 40px;">
    <el-button type="primary" @click="handleSubmit">提交</el-button>
  </div>
</div>
</template>

<script>
export default {
  name: 'WarnsetAll',
  data () {
    return {
      current: {
        warn: 50,
        error: 20
      }
    }
  },
  methods: {
    handleSubmit () {
      this.$confirm('此操作将改变所有物料的阈值，请谨慎操作, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$axios({
          method: 'post',
          url: this.GLOBAL.backEndIp + '/api/material/updateallthreshold',
          params: {
            warn: this.current.warn,
            danger: this.current.error
          }
        }).then(response => {
          if (response.data.code === 1) {
            this.$message({
              message: '修改成功。',
              type: 'success'
            })
          } else {
            this.$message({
              message: '修改失败。' + '错误原因：' + response.data.code + '-' + response.data.message,
              type: 'error'
            })
          }
        }).catch(error => {
          this.$message({
            message: '修改错误。' + '错误原因：' + error.response.status,
            type: 'error'
          })
        })
      }).catch(() => {})
    }
  }
}
</script>

<style>
.warnset_all_tip_class {
  color: #606266;
  text-align: center;
}
.warnset_all_input_class {
  text-align: center;
}
</style>
